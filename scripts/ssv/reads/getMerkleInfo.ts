import { readFileSync } from 'fs';
import { getMerkleTreePath } from '../helpers/ssvEnv'

type MerkleEntry = {
  address: string;
  amount: string;
  proof: string[];
};

type MerkleTree = {
  root: string;
  data: MerkleEntry[];
};

type MerkleInfo = {
  cumulativeAmount: string;
  expectedMerkleRoot: string;
  merkleProof: string[];
};

export function getMerkleInfo(proxy: string): MerkleInfo {
  const fileContent = readFileSync(getMerkleTreePath(), 'utf-8');
  const merkleTree: MerkleTree = JSON.parse(fileContent);

  const entry = merkleTree.data.find(
    (item) => item.address.toLowerCase() === proxy.toLowerCase()
  );

  if (!entry) {
    throw new Error(`Address ${proxy} not found in merkle data.`);
  }

  return {
    cumulativeAmount: entry.amount,
    expectedMerkleRoot: merkleTree.root,
    merkleProof: entry.proof,
  };
}