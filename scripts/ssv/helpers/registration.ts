import { blocksPerDay } from '../../common/helpers/constants'
import { getLiquidationThresholdPeriod } from '../reads/getLiquidationThresholdPeriod'
import { getMinimumLiquidationCollateral } from '../reads/getMinimumLiquidationCollateral'
import { getNetworkFee } from '../reads/getNetworkFee'

export async function getRegistrationAmount(
  validatorCount: number,
  allowedDaysToLiquidation: bigint,
): Promise<bigint> {
  const networkFee = await getNetworkFee()
  const minimumLiquidationCollateral = await getMinimumLiquidationCollateral()
  const liquidationThresholdPeriod = await getLiquidationThresholdPeriod()
  const collateralForLiquidationThresholdPeriod =
    liquidationThresholdPeriod * networkFee * BigInt(validatorCount)
  const collateral =
    minimumLiquidationCollateral > collateralForLiquidationThresholdPeriod
      ? minimumLiquidationCollateral
      : collateralForLiquidationThresholdPeriod
  const neededBalancePerValidator =
    networkFee * blocksPerDay * allowedDaysToLiquidation

  return neededBalancePerValidator * BigInt(validatorCount) + collateral
}
