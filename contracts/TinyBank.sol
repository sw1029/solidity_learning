// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// staking
// deposit(MyToken) / withdraw(MyToken)

interface IMyToken {
    function transfer(uint256 amount,address to) external;
    function transferFrom(address from, address to, uint256 amount) external;
    function mint(uint256 amount, address to) external;
}

contract TinyBank {
    event Staked (address from, uint256 amount);
    event Withdraw (uint256 amount, address to);

    IMyToken public stakingToken; // 토큰을 먼저 배포하고, constructor의 파라미터로 주어야 함함
    mapping(address => uint256) public staked;
    uint256 public totalStaked;

    uint256 public rewardPerBlock = 1 * 10 **18; // 블록당 보상량

    mapping(address => uint256) public lastClaimedBlock; // 보상
    address[] public stakedUsers;

    constructor(IMyToken _stakingToken) {
        // 생성자
        stakingToken = _stakingToken;
    }

    modifier updateReward(address to) {//modifier는 기본적으로 internal
        if(staked[to]>0){
        uint256 blocks = block.number - lastClaimedBlock[to];
        uint256 reward = blocks * rewardPerBlock * staked[to] / totalStaked;
        stakingToken.mint(reward, to); // 보상 지급
        }
        lastClaimedBlock[to] = block.number; // 마지막으로 보상을 지급한 블록 번호    
        _; // modifier는 _;를 통해서 원래의 함수를 호출할 수 있다
    }

    function stake(uint256 _amount) external updateReward(msg.sender) {
        //IMyToken.transfer(msg.sender, address(this), _amount);
        require(_amount >= 0, "cannot stake 0");
        //updateReward(msg.sender); // 보상 분배
        stakingToken.transferFrom(msg.sender, address(this), _amount);//위와는 다르다! user가 보내는 것이 아니라, contract가 보내는 것
        staked[msg.sender] += _amount; // 보낸사람의 잔고에서 amount만큼 차감
        totalStaked += _amount; // 전체 스테이킹 양을 증가시킨다
        //stakedUsers.push(msg.sender); // 스테이킹한 사람의 주소를 추가한다
        emit Staked(msg.sender, _amount); // 이벤트 발생
    }
    function withdraw(uint256 _amount) external updateReward(msg.sender) {
        require(staked[msg.sender] >= _amount, "insufficient staked token");
        require(_amount > 0, "cannot withdraw 0");
        //updateReward(msg.sender); // 보상 분배
        stakingToken.transfer( _amount, msg.sender); // contract가 user에게 amount만큼 송금
        staked[msg.sender] -= _amount;
        totalStaked -= _amount;
    
        emit Withdraw(_amount, msg.sender); // 이벤트 발생
    }
}