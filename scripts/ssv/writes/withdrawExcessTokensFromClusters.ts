import { encodeFunctionData } from 'viem'
import { MetaTransaction } from '../../safe/models/MetaTransaction'
import { logger } from '../../common/helpers/logger'
import { waitForHashToBeApprovedAndExecute } from '../../safe/waitForHashToBeApprovedAndExecute'
import { ClusterStateApi, toClusterState } from '../models/ClusterStateApi'
import { getClusterStatesToWithdraw } from '../reads/getClusterStatesToWithdraw'
import { P2pSsvProxyContractAbi } from '../contracts/P2pSsvProxyContractAbi'
import { getSharedSsvWriteConfig } from '../helpers/ssvEnv'

export async function withdrawExcessTokensFromClusters() {
  logger.info('withdrawExcessTokensFromClusters started')
  const config = getSharedSsvWriteConfig()

  const clusterStatesToWithdraw = await getClusterStatesToWithdraw()

  if (!clusterStatesToWithdraw.length) {
    logger.info('No clusters to withdraw.')
    logger.info('withdrawExcessTokensFromClusters finished')
    return
  }
  const metaTxs = getMetaTxs(clusterStatesToWithdraw, config.factoryAddress)

  await waitForHashToBeApprovedAndExecute(metaTxs)

  logger.info('withdrawExcessTokensFromClusters finished')
}

type ClusterStateToWithdraw = ClusterStateApi & { tokensToWithdraw: bigint }

function getMetaTxs(
  clusterStatesToWithdraw: ClusterStateToWithdraw[],
  factoryAddress: `0x${string}`,
) {
  const metaTxs: MetaTransaction[] = []

  for (const clusterStateApi of clusterStatesToWithdraw) {
    const cluster = toClusterState(clusterStateApi)

    const withdrawFromSSVData = encodeFunctionData({
      abi: P2pSsvProxyContractAbi,
      functionName: 'withdrawFromSSV',
      args: [
        clusterStateApi.tokensToWithdraw,
        clusterStateApi.operators,
        [cluster],
      ],
    })
    const withdrawFromSSVMetaTx = {
      to: clusterStateApi.ownerAddress as `0x${string}`,
      data: withdrawFromSSVData,
    }
    metaTxs.push(withdrawFromSSVMetaTx)

    const withdrawSSVTokensData = encodeFunctionData({
      abi: P2pSsvProxyContractAbi,
      functionName: 'withdrawSSVTokens',
      args: [
        factoryAddress,
        clusterStateApi.tokensToWithdraw,
      ],
    })
    const withdrawSSVTokensMetaTx = {
      to: clusterStateApi.ownerAddress as `0x${string}`,
      data: withdrawSSVTokensData,
    }
    metaTxs.push(withdrawSSVTokensMetaTx)
  }

  return metaTxs
}
