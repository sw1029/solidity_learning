import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-vyper";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  vyper: {
    version : "0.3.0",
  },
  networks: {
    kairos: {
      url: "https://public-en-kairos.node.kaia.io",
      accounts: ["0xa07900d6508ed7c5a81c160c2e7f2542f0c57b151dd9b2f079cbbabb1af58d47"]
    }
  }
};

export default config;
