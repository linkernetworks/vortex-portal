import * as React from 'react';
import { Modal } from 'antd';

import * as styles from './styles.module.scss';

import ExecTerminal from '@/components/ExecTerminal';

// From Antd motion theme
const duration = 300;
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

interface ModalTerminalState {
  readyToLoadTerm: boolean;
}

class ModalTerminal extends React.PureComponent<
  ModalTerminalProps,
  ModalTerminalState
> {
  public state = {
    readyToLoadTerm: false
  };

  public componentDidUpdate(prevProps: ModalTerminalProps) {
    if (!prevProps.execIdentifier && this.props.execIdentifier) {
      setTimeout(() => {
        this.setState({ readyToLoadTerm: true });
      }, duration);
    }
  }

  protected handleClose = () => {
    this.props.onCloseModal();
    this.setState({ readyToLoadTerm: false });
  };

  public render() {
    const { execIdentifier, title, welcomeMsg, onCloseModal } = this.props;
    const { readyToLoadTerm } = this.state;

    return (
      <Modal
        visible={!!execIdentifier}
        title={title}
        className={styles['terminal-modal']}
        onCancel={this.handleClose}
        footer={null}
        width={960}
        bodyStyle={{ padding: 0, height: '65vh', background: 'black' }}
        destroyOnClose={true}
      >
        {readyToLoadTerm &&
          execIdentifier && (
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
