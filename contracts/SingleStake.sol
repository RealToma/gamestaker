// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./libs/ManagerLib.sol";
import "./StakeTreasury.sol"; // need interface
import "./WAGR.sol";
import "./NFTicket/interfaces/INFTicket.sol";

import "hardhat/console.sol";

contract SingleStake is Ownable, ReentrancyGuard { 
    // using SafeMath for uint256;
    using ManagerLib for ManagerLib.ManLib;
    using ManagerLib for ManagerLib.DepositValue;

    ManagerLib.ManLib private manlib;
    address[] optionWAGR;
    bytes32 name;
    uint winner;


    uint256 public companyDescriptor; 
    uint256 public serviceDescriptor;
    address public winningERC20;


    
    // Events
    event TokenAllowed(address indexed token);
    event TokenDisallowed(address indexed token);
    event ManagerAdded(address indexed manager);
    event ManagerRemoved(address indexed manager);

    event StakeTreasuryCreated(address indexed treasuryAddress);

    event TokensWagered(
        bytes32 indexed _name, 
        uint option, 
        address indexed lpToken, 
        uint256 indexed totalLP
    );
    event StakeResolved(
        bytes32 indexed _name,
        uint256 indexed winningIndex, 
        address indexed winingERC20
    );

    event TicketIssued(
        address indexed recipient,
        uint256 indexed ticketID,
        uint256 indexed serviceDescriptor
    );

    event Withdrawn(
        address indexed user,
        address indexed token,
        uint256 indexed amount
    );
    event SwapExactTokens(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 indexed amountIn,
        uint256 amountOutMin
    );

    event SwapExactTokensSuccess(uint256 amountOut);
    event DepositFeeChanged(uint256 newFee);
    event WithdrawFeeChanged(uint256 newFee);
    event WithdrawalRequested(
        address indexed user,
        address indexed token,
        uint256 indexed amount
    );
    event WithdrawalApproved(
        address indexed user,
        address indexed token,
        uint256 indexed amount
    );
    event WithdrawalRejected(
        address indexed user,
        address indexed token,
        uint256 indexed amount
    );


    modifier tokenAllowed(address _token) {
        require(manlib.usdcAddress == _token, "Token not allowed");
        _;
    }

    modifier onlyOwnerOrManager() {
        require(
            owner() == _msgSender() || manlib.managers[_msgSender()] == true,
            "Not owner or manager"
        );
        _;
    }

    constructor(
        bytes32 gameID, 
        address usdc, 
        address nfticket, 
        address treasury, 
        uint noOfOptions
    ) Ownable(msg.sender)
    {
        manlib.NFTicketAddress = nfticket;
        manlib.treasuryAddress = treasury;
        manlib.usdcAddress = usdc;
        manlib.incoming_usd = 0;
        manlib.lpTokens = 0;
        companyDescriptor = 0x00000803;
        serviceDescriptor = (0x08000000 * ( 2 ** (256-32))) + companyDescriptor;
        name = gameID;
        manlib.depositFeeRate = 0; // 5% by default
        manlib.withdrawFeeRate = 5; // 10% by default
        manlib.performanceFeeRate = 0; // 10% by default
        // For weekly and monthly report
        manlib.managerPerformanceFee = 0; // 5% by default

        for(uint i = 0; i < noOfOptions; i++)
        {
            string memory erc20name = string(abi.encodePacked("WGR", Strings.toString(i)));
            WAGR _wgr = new WAGR(erc20name);
            optionWAGR.push(address(_wgr));
            console.log("WAGR[%s] is %s", i, address(_wgr));
        }
    }

    /*************
    *
    * @notice deposit asset token and receive WAGR tokens to NFTicket in return
        provides the logic for REST:...../sc_add (bettingIndex: integer($int32), amount: integer($int256)) --> handleAddingBet()
    * @param option - option to choose possible ordinal outcome, e.g. win (home team), tie or lose
    * @param erc20Contract - contract address of ERC20 asset deposited
    * @param amountERC20Added - units of ERC20 units deposited
    *
    *************/
    function create_stake(
        uint option, 
        address erc20Contract, 
        uint256 stakedAmount
    ) 
        external
    {
        ManagerLib.DepositValue memory dv;

        require(manlib.isAcceptedCurrency(erc20Contract), "this token is not accepted here");
        // TODO - probably BS IERC20(erc20Contract).approve(address(this), amountERC20Added);
        require(
            IERC20(erc20Contract).transferFrom(msg.sender, address(this), stakedAmount),
            "Transfer failed"
        );
        dv = manlib.calculateDepositValue(erc20Contract, stakedAmount);
        StakeTreasury(manlib.treasuryAddress).bookTokens(name, erc20Contract, dv.amountAfterFee);
        manlib.transferTokenToTreasury(erc20Contract, dv.amountAfterFee);

        /// @notice add (top-up to) LP tokens to NFTicket
        
        uint8 conversionFactor = getConversionFactor(optionWAGR[option], manlib.usdcAddress);
        uint256 mintAmount;
        mintAmount = dv.amountAfterFeeUSDValue * (10 ** conversionFactor);

        console.log("minting %s of %s with conversion of %s", mintAmount, optionWAGR[option], conversionFactor);
        WAGR(optionWAGR[option]).mint(msg.sender, mintAmount);
        console.log("TokensWagered(option: %d, token: %s, afterFee %s",
            option, optionWAGR[option], dv.amountAfterFeeUSDValue);
        emit TokensWagered(name, option, optionWAGR[option], dv.amountAfterFeeUSDValue);
    }

    /***
    *
    * @notice this function provides the logic for REST:.../sc_solve (winningIndex: integer($int32)) --> handleResolveBet(winningIndex)
    *
    * @param _name - which 'project' to resolve
    * @param winningIndex - which of the options is the winner  
    *
    ****/
    function setWinner(uint winningIndex)
        public
        onlyOwnerOrManager
    {
        require(winner == 0, "winner already determined");
        require(optionWAGR[winningIndex] != address(0), "not a token-backed option");
        winningERC20 = optionWAGR[winningIndex];
        winner = 100 + winningIndex; /**  @notice use 100 as offset so option 0 does not result in winner = 0 
            (which would be indistinguishable from default/unset value) */
        console.log("winningIndex = %s winningERC is %s", winningIndex, winningERC20);
        emit StakeResolved(name, winningIndex, winningERC20);
    }

    /***
    *
    * @notice pay out to users who staked the resolved option
    * @param _coin - the ERC20 used to place the bet
    * @dev this allows us to have multiple valid ERC20s and then call this function for each of them
    * @param sendTo - wallet to cash out to
    *
    ****/
    function cashOut(address sendTo) 
        external // override 
    {
        require(winner != 0, "winner not yet determined");

        (uint256 stake, uint256 payOut) = StakeTreasury(manlib.treasuryAddress)
            .calculatePayout(
                msg.sender, 
                winningERC20, 
                name
            );
        require(payOut > 0, "payout underflow");
        uint8 conversionFactor = getConversionFactor(winningERC20, manlib.usdcAddress);
        uint256 mintAmount;
        mintAmount = payOut * (10 ** conversionFactor);
        IERC20(winningERC20).approve(address(this), stake);
        WAGR(winningERC20).burn(msg.sender, stake);
        withdrawTo(sendTo, manlib.usdcAddress, payOut);
    }

    function topUpNFTicket(
        uint256 ticketID,
        address erc20Contract,
        uint256 lpTokensToMint
    )
        internal
    {
        uint256 numberCreditsAdded = lpTokensToMint / (1 gwei); /// @notice 1 token is 1 gwei * 1 credit 
        IERC20(erc20Contract).approve(manlib.NFTicketAddress, lpTokensToMint);
        INFTicket(manlib.NFTicketAddress).topUpTicketNoPayload(
            ticketID, 
            numberCreditsAdded, 
            address(this), 
            lpTokensToMint
        );    
    }

     function setDepositFee(uint256 _fee) external onlyOwnerOrManager {
        require(_fee <= 100, "Fee is too high");
        manlib.depositFeeRate = _fee;
        emit DepositFeeChanged(_fee);
    }

    function setWithdrawFee(uint256 _fee) external onlyOwnerOrManager {
        require(_fee <= 100, "Fee is too high");
        manlib.withdrawFeeRate = _fee;
        emit WithdrawFeeChanged(_fee);
    }

    function getConversionFactor(address ourToken, address stableCoin) 
        internal 
        view 
        returns(uint8 conversionFactor) 
    {
        uint8 ourDecimals = ERC20(ourToken).decimals();
        uint8 stableDecimals = ERC20(stableCoin).decimals();
        conversionFactor = 0;
        if (ourDecimals != stableDecimals) {
            require(ourDecimals > stableDecimals, "we require stable decimals to be <= our decimals");
            conversionFactor = ourDecimals - stableDecimals;
        }
        return(conversionFactor);
    }

    function setUSDCAddress(address _usdc) external onlyOwnerOrManager {
        manlib.usdcAddress = _usdc;
    }

    function getAssetsValue(address _token) public view returns (uint256) {
        return manlib.getAssetsValue(_token);
    }
    

    function setManager(address _manager, bool _status) 
        external 
        onlyOwner 
    {
        if (_status) {
            require(!manlib.managers[_manager], "Address is already a manager");
        } else {
            require(manlib.managers[_manager], "Address is not a manager");
        }
        manlib.managers[_manager] = _status;
        if (_status) {
            emit ManagerAdded(_manager);
        } else {
            emit ManagerRemoved(_manager);
        }
    }


    function getUSDCRateFromPoolByExternal(address _token) external view returns (uint256[2] memory) {
        return manlib._getUSDCRateFromPool(_token);
    }    

    function getUniswapRouter() 
        public
        view
        returns(address)
    {
        return manlib.uniswapRouter;
    }
    function deposits(address _wallet, address erc20Contract)
        public 
        view
        returns(uint256)
    {
        return(manlib.deposits[_wallet][erc20Contract]);
    }
    function requestWithdraw(address _token, uint256 _amount) 
        external 
        tokenAllowed(_token)
    {
        require(
            manlib.deposits[msg.sender][_token] >= _amount,
            "Insufficient balance"
        );

        manlib.deposits[msg.sender][_token] -= _amount;
        manlib.withdrawalRequests[msg.sender][_token] = WithdrawalRequest({
            amount: _amount,
            timestamp: block.timestamp,
            status: RequestStatus.PENDING
        });

        emit WithdrawalRequested(msg.sender, _token, _amount);
    }


    /*********************
    *
    * @notice this function sends individual tokens to an investor wallet
    * @param sendTo - wallet to send token to
    * @param _token - address of ERC20 contract
    * @param _amount - amount of ERC20 units to transfer
    *
    **********************/
    function withdrawTo(
        address sendTo,
        address token,
        uint256 amount
    ) 
        internal 
        nonReentrant
        tokenAllowed(token) 
    {
        // This is v0.1 , can't be used now
        require(
             StakeTreasury(manlib.treasuryAddress).getTokenAmount(name, token) >= amount,
             "Insufficient balance in TreasuryLib"
        );        
        uint256 withdrawFee = manlib._calculateFeeUint(amount, manlib.withdrawFeeRate);
        uint256 amountAfterFee = amount - withdrawFee;
        //Take token back from treasury, withdraw amount, but keep withdrawFee in Manager
        StakeTreasury(manlib.treasuryAddress).transferTokenTo(
            name, 
            token, 
            amountAfterFee, 
            sendTo
        );

        emit Withdrawn(msg.sender, token, amountAfterFee);
    }
}
