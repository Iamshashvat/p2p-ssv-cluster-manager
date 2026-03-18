import { getContract } from 'viem'
import { publicClient, walletClient } from '../../common/helpers/clients'

export const P2pSsvProxyFactoryAbi: unknown[] = [
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: '_proxy', type: 'address' }],
    name: 'P2pSsvProxyFactory__RegistrationCompleted',
    type: 'event',
  },
  {
    inputs: [],
    name: 'getAllP2pSsvProxies',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
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

if (!process.env.P2P_SSV_PROXY_FACTORY_ADDRESS) {
  throw new Error('No P2P_SSV_PROXY_FACTORY_ADDRESS in ENV')
}

export const P2pSsvProxyFactoryAddress = process.env
  .P2P_SSV_PROXY_FACTORY_ADDRESS as `0x${string}`

export const P2pSsvProxyFactoryContract = getContract({
  address: P2pSsvProxyFactoryAddress,
  abi: P2pSsvProxyFactoryAbi,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
})
