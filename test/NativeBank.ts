import hre from "hardhat";
import { expect } from "chai";
import { mintingAmount, decimals } from "./constant";

describe("NativeBank", () => {
    it("should send native token to contract", async () => {
        const signers = await hre.ethers.getSigners();
        const staker = signers[0];
        const NativeBankC = await hre.ethers.deployContract("NativeBank");

        const tx ={
            from : staker.address,
            to : await NativeBankC.getAddress(),
            value: hre.ethers.parseEther("1"),
        };
        const txResp = await staker.sendTransaction(tx);
        const txReceipt = await txResp.wait();
    });
})