import { Board } from './board.model';

export interface User {
  email: string | null;
  name: string | null;
  boards: Board[];
}
