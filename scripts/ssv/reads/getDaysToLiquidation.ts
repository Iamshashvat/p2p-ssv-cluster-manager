import { logger } from '../../common/helpers/logger'
import { ClusterStateApi } from '../models/ClusterStateApi'
import { getOperatorFee } from './getOperatorFee'
import { getNetworkFee } from './getNetworkFee'
import { getMinimumLiquidationCollateral } from './getMinimumLiquidationCollateral'
import { blocksPerDay } from '../../common/helpers/constants'
import { getCurrentClusterBalance } from './getCurrentClusterBalance'
import { getLiquidationThresholdPeriod } from './getLiquidationThresholdPeriod'
import { getAllowedDaysToLiquidation } from '../helpers/ssvEnv'

export async function getDaysToLiquidation(clusterState: ClusterStateApi) {
  logger.info('getDaysToLiquidation started for ' + clusterState.clusterId)

  const allowedDaysToLiquidation = getAllowedDaysToLiquidation()

  const { validatorCount, operators } = clusterState

  if (validatorCount === 0) {
    return { daysToLiquidation: 100500n, tokensToAdd: 0n }
  }

  let totalFeePerBlock = 0n
  for (const operatorId of operators) {
    const operatorFee = await getOperatorFee(operatorId)
    totalFeePerBlock += operatorFee
  }

  const networkFee = await getNetworkFee()
  totalFeePerBlock += networkFee


  const balance = await getCurrentClusterBalance(clusterState)
  const minimumLiquidationCollateral = await getMinimumLiquidationCollateral()

  const liquidationThresholdPeriod = await getLiquidationThresholdPeriod()
  const collateralForLiquidationThresholdPeriod = liquidationThresholdPeriod *
    totalFeePerBlock *
    BigInt(validatorCount)

  const collateral = minimumLiquidationCollateral > collateralForLiquidationThresholdPeriod
    ? minimumLiquidationCollateral
    : collateralForLiquidationThresholdPeriod

  const balanceAfterMinimumLiquidationCollateral =
    balance - collateral
  const balancePerValidator =
    balanceAfterMinimumLiquidationCollateral / BigInt(validatorCount)


  const blocksToLiquidation = balancePerValidator / totalFeePerBlock
  const daysToLiquidation = blocksToLiquidation / blocksPerDay
  logger.info('Days To Liquidation = ' + daysToLiquidation)

  const neededBalancePerValidator =
    totalFeePerBlock * blocksPerDay * allowedDaysToLiquidation
  const targetBalance =
    neededBalancePerValidator * BigInt(validatorCount) +
    collateral
  const tokensToAdd = targetBalance - balance
  logger.info('tokensToAdd = ' + tokensToAdd)

  logger.info('getDaysToLiquidation finished for ' + clusterState.clusterId)

  return { daysToLiquidation, tokensToAdd, validatorCount }
}
