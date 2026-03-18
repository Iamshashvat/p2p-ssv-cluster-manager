import { FeeRecipient } from '../models/SharesFileTypes'
import {
  P2pSsvProxyFactoryContract_3_1
} from '../contracts/P2pSsvProxyFactoryContract_3_1'
import { predictFeeDistributorAddress } from './predictFeeDistributorAddress'
import { logger } from '../../common/helpers/logger'

export async function predictP2pSsvProxyAddress_3_1(clientConfig: FeeRecipient, referrerConfig: FeeRecipient) {
  try {
    const feeDistributor = await predictFeeDistributorAddress()
    return await P2pSsvProxyFactoryContract_3_1.read.predictP2pSsvProxyAddressBeacon([
      feeDistributor,
    ]) as string
  } catch (error) {
    logger.warn(
      'predictP2pSsvProxyAddressBeacon failed, falling back to predictP2pSsvProxyAddress',
      error,
    )
  }

  return await P2pSsvProxyFactoryContract_3_1.read.predictP2pSsvProxyAddress([
    clientConfig,
    referrerConfig,
  ]) as string
}
