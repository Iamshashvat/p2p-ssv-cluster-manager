import 'dotenv/config'
import { logger } from './scripts/common/helpers/logger'
import process from 'process'
import { setSsvOperatorIds } from './scripts/ssv/writes/setOperatorIds'

async function main() {
  logger.info('09-set-ssv-operator-ids started')

  try {
    await setSsvOperatorIds()

  } catch (error) {
    logger.error(error)
  }

  logger.info('09-set-ssv-operator-ids finished')
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

