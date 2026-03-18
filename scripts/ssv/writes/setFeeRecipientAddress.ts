import { logger } from '../../common/helpers/logger'
import { SSVNetworkAbi } from '../contracts/SSVNetworkContract'
import { sendTx } from '../../common/helpers/sendTx'
import { getAddress } from '../helpers/ssvEnv'

export async function setFeeRecipientAddress() {
  logger.log('setFeeRecipientAddress started')

  const proxyAddress = getAddress('SSV_PROXY_ADDRESS')
  const feeRecipientAddress = getAddress('SSV_FEE_RECIPIENT_ADDRESS')

  const txHash = await sendTx(
    proxyAddress,
    SSVNetworkAbi,
    'setFeeRecipientAddress',
    [feeRecipientAddress],
  )

  logger.log('setFeeRecipientAddress finished')

  return txHash
}
