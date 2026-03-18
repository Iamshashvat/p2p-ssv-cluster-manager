import axios from 'axios'
import { logger } from '../../common/helpers/logger'
import { ClusterStateApi } from '../models/ClusterStateApi'
import { isHoodi } from '../../common/helpers/clients'
import { getBeaconUrl } from '../helpers/ssvEnv'

export async function getClusterStateFromApi(
  owner: string,
  operators: bigint[] | number[],
): Promise<ClusterStateApi | null> {
  const args = `owner/${owner}/operators/${operators.join(',')}`
  logger.info('getClusterStateFromApi started for ' + args)

  getBeaconUrl()

  try {
    const result = await axios.get(
      `https://api.ssv.network/api/v4/${isHoodi ? 'hoodi' : 'mainnet'}/clusters/` +
      args,
    )

    logger.info('getClusterStateFromApi finished for ' + args)
    return result.data.cluster as ClusterStateApi
  } catch (error: any) {
    if (error?.response?.status === 404) {
      logger.info(`getClusterStateFromApi: cluster not found for ${args}, returning null`)
      return null
    }
    throw error
  }
}
