export interface Configmap {
  id?: string;
  ownerID?: string;
  name: string;
  namespace: string;
  data: { [name: string]: string };
  createAt?: string;
}

export interface Configmaps {
  [name: string]: Configmap;
}
