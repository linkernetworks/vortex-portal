import * as React from 'react';
import { Input, Modal } from 'antd';
import { last } from 'lodash';
import * as styles from './styles.module.scss';
import * as containerAPI from '@/services/container';

const InputTextArea = Input.TextArea;

interface ModalContainerLogsProps {
  title: string;
  logsIdentifier?: {
    namespace: string;
    podName: string;
    containerName: string;
  };
  onCloseModal: () => void;
}

interface ModalContainerLogsState {
  logs: Array<{ timestamp: string; content: string }>;
}

class ModalContainerLogs extends React.PureComponent<
  ModalContainerLogsProps,
  ModalContainerLogsState
> {
  private intervalContainerId: number;
  constructor(props: ModalContainerLogsProps) {
    super(props);
    this.state = {
      logs: []
    };
  }

  public componentDidUpdate(prevProps: ModalContainerLogsProps) {
    if (!prevProps.logsIdentifier && this.props.logsIdentifier) {
      const { logsIdentifier } = this.props;
      if (logsIdentifier) {
        const { namespace, podName, containerName } = logsIdentifier;
        containerAPI
          .getContainerLogs(namespace, podName, containerName)
          .then(res => {
            this.setState({ logs: res.data.logs });
          });
        this.intervalContainerId = window.setInterval(
          () => this.fetchContainerLogs(namespace, podName, containerName),
          5000
        );
      }
    }
  }

  protected handleClose = () => {
    this.props.onCloseModal();
    clearInterval(this.intervalContainerId);
  };

  protected fetchContainerLogs = (
    namespace: string,
    pod: string,
    container: string
  ) => {
    const logs = [...this.state.logs];
    containerAPI.getContainerLogs(namespace, pod, container).then(res => {
      const newLogs = res.data.logs;
      const lastLog = last(logs);
      newLogs.map(log => {
        if (lastLog && log.timestamp > lastLog.timestamp) {
          logs.push(log);
        }
      });
    });
    this.setState({ logs });
  };

  public render() {
    const { logsIdentifier, title } = this.props;
    let content = '';
    if (this.state.logs.length > 0) {
      this.state.logs.map(log => {
        content += `${log.content}\n`;
      });
    }
    return (
      <Modal
        visible={!!logsIdentifier}
        title={title}
        className={styles['terminal-modal']}
        onCancel={this.handleClose}
        footer={null}
        width={960}
        bodyStyle={{ padding: 0, height: '65vh', background: 'black' }}
        destroyOnClose={true}
      >
        <InputTextArea
          className={styles.textarea}
          disabled={true}
          value={content}
          rows={10}
        />
      </Modal>
    );
  }
}

export default ModalContainerLogs;
