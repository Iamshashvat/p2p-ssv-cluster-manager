import { logger } from '../../common/helpers/logger'
import { isHoodi } from '../../common/helpers/clients'
import { getP2pSsvProxies } from './getP2pSsvProxies'
import { sleep } from '../../common/helpers/sleep'
import axios from 'axios'

const SSV_API_BASE = 'https://api.ssv.network/api/v4'

export async function getFeeRecipientsForAllProxies(): Promise<Record<string, string>> {
  logger.info('getFeeRecipientsForAllProxies started')

  const proxies = await getP2pSsvProxies()
  logger.info('Total proxies found: ' + proxies.size)

  const network = isHoodi ? 'hoodi' : 'mainnet'
  const feeRecipients: Record<string, string> = {}
  let notFound = 0

  for (const proxy of proxies) {
    try {
      const url = `${SSV_API_BASE}/${network}/accounts/${proxy}`
      const response = await axios.get(url)
      const recipientAddress = response.data?.data?.recipientAddress

      if (recipientAddress) {
        feeRecipients[proxy] = recipientAddress
      } else {
        logger.warn(`No recipientAddress in SSV API response for ${proxy}`)
        notFound += 1
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        logger.debug(`Proxy ${proxy} not found in SSV API (404)`)
        notFound += 1
      } else {
        logger.warn(`SSV API error for ${proxy}: ${error?.message}`)
        notFound += 1
      }
    }

    await sleep(100)
  }

  if (notFound > 0) {
    logger.warn(
      `getFeeRecipientsForAllProxies: ${notFound} proxies without fee recipient`,
    )
  }

  logger.info(
    'getFeeRecipientsForAllProxies finished. Proxies with fee recipients: ' +
      Object.keys(feeRecipients).length,
  )

  return feeRecipients
}
