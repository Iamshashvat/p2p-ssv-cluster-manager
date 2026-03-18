import { ClusterState } from '../models/ClusterState'
import { FeeRecipient } from '../models/SharesFileTypes'
import { zeroAddress } from 'viem'

type Address = `0x${string}`

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`No ${name} in ENV`)
  }

  return value.trim()
}

function optionalEnv(name: string): string | undefined {
  const value = process.env[name]
  return value ? value.trim() : undefined
}

function toAddress(value: string, name: string): Address {
  if (!value.startsWith('0x') || value.length !== 42) {
    throw new Error(`Invalid ${name} address in ENV`)
  }
  return value as Address
}

export function getAddress(name: string): Address {
  return toAddress(requiredEnv(name), name)
}

export function getRequiredString(name: string): string {
  return requiredEnv(name)
}

export function getOptionalAddress(name: string): Address | undefined {
  const value = optionalEnv(name)
  return value ? toAddress(value, name) : undefined
}

export function getBigInt(name: string): bigint {
  return BigInt(requiredEnv(name))
}

export function getNumber(name: string): number {
  return Number(requiredEnv(name))
}

export function getAddressList(name: string): Address[] {
  return requiredEnv(name)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => toAddress(item, name))
}

export function getBigIntList(name: string): bigint[] {
  return requiredEnv(name)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => BigInt(item))
}

export function getNumberList(name: string): number[] {
  return requiredEnv(name)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
}

export function getFeeRecipientConfig(prefix: 'CLIENT' | 'REFERRER'): FeeRecipient {
  const basisPoints = getNumber(`SSV_${prefix}_BASIS_POINTS`)
  const recipient = getOptionalAddress(`SSV_${prefix}_RECIPIENT`) ?? zeroAddress

  return {
    basisPoints,
    recipient,
  }
}

export function getAllowedDaysToLiquidation(): bigint {
  return getBigInt('ALLOWED_DAYS_TO_LIQUIDATION')
}

export function getAllowedDaysToLiquidationForPrivate(): bigint {
  return getBigInt('ALLOWED_DAYS_TO_LIQUIDATION_FOR_PRIVATE')
}

export function getBeaconUrl(): string {
  return getRequiredString('BEACON_URL')
}

export function getMerkleTreePath(): string {
  return getRequiredString('MERKLE_TREE_PATH')
}

export function getSharedSsvWriteConfig() {
  return {
    factoryAddress: getAddress('P2P_SSV_PROXY_FACTORY_ADDRESS'),
    safeAddress: getAddress('SAFE_ADDRESS'),
    safeOwnerAddress2: getAddress('SAFE_OWNER_ADDRESS_2'),
    ssvNetworkAddress: getAddress('SSV_NETWORK_ADDRESS'),
    ssvTokenAddress: getAddress('SSV_TOKEN_ADDRESS'),
  }
}

export function getClusterState(prefix: string): ClusterState {
  return {
    validatorCount: getNumber(`${prefix}_VALIDATOR_COUNT`),
    networkFeeIndex: getBigInt(`${prefix}_NETWORK_FEE_INDEX`),
    index: getBigInt(`${prefix}_INDEX`),
    active: requiredEnv(`${prefix}_ACTIVE`).toLowerCase() === 'true',
    balance: getBigInt(`${prefix}_BALANCE`),
  }
}

export function getSetSsvOperatorIdsConfig(): {
  owner: Address
  operatorIds: number[]
} {
  const owner = getAddress('SET_SSV_OPERATOR_OWNER')
  const ids = getNumberList('SET_SSV_OPERATOR_IDS')

  return {
    owner,
    operatorIds: toFixedLength24(ids),
  }
}

function toFixedLength24(ids: number[]): number[] {
  if (ids.length > 24) {
    throw new Error('SET_SSV_OPERATOR_IDS supports at most 24 values')
  }

  const result = [...ids]
  while (result.length < 24) {
    result.push(0)
  }

  return result
}
