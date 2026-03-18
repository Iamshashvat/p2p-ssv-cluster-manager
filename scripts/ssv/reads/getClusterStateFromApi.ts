import axios from 'axios'
import { logger } from '../../common/helpers/logger'
import { ClusterStateApi } from '../models/ClusterStateApi'
import { isHolesky } from '../../common/helpers/clients'
import { getBeaconUrl } from '../helpers/ssvEnv'

export async function getClusterStateFromApi(
  owner: string,
  operators: bigint[] | number[],
): Promise<ClusterStateApi> {
  const args = `owner/${owner}/operators/${operators.join(',')}`
  logger.info('getClusterStateFromApi started for ' + args)

  getBeaconUrl()

  const result = await axios.get(
    `https://api.ssv.network/api/v4/${isHolesky ? 'hoodi' : 'mainnet'}/clusters/` +
    args,
  )

  logger.info('getClusterStateFromApi finished for ' + args)
  return result.data.cluster as ClusterStateApi
}
