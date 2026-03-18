import { logger } from '../../common/helpers/logger'
import { ClusterStateApi } from '../models/ClusterStateApi'
import { getOperatorFee } from './getOperatorFee'
import { getNetworkFee } from './getNetworkFee'
import { getMinimumLiquidationCollateral } from './getMinimumLiquidationCollateral'
import { blocksPerDay } from '../../common/helpers/constants'
import { getCurrentClusterBalance } from './getCurrentClusterBalance'
import { getLiquidationThresholdPeriod } from './getLiquidationThresholdPeriod'
import { getAllowedDaysToLiquidationForPrivate } from '../helpers/ssvEnv'

export async function getExcessTokensToWithdraw(clusterState: ClusterStateApi) {
  logger.info('getExcessTokensToWithdraw started for ' + clusterState.clusterId)

  const allowedDaysToLiquidationForPrivate = getAllowedDaysToLiquidationForPrivate()

  const { validatorCount, operators } = clusterState

  let allZeroOperatorFees = true
  let totalFeePerBlock = 0n
  for (const operatorId of operators) {
    const operatorFee = await getOperatorFee(operatorId)
    totalFeePerBlock += operatorFee

    if (operatorFee > 0n) {
      allZeroOperatorFees = false
    }
  }

  if (!allZeroOperatorFees) {
    return 0n
  }

  const networkFee = await getNetworkFee()
  totalFeePerBlock += networkFee

  const neededBalancePerValidator =
    totalFeePerBlock * blocksPerDay * allowedDaysToLiquidationForPrivate
  const minimumLiquidationCollateral = await getMinimumLiquidationCollateral()

  const liquidationThresholdPeriod = await getLiquidationThresholdPeriod()
  const collateralForLiquidationThresholdPeriod = liquidationThresholdPeriod *
    totalFeePerBlock *
    BigInt(validatorCount)

  const collateral = minimumLiquidationCollateral > collateralForLiquidationThresholdPeriod
    ? minimumLiquidationCollateral
    : collateralForLiquidationThresholdPeriod

  const targetBalance =
    neededBalancePerValidator * BigInt(validatorCount) +
    collateral

  const balance = await getCurrentClusterBalance(clusterState)

  const tokensToWithdraw = balance - targetBalance
  logger.info('tokensToWithdraw = ' + tokensToWithdraw)

  logger.info(
    'getExcessTokensToWithdraw finished for ' + clusterState.clusterId,
  )

  return tokensToWithdraw
}
