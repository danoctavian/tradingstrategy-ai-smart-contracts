
const { Addresses } = require('./scripts/common')
const name = 'TradingStrategyShares'
const symbol = 'TSS'
const manager = '0x8Ac7C3077610707Cd7dAa8EA986D7da9600DF580'

// TODO: fill
const supportedAssets = [Addresses.USDC, Addresses.WMATIC]

// TODO: fill
const priceOracles = [Addresses.CHAINLINK.USDC_USD, Addresses.CHAINLINK.MATIC_USD]

module.exports = [
  name,
  symbol,
  manager,
  supportedAssets,
  priceOracles
];
