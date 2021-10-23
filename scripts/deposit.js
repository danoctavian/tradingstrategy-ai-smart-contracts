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

  console.log('doing swaps..')

  const contracts = JSON.parse(fs.readFileSync('deployment.json', 'utf8'))

  console.log({
    contracts
  })

  const pool = await Pool.at(contracts.pool)

  const usdc = await IERC20Detailed.at(Addresses.USDC)


  const balance = await usdc.balanceOf(owner)
  console.log({
    owner,
    balance: balance.toString()
  })

  console.log('approving..')

  await usdc.approve(pool.address, ether('100000000'))

  console.log('depositing..')
  await pool.deposit(usdc.address, '10000', {
    gas: 12e6
  })


  // await pool.swapExactTokensForTokens(
  //   uint amountIn,
  //   uint amountOutMin,
  //   address[] calldata path,
  //   IUniswapV2Router02 router
  // )

  process.exit(0)
}


main().catch(error => {
  console.error('An unexpected error encountered:', error)
  process.exit(1)
});
