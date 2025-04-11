import hre from "hardhat";
import { expect } from "chai";

describe("mytoken deploy",() => {
    it("deploy",async () => {
        const MyTokenC = await hre.ethers.deployContract("MyToken",[
            "MyToken",
            "MT",
            18,
        ]);
        expect(await MyTokenC.name()).to.equal("MyToken");
        expect(await MyTokenC.symbol()).to.equal("MT");
        expect(await MyTokenC.decimals()).to.equal(18);
    });
});