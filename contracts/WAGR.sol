// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WAGR is ERC20, Ownable {
    event TokenMinted (
        string indexed name,
        uint256 indexed amount,
        address indexed to
    );
    event TokenBurnt (
        string indexed name,
        uint256 indexed amount,
        address indexed to
    );

    address MASTER;

    constructor(string memory _name) Ownable(msg.sender) ERC20("WAGR Token", _name) {
        MASTER = msg.sender;
    }

    modifier onlyMaster() {
        require(msg.sender == MASTER, "only MASTER can do this");
        _;
    }

    function mint(address to, uint256 amount) public onlyMaster {
        _mint(to, amount);
        emit TokenMinted(name(), amount, to);
    }

    function burn(address account, uint256 amount) public onlyMaster {
        _burn(account, amount);
        emit TokenBurnt(name(), amount, account);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }

}