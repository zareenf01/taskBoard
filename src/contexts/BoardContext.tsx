import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { AppState, Board, Column, Task, SearchFilters } from "../types";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  generateId,
} from "../localStorage";

interface BoardContextType {
  state: AppState;
  createBoard: (title: string, description: string, createdBy: string) => void;
  deleteBoard: (boardId: string) => void;
  setCurrentBoard: (boardId: string | null) => void;
  createColumn: (title: string, boardId: string) => void;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  createTask: (task: Omit<Task, "id" | "createdAt" | "order">) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newColumnId: string, newOrder: number) => void;
  reorderTask: (taskId: string, newOrder: number) => void;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

type Action =
  | { type: "SET_STATE"; payload: AppState }
  | { type: "CREATE_BOARD"; payload: Board }
  | { type: "DELETE_BOARD"; payload: string }
  | { type: "SET_CURRENT_BOARD"; payload: string | null }
  | { type: "CREATE_COLUMN"; payload: Column }
  | { type: "UPDATE_COLUMN"; payload: { columnId: string; title: string } }
  | { type: "DELETE_COLUMN"; payload: string }
  | { type: "CREATE_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: { taskId: string; updates: Partial<Task> } }
  | { type: "DELETE_TASK"; payload: string }
  | {
      type: "MOVE_TASK";
      payload: { taskId: string; newColumnId: string; newOrder: number };
    }
  | { type: "REORDER_TASK"; payload: { taskId: string; newOrder: number } };

const initialState: AppState = {
  boards: [],
  columns: [],
  tasks: [],
  currentBoardId: null,
};

const initialSearchFilters: SearchFilters = {
  searchTerm: "",
  priority: "all",
  dueDateFilter: "all",
};

const boardReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_STATE":
      return action.payload;

    case "CREATE_BOARD":
      return {
        ...state,
        boards: [...state.boards, action.payload],
      };

    case "DELETE_BOARD":
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
        columns: state.columns.filter(
          (column) => column.boardId !== action.payload
        ),
        tasks: state.tasks.filter(
          (task) =>
            !state.columns.find(
              (col) =>
                col.boardId === action.payload && col.id === task.columnId
            )
        ),
        currentBoardId:
          state.currentBoardId === action.payload ? null : state.currentBoardId,
      };

    case "SET_CURRENT_BOARD":
      return {
        ...state,
        currentBoardId: action.payload,
      };

    case "CREATE_COLUMN":
      return {
        ...state,
        columns: [...state.columns, action.payload],
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? { ...board, columnIds: [...board.columnIds, action.payload.id] }
            : board
        ),
      };

    case "UPDATE_COLUMN":
      return {
        ...state,
        columns: state.columns.map((column) =>
          column.id === action.payload.columnId
            ? { ...column, title: action.payload.title }
            : column
        ),
      };

    case "DELETE_COLUMN": {
      const columnToDelete = state.columns.find(
        (col) => col.id === action.payload
      );
      return {
        ...state,
        columns: state.columns.filter((column) => column.id !== action.payload),
        tasks: state.tasks.filter((task) => task.columnId !== action.payload),
        boards: state.boards.map((board) =>
          board.id === columnToDelete?.boardId
            ? {
                ...board,
                columnIds: board.columnIds.filter(
                  (id) => id !== action.payload
                ),
              }
            : board
        ),
      };
    }

    case "CREATE_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        columns: state.columns.map((column) =>
          column.id === action.payload.columnId
            ? { ...column, taskIds: [...column.taskIds, action.payload.id] }
            : column
        ),
      };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };

    case "DELETE_TASK": {
      const taskToDelete = state.tasks.find(
        (task) => task.id === action.payload
      );
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        columns: state.columns.map((column) =>
          column.id === taskToDelete?.columnId
            ? {
                ...column,
                taskIds: column.taskIds.filter((id) => id !== action.payload),
              }
            : column
        ),
      };
    }

    case "MOVE_TASK": {
      const { taskId, newColumnId, newOrder } = action.payload;
      const taskToMove = state.tasks.find((task) => task.id === taskId);
      if (!taskToMove) return state;

      const oldColumnId = taskToMove.columnId;

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? { ...task, columnId: newColumnId, order: newOrder }
            : task
        ),
        columns: state.columns.map((column) => {
          if (column.id === oldColumnId) {
            return {
              ...column,
              taskIds: column.taskIds.filter((id) => id !== taskId),
            };
          }
          if (column.id === newColumnId) {
            const newTaskIds = [...column.taskIds];
            if (!newTaskIds.includes(taskId)) {
              newTaskIds.splice(newOrder, 0, taskId);
            }
            return { ...column, taskIds: newTaskIds };
          }
          return column;
        }),
      };
    }

    case "REORDER_TASK": {
      const { taskId: reorderTaskId, newOrder: reorderNewOrder } =
        action.payload;
      const taskToReorder = state.tasks.find(
        (task) => task.id === reorderTaskId
      );
      if (!taskToReorder) return state;

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === reorderTaskId ? { ...task, order: reorderNewOrder } : task
        ),
        columns: state.columns.map((column) => {
          if (column.id === taskToReorder.columnId) {
            const newTaskIds = column.taskIds.filter(
              (id) => id !== reorderTaskId
            );
            newTaskIds.splice(reorderNewOrder, 0, reorderTaskId);
            return { ...column, taskIds: newTaskIds };
          }
          return column;
        }),
      };
    }

    default:
      return state;
  }
};

