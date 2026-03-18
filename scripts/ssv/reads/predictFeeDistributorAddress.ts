import { FeeDistributorFactoryContract } from '../contracts/FeeDistributorFactoryContract'
import { getAddress, getFeeRecipientConfig } from '../helpers/ssvEnv'

export async function predictFeeDistributorAddress() {
  const referenceFeeDistributor = getAddress('REFERENCE_FEE_DISTRIBUTOR')
  const clientConfig = getFeeRecipientConfig('CLIENT')
  const referrerConfig = getFeeRecipientConfig('REFERRER')

  const predictedFeeDistributorAddress =
    await FeeDistributorFactoryContract.read.predictFeeDistributorAddress([
      referenceFeeDistributor,
      clientConfig,
      referrerConfig,
    ])

  return predictedFeeDistributorAddress
}
