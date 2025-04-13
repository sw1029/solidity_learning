// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken{
    event Transfer(address indexed from, address indexed to, uint256 value);
    // 이벤트를 발생시키는 경우
    //indexed를 사용하면 검색이 가능하다
    //indexing의 의미 == topic에 데이터를 넣어달라

    //event의 사용 이유 == 비싼 storage를 사용하지 않고, 로그를 남길 수 있다
    //event는 블록체인에 저장된다
    // 블록체인에 저장된 데이터는 영구적이다

    string public name;
    string public symbol;
    uint8 public decimals; // 소수점 n자리까지 지원하겠다

    uint256 public totalSupply; // 발행량
    mapping(address => uint256) public balanceOf; // 잔고를 확인하기 위한 mapping

    constructor(string memory _name,string memory _symbol,uint8 _decimal,uint256 _amount){
        //길이가 정해져 있지 않은 string의 경우 memory를 사용해야 한다
        //생성할 때 발행량을 정해줄 수 있다
        //딱 한번 호출됨
        name = _name;
        symbol = _symbol;
        decimals = _decimal;
        _mint(_amount*10*uint256(decimals), msg.sender);// 1 token == 10^18 wei
        //msg.sender는 이 계약을 배포한 사람의 주소

    }

    //transaction
    //from, to, data, value, gas...

    function _mint(uint256 amount, address owner) internal{
        // 발행량을 1 증가시키고, 발행한 사람의 잔고를 1 증가시킨다
        totalSupply += amount;
        balanceOf[owner] += amount;
    }

    function _totalSupply()  external view returns (uint256) {
        return totalSupply;
    }
    function _balanceOf(address owner) external view returns (uint256) {
        return balanceOf[owner];
    }
    function _name() external view returns (string memory) {
        return name;
    }


    function transfer(uint256 amount, address to)external{
        balanceOf[msg.sender] -= amount; // 보낸사람의 잔고에서 amount만큼 차감
        balanceOf[to] += amount; // 받는사람의 잔고에 amount만큼 추가
        //msg.sender는 이 계약을 배포한 사람의 주소

        emit Transfer(msg.sender, to, amount); // 이벤트 발생
    }



}