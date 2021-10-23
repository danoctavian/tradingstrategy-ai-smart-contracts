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
  const sender = Addresses.MANAGER // contracts.pool
  const slippage = 50; // not sure

  const fromTokenAddress = Addresses.DAI
  const toTokenAddress = Addresses.USDC
  const oneInchBuilderURL =
    `https://api.1inch.exchange/v3.0/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&` +
    `amount=${amount.toString()}&fromAddress=${sender}&slippage=${slippage.toString()}&destReceiver=${sender}&disableEstimate=true`

  console.log({
    oneInchBuilderURL
  })

  const r = await fetch(oneInchBuilderURL).then(r => r.json())
  const data = r.tx.data

  console.log({
    data
  })


  const router = await IAaveLendingPool.at(Addresses.ONE_INCH_ROUTER)

  const fromToken = await IERC20Detailed.at(fromTokenAddress)

  console.log('approve...')
  await fromToken.approve(router.address, ether('1000000000'))

  console.log('swap...')


  await web3.eth.call({
    to: router.address,
    data: data
  })

  //   await lendingPool.call(data)
}



main().catch(error => {
  console.error('An unexpected error encountered:', error)
  process.exit(1)
});


