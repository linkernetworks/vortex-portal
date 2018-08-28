export interface Node {
  resource: Resource;
  detail: Detail;
  nics: NetworkInterfaceController;
}

export interface Nodes {
  [name: string]: Node;
}

export interface NodesNics {
  [name: string]: NetworkInterfaceController;
}

export interface Detail {
  hostname: string;
  createAt: number;
  status: string;
  os: string;
  kernelVersion: string;
  dockerVersion: string;
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
  memoryTotalHugepages: number;
  memoryFreeHugepages: number;
  memoryHugepagesSize: number;
}

export interface NetworkInterfaceController {
  [interfaceName: string]: {
    default: boolean;
    type: NICType;
    ip: string;
    dpdk: boolean;
    pciID: string;
    nicNetworkTraffic: {
      receiveBytesTotal: Array<{ timestamp: number; value: string }>;
      transmitBytesTotal: Array<{ timestamp: number; value: string }>;
      receivePacketsTotal: Array<{ timestamp: number; value: string }>;
      transmitPacketsTotal: Array<{ timestamp: number; value: string }>;
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
