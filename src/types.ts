export interface Task {
  id: string;
  text: string;
  dueDate: Date | null; // Make sure this allows null as a valid value
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}
