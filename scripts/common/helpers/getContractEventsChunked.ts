import { publicClient } from './clients'
import { logger } from './logger'
import { sleep } from './sleep'

const CHUNK_SIZE = 10000n
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 3000

export async function getContractEventsChunked(params: {
  address: `0x${string}`
  abi: readonly unknown[]
  eventName: string
  fromBlock: bigint
  toBlock?: bigint | 'latest'
  strict?: boolean
  args?: Record<string, unknown>
}) {
  const latestBlock =
    params.toBlock === 'latest' || params.toBlock === undefined
      ? await publicClient.getBlockNumber()
      : params.toBlock

  const totalChunks = (latestBlock - params.fromBlock) / CHUNK_SIZE + 1n

  const allLogs: unknown[] = []
  let from = params.fromBlock
  let chunkIndex = 0n

  while (from <= latestBlock) {
    const to = from + CHUNK_SIZE - 1n > latestBlock ? latestBlock : from + CHUNK_SIZE - 1n
    chunkIndex += 1n

    if (chunkIndex % 50n === 1n || chunkIndex === totalChunks) {
      logger.info(
        `${params.eventName}: chunk ${chunkIndex}/${totalChunks} (blocks ${from}–${to})`,
      )
    }

    let logs: unknown[] | null = null
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        logs = await publicClient.getContractEvents({
          address: params.address,
          abi: params.abi as any,
          eventName: params.eventName as any,
          fromBlock: from,
          toBlock: to,
          strict: params.strict ?? false,
          args: params.args as any,
        })
        break
      } catch (error: any) {
        if (attempt < MAX_RETRIES) {
          logger.warn(
            `${params.eventName} chunk ${chunkIndex} attempt ${attempt} failed: ${error?.message}. Retrying in ${RETRY_DELAY_MS}ms...`,
          )
          await sleep(RETRY_DELAY_MS)
        } else {
          throw error
        }
      }
    }

    if (logs) {
      allLogs.push(...logs)
    }

    from = to + 1n
  }

  return allLogs
}
