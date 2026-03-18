import 'dotenv/config'
import process from 'process'
import { logger } from './scripts/common/helpers/logger'
import { predictP2pSsvProxyAddress_3_1 } from './scripts/ssv/reads/predictP2pSsvProxyAddress_3_1'
import { getFeeRecipientConfig } from './scripts/ssv/helpers/ssvEnv'

async function main() {
  logger.info('97-test started')

  try {
    const clientConfig = getFeeRecipientConfig('CLIENT')
    const referrerConfig = getFeeRecipientConfig('REFERRER')
    const proxy = await predictP2pSsvProxyAddress_3_1(
      clientConfig,
      referrerConfig,
    )

    logger.info('Predicted proxy', proxy)
  } catch (error) {
    logger.error(error)
  }

  logger.info('97-test finished')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
