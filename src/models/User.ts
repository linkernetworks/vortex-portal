import { Omit } from '@/utils/types';

export const JWTTOKEN = 'JWTTOKEN';

export enum UserRole {
  root = 'root',
  user = 'user',
  guest = 'guest'
}

export interface LoginCredential {
  username: string; // email
  password: string;
}

export interface UserBrief {
  loginCredential: LoginCredential;
  role: UserRole;
  displayName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export type UserFields = Omit<UserBrief, 'loginCredential'> & LoginCredential;

export type FlattenUser = Omit<User, 'loginCredential'> & LoginCredential;

export interface User extends UserBrief {
  id: string;
  createdAt: Date;
}
