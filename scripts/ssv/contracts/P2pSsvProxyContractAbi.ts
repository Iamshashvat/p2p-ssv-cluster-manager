export const P2pSsvProxyContractAbi: unknown[] = [
  {
    inputs: [
      { internalType: 'uint64[]', name: '_operatorIds', type: 'uint64[]' },
      {
        components: [
          { internalType: 'uint32', name: 'validatorCount', type: 'uint32' },
          { internalType: 'uint64', name: 'networkFeeIndex', type: 'uint64' },
          { internalType: 'uint64', name: 'index', type: 'uint64' },
          { internalType: 'bool', name: 'active', type: 'bool' },
          { internalType: 'uint256', name: 'balance', type: 'uint256' },
        ],
        internalType: 'struct ISSVNetwork.Cluster[]',
        name: '_clusters',
        type: 'tuple[]',
      },
    ],
    name: 'liquidate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
      { internalType: 'uint64[]', name: '_operatorIds', type: 'uint64[]' },
      {
        components: [
          { internalType: 'uint32', name: 'validatorCount', type: 'uint32' },
          { internalType: 'uint64', name: 'networkFeeIndex', type: 'uint64' },
          { internalType: 'uint64', name: 'index', type: 'uint64' },
          { internalType: 'bool', name: 'active', type: 'bool' },
          { internalType: 'uint256', name: 'balance', type: 'uint256' },
        ],
        internalType: 'struct ISSVNetwork.Cluster[]',
        name: '_clusters',
        type: 'tuple[]',
      },
    ],
    name: 'reactivate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
      { internalType: 'uint64[]', name: '_operatorIds', type: 'uint64[]' },
      {
        components: [
          { internalType: 'uint32', name: 'validatorCount', type: 'uint32' },
          { internalType: 'uint64', name: 'networkFeeIndex', type: 'uint64' },
          { internalType: 'uint64', name: 'index', type: 'uint64' },
          { internalType: 'bool', name: 'active', type: 'bool' },
          { internalType: 'uint256', name: 'balance', type: 'uint256' },
        ],
        internalType: 'struct ISSVNetwork.Cluster[]',
        name: '_clusters',
        type: 'tuple[]',
      },
    ],
    name: 'withdrawFromSSV',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'withdrawSSVTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getClient',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
]
