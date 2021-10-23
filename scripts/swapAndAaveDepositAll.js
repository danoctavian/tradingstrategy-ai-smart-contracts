const { artifacts, config, network, run, web3 } = require('hardhat')
const { ether} = require('@openzeppelin/test-helpers')

const { Addresses } = require('./common')

const Pool = artifacts.require('Pool')
const fs = require('fs')

async function main () {

  await run('compile')

  console.log(`Using network: ${network.name}`)
  console.log('Network config:', config.networks[network.name])

  console.log('doing swaps..')

  const contracts = JSON.parse(fs.readFileSync('deployment.json', 'utf8'))

  console.log({
    contracts
  })

  const pool = await Pool.at(contracts.pool)

  console.log('swapping and depositing all...')

  await pool.swapAndAaveDepositAll(
    '1000',
    '0',
    [Addresses.USDC, Addresses.DAI],
    Addresses.QUICKSWAP,
    Addresses.AAVE_LENDING_POOL
  );

  process.exit(0)

  // await pool.swapExactTokensForTokens(
  //   uint amountIn,
  //   uint amountOutMin,
  //   address[] calldata path,
  //   IUniswapV2Router02 router
  // )
}


main().catch(error => {
  console.error('An unexpected error encountered:', error)
  process.exit(1)
});
