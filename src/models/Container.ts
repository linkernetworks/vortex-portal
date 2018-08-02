export interface Container {
  detail: Detail;
  status: Status;
  resource: Resource;
  nicNetworkTraffic: Traffic;
}

export interface Containers {
  [name: string]: Container;
}

export interface Detail {
  containerName: string;
  createAt: number;
  pod: string;
  namespace: string;
  node: string;
  image: string;
  command: Array<string>;
}

export interface Status {
  status: string;
  waitingReason: string;
  terminatedReason: string;
  restartTime: string;
}

export interface Resource {
  cpuUsagePercentage: Array<{ timestamp: number; value: string }>;
  memoryUsageBytes: Array<{ timestamp: number; value: string }>;
}

export interface Traffic {
  receiveBytesTotal: Array<{ timestamp: number; value: string }>;
  transmitBytesTotal: Array<{ timestamp: number; value: string }>;
  receivePacketsTotal: Array<{ timestamp: number; value: string }>;
  transmitPacketsTotal: Array<{ timestamp: number; value: string }>;
}
