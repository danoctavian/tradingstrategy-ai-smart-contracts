/**
 * @type import('hardhat/config').HardhatUserConfig
 */

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

for (const network of ['MAINNET', 'KOVAN', 'MUMBAI']) {
  const url = getenv(network, 'PROVIDER_URL', false);
  if (!url) continue;
  const accounts = getenv(network, 'ACCOUNT_KEY', undefined, v => v.split(/[^0-9a-fx]+/i));
  const gasPrice = getenv(network, 'GAS_PRICE', undefined, v => parseInt(v, 10) * 1e9);
  const gasLimit = getenv(network, 'GAS_LIMIT', undefined, v => parseInt(v, 10));
  networks[network.toLowerCase()] = { accounts, gasPrice, gasLimit, url };
}

module.exports = {
  solidity: "0.8.4",
};
