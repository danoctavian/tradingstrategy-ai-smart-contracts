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
  const amount = '1000' // 0.001 USDC
  const sender = Addresses.MANAGER // contracts.pool
  const slippage = 50; // not sure

  const fromTokenAddress = Addresses.DAI
  const toTokenAddress = Addresses.USDC


  const pool = await Pool.at(contracts.pool)
  const aaveLendingPool = await IAaveLendingPool.at(Addresses.AAVE_LENDING_POOL)


  const asset = Addresses.USDC
  const assetToken = await IERC20Detailed.at(asset)

  // console.log('approve')
  // await assetToken.approve(aaveLendingPool.address, ether('100000'))
  //
  // console.log('depositing directly to aave')
  // await aaveLendingPool.deposit(asset, amount, Addresses.MANAGER, 0)
  //
  // process.exit(0)
  console.log('depositing...')
  await pool.aaveDeposit(
     Addresses.USDC,
     amount,
    aaveLendingPool.address
  );

  process.exit(0)
}



main().catch(error => {
  console.error('An unexpected error encountered:', error)
  process.exit(1)
});
