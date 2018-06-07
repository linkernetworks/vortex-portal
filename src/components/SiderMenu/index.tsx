import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

import * as styles from './styles.module.scss';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface State {
  collapsed: boolean;
}

interface Props {
  logo: string;
  name: string;
}

const getIcon = (icon: string) => {
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

class SiderMenu extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  public onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  public render() {
    const { collapsed } = this.state;
    const { logo, name } = this.props;

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
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <span>Dashboard</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span>Option 2</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default SiderMenu;
