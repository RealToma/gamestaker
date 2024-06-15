// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "./interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

struct createTreasury {
    address manager;
}

contract StakeTreasury is ReentrancyGuard { //Owner is the manager contract,one manager has just one treasuryLib
    
  
    // Relationships
    address private manager; // It's also the owner of the contract
    mapping(address => bool) stakes; 
    // Permanent state variables
    uint256 public stableAmount; // for treasuryLib

    // Events
    event DebugAddress(address indexed token);
    event DebugNumber(uint256 checkit);
    event DebugString(string stringValue);
    
    modifier onlyOwner()
    {
        require(msg.sender == manager, "only our owner allowed");
        _;
    }
    
    modifier onlyStaker() 
    {
        require(stakes[msg.sender] == true, "not a valid staker");
        _;
    }
 
    modifier onlyStakerOrManager() {
        require(
            msg.sender == manager || stakes[msg.sender] == true,
            "only staker or manager allowed"
        );
        _;
    }

    constructor() {
        manager = msg.sender;
    }

    /***
    *
    * @notice we need to 
        a) pass the address of the staker contract to treasury
        because we need the instantiated treasury address when we create the SingleStake contract
        we need to go back here to pass that address into the treasury
        TODO: use create2??
        b) start using template structures, i.e. schemata, to configure avatars and projects
    *
    * @param template - so far only one field: maner, i.e. address of SingleStake contract
    * @notice TODO : we might need to think of having one treasury across the whole lifecycles,
        i.e. treasury : staker being a 1 : n relationship
    *
    ***/
    function init(createTreasury memory template)
        public
        onlyOwner
    {
        manager = template.manager;
    }

    /***
    *
    * @notice register a staking contract which is allowed access to this treasury
    *
    ***/
    function registerStaker(address staker)
        public
        onlyStakerOrManager
    {
        stakes[staker] = true;
    }

  
    function _calculateFeeUint(
        uint256 _amount,
        uint256 _feeRate
    ) internal pure returns (uint256) {
        return (_amount * _feeRate) / 100;
    }

    function _calculateFeeInt(
        int256 _amount,
        int256 _feeRate
    ) internal pure returns (int256) {
        return (_amount * _feeRate) / 100;
    }    

    /***
    *
    * @notice calculate the share this user gets for his staking the chosen option
    * @param usr - wallet of usr
    * @param chosenERC20 - the staking ERC20 which was chosen
    * @param project - name of the project we are staking
    * @param erc20Contract - address of contract of 'stable' ERC20 staked
    *
    ***/
    function calculatePayout(
        address usr,
        address chosenERC20,
        bytes32 project    )
        public
        view
        onlyStakerOrManager
        returns (uint256 stake, uint256 payout)
    {
        stake = IERC20(chosenERC20).balanceOf(usr);
        require(stake > 0, "you have no stake in the winning option");

        payout = 
            ( stake * stableAmount )
                /
            IERC20(chosenERC20).totalSupply();

        return(stake, payout);
    }

    /***
    *
    * @notice books the 'staked' amount for the 'project' with name=_name
    * @param _name - name of project
    * @param tokenAddress - contract address of ERC20 provided
    * @param amount - amount staked
    * @return currentAmountStaked
    *
    ***/
    function bookTokens(
        bytes32 _name, 
        address tokenAddress, 
        uint256 amount
    ) 
        public 
        onlyStakerOrManager 
        returns(uint256)
    {
        stableAmount = stableAmount + uint256(amount);
        // TODO emit
        return(stableAmount);
    }

    function transferTokenTo(
        bytes32 _name, 
        address tokenAddress, 
        uint256 amount,
        address to
    ) 
        public 
        onlyStakerOrManager 
    {
        require(stableAmount >= amount, "TreasuryLib does not have sufficient balance");
        stableAmount = stableAmount - uint256(amount);
        _transferTokenTo(tokenAddress, to, amount);
    }

    function _transferTokenTo(
        address tokenAddress,  
        address to, 
        uint256 amount
    ) 
        internal 
    {
        require(IERC20(tokenAddress).balanceOf(address(this)) >= amount, "Treasury does not have sufficient balance");        
        require(IERC20(tokenAddress).transfer(to, amount), "Treasury Transfer failed");
    }


    function getTokenAmount(bytes32 _name, address _token) public view returns (uint256) {
        return stableAmount;
    }    

}
