export class TaskModel {
  id?: number;
  heading: string;
  description: string;
  start_date?: string;
  target_date?: string;
  task_order?: number;
  user: number;
}
