import * as React from 'react';
import { Switch, Redirect, Route, RouteProps } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import UserLayout from '@/layouts/UserLayout';
import ClusterOverview from '@/routes/Cluster/Overview';
import Node from '@/routes/Cluster/Node';
import Network from '@/routes/Cluster/Network';

import ApplicationOverview from '@/routes/Application/Overview';
import Deployment from '@/routes/Application/Deployment';
import Namespace from '@/routes/Application/Namespace';
import Pod from '@/routes/Application/Pod';
import Container from '@/routes/Application/Container';
import Service from '@/routes//Application/Service';
import Storage from '@/routes/Storage';
import Login from '@/routes/Login';
import ImageHub from '@/routes/ImageHub';
import Users from '@/routes/Users';
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
    <Redirect exact={true} from="/" to="/cluster/overview" />
    <Redirect exact={true} from="/cluster" to="/cluster/overview" />
    <RouteWithLayout
      layout={MainLayout}
      component={ClusterOverview}
      path="/cluster/overview"
    />
    <RouteWithLayout
      layout={MainLayout}
      component={Node}
      path="/cluster/node"
    />
    <RouteWithLayout
      layout={MainLayout}
      component={Network}
      path="/cluster/network"
    />
    <Redirect exact={true} from="/application" to="/application/overview" />
    <RouteWithLayout
      layout={MainLayout}
      component={ApplicationOverview}
      path="/application/overview"
    />
    <RouteWithLayout
      layout={MainLayout}
      component={Namespace}
      path="/application/namespace"
    />
    <RouteWithLayout
      layout={MainLayout}
      component={Deployment}
      path="/application/deployment"
    />
    <RouteWithLayout
      layout={MainLayout}
      component={Service}
      path="/application/service"
    />
    <RouteWithLayout
      layout={MainLayout}
      component={Pod}
      path="/application/pod"
    />
    <RouteWithLayout
      layout={MainLayout}
      component={Container}
      path="/application/container"
    />
    <RouteWithLayout layout={MainLayout} component={Storage} path="/storage" />
    <RouteWithLayout layout={MainLayout} component={Users} path="/users" />
    <RouteWithLayout
      layout={MainLayout}
      component={ImageHub}
      path="/imagehub"
    />
    <Route component={NotFound} />
  </Switch>
);

export default appRoutes;
