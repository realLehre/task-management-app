import { Board } from './board.model';

export interface User {
  email: string | null;
  name: string | null;
  boards: Board[];
}

export interface AuthUser {
  email: string;
  displayName: string;
  expirationTime: number;
  uid: string;
}
