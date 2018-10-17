import { Omit } from '@/utils/types';
export interface Storage {
  id: string;
  owner: string;
  ownerID: string;
  createdBy?: { displayName: string };
  type: string;
  name: string;
  createdAt: Date;
  storageClassName: string;
  ip: string;
  path: string;
}

export type StorageFields = Omit<
  Storage,
  'id' | 'owner' | 'ownerID' | 'storageClassName' | 'createdAt'
>;

export interface Volume {
  id: string;
  owner: string;
  ownerID: string;
  createdBy?: { displayName: string };
  storageName: string;
  name: string;
  namespace: string;
  accessMode: string;
  capacity: string;
  createdAt: Date;
}

export type VolumeFields = Omit<
  Volume,
  'id' | 'owner' | 'ownerID' | 'createdAt'
>;

export enum AccessMode {
  ReadWriteOnce = 'ReadWriteOnce',
  ReadOnlyMany = 'ReadOnlyMany',
  ReadWriteMany = 'ReadWriteMany'
}
