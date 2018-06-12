import * as React from 'react';
import { Avatar, Icon, Dropdown, Menu, Tooltip } from 'antd';
import * as styles from './styles.module.scss';

import { User } from '@/models';

interface NavHeaderProps {
  currentUser: User;
  onMenuClick: () => void;
  onLangsClick: () => void;
}

class NavHeader extends React.Component<NavHeaderProps> {
  public render() {
    const { onMenuClick, onLangsClick, currentUser } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled={true}>
          <Icon type="user" /> Profile
        </Menu.Item>
        <Menu.Item disabled={true}>
          <Icon type="setting" /> Setting
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" /> Logout
        </Menu.Item>
      </Menu>
    );
    const langs = (
      <Menu
        className={styles.menu}
        selectedKeys={['en']}
        onClick={onLangsClick}
      >
        <Menu.Item key="en"> English</Menu.Item>
        <Menu.Item key="zh-tw"> 繁體中文</Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>
        <div className={styles.actions}>
          <Tooltip title="Image Hub">
            <a className={styles.action} target="_blank" href="#">
              <Icon type="appstore-o" />
            </a>
          </Tooltip>
          <Dropdown overlay={langs}>
            <span className={styles.action}>
              <Icon type="global" />
            </span>
          </Dropdown>
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} icon="user" />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default NavHeader;
