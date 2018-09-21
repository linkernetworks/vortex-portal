import axios, { AxiosPromise } from 'axios';
import * as SockJS from 'sockjs-client';

export const getSocketSession = (
  namespace: string,
  podName: string,
  containerName: string
): AxiosPromise<{ id: string }> => {
  return axios.get(
    `/v1/exec/pod/${namespace}/${podName}/shell/${containerName}`
  );
};

export const getSock = (
  id: string,
  receiveMessage: (data: string) => void,
  closed: () => void
) => {
  const sock = new SockJS(`/v1/sockjs?${id}`);

  const sendMessage = (command: string) => {
    sock.send(JSON.stringify({ Op: 'stdin', Data: command }));
  };

  sock.onopen = function() {
    console.log('sock open');
    sock.send(JSON.stringify({ Op: 'bind', SessionID: id }));
  };

  sock.onclose = function() {
    console.log('sock close');
    sock.close();
    closed();
  };

  sock.onmessage = function(event) {
    const msg = JSON.parse(event.data);
    // ignore error message when fallback various shell
    if (!/^(rpc error\: code = 2)/.test(msg.Data)) {
      receiveMessage(msg.Data);
    }
  };

  return {
    sock,
    sendMessage
  };
};
