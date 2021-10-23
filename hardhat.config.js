/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('dotenv').config();
require('@nomiclabs/hardhat-web3');
require('@nomiclabs/hardhat-truffle5');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('solidity-coverage');
require('hardhat-contract-sizer');

const { task } = require('hardhat/config');
const ether = n => `${n}${'0'.repeat(18)}`;

const networks = {
  hardhat: {
    accounts: {
      count: 100,
      accountsBalance: ether(1000000000),
    },
    hardfork: 'berlin',
    allowUnlimitedContractSize: true,
    blockGasLimit: 12e6,
    gas: 12e6,
  },
  localhost: {
    blockGasLimit: 12e6,
    gas: 12e6,
  },
};

const getenv = (network, key, fallback, parser = i => i) => {
  const value = process.env[`${network}_${key}`];
  return value ? parser(value) : fallback;
};

for (const network of ['POLYGON', 'KOVAN', 'MUMBAI']) {
  const url = getenv(network, 'PROVIDER_URL', false);
  if (!url) continue;
  const accounts = getenv(network, 'ACCOUNT_KEY', undefined, v => v.split(/[^0-9a-fx]+/i));
  const gasPrice = getenv(network, 'GAS_PRICE', undefined, v => parseInt(v, 10) * 1e9);
  const gasLimit = getenv(network, 'GAS_LIMIT', undefined, v => parseInt(v, 10));
  networks[network.toLowerCase()] = { accounts, gasPrice, gasLimit, url };
}

module.exports = {
  networks,

  solidity: {
    compilers: [
      { version: '0.5.16' }, // uniswap v2 core
      {  version: '0.8.7' }, // swap operator
    ]
  },
};
