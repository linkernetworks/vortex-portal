export enum UserType {
  Admin = 'ADMIN',
  Normal = 'NORMAL'
}

export default interface User {
  name: string;
  type: UserType;
  email?: string;
}
