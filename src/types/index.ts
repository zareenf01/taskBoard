export interface Task {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdAt: string;
  columnId: string;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
  taskIds: string[];
}

export interface Board {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  columnIds: string[];
}

export interface AppState {
  boards: Board[];
  columns: Column[];
  tasks: Task[];
  currentBoardId: string | null;
}

export type Priority = 'high' | 'medium' | 'low';

export interface SearchFilters {
  searchTerm: string;
  priority: Priority | 'all';
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week';
}