export interface Pod {
  [name: string]: {
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
  };
}
