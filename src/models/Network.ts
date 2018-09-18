import { Omit } from '@/utils/types';
export interface Network {
  id: string;
  owner: string;
  ownerID: string;
  name: string;
  bridgeName: string;
  type: dataPathType;
  isDPDKPort: boolean;
  vlanTags: Array<number>;
  nodes: Array<NetworkNode>;
  createdAt?: Date;
}

export type NetworkFields = Omit<
  Network,
  'id' | 'ownerID' | 'owner' | 'bridgeName' | 'createdAt'
>;

interface NetworkNode {
  name: string;
  physicalInterfaces: Array<{
    name: string; // Could be empty
    pciID: string; // Could be empty
  }>;
}

export enum dataPathType {
  system = 'system',
  netdev = 'netdev'
}
