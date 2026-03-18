import { logger } from '../../common/helpers/logger'
import { SSVNetworkAbi } from '../contracts/SSVNetworkContract'
import { encodeFunctionData } from 'viem'
import { ClusterState } from '../models/ClusterState'
import { waitForHashToBeApprovedAndExecute } from '../../safe/waitForHashToBeApprovedAndExecute'
import { MetaTransaction } from '../../safe/models/MetaTransaction'

export async function bulkRemoveValidator(
  proxy: string,
  publicKeys: string[],
  operatorIds: (number | bigint)[],
  cluster: ClusterState,
) {
  logger.log(
    'bulkRemoveValidator started for ' + proxy,
    operatorIds.join(',') + ' ' + publicKeys.join('\n'),
  )

  const distinctPubKeys = distinct(publicKeys)

  const metaTxs: MetaTransaction[] = []

  const bulkRemoveData = encodeFunctionData({
    abi: SSVNetworkAbi,
    functionName: 'bulkRemoveValidator',
    args: [distinctPubKeys, operatorIds, cluster],
  })
  const metaTx = {
    to: proxy as `0x${string}`,
    data: bulkRemoveData,
  }
  metaTxs.push(metaTx)

  await waitForHashToBeApprovedAndExecute(metaTxs)

  logger.log(
    'bulkRemoveValidator finished for ' + proxy,
    operatorIds.join(',') + ' ' + distinctPubKeys.join('\n'),
  )
}

const distinct = <T>(arr: readonly T[]) => [...new Set(arr)]