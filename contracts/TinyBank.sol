// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// staking
// deposit(MyToken) / withdraw(MyToken)

interface IMyToken {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract TinyBank {
    IMyToken public stakingToken; // 토큰을 먼저 배포하고, constructor의 파라미터로 주어야 함함
    constructor(IMyToken _stakingToken) {
        // 생성자
        stakingToken = _stakingToken;
    }

    // mapping(주소 => 잔고)
    mapping(address => uint256) public balanceOf;

}