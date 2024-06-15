// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../StakeTreasury.sol";



    struct WithdrawalRequest {
        uint256 amount;
        uint256 timestamp;
        RequestStatus status;
    }

    struct UsdValueRecord {
        uint256 userDepositUSD;
        uint256 currentAssetsValue;
        uint256 timestamp;
    }


    enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    enum FeeType {
        DEPOSIT,
        WITHDRAW,
        PERFORMANCE,
        MANAGER
    }    

library ManagerLib {
    using EnumerableSet for EnumerableSet.AddressSet;
    event DebugNumber(uint256 checkit);
    event SwapExactTokensSuccess(uint256 amountOut);
    event SwapExactTokens(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 indexed amountIn,
        uint256 amountOutMin
    );


    
    /*
    event Deposited(
        address indexed user,
        address indexed token,
        uint256 indexed amount
    );
    event Deposited(
        uint256 indexed ticketID,
        address indexed token,
        uint256 indexed amount
    );
    */

    struct DepositValue {
        uint256 amountAfterFee;
        uint256 amountAfterFeeUSDValue;
        uint256 depositFee;
    }

    struct ManLib {
        address owner;
        address uniswapRouter;
        address uniswapV2FactoryAddress;
        address usdcAddress;
        address NFTicketAddress;
        address treasuryAddress;

        bool g_allInvestorDepositUSDHasInit;
        uint256 incoming_usd;
        uint256 lpTokens;


        mapping(address => mapping(address => WithdrawalRequest)) withdrawalRequests;

         // Investor's deposits
        mapping(address => mapping(address => uint256)) deposits;

        uint256  depositFeeRate; // 5% by default
        uint256  withdrawFeeRate; // 10% by default
        int256  performanceFeeRate; // 10% by default
        bool  rebalancing; 
        // For weekly and monthly report
        uint256  managerPerformanceFee; // 5% by default

        mapping(address => uint256)  g_tokenAmount;

        // address[]  g_allowedTokensList;
        uint[] options; // slots to hold tokens backing each possible result

        mapping(address => bool)  managers;
        // Fees
        mapping(address => uint256)  g_managerFee;
        mapping(address => uint256)  g_performanceFee;
        mapping(address => uint256)  g_depositFee;
        mapping(address => uint256)  g_withdrawFee;   
        // for all users portion
        uint256  g_currentTotalValueInUSD; // 10% by default
        mapping(address => uint256)  g_allInvestorDepositUSD; 
        address[]  g_allInvestors;
        mapping(address => bool)  isInvestorExist;    
    }

    function _calculateFeeUint(
        ManLib storage,
        uint256 _amount,
        uint256 _feeRate
    ) internal pure returns (uint256) {
        return (_amount * _feeRate) / 100;
    }



    /***
    *
    * @notice this function is a wrapper to validate all ERC20 tokens which may be used to stake
    * @param manlib - self
    * @param _coin - ERC20 to validate
    * @return true or false
    *
    ***/
    function isAcceptedCurrency(ManLib storage manlib, address _coin)
        internal
        view
        returns(bool)
    {
        return((manlib.usdcAddress == _coin));
    }

    /***
    *
    * @notice core function which calculates the value of the 'staked' ERC20 tokens and returns that as WAGR ERC20 tokens
        we keep it simple by only allowing dollar-pegged stablecoins, which means we simply issue as many WAGR as we received stable USDx
    * @param manlib - self
    * @param erc20Contract - address of ERC20 token staked
    * @param amountERC20Added - unit amount of ERC20 token staked
    * @return dv - structure to hold value staked and fees
    *
    ****/
    function calculateDepositValue(
        ManLib storage manlib, 
        address erc20Contract, 
        uint256 amountERC20Added
    )
        internal
        returns(DepositValue memory dv)
    {
        require(erc20Contract == manlib.usdcAddress, "Token not allowed"); // @notice only USDC deposits for now
        
        dv.depositFee = _calculateFeeUint(manlib, amountERC20Added, manlib.depositFeeRate);
        dv.amountAfterFee = amountERC20Added - dv.depositFee;
        dv.amountAfterFeeUSDValue = getUSDValue(manlib, erc20Contract,dv.amountAfterFee);

        manlib.incoming_usd += dv.amountAfterFeeUSDValue;
        
        // Store fee in mapping accmulative
        manlib.g_depositFee[erc20Contract] += dv.depositFee;

        manlib.deposits[msg.sender][erc20Contract] += dv.amountAfterFee;
        // Add to token asset
        manlib.g_tokenAmount[erc20Contract] += dv.amountAfterFee; 
        return(dv); 
    }

    function transferTokenToTreasury(ManLib storage manlib, address _tokenAddress,uint256 amount) 
        internal {
        require(_tokenAddress == manlib.usdcAddress, "Unknown stable coin");
        require(IERC20(_tokenAddress).balanceOf(address(this)) >= amount, "Manager does not have sufficient balance");
        IERC20(_tokenAddress).transfer(manlib.treasuryAddress, amount);
    }

    function _getUSDCRateFromPool(ManLib storage manlib, address _token) 
        internal 
        view 
        returns (uint256[2] memory) 
    {
        IUniswapV2Factory uniswapFactory = IUniswapV2Factory(manlib.uniswapV2FactoryAddress);
        address pairAddress = uniswapFactory.getPair(manlib.usdcAddress, _token);
        require(pairAddress != address(0), "Pair not found");
        IUniswapV2Pair  uniswapPair = IUniswapV2Pair(pairAddress);
        (uint256 usdcReserve, uint256 tokenReserve, ) = uniswapPair.getReserves();
        return [usdcReserve , tokenReserve];
    }

    function getUSDValue(ManLib storage manlib, address _token, uint256 _amount) 
        internal 
        view 
        returns (uint256) 
    {
        if(_token == manlib.usdcAddress){
            return _amount;
        }
        //Take the rate to USDC in advance
        uint256[2] memory reserves = _getUSDCRateFromPool(manlib, _token);
        return _amount*reserves[0]/reserves[1];
    }


    function getAssetsValue(ManLib storage manlib, address _token) public view returns (uint256) {
        return getUSDValue(manlib, _token, manlib.g_tokenAmount[_token]);
    }

}
