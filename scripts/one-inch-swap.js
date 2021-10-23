const { artifacts, config, network, run, web3 } = require('hardhat')
const { ether} = require('@openzeppelin/test-helpers')
const { Addresses } = require('./common')
const fetch = require('node-fetch')


const Pool = artifacts.require('Pool')
const IAaveLendingPool = artifacts.require('IAaveLendingPool')
const IERC20Detailed = artifacts.require('IERC20Detailed')
const fs = require('fs')

// inspired by https://github.com/smye/1inch-swap/blob/master/scripts/swap.py

async function main() {


  const contracts = JSON.parse(fs.readFileSync('deployment.json', 'utf8'))
  const chainId = 137
  const amount = ether('0.01')
  const poolAddress = Addresses.MANAGER // contracts.pool
  const slippage = 50; // not sure

  const fromTokenAddress = Addresses.WMATIC
  const toTokenAddress = Addresses.USDC
  const oneInchBuilderURL =
    `https://api.1inch.exchange/v3.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&` +
    `amount=${amount.toString()}&fromAddress=${poolAddress}&slippage=${slippage.toString()}&destReceiver=${poolAddress}&disableEstimate=true`

  console.log({
    oneInchBuilderURL
  })

  const r = await fetch(oneInchBuilderURL).then(r => r.json())
  console.log(r)
  const data = r.tx.data


  const lendingPool = await IAaveLendingPool.at(Addresses.AAVE_LENDING_POOL)

  const fromToken = await IERC20Detailed.at(fromTokenAddress)

  console.log('approve...')
  await fromToken.approve(lendingPool.address, amount)

  console.log('swap...')

  await lendingPool.call(data)
}



main().catch(error => {
  console.error('An unexpected error encountered:', error)
  process.exit(1)
});


