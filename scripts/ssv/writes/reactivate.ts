import { logger } from '../../common/helpers/logger'
import { P2pSsvProxyContractAbi } from '../contracts/P2pSsvProxyContractAbi'
import { sendTx } from '../../common/helpers/sendTx'
import { getAddress, getBigInt, getBigIntList, getClusterState } from '../helpers/ssvEnv'

export async function reactivate() {
  logger.log('reactivate started')

  const operatorIds = getBigIntList('SSV_REACTIVATE_OPERATOR_IDS')
  const tokenAmount = getBigInt('SSV_REACTIVATE_AMOUNT_WEI')
  const clusterState = getClusterState('SSV_REACTIVATE_CLUSTER')
  const proxyAddress = getAddress('SSV_REACTIVATE_PROXY_ADDRESS')

  const txHash = await sendTx(
    proxyAddress,
    P2pSsvProxyContractAbi,
    'reactivate',
    [
      tokenAmount,
      operatorIds,
      [clusterState],
    ],
  )

  logger.log('reactivate finished')

  return txHash
}
