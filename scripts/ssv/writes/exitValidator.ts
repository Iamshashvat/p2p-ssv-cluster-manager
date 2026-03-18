import { logger } from '../../common/helpers/logger'
import { SSVNetworkAbi } from '../contracts/SSVNetworkContract'
import { sendTx } from '../../common/helpers/sendTx'
import { getAddress, getNumberList, getRequiredString } from '../helpers/ssvEnv'

export async function exitValidator() {
  logger.log('exitValidator started')

  const publicKey = getRequiredString('SSV_EXIT_PUBLIC_KEY')
  const operatorIds = getNumberList('SSV_EXIT_OPERATOR_IDS')
  const proxyAddress = getAddress('SSV_EXIT_PROXY_ADDRESS')

  const txHash = await sendTx(
    proxyAddress,
    SSVNetworkAbi,
    'exitValidator',
    [publicKey, operatorIds],
  )

  logger.log('exitValidator finished')

  return txHash
}
