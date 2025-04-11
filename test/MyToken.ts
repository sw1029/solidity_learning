import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";

describe("mytoken deploy",() => {
    let MyTokenC:MyToken;
    before("deploy",async () => {
        MyTokenC = await hre.ethers.deployContract("MyToken",[
            "MyToken",
            "MT",
            18,
        ]);
    });
    it("should return name", async () => {
       expect(await MyTokenC.name()).to.equal("MyToken"); 
    });
    it("should return symbol", async () => {
         expect(await MyTokenC.symbol()).to.equal("MT"); 
    });
    it("should return decimals", async () => {
       expect(await MyTokenC.decimals()).to.equal(18); 
    });
    it("should return 0 totalsupply", async () => {
        expect(await MyTokenC.totalSupply()).to.equal(0); 
    });
    it("should return 0 balance", async () => {
        const signers = await hre.ethers.getSigners();
        expect(await MyTokenC.balanceOf(signers[0].address)).to.equal(0); 
    });
});