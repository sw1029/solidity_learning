import hre from "hardhat";
import { expect } from "chai";
import { mintingAmount, decimals } from "./constant";
import { MyToken, TinyBank } from "../typechain-types";

describe("TinyBank", () => {
    let MyTokenC : MyToken;
    let tinyBankC : TinyBank;
    //let signers[] : HardhatEthersSigner;
    beforeEach(async () => {
        const signers = await hre.ethers.getSigners();
        MyTokenC = await hre.ethers.deployContract("MyToken",[
        "MyToken",
        "MT",
        decimals,
        mintingAmount,
        ]);
        tinyBankC = await hre.ethers.deployContract("TinyBank",[
            await MyTokenC.getAddress(),
            [signers[0].address,signers[1].address,signers[2].address],
        ]);
    });

    describe("Initialized state check",() => {
        it("should return 0 totalStaked 0",async () => {
            expect(await tinyBankC.totalStaked()).to.equal(0n);
        });
        it("should return staked 0 amount of signer0",async () => {
            const signers = await hre.ethers.getSigners();
            expect(await tinyBankC.staked(signers[0].address)).equal(0);
        });
    });

    describe("Staking",() => {
        it("should return staked amount",async () => {
            const signers = await hre.ethers.getSigners();
            const stakingAmount = hre.ethers.parseUnits("50",decimals);
            await MyTokenC.approve(await tinyBankC.getAddress(),stakingAmount);//address에게 contract가 허가를 받아야 함
            await expect(tinyBankC.stake(stakingAmount)).to.emit(tinyBankC,"Staked").withArgs(
                signers[0].address,
                stakingAmount
            );
            expect(await tinyBankC.staked(signers[0].address)).equal(0);
            expect(await MyTokenC.balanceOf(tinyBankC)).equal(await tinyBankC.totalStaked());
            expect(await tinyBankC.totalStaked()).equal(stakingAmount);
        });
        
    });

    describe("Withdraw",() => {
        
        it("should return 0 staked after withdrawing total token",async () => {
            const signers = await hre.ethers.getSigners();
            const stakingAmount = hre.ethers.parseUnits("50",decimals);
            await MyTokenC.approve(await tinyBankC.getAddress(),stakingAmount);//address에게 contract가 허가를 받아야 함
            await tinyBankC.stake(stakingAmount);
            await expect(tinyBankC.withdraw(stakingAmount)).to.emit(tinyBankC,"Withdrawn").withArgs(
                stakingAmount,
                signers[0].address
            );
            expect(await tinyBankC.staked(signers[0].address)).equal(0);
            
        });
        
    });
    describe("reward",() => {
        
        it("should reward 1MT every blocks",async () => {
            const signers = await hre.ethers.getSigners();
            const stakingAmount = hre.ethers.parseUnits("50",decimals);
            await MyTokenC.approve(await tinyBankC.getAddress(),stakingAmount);//address에게 contract가 허가를 받아야 함
            await tinyBankC.stake(stakingAmount);
            
            const blocks = 5n;
            const transferAmount = hre.ethers.parseUnits("1",decimals);
            for(var i = 0; i < blocks; i++){
                await MyTokenC.transfer(transferAmount,signers[0].address);
            }

            await tinyBankC.withdraw(stakingAmount);//withdraw를 하면 reward가 지급
            expect(await MyTokenC.balanceOf(signers[0].address)).equal(
                hre.ethers.parseUnits((blocks+mintingAmount+1n).toString(),decimals)
            );
            
        });
        it("should revert when changing rewardPerBlock by hacker",async () => {
            //const signers = await hre.ethers.getSigners();
            const rewardToChange = hre.ethers.parseUnits("10000",decimals);
            await expect(tinyBankC.setRewardPerBlock(rewardToChange)).to.be.revertedWith(
                "You are not authorized to change reward amount");
            
            
        });


    });
    
}); 
    