export interface NetworkInterfaceController {
  name: string;
  default: boolean;
  type: NICType;
  pciID: string;
}

export enum NICType {
  virtual = 'virtual',
  physical = 'physical'
}
