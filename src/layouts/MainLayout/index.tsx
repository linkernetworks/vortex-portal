import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Layout } from 'antd';
import { Location } from 'history';

import { intlActions, intlModels } from '@/store/ducks/intl';
import { RootState, RootAction } from '@/store/ducks';
import SiderMenu from '@/components/SiderMenu';
import NavHeader from '@/components/NavHeader';
import { UserType } from '@/models/User';
import { getMenuData } from '@/routes/menu';

import * as styles from './styles.module.scss';
import logo from '@/assets/logo.svg';

const { Content, Header, Footer } = Layout;

interface MainLayoutProps {
  locale: string;
  localeOptions: Array<intlModels.IntlOption>;
  location: Location;
  changeLanguage: (locale: string) => any;
}

class MainLayout extends React.PureComponent<MainLayoutProps, object> {
  protected handleMenuClick = () => {
    return;
  };

  public render() {
    const { handleMenuClick } = this;
    const { locale, localeOptions, location, changeLanguage } = this.props;
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
            <Header className={styles.header}>
              <NavHeader
                onMenuClick={handleMenuClick}
                onLangsClick={changeLanguage}
                currentUser={currentUser}
                locale={locale}
                localeOptions={localeOptions}
              />
            </Header>
            <Content className={styles.content}>
              <div className={styles.card}>{this.props.children}</div>
            </Content>
            <Footer className={styles.footer}>Made by ❤️</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    locale: state.intl.locale,
    localeOptions: state.intl.options,
    location: state.router.location
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  changeLanguage: (newLocale: string) =>
    dispatch(intlActions.updateLocale({ locale: newLocale }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainLayout);
