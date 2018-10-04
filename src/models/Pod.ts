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
  metadata: PodFromMongo;
}

export interface PodRouteGwRequest {
  key?: string;
  dstCIDR: string;
  gateway: string;
}

export interface PodRouteIntfRequest {
  dstCIDR: string;
}

export interface PodContainerRequest {
  key?: string;
  name: string;
  image: string;
  resourceRequestCPU: number;
  resourceRequestMemory: number;
  command: Array<string>;
}

export interface PodNetworkRequest {
  key?: string;
  name: string;
  ifName: string;
  vlan: number;
  ipAddress: string;
  netmask: string;
  routesGw: Array<PodRouteGwRequest>;
  routesIntf?: Array<PodRouteIntfRequest>;
}

export interface PodRequest {
  name: string;
  namespace: string;
  labels: any;
  envVars: any;
  containers: Array<PodContainerRequest>;
  networks: Array<PodNetworkRequest>;
  volumes: Array<string>;
  nodeAffinity: Array<string>;
  networkType: string;
  capability: boolean;
  restartPolicy: string;
}

export interface PodFromMongo {
  id: string;
  name: string;
}

export interface Pods {
  [name: string]: Pod;
}

export interface PodsNics {
  // Pod name
  [name: string]: NICS;
}
export interface PodInfo {
  name: string;
  status: string;
  node: string;
  restarts: number;
  createdAt: string;
}

export interface NICS {
  // NICS name
  [name: string]: {
    nicNetworkTraffic: {
      receiveBytesTotal: Array<{ timestamp: number; value: string }>;
      transmitBytesTotal: Array<{ timestamp: number; value: string }>;
      receivePacketsTotal: Array<{ timestamp: number; value: string }>;
      transmitPacketsTotal: Array<{ timestamp: number; value: string }>;
    };
  };
}

export enum NICType {
  virtual = 'virtual',
  physical = 'physical'
}
