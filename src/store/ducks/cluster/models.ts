export interface Node {
  name: string;
  nics?: Array<{
    name: string;
    default: boolean; // default route
    type: string;
    pciID: string;
  }>;
}
