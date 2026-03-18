import { logger } from '../../common/helpers/logger'
import { P2pSsvProxyFactoryAbi_3_1, P2pSsvProxyFactoryAddress_3_1 } from '../contracts/P2pSsvProxyFactoryContract_3_1'
import { encodeFunctionData } from 'viem'
import { getAddressList } from '../helpers/ssvEnv'
import { executeSingleMetaTx } from '../helpers/metaTx'

export async function setAllowedSsvOperatorOwners() {
  logger.log('setAllowedSsvOperatorOwners started')

  const owners = getAddressList('ALLOWED_SSV_OPERATOR_OWNERS')

  const calldata = encodeFunctionData({
    abi: P2pSsvProxyFactoryAbi_3_1,
    functionName: 'setAllowedSsvOperatorOwners',
    args: [owners],
  })

  const metaTx = {
    to: P2pSsvProxyFactoryAddress_3_1 as `0x${string}`,
    data: calldata,
  }
  const txHash = await executeSingleMetaTx(metaTx)

  logger.log('setAllowedSsvOperatorOwners finished')

  return txHash
}
