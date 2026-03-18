import 'dotenv/config'
import process from 'process'
import { logger } from './scripts/common/helpers/logger'
import { bulkRegisterValidators } from './scripts/ssv/writes/bulkRegisterValidators'
import { predictP2pSsvProxyAddress_3_1 } from './scripts/ssv/reads/predictP2pSsvProxyAddress_3_1'
import {
  getAddressList,
  getAllowedDaysToLiquidation,
  getBigInt,
  getFeeRecipientConfig,
} from './scripts/ssv/helpers/ssvEnv'
import { readKeyshares, toSsvRegistrationInput } from './scripts/ssv/helpers/keyshares'
import { getClusterStateOrDefault } from './scripts/ssv/helpers/clusterState'
import { getRegistrationAmount } from './scripts/ssv/helpers/registration'

async function main() {
  logger.info('07-register-validators started')

  try {
    const shares = readKeyshares()
    const { operatorIds, publicKeys, sharesData } = toSsvRegistrationInput(shares)
    const operatorOwners = getAddressList('ALLOWED_SSV_OPERATOR_OWNERS')
    const clientConfig = getFeeRecipientConfig('CLIENT')
    const referrerConfig = getFeeRecipientConfig('REFERRER')
    const amount = await getRegistrationAmount(
      shares.length,
      getAllowedDaysToLiquidation(),
    )
    const proxy = (await predictP2pSsvProxyAddress_3_1(
      clientConfig,
      referrerConfig,
    )) as string
    const clusterState = await getClusterStateOrDefault(proxy, operatorIds)
    const ssvTokensValueInWei =
      (amount * getBigInt('SSV_PER_ETH_EXCHANGE_RATE_DIVIDED_BY_WEI')) /
      1000000000000000000n

    await bulkRegisterValidators(
      operatorOwners,
      operatorIds,
      publicKeys,
      sharesData,
      amount,
      clusterState,
      clientConfig,
      referrerConfig,
      ssvTokensValueInWei,
    )
  } catch (error) {
    logger.error(error)
  }

  logger.info('07-register-validators finished')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
