// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.4.0-solc-0.7/contracts/token/ERC20/ERC20.sol";

contract DividendToken is ERC20 {


    constructor () ERC20("Test USDT", "TUSDT") {
        _mint(address(this), getRandomAmountWithLimit(100000000));
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
    }

    function getRandomAmountWithLimit(uint256 limit) private view returns(uint256){
        return random() % limit * 10 ** 18;
    }

    function generateYield(address targetAddress, uint256 maxAmount) public {
        _burn(address(this), getRandomAmountWithLimit(maxAmount));
        _mint(targetAddress, getRandomAmountWithLimit(maxAmount));
    }
}
