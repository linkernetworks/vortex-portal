export interface Pod {
  podName: string;
  namespace: string;
  node: string;
  status: string;
  createAt: number;
  createByKind: string;
  createByName: string;
  ip: string;
  labels: Map<string, string>;
  restartCount: number;
  containers: Array<string>;
}

export interface PodContainerRequest {
  name: string;
  image: string;
  command: Array<string>;
}

export interface PodNetworkRequest {
  name: string;
  ifName: string;
  vlan?: number;
  ipAddress: string;
  netmask: string;
}

export interface PodRequest {
  name: string;
  namespace: string;
  labels: Map<string, string>;
  containers: Array<PodContainerRequest>;
  networks: Array<PodNetworkRequest>;
  volumes: Array<string>;
  nodeAffinity: Array<string>;
  networkType: string;
  restartPolicy: string;
  capability: boolean;
}

export interface Pods {
  [name: string]: Pod;
}
