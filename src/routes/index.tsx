import * as React from 'react';
import { Route, RouteProps, RouteComponentProps } from 'react-router';
// import MainLayout from '@/layouts/MainLayout';

// const appRoutes: Route = [
//   {
//     path:
//     component:
//   }
// ];

interface RouteWithLayoutProps extends RouteProps {
  layout: React.ComponentType;
  component: React.ComponentType;
}

export function RouteWithLayout({
  layout,
  component,
  ...rest
}: RouteWithLayoutProps) {
  const childComponent = (props: any) =>
    React.createElement(layout, props, React.createElement(component, props));
  return <Route {...rest} render={childComponent} />;
}
