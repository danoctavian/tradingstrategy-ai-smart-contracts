const { artifacts, config, network, run, web3 } = require('hardhat')
const { ether} = require('@openzeppelin/test-helpers')

const { Addresses } = require('./common')

const fs = require('fs')

const Pool = artifacts.require('Pool')
const IERC20Detailed = artifacts.require('IERC20Detailed')

async function main () {

  await run('compile')
  const [owner] = await web3.eth.getAccounts()

  console.log(`Using network: ${network.name}`)
  console.log('Network config:', config.networks[network.name])

  const contracts = JSON.parse(fs.readFileSync('deployment.json', 'utf8'))

  console.log({
    contracts
  })

  const pool = await Pool.at(contracts.pool)

  const totalFundValue = await pool.totalFundValue()
  console.log({
    totalFundValue: totalFundValue.toString()
  })

  process.exit(0)
}


main().catch(error => {
  console.error('An unexpected error encountered:', error)
  process.exit(1)
});
