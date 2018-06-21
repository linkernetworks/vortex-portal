import { UserType } from '@/models/User';

export interface MenuItem {
  name: string;
  path: string;
  icon?: string;
  children?: Array<MenuItem>;
  authority?: UserType;
}

export const menuData: Array<MenuItem> = [
  {
    name: 'compute',
    path: 'compute',
    icon: 'api',
    children: [
      {
        name: 'overview',
        path: 'overview'
      },
      {
        name: 'node',
        path: 'node'
      },
      {
        name: 'pod',
        path: 'pod'
      },
      {
        name: 'container',
        path: 'container'
      }
    ]
  },
  {
    name: 'network',
    path: 'network',
    icon: 'share-alt',
    children: [
      {
        name: 'ovs',
        path: 'ovs'
      },
      {
        name: 'dpdk',
        path: 'dpdk'
      }
    ]
  },
  {
    name: 'service',
    icon: 'flag',
    path: 'service'
  },
  {
    name: 'storage',
    path: 'storage'
  },
  {
    name: 'user',
    icon: 'team',
    path: 'user',
    authority: UserType.Admin
  }
];

function formatter(
  data: Array<MenuItem>,
  parentPath = '/',
  parentAuthority?: UserType
) {
  return data.map(item => {
    const result = {
      ...item,
      path: parentPath + item.path,
      authority: item.authority || parentAuthority
    };

    if (item.children) {
      result.children = formatter(
        item.children,
        `${parentPath}${item.path}/`,
        item.authority
      );
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
