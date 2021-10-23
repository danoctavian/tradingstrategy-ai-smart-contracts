const { artifacts, config, network, run, web3 } = require('hardhat')
const fs = require('fs')
const { ether} = require('@openzeppelin/test-helpers')

const { Addresses } = require('./common')

const Pool = artifacts.require('Pool')
const IERC20Detailed = artifacts.require('IERC20Detailed')

async function main () {

  await run('compile')

  const [owner] = await web3.eth.getAccounts()
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

  const usdc = await IERC20Detailed.at(Addresses.USDC)

  const balance = await usdc.balanceOf(owner)
  console.log({
    owner,
    balance: balance.toString()
  })

  console.log('depositing some funds..')

  console.log('approving..')

  await usdc.approve(pool.address, ether('100000000'))

  console.log('depositing..')
  await pool.deposit(usdc.address, '10000', {
    gas: 12e6
  })

  process.exit(0)
}


main().catch(error => {
  console.error('An unexpected error encountered:', error)
  process.exit(1)
});
