import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { Location } from 'history';
import * as pathToRegexp from 'path-to-regexp';

import * as styles from './styles.module.scss';

import { urlToList } from '@/utils/pathTools';
import { MenuItem } from '@/routes/menu';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface SiderMenuState {
  collapsed: boolean;
  openKeys: Array<string>;
}

interface SiderMenuProps {
  logo: string;
  name: string;
  location: Location;
  menuData: Array<MenuItem>;
}

const getIcon = (icon: React.ReactChild) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return (
      <img
        src={icon}
        alt="icon"
        className={`${styles.icon} sider-menu-item-img`}
      />
    );
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = (menu: Array<MenuItem>): Array<string> => {
  return menu.reduce((keys: Array<string>, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);
};

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (
  flatMenuKeys: Array<string>,
  paths: Array<string>
) => {
  return paths.reduce(
    (matchKeys: Array<string>, path) =>
      matchKeys.concat(
        flatMenuKeys.filter(item => pathToRegexp(item).test(path))
      ),
    []
  );
};

class SiderMenu extends React.PureComponent<SiderMenuProps, SiderMenuState> {
  public flatMenuKeys: Array<string>;

  constructor(props: SiderMenuProps) {
    super(props);

    this.flatMenuKeys = getFlatMenuKeys(props.menuData);

    this.state = {
      collapsed: false,
      openKeys: this.getDefaultCollapsedSubMenus(props)
    };
  }

  public componentWillReceiveProps(nextProps: SiderMenuProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps)
      });
    }
  }

  public getSelectedMenuKeys = () => {
    const {
      location: { pathname }
    } = this.props;
    return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
  };

  public getDefaultCollapsedSubMenus(props: SiderMenuProps) {
    const {
      location: { pathname }
    } = props || this.props;
    return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
  }

  public onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  public isMainMenu = (key?: string) => {
    return this.props.menuData.some((item: MenuItem) => {
      return key ? item.path === key : true;
    });
  };

  public handleOpenChange = (openKeys: Array<string>) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne =
      openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys]
    });
  };

  public renderMenuItem(menuData: Array<MenuItem>): Array<React.ReactChild> {
    return menuData.map(item => {
      const icon = item.icon && getIcon(item.icon);
      const { name } = item;
      if (item.children) {
        const childrenItems = this.renderMenuItem(item.children);
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>
                    <FormattedMessage id={`side.${item.name}`} />
                  </span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.path}>
            <Link to={item.path}>
              {icon}
              <span>
                <FormattedMessage id={`side.${name}`} />
              </span>
            </Link>
          </Menu.Item>
        );
      }
    });
  }

  public render() {
    const { collapsed, openKeys } = this.state;
    const { logo, name, menuData } = this.props;
    const menuProps = collapsed ? {} : { openKeys };

    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }

    return (
      <Sider
        className={styles.sider}
        collapsible={true}
        collapsed={collapsed}
        onCollapse={this.onCollapse}
      >
        <div className={styles.logo} key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>{name}</h1>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          style={{ padding: '16px 0', width: '100%' }}
          {...menuProps}
          selectedKeys={selectedKeys}
          onOpenChange={this.handleOpenChange}
        >
          {this.renderMenuItem(menuData)}
        </Menu>
      </Sider>
    );
  }
}

export default SiderMenu;
