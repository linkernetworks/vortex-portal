export interface Container {
  detail: Detail;
  resource: Resource;
}

export interface Containers {
  [name: string]: Container;
}

export interface ContainersResource {
  [name: string]: Resource;
}

export interface Detail {
  containerName: string;
  createAt: number;
  status: string;
  restartCount: string;
  pod: string;
  namespace: string;
  node: string;
  image: string;
  command: Array<string>;
}

export interface Resource {
  cpuUsagePercentage: Array<{ timestamp: number; value: string }>;
  memoryUsageBytes: Array<{ timestamp: number; value: string }>;
}
