export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'completed';
  date: number,
  // order: number,

}
