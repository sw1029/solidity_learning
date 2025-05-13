import hre from "hardhat";
import { expect } from "chai";
import { mintingAmount, decimals } from "./constant";
import { MyToken, TinyBank } from "../typechain-types";

describe("TinyBank", () => {
    let MyTokenC : MyToken;
    let tinyBankC : TinyBank;
    //let signers[] : HardhatEthersSigner;
    beforeEach(async () => {
        MyTokenC = await hre.ethers.deployContract("MyToken",[
        "MyToken",
        "MT",
        decimals,
        mintingAmount,
        ]);
        tinyBankC = await hre.ethers.deployContract("TinyBank",[
            await MyTokenC.getAddress()
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
            await tinyBankC.stake(stakingAmount);
            expect(await tinyBankC.staked(signers[0].address)).equal(0);
            expect(await MyTokenC.balanceOf(tinyBankC)).equal(await tinyBankC.totalStaked());
            expect(await tinyBankC.totalStaked()).equal(stakingAmount);
        });
        it("",async () => {
            const signers = await hre.ethers.getSigners();
            
        });
    });

    describe("Withdraw",() => {
        
        it("should return 0 staked after withdrawing total token",async () => {
            const signers = await hre.ethers.getSigners();
            const stakingAmount = hre.ethers.parseUnits("50",decimals);
            await MyTokenC.approve(await tinyBankC.getAddress(),stakingAmount);//address에게 contract가 허가를 받아야 함
            await tinyBankC.stake(stakingAmount);
            await tinyBankC.withdraw(stakingAmount);
            expect(await tinyBankC.staked(signers[0].address)).equal(0);
            //staked가 왜 호출이 안될까???
        });
        it("",async () => {
            const signers = await hre.ethers.getSigners();
            
        });
    });
}); 
    