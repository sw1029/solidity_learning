// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

abstract contract ManagedAccess{
    address public manager;
    address public owner;
 
    constructor(address _owner, address _manager) {
        owner = _owner;
        manager = _manager;
        
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call this function");
        _;
    }
    modifier onlyMgr {
        require(msg.sender == manager, "only manager can call this function");
        _;
    }
    
}