import * as React from 'react';
import { Switch, Redirect, Route, RouteProps } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import UserLayout from '@/layouts/UserLayout';
import Node from '@/routes/Compute/Node';
import Overview from '@/routes/Compute/Overview';
import Service from '@/routes/Service';
import Storage from '@/routes/Storage';
import Network from '@/routes/Network';
import Login from '@/routes/Login';
import NotFound from '@/routes/Exception/404';

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
    <Layout {...props}>
      <Component {...props} />
    </Layout>
  );
  return <Route {...rest} render={childComponent} />;
}

const appRoutes = (
  <Switch>
    <RouteWithLayout layout={UserLayout} component={Login} path="/signin" />
    <RouteWithLayout layout={UserLayout} component={Login} path="/signup" />
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
    <RouteWithLayout layout={MainLayout} component={Network} path="/network" />
    <RouteWithLayout layout={MainLayout} component={Service} path="/service" />
    <RouteWithLayout layout={MainLayout} component={Storage} path="/storage" />
    <Route component={NotFound} />
  </Switch>
);

export default appRoutes;
