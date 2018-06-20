import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Layout } from 'antd';
import { Location } from 'history';

import { intlActions } from '@/store/ducks/intl';
import { RootState, RootAction } from '@/store/ducks';
import SiderMenu from '@/components/SiderMenu';
import NavHeader from '@/components/NavHeader';
import { UserType } from '@/models/User';
import { getMenuData } from '@/routes/menu';

import logo from '@/assets/logo.svg';

const { Content, Header, Footer } = Layout;

interface MainLayoutProps {
  location: Location;
  changeLanguage: (locale: string) => any;
}

class MainLayout extends React.PureComponent<MainLayoutProps, any> {
  protected handleLangsClick = (locale: string) => {
    this.props.changeLanguage(locale);
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

const mapStateToProps = (state: RootState) => {
  return {
    location: state.router.location
  } as { location: Location };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  changeLanguage: (locale: string) =>
    dispatch(intlActions.updateLocale({ locale }))
});

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
