const { artifacts, config, network, run, web3 } = require('hardhat')
const fs = require('fs')

const { Addresses } = require('./common')

const Pool = artifacts.require('Pool')

async function main () {

  await run('compile')

  console.log(`Using network: ${network.name}`)
  console.log('Network config:', config.networks[network.name])

  const name = 'TradingStrategyShares'
  const symbol = 'TSS'
  const manager = '0x8Ac7C3077610707Cd7dAa8EA986D7da9600DF580'

  // TODO: fill
  const supportedAssets = [Addresses.USDC, Addresses.WMATIC]

  // TODO: fill
  const priceOracles = [Addresses.CHAINLINK.USDC_USD, Addresses.CHAINLINK.MATIC_USD]

  const managerBalance = await web3.eth.getBalance(manager);
  console.log({
    managerBalance: managerBalance.toString()
  });


  const pool = await Pool.new(
    name,
    symbol,
    manager,
    supportedAssets,
    priceOracles
  );

  const contracts = {
    pool: pool.address
  };

  console.log(JSON.stringify(contracts))

  fs.writeFileSync('deployment.json', JSON.stringify(contracts))
}


main().catch(error => {
  console.error('An unexpected error encountered:', error)
  process.exit(1)
});
