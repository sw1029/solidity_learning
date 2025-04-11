import hre from "hardhat";
import { ethers } from "ethers";
describe("hardhat-test", async () => {
    it("hardhat ethers test", async () => {
        //console.log(hre.ethers);
        const signers = await hre.ethers.getSigners();
        
        const bob = signers[0];
        const alice = signers[1];
        const charlie = signers[2];

        const tx = {
            from:bob.address,
            to:alice.address,
            value:hre.ethers.parseEther("100"),
        }//트랜잭션
        const txHash = await bob.sendTransaction(tx);//송금
        //이러한 경우 bob이 보냈다는 서명이 필요함
        //sendTransaction은 서명된 트랜잭션을 보내는 것

        const receipt = await txHash.wait();//영수증
        console.log(await hre.ethers.provider.getTransaction(txHash.hash));
        console.log(receipt);

    }) //npx hardhat test
    //hardhat은 불필요한 작업을 제끼기 위해서 사용
    //nonce는 n번째 트랜잭션을 의미
    it("ethers test", async () => {
        const provider = new ethers.JsonRpcProvider("http://localhost:8545")
        const bobWallet = new ethers.Wallet(
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            provider
        );
        const aliceWallet = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d");
    
        const tx = {
            from:bobWallet.address,
            to:aliceWallet.address,
            value:ethers.parseEther("100"),
            chainId:31337
        }
        const populatedTx = await bobWallet.populateTransaction(tx);
        //트랜잭션을 채우는 것
        //provider를 이용해서 필요한 field를 채워주는 것
        const signedTX = await bobWallet
        provider.send("eth_sendRawTransaction", [signedTX])
        //getBalance를 통해 잔고 확인
        //wallet 주소를 통해 잔고 확인
    })
});
//describe == 그룹화를 통하여 테스트
//it을 통해 테스트