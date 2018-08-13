export interface Storage {
  id: string;
  type: string;
  name: string;
  createdAt: Date;
  storageClassName: string;
  ip: string;
  path: string;
}

export interface Volume {
  id: string;
  storageName: string;
  name: string;
  accessMode: string;
  capcity: string;
  createdAt: Date;
}
