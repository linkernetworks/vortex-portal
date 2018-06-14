import * as React from 'react';
import { Layout, Breadcrumb } from 'antd';
import SiderMenu from '@/components/SiderMenu';
import NavHeader from '@/components/NavHeader';
import { withRouter, RouteComponentProps } from 'react-router';
import logo from '@/assets/logo.svg';

const { Content, Header, Footer } = Layout;

import { UserType } from '@/models/User';
import { getMenuData } from '@/routes/menu';

class MainLayout extends React.PureComponent<RouteComponentProps<{}>, any> {
  protected handleLangsClick = () => {
    return;
  };

  protected handleMenuClick = () => {
    return;
  };

  public render() {
    const { handleLangsClick, handleMenuClick } = this;
    const { location } = this.props;
    const currentUser = {
      name: 'Lucien',
      type: UserType.Admin
    };

    return (
      <div className="App">
        <Layout>
          <SiderMenu
            logo={logo}
            name={'Vortex'}
            menuData={getMenuData()}
            location={location}
          />
          <Layout>
            <Header style={{ padding: 0 }}>
              <NavHeader
                onMenuClick={handleMenuClick}
                onLangsClick={handleLangsClick}
                currentUser={currentUser}
              />
            </Header>
            <Content style={{ margin: '24px 24px 0', height: '100%' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
              </Breadcrumb>
              <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                {this.props.children}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Made by ❤️</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default withRouter(MainLayout);
