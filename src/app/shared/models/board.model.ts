import { Task } from './task.model';

export interface Board {
  name: string;
  columns: Array<string>;
  tasks: Task[];
  id: string;
}
