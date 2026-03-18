import { logger } from '../../common/helpers/logger'
import {
  P2pSsvProxyFactoryAbi,
  P2pSsvProxyFactoryAddress,
} from '../contracts/P2pSsvProxyFactoryContract'
import { isHolesky, publicClient } from '../../common/helpers/clients'
import { getP2pSsvProxies_3_1 } from './getP2pSsvProxies_3_1'
import { sleep } from '../../common/helpers/sleep'

export async function getP2pSsvProxies() {
  logger.info('getP2pSsvProxies started')

  await sleep(2000)

  const logs = await publicClient.getContractEvents({
    address: P2pSsvProxyFactoryAddress,
    abi: P2pSsvProxyFactoryAbi,
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
    logger.warn('getP2pSsvProxies skipped logs without decoded _proxy args', skippedLogs)
  }

  logger.info('getP2pSsvProxies finished')

  const uniqueProxies = new Set(proxies)

  const proxies_3_1 = await getP2pSsvProxies_3_1()
  proxies_3_1.forEach((p) => uniqueProxies.add(p))

  return uniqueProxies
}
