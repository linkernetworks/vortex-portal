export interface Service {
  id?: string;
  ownerID?: string;
  name: string;
  namespace: string;
  type: string;
  selector: any;
  ports: Array<ServicePort>;
  createdAt?: string;
}

export interface ServicePort {
  key?: string;
  name: string;
  port: number;
  targetPort: number;
  nodePort?: number;
}
