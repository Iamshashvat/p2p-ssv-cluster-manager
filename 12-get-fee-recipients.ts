import 'dotenv/config'
import { logger } from './scripts/common/helpers/logger'
import process from 'process'
import { getFeeRecipientsForAllProxies } from './scripts/ssv/reads/getFeeRecipientsForAllProxies'

async function main() {
  logger.info('12-get-fee-recipients started')

  const mapping = await getFeeRecipientsForAllProxies()
  console.log(JSON.stringify(mapping, null, 2))

  logger.info('12-get-fee-recipients finished')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