interface BoardProviderProps {
  children: ReactNode;
}

export const BoardProvider: React.FC<BoardProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const [searchFilters, setSearchFilters] =
    React.useState<SearchFilters>(initialSearchFilters);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      dispatch({ type: "SET_STATE", payload: savedData });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage(state);
    }
  }, [state, isLoaded]);

  const createBoard = (
    title: string,
    description: string,
    createdBy: string
  ) => {
    const newBoard: Board = {
      id: generateId(),
      title,
      description,
      createdBy,
      createdAt: new Date().toISOString(),
      columnIds: [],
    };
    dispatch({ type: "CREATE_BOARD", payload: newBoard });
  };

  const deleteBoard = (boardId: string) => {
    dispatch({ type: "DELETE_BOARD", payload: boardId });
  };

  const setCurrentBoard = (boardId: string | null) => {
    dispatch({ type: "SET_CURRENT_BOARD", payload: boardId });
  };

  const createColumn = (title: string, boardId: string) => {
    const newColumn: Column = {
      id: generateId(),
      title,
      boardId,
      order: state.columns.filter((col) => col.boardId === boardId).length,
      taskIds: [],
    };
    dispatch({ type: "CREATE_COLUMN", payload: newColumn });
  };

  const updateColumn = (columnId: string, title: string) => {
    dispatch({ type: "UPDATE_COLUMN", payload: { columnId, title } });
  };

  const deleteColumn = (columnId: string) => {
    dispatch({ type: "DELETE_COLUMN", payload: columnId });
  };

  const createTask = (taskData: Omit<Task, "id" | "createdAt" | "order">) => {
    const columnTasks = state.tasks.filter(
      (task) => task.columnId === taskData.columnId
    );
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      order: columnTasks.length,
    };
    dispatch({ type: "CREATE_TASK", payload: newTask });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: "UPDATE_TASK", payload: { taskId, updates } });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: "DELETE_TASK", payload: taskId });
  };

  const moveTask = (taskId: string, newColumnId: string, newOrder: number) => {
    dispatch({ type: "MOVE_TASK", payload: { taskId, newColumnId, newOrder } });
  };

  const reorderTask = (taskId: string, newOrder: number) => {
    dispatch({ type: "REORDER_TASK", payload: { taskId, newOrder } });
  };

  const contextValue: BoardContextType = {
    state,
    createBoard,
    deleteBoard,
    setCurrentBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
    searchFilters,
    setSearchFilters,
  };

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = (): BoardContextType => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
};
