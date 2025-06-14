# @version ^0.4.1
# @license MIT

interface IMyToken:
    def transfer(_amount: uint256, _to: address): nonpayable
    def transferFrom(_owner: address, _to: address, _amount: uint256): nonpayable
    def mint(_amount: uint256, _to: address): nonpayable

event Staked:
    _owner: indexed(address)
    _amount: uint256

staked: public(HashMap[address, uint256])
totalStaked: public(uint256)

rewardPerBlock: public(uint256)
INIT_REWARD: constant(uint256) = 1 * 10 ** 18
lastClaimedBlock: HashMap[address, uint256]

owner: public(address)
manager: public(address)

@external
def __init__(_stakingToken:IMyToken):
    self.stakingToken = _stakingToken
    self.rewardPerBlock = self.INIT_REWARD
    self.owner = msg.sender
    self.manager = msg.sender

@internal
def onlyOwner(_owner: address):
    assert msg.sender == _owner, "you are not authorized"

@internal
def onlyManager(_manager: address):
    assert _manager == self.owner, "you are not authorized to manage this contract"

@external
def setRewardPerBlock(_amount: uint256):
    self.onlyOwner(msg.sender)
    self.rewardPerBlock = _amount
    

    


@internal
def updateReward(_to: address):
    if staked[_to] > 0:
        blocks: uint256 = self.lastClaimedBlock[_to] - block.number
        reward: uint256 = rewardPerBlock * blocks * self.staked[_to] / self.totalStaked
        self.stakingToken.mint(reward, _to)

    self.lastClaimedBlock[_to] = block.number



@external
def stake(_amount: uint256):
    assert _amount > 0, "cannot stake 0 amount"
    self.updateReward(msg.sender)
    self.stakingToken.transferFrom(msg.sender, self, _amount)
    self.staked[msg.sender] += _amount
    self.totalStaked += _amount
@external
def withdraw(_amount: uint256):
    assert self.staked[msg.sender] >= _amount, "Insufficient staked token"
    self.updateReward(msg.sender)
    self.staked[msg.sender] -= _amount
    self.totalStaked -= _amount
    self.stakingToken.transfer(_amount, msg.sender)
    
