import { logger } from '../../common/helpers/logger'
import { isHoodi, publicClient } from '../../common/helpers/clients'
import {
  SSVNetworkAbi,
  SSVNetworkAddress,
} from '../contracts/SSVNetworkContract'

export async function getPubkeysForProxy(proxy: string) {
  logger.info('getPubkeysForProxy started for ' + proxy)

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

  const pubkeys: string[] = []
  let skippedLogs = 0
  for (const log of logs) {
    const pubkey = (log as { args?: { publicKey?: string } }).args?.publicKey
    if (!pubkey) {
      skippedLogs += 1
      continue
    }
    pubkeys.push(pubkey)
  }
  if (skippedLogs > 0) {
    logger.warn(
      `getPubkeysForProxy skipped logs without decoded publicKey args for ${proxy}`,
      skippedLogs,
    )
  }

  logger.info('getPubkeysForProxy finished for ' + proxy)

  return pubkeys
}
