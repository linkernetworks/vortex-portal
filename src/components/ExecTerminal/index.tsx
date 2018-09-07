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
  private termRef = React.createRef<HTMLDivElement>();

  public async componentDidMount() {
    const { namespace, podName, containerName } = this.props;
    this.xterm = new Terminal();
    this.xterm.open(this.termRef.current!);

    const session = await getSocketSession(namespace, podName, containerName);
    const sock = getSock(session.data.id);
    // sock.onmessage = event => {
    //   const msg = JSON.parse(event.data);
    //   console.log(msg);
    //   this.xterm.write(msg.Data);
    // };
  }

  public componentWillUnmount() {
    if (this.xterm) {
      this.xterm.dispose();
    }
  }

  public render() {
    return <div ref={this.termRef} />;
  }
}

export default ExecTerminal;
