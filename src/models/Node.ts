export interface Detail {
  hostname: string;
  createAt: number;
  status: string;
  os: string;
  kernelVersion: string;
  kubeproxyVersion: string;
  kubernetesVersion: string;
  label: Map<string, string>;
}

export interface Resource {
  cpuRequests: number;
  cpuLimits: number;
  memoryRequests: number;
  memoryLimits: number;
  allocatableCPU: number;
  allocatableMemory: number;
  allocatablePods: number;
  allocatableEphemeralStorage: number;
  capacityCPU: number;
  capacityMemory: number;
  capacityPods: number;
  capacityEphemeralStorage: number;
}

export interface NetworkInterfaceController {
  name: string;
  default: boolean;
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
