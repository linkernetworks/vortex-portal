export interface Node {
  detail: Detail;
  resource: Resource;
  nics: NetworkInterfaceController;
}

export interface Nodes {
  [name: string]: Node;
}

export interface Detail {
  hostname: string;
  createAt: number;
  status: string;
  os: string;
  kernelVersion: string;
  kubeproxyVersion: string;
  kubernetesVersion: string;
  labels: Map<string, string>;
}

export interface Resource {
  cpuRequests: number;
  cpuLimits: number;
  memoryRequests: number;
  memoryLimits: number;
  allocatableCPU: number;
  allocatableMemory: number;
  allocatablePods: number;
  capacityCPU: number;
  capacityPods: number;
  capacityMemory: number;
  capacityEphemeralStorage: number;
}

export interface NetworkInterfaceController {
  [interfaceName: string]: {
    default: boolean;
    type: NICType;
    ip: string;
    dpdk: boolean;
    pciID: string;
    nicNetworkTraffic: {
      receiveBytesTotal: number;
      transmitBytesTotal: number;
      receivePacketsTotal: number;
      transmitPacketsTotal: number;
    };
  };
}

export interface NICBrief {
  name: string;
  default: boolean;
  dpdk: boolean;
  type: NICType;
  pciID: string;
}

export interface Info {
  detail: Detail;
  resource: Resource;
}

export enum NICType {
  virtual = 'virtual',
  physical = 'physical'
}
