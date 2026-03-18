import { logger } from '../../common/helpers/logger'
import { sendTx } from '../../common/helpers/sendTx'
import { P2pSsvProxyFactoryAbi_3_1 } from '../contracts/P2pSsvProxyFactoryContract_3_1'
import { getAddress, getBigInt } from '../helpers/ssvEnv'

export async function setSmallExchangeRate() {
  logger.log('setSmallExchangeRate started')

  const factoryAddress = getAddress('P2P_SSV_PROXY_FACTORY_ADDRESS_3_1')
  const exchangeRate = getBigInt('SSV_PER_ETH_EXCHANGE_RATE_DIVIDED_BY_WEI')

  const txHash = await sendTx(
    factoryAddress,
    P2pSsvProxyFactoryAbi_3_1,
    'setSsvPerEthExchangeRateDividedByWei',
    [exchangeRate],
  )

  logger.log('setSmallExchangeRate finished')

  return txHash
}
