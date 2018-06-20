import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Avatar, Icon, Dropdown, Menu, Tooltip } from 'antd';
import * as styles from './styles.module.scss';

import { User } from '@/models';

export interface NavHeaderProps {
  currentUser: User;
  onMenuClick: () => void;
  onLangsClick: (locale: string) => void;
}

class NavHeader extends React.Component<NavHeaderProps> {
  public handleLangsClick = ({ key }: { key: string }) => {
    this.props.onLangsClick(key);
  };

  public render() {
    const { onMenuClick, currentUser } = this.props;
    const { handleLangsClick } = this;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled={true}>
          <Icon type="user" />
          <FormattedMessage id="nav.profile" />
        </Menu.Item>
        <Menu.Item disabled={true}>
          <Icon type="setting" />
          <FormattedMessage id="nav.setting" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="nav.logout" />
        </Menu.Item>
      </Menu>
    );
    const langs = (
      <Menu
        className={styles.menu}
        selectedKeys={['en']}
        onClick={handleLangsClick}
      >
        <Menu.Item key="en-US"> English</Menu.Item>
        <Menu.Item key="zh-Hant"> 繁體中文</Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>
        <div className={styles.actions}>
          <Tooltip title={<FormattedMessage id="nav.imagehub" />}>
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
