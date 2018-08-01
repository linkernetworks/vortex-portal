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
  cpuUsagePercentage: any;
  memoryUsageBytes: any;
}

export interface Traffic {
  receiveBytesTotal: any;
  transmitBytesTotal: any;
  receivePacketsTotal: any;
  transmitPacketsTotal: any;
}
