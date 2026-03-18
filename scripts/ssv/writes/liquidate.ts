import { logger } from '../../common/helpers/logger'
import { P2pSsvProxyContractAbi } from '../contracts/P2pSsvProxyContractAbi'
import { sendTx } from '../../common/helpers/sendTx'
import { getAddress, getClusterState, getNumberList } from '../helpers/ssvEnv'

export async function liquidate() {
  logger.log('liquidate started')

  const operatorIds = getNumberList('SSV_LIQUIDATE_OPERATOR_IDS')
  const clusterState = getClusterState('SSV_LIQUIDATE_CLUSTER')
  const proxyAddress = getAddress('SSV_LIQUIDATE_PROXY_ADDRESS')

  const txHash = await sendTx(
    proxyAddress,
    P2pSsvProxyContractAbi,
    'liquidate',
    [
      operatorIds,
      [clusterState],
    ],
  )

  logger.log('liquidate finished')

  return txHash
}
