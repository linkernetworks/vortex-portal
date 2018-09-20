import * as React from 'react';
import { Icon } from 'antd';

import * as styles from './styles.module.scss';

const StatusIcon: React.SFC<{ status: string }> = props => {
  switch (props.status) {
    case 'running':
    case 'ready':
    case 'Completed':
      return <Icon type="check-circle" className={styles.readyIcon} />;
    case 'ContainerCreating':
    case 'custom-loading':
      return <Icon type="clock-circle" className={styles.pendingIcon} />;
    default:
      return <Icon type="close-circle" className={styles.errorIcon} />;
  }
};

export default StatusIcon;
