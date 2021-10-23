const { artifacts, config, network, run, web3 } = require('hardhat')

const Pool = artifacts.require('Pool')

async function main () {

  await run('compile')

  console.log(`Using network: ${network.name}`)
  console.log('Network config:', config.networks[network.name])

  const name = 'TradingStrategyShares'
  const symbol = 'TSS'
  const manager = '0x8Ac7C3077610707Cd7dAa8EA986D7da9600DF580'

  // TODO: fill
  const supportedAssets = []

  // TODO: fill
  const priceOracles = []

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
}


main().catch(error => {
  console.error('An unexpected error encountered:', error)
  process.exit(1)j
});
