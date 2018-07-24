import * as Container from '@/models/Container';

export interface Pod {
  id: string;
  name: string;
  containers: Array<Container.Container>;
  createdAt: string;
}
