import hre from "hardhat";
import { expect } from "chai";
import { mintingAmount, decimals } from "./constant";
import { HardhatEthersHelpers } from "hardhat/types";
import { NativeBank } from "../typechain-types";


describe("NativeBank", () => {
    //let signers : HardhatEther;
    let NativeBankC : any;
    beforeEach("Deploy NativeBank contract" async () => {
        //signers = await hre.ethers.getSigners();
        NativeBankC = await hre.ethers.deployContract("NativeBank");
    });
    it("should send native token to contract", async () => {
        const signers = await hre.ethers.getSigners();
        const staker = signers[0];
        const tx ={
            from : staker.address,
            to : await NativeBankC.getAddress(),
            value: hre.ethers.parseEther("1"),
        };
        const txResp = await staker.sendTransaction(tx);
        const txReceipt = await txResp.wait();
    });

    it("should withdraw all th tokens",async () => {
        const signers = await hre.ethers.getSigners();
        const staker = signers[0];
        const stakingAmount = hre.ethers.parseEther("10");
        const tx = {
            from:staker,
            to : await NativeBankC.getAddress(),
            value: stakingAmount,
        };

        const sentTx = await staker.sendTransaction(tx);
        sentTx.wait();

        expect(NativeBankC.balanceOf(staker.address)).to.equal(stakingAmount);

        await NativeBankC.withdraw();
        expect(await NativeBankC.balanceOf(staker.address)).to.equal(0n);
    });
})