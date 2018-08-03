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
  nics: NICS;
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
  capability: boolean;
  restartPolicy: string;
}

export interface Pods {
  [name: string]: Pod;
}

export interface NICS {
  [name: string]: {
    nicNetworkTraffic: {
      receiveBytesTotal: Array<{ timestamp: number; value: string }>;
      transmitBytesTotal: Array<{ timestamp: number; value: string }>;
      receivePacketsTotal: Array<{ timestamp: number; value: string }>;
      transmitPacketsTotal: Array<{ timestamp: number; value: string }>;
    };
  };
}
