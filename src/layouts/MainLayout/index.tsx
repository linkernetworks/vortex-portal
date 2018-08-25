import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Layout } from 'antd';
import { Location } from 'history';

import { intlActions, intlModels } from '@/store/ducks/intl';
import { RootState, RootAction } from '@/store/ducks';
import SiderMenu from '@/components/SiderMenu';
import NavHeader from '@/components/NavHeader';
import BaseFooter from '@/components/BaseFooter';
import { getMenuData } from '@/routes/menu';
import * as metaAPI from '@/services/meta';

import * as styles from './styles.module.scss';
import logo from '@/assets/logo.png';

const { Content, Header, Footer } = Layout;

interface MainLayoutProps {
  locale: string;
  localeOptions: Array<intlModels.IntlOption>;
  location: Location;
  changeLanguage: (locale: string) => any;
}

interface MainLayoutState {
  version: string;
}

class MainLayout extends React.PureComponent<MainLayoutProps, MainLayoutState> {
  constructor(props: MainLayoutProps) {
    super(props);
    this.state = {
      version: ''
    };
  }

  public componentDidMount() {
    metaAPI.getVersion().then(res => {
      this.setState({
        version: res.data.message
      });
    });
  }

  protected handleMenuClick = () => {
    return;
  };

  public render() {
    const { handleMenuClick } = this;
    const { locale, localeOptions, location, changeLanguage } = this.props;
    const currentUser = {
      id: '123',
      displayName: 'Lucien',
      createdAt: new Date()
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
                locale={locale}
                localeOptions={localeOptions}
              />
            </Header>
            <Content className={styles.content}>{this.props.children}</Content>
            <Footer className={styles.footer}>
              <BaseFooter
                version={{
                  backend: this.state.version,
                  portal: `v${process.env.REACT_APP_PORTAL_VERSION}`
                }}
              />
            </Footer>
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
    location: state.router.location as Location
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
