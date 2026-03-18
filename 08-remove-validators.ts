import 'dotenv/config'
import process from 'process'
import { logger } from './scripts/common/helpers/logger'
import { predictP2pSsvProxyAddress_3_1 } from './scripts/ssv/reads/predictP2pSsvProxyAddress_3_1'
import { bulkRemoveValidator } from './scripts/ssv/writes/bulkRemoveValidator'
import { getFeeRecipientConfig } from './scripts/ssv/helpers/ssvEnv'
import { readKeyshares, toSsvRegistrationInput } from './scripts/ssv/helpers/keyshares'
import { getClusterStateOrDefault } from './scripts/ssv/helpers/clusterState'

async function main() {
  logger.info('08-remove-validators started')

  try {
    const shares = readKeyshares()
    const { operatorIds, publicKeys } = toSsvRegistrationInput(shares)
    const clientConfig = getFeeRecipientConfig('CLIENT')
    const referrerConfig = getFeeRecipientConfig('REFERRER')
    const proxy = (await predictP2pSsvProxyAddress_3_1(
      clientConfig,
      referrerConfig,
    )) as string
    const clusterState = await getClusterStateOrDefault(proxy, operatorIds)

    await bulkRemoveValidator(proxy, publicKeys, operatorIds, clusterState)
  } catch (error) {
    logger.error(error)
  }

  logger.info('08-remove-validators finished')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
