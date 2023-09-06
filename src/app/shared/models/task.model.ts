export interface Task {
  title: string;
  description: string;
  sub_tasks: Array<{ id: string; done: boolean; subtask: string }>;
  completed_sub_tasks: Array<{ id: string; done: boolean; subtask: string }>;
  status: string;
  id: string;
}
