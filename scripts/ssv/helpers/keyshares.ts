import { readFileSync } from 'fs'
import { SharesFile } from '../models/SharesFileTypes'

export function readKeyshares(filePath = 'keyshares.json'): SharesFile['shares'] {
  const fileContent = readFileSync(filePath, 'utf-8')
  const sharesFile: SharesFile = JSON.parse(fileContent)
  return sharesFile.shares
}

export function toSsvRegistrationInput(shares: SharesFile['shares']) {
  let operatorIds: number[] = []
  const publicKeys: string[] = []
  const sharesData: string[] = []

  for (const share of shares) {
    operatorIds = share.payload.operatorIds
    publicKeys.push(share.data.publicKey)
    sharesData.push(share.payload.sharesData)
  }

  return {
    operatorIds,
    publicKeys,
    sharesData,
  }
}
