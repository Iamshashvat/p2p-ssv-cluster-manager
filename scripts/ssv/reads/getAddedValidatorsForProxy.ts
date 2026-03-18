import { logger } from '../../common/helpers/logger'
import { isHolesky, publicClient } from '../../common/helpers/clients'
import {
  SSVNetworkAbi,
  SSVNetworkAddress,
} from '../contracts/SSVNetworkContract'
import { sleep } from '../../common/helpers/sleep'

export async function getAddedValidatorsForProxy(proxy: string): Promise<{   operatorIds: bigint[]  ,publicKey: string }[]> {
  logger.info('getAddedValidatorsForProxy started for ' + proxy)

  try {
    await sleep(1200)

    const logs = await publicClient.getContractEvents({
      address: SSVNetworkAddress,
      abi: SSVNetworkAbi,
      eventName: 'ValidatorAdded',
      fromBlock: isHolesky ? 1502570n : 1000000n,
      toBlock: 'latest',
      strict: true,
      args: {
        owner: proxy,
      },
    })

    const validators: { operatorIds: bigint[]; publicKey: string }[] = []
    let skippedLogs = 0
    for (const log of logs) {
      const args = (
        log as { args?: { operatorIds?: bigint[]; publicKey?: string } }
      ).args
      if (!args?.operatorIds || !args.publicKey) {
        skippedLogs += 1
        continue
      }
      validators.push(args as { operatorIds: bigint[]; publicKey: string })
    }
    if (skippedLogs > 0) {
      logger.warn(
        `getAddedValidatorsForProxy skipped logs without decoded args for ${proxy}`,
        skippedLogs,
      )
    }

    logger.info('getAddedValidatorsForProxy finished for ' + proxy)

    return validators

  } catch (error) {
    logger.error(error)
    return await getAddedValidatorsForProxy(proxy)
  }
}
