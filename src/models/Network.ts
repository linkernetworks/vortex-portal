import { Omit } from '@/utils/types';
export interface Network {
  id: string;
  name: string;
  bridgeName: string;
  type: dataPathType;
  isDPDKPort: boolean;
  VLANTags: Array<number>;
  nodes: Array<NetworkNode>;
  createdAt?: Date;
}

export type NetworkFields = Omit<Network, 'id' | 'bridgeName' | 'createdAt'>;

interface NetworkNode {
  name: string;
  physicalInterface: Array<{
    name: string; // Could be empty
    pciid: string; // Could be empty
  }>;
}

export enum dataPathType {
  system = 'system',
  netdev = 'netdev'
}
