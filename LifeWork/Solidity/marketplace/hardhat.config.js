/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
    hardhat: {
      // Uncomment these lines to use mainnet fork
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
        blockNumber: 11972120,
      },
    },
    // live: {
    //   url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
    //   accounts: [process.env.MAINNET_PRIVKEY],
    // },
  },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API,
  //   // url: "https://api-rinkeby.etherscan.io/",
  // },
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 240000,
  },
};
