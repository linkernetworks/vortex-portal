export interface Deployment {
  id?: string;
  ownerID?: string;
  name: string;
  namespace: string;
  labels: any;
  envVars: any;
  containers: Array<DeploymentContainer>;
  networks: Array<DeploymentNetwork>;
  volumes: Array<DeploymentVolume>;
  nodeAffinity: Array<string>;
  networkType: string;
  capability: boolean;
  replicas: number;
}

export interface DeploymentRouteGw {
  key?: string;
  dstCIDR: string;
  gateway: string;
}

export interface DeploymentRouteIntf {
  dstCIDR: string;
}

export interface DeploymentVolume {
  name: string;
  mountPath: string;
}

export interface DeploymentContainer {
  key?: string;
  name: string;
  image: string;
  command: Array<string>;
}

export interface DeploymentNetwork {
  key?: string;
  name: string;
  ifName: string;
  vlan: number;
  ipAddress: string;
  netmask: string;
  routesGw: Array<DeploymentRouteGw>;
  routesIntf?: Array<DeploymentRouteIntf>;
}

export interface Controller {
  id?: string;
  ownerID?: string;
  controllerName: string;
  type: string;
  namespace: string;
  strategy: string;
  createAt: number;
  desiredPod: number;
  currentPod: number;
  availablePod: number;
  labels: any;
  pods: Array<string>;
}

export interface Controllers {
  [name: string]: Controller;
}
