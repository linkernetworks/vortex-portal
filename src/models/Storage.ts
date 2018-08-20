import { Omit } from '@/utils/types';
export interface Storage {
  id: string;
  type: string;
  name: string;
  createdAt: Date;
  storageClassName: string;
  ip: string;
  path: string;
}

export type StorageFields = Omit<
  Storage,
  'id' | 'storageClassName' | 'createdAt'
>;

export interface Volume {
  id: string;
  storageName: string;
  name: string;
  accessMode: string;
  capacity: string;
  createdAt: Date;
}

export type VolumeFields = Omit<Volume, 'id' | 'createdAt'>;

export enum AccessMode {
  ReadWriteOnce = 'ReadWriteOnce',
  ReadOnlyMany = 'ReadOnlyMany',
  ReadWriteMany = 'ReadWriteMany'
}
