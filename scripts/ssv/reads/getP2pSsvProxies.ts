import { logger } from '../../common/helpers/logger'
import {
  P2pSsvProxyFactoryAbi,
  P2pSsvProxyFactoryAddress,
} from '../contracts/P2pSsvProxyFactoryContract'
import {
  P2pSsvProxyFactoryAbi_3_1,
  P2pSsvProxyFactoryAddress_3_1,
} from '../contracts/P2pSsvProxyFactoryContract_3_1'
import {
  P2pSsvProxyFactoryAbi_3_1_1,
  P2pSsvProxyFactoryAddress_3_1_1,
} from '../contracts/P2pSsvProxyFactoryContract_3_1_1'
import { publicClient } from '../../common/helpers/clients'

async function readAllProxies(
  address: `0x${string}`,
  abi: unknown[],
  label: string,
): Promise<string[]> {
  logger.info(`${label}: reading getAllP2pSsvProxies...`)

  const proxies = await publicClient.readContract({
    address,
    abi: abi as any,
    functionName: 'getAllP2pSsvProxies',
    args: [],
  })

  logger.info(`${label}: found ${(proxies as string[]).length} proxies`)
  return proxies as string[]
}

export async function getP2pSsvProxies() {
  logger.info('getP2pSsvProxies started')

  const queries: Promise<string[]>[] = [
    readAllProxies(P2pSsvProxyFactoryAddress, P2pSsvProxyFactoryAbi, 'v1'),
    readAllProxies(P2pSsvProxyFactoryAddress_3_1, P2pSsvProxyFactoryAbi_3_1, 'v3.1'),
  ]

  if (P2pSsvProxyFactoryAddress_3_1_1) {
    queries.push(readAllProxies(P2pSsvProxyFactoryAddress_3_1_1, P2pSsvProxyFactoryAbi_3_1_1, 'v3.1.1'))
  } else {
    logger.warn('P2P_SSV_PROXY_FACTORY_ADDRESS_3_1_1 not set, skipping v3.1.1 factory')
  }

  const results = await Promise.all(queries)

  const uniqueProxies = new Set(results.flat())

  logger.info('getP2pSsvProxies finished. Total unique proxies: ' + uniqueProxies.size)

  return uniqueProxies
}
