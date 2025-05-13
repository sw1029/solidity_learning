// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MultiManagedAccess {
    uint constant MANAGER_NUMBERS = 5;//immutable로 바꿔도 된다
    // immutable로 바꾸면, constructor에서만 초기화 가능하다
    address public owner;
    address [MANAGER_NUMBERS] public managers;
    bool[MANAGER_NUMBERS] public confirmed;
    constructor(address _owner, address [] memory _managers) {
        owner = _owner;
        for(uint i = 0; i < MANAGER_NUMBERS; i++){
            managers[i] = _managers[i];
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function allConfirmed () internal view returns (bool){
        for(uint i = 0; i < MANAGER_NUMBERS; i++){
            if(confirmed[i] == false)return false;   
        }
        return true;
    }

    modifier onlyAllConfirmed(){
        require(allConfirmed() == true, "All managers must confirm");
        reset();
        _;
    }

    function confirm() external {
        bool found = false;
        for(uint i = 0; i < MANAGER_NUMBERS; i++){
            if(msg.sender == msg.sender){
                found = true;
                confirmed[i] = true;
                break;
            }
        }
        require(found == true, "Only manager can call this function");
    }

    function reset() internal{
        for(uint i = 0; i < MANAGER_NUMBERS; i++){
            confirmed[i] = false;
        }
    }
}