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

    const unitParser =(amount: string) => hre.ethers.parseUnits(amount, decimals);
    const unitFormatter = (amount: bigint) => hre.ethers.formatUnits(amount, decimals);
    const getBalance = async (address: string) => unitFormatter(
        await hre.ethers.provider.getBalance(address)
    )

    it("exploit", async () => {
        const signers = await hre.ethers.getSigners();
        const victim1 = signers[1]
        const victim2 = signers[2];
        const hacker = signers[3];

        const exploitC = await hre.ethers.deployContract(
            "Exploit",
            [await NativeBankC.getAddress()], hacker
        );

        const hCAddr = await exploitC.getAddress();
        const stakingAmount = unitParser("1");
        const v1Tx = {
            from: victim1.address,
            to: await NativeBankC.getAddress(),
            value: stakingAmount,
        }    
        const v2Tx = {
            from: victim2.address,
            to: await NativeBankC.getAddress(),
            value: stakingAmount,
        };
        await victim1.sendTransaction(v1Tx);
        await victim2.sendTransaction(v2Tx);

        await getBalance(hCAddr);
        await exploitC.exploit({value: stakingAmount});
        await getBalance(hCAddr);
    }
    );
})