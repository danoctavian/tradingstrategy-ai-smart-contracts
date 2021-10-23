
const { Addresses } = require('./scripts/common')
const name = 'TradingStrategyShares'
const symbol = 'TSS'
const manager = '0x8Ac7C3077610707Cd7dAa8EA986D7da9600DF580'

const supportedAssets = [Addresses.USDC, Addresses.WMATIC, Addresses.DAI, Addresses.amUSDC, Addresses.amDAI]

const priceOracles = [
  Addresses.CHAINLINK.USDC_USD,
  Addresses.CHAINLINK.MATIC_USD,
  Addresses.CHAINLINK.DAI_USD,
  Addresses.CHAINLINK.USDC_USD, // assume peg to USDC
  Addresses.CHAINLINK.DAI_USD, // assume peg to DAI
]

const shareholder = manager

module.exports = [
  name,
  symbol,
  manager,
  supportedAssets,
  priceOracles,
  shareholder
];
