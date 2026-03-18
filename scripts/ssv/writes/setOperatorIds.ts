import { logger } from '../../common/helpers/logger'
import { P2pSsvProxyFactoryAbi_3_1, P2pSsvProxyFactoryAddress_3_1 } from '../contracts/P2pSsvProxyFactoryContract_3_1'
import { encodeFunctionData } from 'viem'
import { getSetSsvOperatorIdsConfig } from '../helpers/ssvEnv'
import { executeSingleMetaTx } from '../helpers/metaTx'

export async function setSsvOperatorIds() {
  logger.log('setSsvOperatorIds started')

  const { owner, operatorIds } = getSetSsvOperatorIdsConfig()

  const setSsvOperatorIdsCalldata = encodeFunctionData({
    abi: P2pSsvProxyFactoryAbi_3_1,
    functionName: 'setSsvOperatorIds',
    args: [operatorIds, owner],
  })

  const metaTx = {
    to: P2pSsvProxyFactoryAddress_3_1 as `0x${string}`,
    data: setSsvOperatorIdsCalldata,
  }
  const txHash = await executeSingleMetaTx(metaTx)

  logger.log('setSsvOperatorIds finished')

  return txHash
}
