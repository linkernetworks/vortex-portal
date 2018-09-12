import * as React from 'react';
import { Terminal } from 'xterm';
import 'xterm/dist/xterm.css';

import { getSocketSession, getSock } from '@/services/exec';

interface ExecTerminalProps {
  namespace: string;
  podName: string;
  containerName: string;
}

class ExecTerminal extends React.PureComponent<ExecTerminalProps, object> {
  private xterm: Terminal;
  private sock: WebSocket;
  private termRef = React.createRef<HTMLDivElement>();

  protected handleRecieveMessage = (msg: string) => {
    this.xterm.write(msg);
  };

  protected handleTerminalInput = (sendMessage: (command: string) => void) => (
    key: string,
    event: KeyboardEvent
  ) => {
    sendMessage(key);
  };

  public async componentDidMount() {
    const { namespace, podName, containerName } = this.props;

    const session = await getSocketSession(namespace, podName, containerName);
    const { sock, sendMessage } = getSock(
      session.data.id,
      this.handleRecieveMessage
    );
    this.sock = sock;

    this.xterm = new Terminal();
    this.xterm.open(this.termRef.current!);
    this.xterm.on('key', this.handleTerminalInput(sendMessage));
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
