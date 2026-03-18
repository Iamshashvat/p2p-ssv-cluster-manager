import 'dotenv/config'
import { logger } from '../../common/helpers/logger'
import { getP2pSsvProxies } from '../reads/getP2pSsvProxies'
import { MetaTransaction } from '../../safe/models/MetaTransaction'
import { encodeFunctionData } from 'viem'
import {
  CumulativeMerkleDropAbi,
  CumulativeMerkleDropAddress,
  CumulativeMerkleDropContract
} from '../contracts/CumulativeMerkleDropContract'
import { waitForHashToBeApprovedAndExecute } from '../../safe/waitForHashToBeApprovedAndExecute'
import { getMerkleInfo } from '../reads/getMerkleInfo'
import { P2pSsvProxyContractAbi } from '../contracts/P2pSsvProxyContractAbi'
import { getProxyClient } from '../reads/getProxyClient'
import { getAddress } from '../helpers/ssvEnv'

const nonForwardToClientsProxies = [
  '0xc0Ec400995e2BC1e12837804d512302f7feEF769',
  '0x745Ced32ee83e1CC186dF0C32FeD1B54F3F15057'
]

export async function claimMainnetIncentives(shouldForwardToClients: boolean) {
  logger.info('claimMainnetIncentives started')
  const factoryAddress = getAddress('P2P_SSV_PROXY_FACTORY_ADDRESS')

  const proxies = await getP2pSsvProxies()

  const metaTxs: MetaTransaction[] = []

  for (const proxy of proxies) {
    try {
      const { cumulativeAmount, expectedMerkleRoot, merkleProof } = getMerkleInfo(proxy)

      const claimCalldata = encodeFunctionData({
        abi: CumulativeMerkleDropAbi,
        functionName: 'claim',
        args: [proxy, cumulativeAmount, expectedMerkleRoot, merkleProof],
      })

      const preclaimed = (await CumulativeMerkleDropContract.read.cumulativeClaimed([proxy])) as bigint
      const amountToTransfer = BigInt(cumulativeAmount) - preclaimed

      if (amountToTransfer <= 0) {
        logger.info(proxy, 'already claimed')
        continue
      }

      const metaTx = {
        to: CumulativeMerkleDropAddress,
        data: claimCalldata,
      }
      metaTxs.push(metaTx)

      if (
        shouldForwardToClients &&
        !nonForwardToClientsProxies.map((a) => a.toLowerCase()).includes(proxy.toLowerCase())
      ) {
        const client = await getProxyClient(proxy)

        const withdrawSSVTokensData = encodeFunctionData({
          abi: P2pSsvProxyContractAbi,
          functionName: 'withdrawSSVTokens',
          args: [
            client,
            amountToTransfer,
          ],
        })
        const withdrawSSVTokensMetaTx = {
          to: proxy as `0x${string}`,
          data: withdrawSSVTokensData,
        }
        metaTxs.push(withdrawSSVTokensMetaTx)
      } else {
        const withdrawSSVTokensData = encodeFunctionData({
          abi: P2pSsvProxyContractAbi,
          functionName: 'withdrawSSVTokens',
          args: [
            factoryAddress,
            amountToTransfer,
          ],
        })
        const withdrawSSVTokensMetaTx = {
          to: proxy as `0x${string}`,
          data: withdrawSSVTokensData,
        }
        metaTxs.push(withdrawSSVTokensMetaTx)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  logger.info(metaTxs.length, 'proxies will receive rewards')

  if (metaTxs.length) {
    await waitForHashToBeApprovedAndExecute(metaTxs)
  }

  logger.info('claimMainnetIncentives finished')
}
