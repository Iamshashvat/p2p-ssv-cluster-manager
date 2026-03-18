import { logger } from '../../common/helpers/logger'
import { getAllClusterStates } from './getAllClusterStates'
import { getDaysToLiquidation } from './getDaysToLiquidation'
import { getAllowedDaysToLiquidation } from '../helpers/ssvEnv'

export async function getClusterStatesToTopUp() {
  logger.info('getClusterStatesToTopUp started')

  const clusterStates = await getAllClusterStates()
  const allowedDaysToLiquidation = getAllowedDaysToLiquidation()

  const clusterStatesToTopUp = []
  let totalTokensToTopUp = 0n
  for (const clusterState of clusterStates) {
    const { daysToLiquidation, tokensToAdd } =
      await getDaysToLiquidation(clusterState)

    if (daysToLiquidation < allowedDaysToLiquidation) {
      clusterStatesToTopUp.push({ ...clusterState, tokensToAdd })
      totalTokensToTopUp += tokensToAdd
    }
  }

  logger.info('getClusterStatesToTopUp finished')

  return {
    clusterStatesToTopUp,
    totalTokensToTopUp,
  }
}
