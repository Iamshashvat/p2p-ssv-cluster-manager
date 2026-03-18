import { logger } from '../../common/helpers/logger'
import { sendTx } from '../../common/helpers/sendTx'
import { P2pSsvProxyFactoryAbi_3_1 } from '../contracts/P2pSsvProxyFactoryContract_3_1'
import { getAddress, getOptionalAddress } from '../helpers/ssvEnv'

export async function transferOwnership() {
  logger.log('transferOwnership started')

  const factoryAddress = getAddress('P2P_SSV_PROXY_FACTORY_ADDRESS_3_1')
  const newOwner =
    getOptionalAddress('SSV_FACTORY_NEW_OWNER') ?? getAddress('FACTORY_OWNER')

  const txHash = await sendTx(
    factoryAddress,
    P2pSsvProxyFactoryAbi_3_1,
    'transferOwnership',
    [newOwner],
  )

  logger.log('transferOwnership finished')

  return txHash
}
