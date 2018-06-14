import * as React from 'react';
import { Switch, Redirect, Route, RouteProps } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import Node from '@/routes/Compute/Node';
import Overview from '@/routes/Compute/Overview';
import Service from '@/routes/Service';
import NotFound from '@/routes/Exception/404';

// const appRoutes: Route = [
//   {
//     path:
//     component:
//   }
// ];

interface RouteWithLayoutProps extends RouteProps {
  layout: React.ComponentClass;
  component: React.ComponentClass;
}

export function RouteWithLayout({
  layout: Layout,
  component: Component,
  ...rest
}: RouteWithLayoutProps) {
  const childComponent = (props: object) => (
    <Layout>
      <Component {...props} />
    </Layout>
  );
  return <Route {...rest} render={childComponent} />;
}

const appRoutes = (
  <Switch>
    <Redirect exact={true} from="/" to="/compute/overview" />
    <Redirect exact={true} from="/compute" to="/compute/overview" />
    <RouteWithLayout
      layout={MainLayout}
      component={Overview}
      path="/compute/overview"
    />
    <RouteWithLayout
      layout={MainLayout}
      component={Node}
      path="/compute/node"
    />
    <RouteWithLayout layout={MainLayout} component={Service} path="/service" />
    <Route component={NotFound} />
  </Switch>
);

export default appRoutes;
