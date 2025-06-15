// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MultiManagedAccess {
    address public owner;
    
    // 관리자 목록을 저장하는 동적 배열
    address[] public managers;
    
    // 특정 주소가 관리자인지 빠르게 확인하기 위한 매핑 (address => bool)
    mapping(address => bool) public isManager;
    
    // 관리자별 승인 상태를 저장하는 매핑
    mapping(address => bool) public confirmed;

    /**
     * @dev 컨트랙트 배포자를 owner이자 첫 번째 관리자로 설정합니다.
     * @param _owner 컨트랙트의 소유자 주소 (일반적으로 msg.sender).
     */
    constructor(address _owner) {
        owner = _owner;
        _addManager(_owner); // 내부 함수를 호출하여 배포자를 관리자로 추가
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev 모든 관리자가 승인했는지 확인합니다.
     * @return bool 모든 관리자가 승인했다면 true, 아니면 false.
     */
    function allConfirmed() internal view returns (bool) {
        // managers 배열의 길이를 사용해 모든 관리자를 순회합니다.
        for (uint i = 0; i < managers.length; i++) {
            address manager = managers[i];
            if (confirmed[manager] == false) {
                return false;
            }
        }
        return true;
    }

    modifier onlyAllConfirmed() {
        require(allConfirmed(), "Not all confirmed yet");
        _reset();
        _;
    }

    /**
     * @dev 호출자가 자신의 작업을 승인합니다. 호출자는 반드시 관리자여야 합니다.
     */
    function confirm() external {
        // isManager 매핑을 통해 호출자가 관리자인지 즉시 확인합니다. (가스 효율적)
        require(isManager[msg.sender], "You are not a manager");
        confirmed[msg.sender] = true;
    }
    
    /**
     * @dev 새로운 관리자를 추가합니다. owner만 호출할 수 있습니다.
     * @param _newManager 추가할 관리자의 주소.
     */
    function addManager(address _newManager) external onlyOwner {
        _addManager(_newManager);
    }
    
    /**
     * @dev 기존 관리자를 제거합니다. owner만 호출할 수 있습니다.
     * @param _managerToRemove 제거할 관리자의 주소.
     */
    function removeManager(address _managerToRemove) external onlyOwner {
        require(isManager[_managerToRemove], "Address is not a manager");

        isManager[_managerToRemove] = false;
        confirmed[_managerToRemove] = false; // 승인 상태도 초기화

        // 배열에서 관리자를 효율적으로 제거하는 로직
        for (uint i = 0; i < managers.length; i++) {
            if (managers[i] == _managerToRemove) {
                // 제거할 원소를 마지막 원소와 교체하고 배열 길이를 줄입니다.
                managers[i] = managers[managers.length - 1];
                managers.pop();
                break;
            }
        }
    }

    /**
     * @dev 모든 관리자의 승인 상태를 'false'로 초기화합니다.
     */
    function _reset() internal {
        for (uint i = 0; i < managers.length; i++) {
            address manager = managers[i];
            if (confirmed[manager]) {
                confirmed[manager] = false;
            }
        }
    }
    
    /**
     * @dev 관리자를 추가하는 내부 로직입니다.
     */
    function _addManager(address _manager) internal {
        require(_manager != address(0), "Invalid manager address");
        require(!isManager[_manager], "Manager already exists");

        isManager[_manager] = true;
        managers.push(_manager);
    }
}