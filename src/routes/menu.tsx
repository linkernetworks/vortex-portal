import * as React from 'react';
import { UserType } from '@/models/User';

export interface MenuItem {
  name: string;
  path: string;
  icon?: React.ReactChild;
  children?: Array<MenuItem>;
  authority?: UserType;
}

export const menuData: Array<MenuItem> = [
  {
    name: 'cluster',
    path: 'cluster',
    icon: 'hdd',
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
        name: 'network',
        path: 'network'
      }
    ]
  },
  {
    name: 'application',
    path: 'application',
    icon: 'api',
    children: [
      {
        name: 'overview',
        path: 'overview'
      },
      {
        name: 'namespace',
        path: 'namespace'
      },
      {
        name: 'deployment',
        path: 'deployment'
      },
      {
        name: 'service',
        path: 'service'
      },
      {
        name: 'pod',
        path: 'pod'
      }
    ]
  },
  {
    name: 'storage',
    icon: 'database',
    path: 'storage'
  },
  {
    name: 'users',
    icon: 'team',
    path: 'users',
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
