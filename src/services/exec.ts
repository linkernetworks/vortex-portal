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

export const getSock = (id: string) => {
  console.log(`/v1/sockjs?${id}`);
  const sock = new SockJS(`/v1/sockjs?${id}`);
  sock.onopen = function() {
    console.log('sock open');
    sock.send(JSON.stringify({ Op: 'bind', SessionID: id }));
  };

  sock.onclose = function() {
    console.log('sock close');
    sock.close();
  };

  sock.onmessage = function(event) {
    const msg = JSON.parse(event.data);
    console.log(msg.Data);
  };

  console.log(sock.onopen, sock);

  const sendMessage = (command: string) => {
    sock.send(JSON.stringify({ Op: 'stdin', Data: command }));
  };

  return {
    onmessage: sock.onmessage,
    onsend: sendMessage
  };
};
