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

export interface Pods {
  [name: string]: Pod;
}
