import { encodeFunctionData } from 'viem'
import { P2pSsvProxyFactoryAbi } from '../contracts/P2pSsvProxyFactoryContract'
import { MetaTransaction } from '../../safe/models/MetaTransaction'
import { logger } from '../../common/helpers/logger'
import { SSVTokenAbi } from '../contracts/SSVTokenContract'
import { waitForHashToBeApprovedAndExecute } from '../../safe/waitForHashToBeApprovedAndExecute'
import { ClusterStateApi, toClusterState } from '../models/ClusterStateApi'
import { getClusterStatesToTopUp } from '../reads/getClusterStatesToTopUp'
import { SSVNetworkAbi } from '../contracts/SSVNetworkContract'
import { getSharedSsvWriteConfig } from '../helpers/ssvEnv'

export async function transferSsvTokensFromFactoryToClusters() {
  logger.info('transferSsvTokensFromFactoryToClusters started')
  const config = getSharedSsvWriteConfig()

  const { clusterStatesToTopUp, totalTokensToTopUp } =
    await getClusterStatesToTopUp()

  logger.info('totalTokensToTopUp', totalTokensToTopUp)

  if (totalTokensToTopUp === 0n) {
    logger.info('totalTokensToTopUp == 0 No need to top up.')
    logger.info('transferSsvTokensFromFactoryToClusters finished')
    return
  }
  const metaTxs = getMetaTxs(totalTokensToTopUp, clusterStatesToTopUp, config)

  await waitForHashToBeApprovedAndExecute(metaTxs)

  logger.info('transferSsvTokensFromFactoryToClusters finished')
}

type ClusterStateToTopUp = ClusterStateApi & { tokensToAdd: bigint }

function getMetaTxs(
  totalTokensToTopUp: bigint,
  clusterStatesToTopUp: ClusterStateToTopUp[],
  config: ReturnType<typeof getSharedSsvWriteConfig>,
) {
  const metaTxs: MetaTransaction[] = []

  const approveData = encodeFunctionData({
    abi: SSVTokenAbi,
    functionName: 'approve',
    args: [config.ssvNetworkAddress, totalTokensToTopUp],
  })
  const approveMetaTx = {
    to: config.ssvTokenAddress,
    data: approveData,
  }
  metaTxs.push(approveMetaTx)

  const transferSsvTokensToGsData = encodeFunctionData({
    abi: P2pSsvProxyFactoryAbi,
    functionName: 'transferERC20',
    args: [
      config.ssvTokenAddress,
      config.safeAddress,
      totalTokensToTopUp,
    ],
  })
  const transferSsvTokensToGsTx = {
    to: config.factoryAddress,
    data: transferSsvTokensToGsData,
  }
  metaTxs.push(transferSsvTokensToGsTx)

  for (const clusterStateApi of clusterStatesToTopUp) {
    const cluster = toClusterState(clusterStateApi)

    const depositData = encodeFunctionData({
      abi: SSVNetworkAbi,
      functionName: 'deposit',
      args: [
        clusterStateApi.ownerAddress,
        clusterStateApi.operators,
        clusterStateApi.tokensToAdd,
        cluster,
      ],
    })
    const depositMetaTx = {
      to: config.ssvNetworkAddress,
      data: depositData,
    }
    metaTxs.push(depositMetaTx)
  }

  return metaTxs
}
