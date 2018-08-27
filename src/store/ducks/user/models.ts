import { User } from '@/models/User';
export * from '@/models/User';

export interface Auth {
  isAuthenticated: boolean;
  token: string;
  user: User | null;
}
