import { logger } from '../../common/helpers/logger'
import { isHoodi, publicClient } from '../../common/helpers/clients'
import {
  SSVNetworkAbi,
  SSVNetworkAddress,
} from '../contracts/SSVNetworkContract'
import { sleep } from '../../common/helpers/sleep'

export async function getOperatorIdsForProxy(proxy: string): Promise<bigint[][]> {
  logger.info('getOperatorIdsForProxy started for ' + proxy)

  await sleep(2000)

  try {
    const logs = await publicClient.getContractEvents({
      address: SSVNetworkAddress,
      abi: SSVNetworkAbi,
      eventName: 'ValidatorAdded',
      fromBlock: isHoodi ? 1216598n : 1000000n,
      toBlock: 'latest',
      strict: true,
      args: {
        owner: proxy,
      },
    })

    const operatorIds: bigint[][] = []
    let skippedLogs = 0
    for (const log of logs) {
      const ids = (log as { args?: { operatorIds?: bigint[] } }).args?.operatorIds
      if (!ids) {
        skippedLogs += 1
        continue
      }
      operatorIds.push(ids)
    }
    if (skippedLogs > 0) {
      logger.warn(
        `getOperatorIdsForProxy skipped logs without decoded operatorIds args for ${proxy}`,
        skippedLogs,
      )
    }

    logger.info('getOperatorIdsForProxy finished for ' + proxy)

    return operatorIds

  } catch (error) {
    return await getOperatorIdsForProxy(proxy)
  }
}
