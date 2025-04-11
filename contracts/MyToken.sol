// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken{
    string public name;
    string public symbol;
    uint8 public decimals; // 소수점 n자리까지 지원하겠다
    
    constructor(string memory _name,string memory _symbol,uint8 _decimal){
        //길이가 정해져 있지 않은 string의 경우 memory를 사용해야 한다
        name = _name;
        symbol = _symbol;
        decimals = _decimal;
    }
}