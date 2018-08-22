export enum UserType {
  Admin = 'ADMIN',
  Normal = 'NORMAL'
}

export interface LoginCredential {
  username: string; // email
  password: string;
}

export interface User {
  loginCredential?: LoginCredential;
  role?: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface UserResponse extends User {
  id: string;
  createdAt: Date;
}
