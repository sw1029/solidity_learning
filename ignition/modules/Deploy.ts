import {buildModule} from "@nomicfoundation/hardhat-ignition/modules"

export default buildModule("MyTokenDeploy", (m) => {
    const managers = [
        m.getAccount(0),  
    ];
    const myTokenC = m.contract("MyToken",["MyToken","MT",18,100]);
    const tinyBankC = m.contract("TinyBank",[myTokenC,managers]);
    return {myTokenC, tinyBankC};
});