import { MetaTransaction } from '../../safe/models/MetaTransaction'
import { waitForHashToBeApprovedAndExecute } from '../../safe/waitForHashToBeApprovedAndExecute'

export async function executeMetaTxs(metaTxs: MetaTransaction[]) {
  return waitForHashToBeApprovedAndExecute(metaTxs)
}

export async function executeSingleMetaTx(metaTx: MetaTransaction) {
  return waitForHashToBeApprovedAndExecute([metaTx])
}
