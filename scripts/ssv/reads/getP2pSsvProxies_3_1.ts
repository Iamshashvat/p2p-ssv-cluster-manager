import { logger } from '../../common/helpers/logger'
import { isHolesky, publicClient } from '../../common/helpers/clients'
import { P2pSsvProxyFactoryAbi_3_1, P2pSsvProxyFactoryAddress_3_1 } from '../contracts/P2pSsvProxyFactoryContract_3_1'

export async function getP2pSsvProxies_3_1() {
  logger.info('getP2pSsvProxies_3_1 started')

  const logs = await publicClient.getContractEvents({
    address: P2pSsvProxyFactoryAddress_3_1,
    abi: P2pSsvProxyFactoryAbi_3_1,
    eventName: 'P2pSsvProxyFactory__RegistrationCompleted',
    fromBlock: isHolesky ? 1502570n : 1000000n,
    toBlock: 'latest',
    strict: false,
  })

  const proxies: string[] = []
  let skippedLogs = 0
  for (const log of logs) {
    const proxy = (log as { args?: { _proxy?: string } }).args?._proxy
    if (!proxy) {
      skippedLogs += 1
      continue
    }
    proxies.push(proxy)
  }
  if (skippedLogs > 0) {
    logger.warn(
      'getP2pSsvProxies_3_1 skipped logs without decoded _proxy args',
      skippedLogs,
    )
  }

  logger.info('getP2pSsvProxies_3_1 finished')

  const uniqueProxies = new Set(proxies)

  return uniqueProxies
}
