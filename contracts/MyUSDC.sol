// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyUSDC is ERC20, Ownable, ERC20Permit {
    constructor() Ownable(msg.sender) ERC20("MyUSDC", "MYUSDC") ERC20Permit("MYUSDC") {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    function decimals() 
        public
        override
        view 
        returns (uint8) 
    {
        return 6;
    }


}
