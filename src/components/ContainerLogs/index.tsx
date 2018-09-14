import * as React from 'react';
import { Input } from 'antd';
import { last } from 'lodash';
import * as styles from './styles.module.scss';
import * as containerAPI from '@/services/container';

const InputTextArea = Input.TextArea;

interface ContainerLogsProps {
  namespace: string;
  podName: string;
  containerName: string;
}

interface ContainerLogsState {
  logs: Array<{ timestamp: string; content: string }>;
}

class ContainerLogs extends React.PureComponent<
  ContainerLogsProps,
  ContainerLogsState
> {
  private intervalContainerId: number;
  constructor(props: ContainerLogsProps) {
    super(props);
    this.state = {
      logs: []
    };
  }

  public componentDidMount() {
    const { namespace, podName, containerName } = this.props;
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

  public componentWillUnmount() {
    clearInterval(this.intervalContainerId);
  }

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
    const { logs } = this.state;
    let content = '';
    if (logs.length > 0) {
      logs.map(log => {
        content += `${log.content}\n`;
      });
    }
    return (
      <InputTextArea
        className={styles.textarea}
        disabled={true}
        value={content}
        rows={10}
      />
    );
  }
}

export default ContainerLogs;
