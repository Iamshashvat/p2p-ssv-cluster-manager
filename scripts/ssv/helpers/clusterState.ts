import { getClusterStateFromApi } from '../reads/getClusterStateFromApi'
import { ClusterState } from '../models/ClusterState'
import { toClusterState } from '../models/ClusterStateApi'

export async function getClusterStateOrDefault(
  proxy: string,
  operatorIds: number[],
): Promise<ClusterState> {
  const clusterStateFromApi = await getClusterStateFromApi(proxy, operatorIds)
  if (clusterStateFromApi === null) {
    return {
      validatorCount: 0,
      networkFeeIndex: 0n,
      index: 0n,
      active: true,
      balance: 0n,
    }
  }

  return toClusterState(clusterStateFromApi)
}
