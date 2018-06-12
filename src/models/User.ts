export enum UserType {
  Admin,
  Normal
}

export default interface User {
  name: string;
  type: UserType;
  email?: string;
}
