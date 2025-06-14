import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { mintingAmount, decimals } from "./constant";
//import { HardhatEthersSigner } from "@nomiclabs/hardhat-ethers/signers";

describe("mytoken deploy",() => {
    let MyTokenC:MyToken;
    beforeEach("deploy",async () => {
        MyTokenC = await hre.ethers.deployContract("MyToken",[
            "MyToken",
            "MT",
            decimals,
            mintingAmount,
        ]);
    });
    //let signers: HardhatEthersSigner[];
    
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
        it("should return initial supply + 1 MT balance for signer 0", async () => {
            const signers = await hre.ethers.getSigners();
            const oneMt = hre.ethers.parseUnits("1",decimals);
            await MyTokenC.mint(oneMt,signers[0].address);
            expect(await MyTokenC.balanceOf(signers[0].address)).equal(
                mintingAmount*10n**decimals + oneMt
            ); 
        });

        it("should return or revert when minting infinitly", async () => {
            const signers = await hre.ethers.getSigners();
            const mintingAgainAmount = hre.ethers.parseUnits("100",decimals); 
            expect(await MyTokenC.mint(mintingAgainAmount,signers[2].address)).to.be.revertedWith("you are not authorized");
            //아무나 발행이 가능하다...
        });
    });

    describe("transfer", () => { //transfer는 사실상 transaction을 의미함
        it("should have 0.5MT", async () => {
            const signers = await hre.ethers.getSigners();
            const tx = await MyTokenC.transfer(
                hre.ethers.parseUnits("0.5",decimals),
                signers[1].address
            )
            const receipt = await tx.wait();//거래영수증
            await MyTokenC.transfer(hre.ethers.parseUnits("0.5",decimals),signers[1].address);
            //expect(await MyTokenC.balanceOf(signers[1].address)).to.equal(hre.ethers.parseUnits("0.5",decimals));
        });
       
        it("should be reverted with insufficient balance error", async () => {
            const signers = await hre.ethers.getSigners();
            await expect(MyTokenC.transfer(hre.ethers.parseUnits((mintingAmount+1n).toString(),decimals),
            signers[1])).to.be.revertedWith("Insufficient balance");

            //const filter = MyTokenC.filters.Transfer(signers[0].address)
            //MyTokenC.queryFilter(filter,0,"latest")
            //최신 블럭까지 검색 후 조건에 맞는 이벤트를 가져와라
            //보통 0 대신 시작주소를 다른 값으로 조정함

        });

        //event chect 로직 시에는 expect 앞에 await을 붙여줘야함.

    });

    describe("TransferFrom", () => {
        it ("should be emit Approval event", async () => {
            const signers = await hre.ethers.getSigners();
            await expect(
                MyTokenC.approve(
                    signers[1].address,
                    hre.ethers.parseUnits("10",decimals))
            )
            .to.emit(MyTokenC,"Approval")
            .withArgs(signers[1].address,hre.ethers.parseUnits("10",decimals));
        });
        it("should be reverted with insufficient allowance error", async () => {
            const signers = await hre.ethers.getSigners();
            await expect(MyTokenC.connect(signers[1])
            .transferFrom(signers[0].address,signers[1].address,
                hre.ethers.parseUnits("1",decimals)))
            .to.be.revertedWith("Insufficient allowance");
        });
        it("should 100MT ok", async () => {
            const signers = await hre.ethers.getSigners();
            await MyTokenC.connect(signers[0]).approve(
                signers[1].address, // 100MT 인출 권한을 signers[1]에게 부여
                hre.ethers.parseUnits("100",decimals)
            );
            await MyTokenC.connect(signers[1]).transferFrom(
                signers[0].address,
                signers[1].address,// 100MT 인출
                hre.ethers.parseUnits("100",decimals)
            );
            const balance = await MyTokenC.balanceOf(signers[1].address);//잔액 (balance)를 가져옴옴
            expect(balance).to.equal(hre.ethers.parseUnits("100",decimals));
            //expect를 통해 잔액이 100MT인지 확인
        });    
    });    
    
});