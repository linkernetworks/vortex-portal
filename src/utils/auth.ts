export function dataToBasicToken(data: { username: string; password: string }) {
  return btoa(`${data.username}:${data.password}`);
}

export function basicTokenToData(token: string) {
  const raw = atob(token).split(':');
  return {
    username: raw[0],
    password: raw[1]
  };
}
