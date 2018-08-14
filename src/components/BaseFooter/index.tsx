import * as React from 'react';
import { Icon } from 'antd';
import LinkerLogo from '@/components/LinkerLogo';
import * as styles from './styles.module.scss';

interface BaseFooterProps {
  version: {
    backend: string;
    portal: string;
  };
}

class BaseFooter extends React.PureComponent<BaseFooterProps, object> {
  public render() {
    return (
      <div className={styles.footer}>
        <div>
          <span className={styles.version}>
            Backend: {this.props.version.backend}
          </span>
          <span className={styles.version}>
            Portal: {this.props.version.portal}
          </span>
        </div>
        <div className={styles.copyright}>
          Copyright <Icon type="copyright" /> 2018{' '}
          <LinkerLogo className={styles.logo} />
          Linker Networks
        </div>
      </div>
    );
  }
}

export default BaseFooter;
