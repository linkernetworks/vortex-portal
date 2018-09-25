import * as React from 'react';
import { Terminal } from 'xterm';
import { fit } from 'xterm/lib/addons/fit/fit';
import 'xterm/dist/xterm.css';

import { getSocketSession, getSock } from '@/services/exec';

const padding = '6px';

interface ExecTerminalProps {
  namespace: string;
  podName: string;
  containerName: string;
  welcomeMsg?: string;
  onClose?: () => void;
}

class ExecTerminal extends React.PureComponent<ExecTerminalProps, object> {
  private xterm: Terminal;
  private sock: WebSocket;
  private termRef = React.createRef<HTMLDivElement>();

  protected handleRecieveMessage = (msg: string) => {
    this.xterm.write(msg);
  };

  protected handleCloseSock = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  protected handleTerminalInput = (sendMessage: (command: string) => void) => (
    key: string,
    event: KeyboardEvent
  ) => {
    sendMessage(key);
  };

  public async componentDidMount() {
    const { namespace, podName, containerName, welcomeMsg } = this.props;

    const session = await getSocketSession(namespace, podName, containerName);
    const { sock, sendMessage } = getSock(
      session.data.id,
      this.handleRecieveMessage,
      this.handleCloseSock
    );
    this.sock = sock;

    this.xterm = new Terminal();
    this.xterm.open(this.termRef.current!);
    this.xterm.element.style.padding = padding;
    fit(this.xterm);
    this.xterm.on('key', this.handleTerminalInput(sendMessage));

    if (welcomeMsg) {
      this.xterm.write(`${welcomeMsg}\r\n\n`);
    }
  }

  public componentWillUnmount() {
    if (this.xterm) {
      this.xterm.dispose();
    }
    if (this.sock) {
      this.sock.close();
    }
  }

  public render() {
    return <div ref={this.termRef} />;
  }
}

export default ExecTerminal;
