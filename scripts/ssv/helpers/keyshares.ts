import { readFileSync } from 'fs'
import { SharesFile } from '../models/SharesFileTypes'

export function readKeyshares(filePath = 'keyshares.json'): SharesFile['shares'] {
  const fileContent = readFileSync(filePath, 'utf-8')
  const sharesFile: SharesFile = JSON.parse(fileContent)
  return sharesFile.shares
}

export function toSsvRegistrationInput(shares: SharesFile['shares']) {
  if (shares.length === 0) {
    throw new Error('No shares provided')
  }

  const operatorIds = shares[0].payload.operatorIds
  const publicKeys: string[] = []
  const sharesData: string[] = []

  for (const share of shares) {
    const ids = share.payload.operatorIds
    if (
      ids.length !== operatorIds.length ||
      ids.some((id, i) => id !== operatorIds[i])
    ) {
      throw new Error(
        `Operator IDs mismatch for validator ${share.data.publicKey}: ` +
        `expected [${operatorIds}], got [${ids}]`,
      )
    }
    publicKeys.push(share.data.publicKey)
    sharesData.push(share.payload.sharesData)
  }

  return {
    operatorIds,
    publicKeys,
    sharesData,
  }
}
