import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
//import { HardhatEthersSigner } from "@nomiclabs/hardhat-ethers/signers";

const mintingAmount = 100n;
const decimals = 18n;

describe("mytoken deploy",() => {
    let MyTokenC:MyToken;
    //let signers: HardhatEthersSigner[];
    beforeEach("deploy",async () => {
        MyTokenC = await hre.ethers.deployContract("MyToken",[
            "MyToken",
            "MT",
            decimals,
            mintingAmount,
        ]);
    });
    describe("basic state", () => {
        it("should return name", async () => {
            expect(await MyTokenC.name()).to.equal("MyToken"); 
         });
         it("should return symbol", async () => {
              expect(await MyTokenC.symbol()).to.equal("MT"); 
         });
         it("should return decimals", async () => {
            expect(await MyTokenC.decimals()).to.equal(18); 
         });
         it("should return 100 totalsupply", async () => {
             expect(await MyTokenC.totalSupply()).to.equal(mintingAmount*10n**decimals); 
         });
    });
    
    describe("mint", () => {
        it("should return 0 balance", async () => {
            const signers = await hre.ethers.getSigners();
            expect(await MyTokenC.balanceOf(signers[0].address)).to.equal(mintingAmount*10n**decimals); 
        });
    });

    

    it("should have 0.5MT", async () => {
        const signers = await hre.ethers.getSigners();
        await MyTokenC.transfer(hre.ethers.parseUnits("0.5",decimals),signers[1].address);
        expect(await MyTokenC.balanceOf(signers[1].address)).to.equal(hre.ethers.parseUnits("0.5",decimals));
    });

    it("should be reverted with insufficient balance error", async () => {
        const signers = await hre.ethers.getSigners();
        await expect(MyTokenC.transfer(hre.ethers.parseUnits((mintingAmount+1n).toString(),decimals),
        signers[1])).to.be.revertedWith("Insufficient balance");
    }
    );

});