import * as React from 'react';
import { Modal } from 'antd';

import * as styles from './styles.module.scss';

import ExecTerminal from '@/components/ExecTerminal';

interface ModalTerminalProps {
  title: string;
  welcomeMsg?: string;
  execIdentifier?: {
    namespace: string;
    podName: string;
    containerName: string;
  };
  onCloseModal: () => void;
}

class ModalTerminal extends React.PureComponent<ModalTerminalProps, object> {
  public render() {
    const { execIdentifier, title, welcomeMsg, onCloseModal } = this.props;
    return (
      <Modal
        visible={!!execIdentifier}
        title={title}
        className={styles['terminal-modal']}
        onCancel={onCloseModal}
        footer={null}
        width={960}
        bodyStyle={{ padding: 0 }}
        destroyOnClose={true}
      >
        {execIdentifier && (
          <ExecTerminal
            namespace={execIdentifier.namespace}
            podName={execIdentifier.podName}
            containerName={execIdentifier.containerName}
            welcomeMsg={welcomeMsg}
            onClose={onCloseModal}
          />
        )}
      </Modal>
    );
  }
}

export default ModalTerminal;
