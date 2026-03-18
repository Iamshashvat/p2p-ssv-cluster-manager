import { getContract } from 'viem'
import { publicClient, walletClient } from '../../common/helpers/clients'

export const P2pSsvProxyFactoryAbi_3_1: unknown[] = [
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: '_proxy', type: 'address' }],
    name: 'P2pSsvProxyFactory__RegistrationCompleted',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint96', name: 'basisPoints', type: 'uint96' },
          { internalType: 'address payable', name: 'recipient', type: 'address' },
        ],
        internalType: 'struct FeeRecipient',
        name: '_clientConfig',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'uint96', name: 'basisPoints', type: 'uint96' },
          { internalType: 'address payable', name: 'recipient', type: 'address' },
        ],
        internalType: 'struct FeeRecipient',
        name: '_referrerConfig',
        type: 'tuple',
      },
    ],
    name: 'predictP2pSsvProxyAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_feeDistributorInstance', type: 'address' }],
    name: 'predictP2pSsvProxyAddressBeacon',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_operatorOwners', type: 'address[]' },
      { internalType: 'uint64[]', name: '_operatorIds', type: 'uint64[]' },
      { internalType: 'bytes[]', name: '_publicKeys', type: 'bytes[]' },
      { internalType: 'bytes[]', name: '_sharesData', type: 'bytes[]' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      {
        components: [
          { internalType: 'uint32', name: 'validatorCount', type: 'uint32' },
          { internalType: 'uint64', name: 'networkFeeIndex', type: 'uint64' },
          { internalType: 'uint64', name: 'index', type: 'uint64' },
          { internalType: 'bool', name: 'active', type: 'bool' },
          { internalType: 'uint256', name: 'balance', type: 'uint256' },
        ],
        internalType: 'struct ISSVNetwork.Cluster',
        name: '_cluster',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'uint96', name: 'basisPoints', type: 'uint96' },
          { internalType: 'address payable', name: 'recipient', type: 'address' },
        ],
        internalType: 'struct FeeRecipient',
        name: '_clientConfig',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'uint96', name: 'basisPoints', type: 'uint96' },
          { internalType: 'address payable', name: 'recipient', type: 'address' },
        ],
        internalType: 'struct FeeRecipient',
        name: '_referrerConfig',
        type: 'tuple',
      },
    ],
    name: 'registerValidators',
    outputs: [{ internalType: 'address', name: 'p2pSsvProxy', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address[]', name: '_allowedSsvOperatorOwners', type: 'address[]' }],
    name: 'setAllowedSsvOperatorOwners',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint64[24]', name: '_operatorIds', type: 'uint64[24]' },
      { internalType: 'address', name: '_ssvOperatorOwner', type: 'address' },
    ],
    name: 'setSsvOperatorIds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint112', name: '_ssvPerEthExchangeRateDividedByWei', type: 'uint112' }],
    name: 'setSsvPerEthExchangeRateDividedByWei',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'address', name: '_recipient', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'transferERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

if (!process.env.P2P_SSV_PROXY_FACTORY_ADDRESS_3_1) {
  throw new Error('No P2P_SSV_PROXY_FACTORY_ADDRESS_3_1 in ENV')
}

export const P2pSsvProxyFactoryAddress_3_1 = process.env
  .P2P_SSV_PROXY_FACTORY_ADDRESS_3_1 as `0x${string}`

export const P2pSsvProxyFactoryContract_3_1 = getContract({
  address: P2pSsvProxyFactoryAddress_3_1,
  abi: P2pSsvProxyFactoryAbi_3_1,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
})
