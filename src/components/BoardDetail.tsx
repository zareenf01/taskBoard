import React, { useState, useMemo } from "react";
import { ArrowLeft, Plus, Search, Columns3 } from "lucide-react";
import { useBoardContext } from "../contexts/BoardContext";
import { Task as TaskType } from "../types";
import { isOverdue, isToday, isThisWeek } from "../localStorage";
import Column from "./Column";
import CreateColumnModal from "./CreateColumnModal";
import EditTaskModal from "./EditTaskModal";

interface BoardDetailProps {
  boardId: string;
  onBack: () => void;
}

const BoardDetail: React.FC<BoardDetailProps> = ({ boardId, onBack }) => {
  const { state, moveTask, searchFilters, setSearchFilters } =
    useBoardContext();
  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const board = state.boards.find((b) => b.id === boardId);
  const columns = state.columns
    .filter((c) => c.boardId === boardId)
    .sort((a, b) => a.order - b.order);

  const filteredTasks = useMemo(() => {
    let filtered = state.tasks.filter((task) =>
      columns.some((col) => col.id === task.columnId)
    );
    //search
    if (searchFilters.searchTerm) {
      const searchTerm = searchFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm)
      );
    }

    //prioriyt
    if (searchFilters.priority !== "all") {
      filtered = filtered.filter(
        (task) => task.priority === searchFilters.priority
      );
    }

    //due
    if (searchFilters.dueDateFilter !== "all") {
      filtered = filtered.filter((task) => {
        switch (searchFilters.dueDateFilter) {
          case "overdue":
            return isOverdue(task.dueDate);
          case "today":
            return isToday(task.dueDate);
          case "week":
            return isThisWeek(task.dueDate);
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [state.tasks, columns, searchFilters]);

  const getTasksForColumn = (columnId: string): TaskType[] => {
    return filteredTasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.order - b.order);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");

    if (taskId && taskId !== draggedTaskId) return;

    const task = state.tasks.find((t) => t.id === taskId);
    if (task && task.columnId !== columnId) {
      const targetColumnTasks = state.tasks.filter(
        (t) => t.columnId === columnId
      );
      moveTask(taskId, columnId, targetColumnTasks.length);
    }

    setDraggedTaskId(null);
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!board) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Board not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Boards</span>
          </button>

          <button
            onClick={() => setIsCreateColumnModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            <Plus size={16} />
            Add Column
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-2xl ${getAvatarColor(
              board.title
            )} flex items-center justify-center text-white font-bold text-xl`}
          >
            {getInitials(board.title)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{board.title}</h1>
            {board.description && (
              <p className="text-gray-600 mt-1">{board.description}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchFilters.searchTerm}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    searchTerm: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <select
              value={searchFilters.priority}
              onChange={(e) =>
                setSearchFilters({
                  ...searchFilters,
                  priority: e.target.value as any,
                })
              }
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none min-w-[140px]"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <input
              type="date"
              value=""
              onChange={() => {}}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="dd/mm/yyyy"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {columns.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Columns3 size={32} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              No columns yet
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Create your first column to start organizing your tasks. Try "To
              Do", "In Progress", or "Done".
            </p>
            <button
              onClick={() => setIsCreateColumnModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Create Your First Column
            </button>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={getTasksForColumn(column.id)}
                onEditTask={setEditingTask}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-6">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
          N
        </div>
      </div>

      <CreateColumnModal
        isOpen={isCreateColumnModalOpen}
        onClose={() => setIsCreateColumnModalOpen(false)}
        boardId={boardId}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />
    </div>
  );
};

export default BoardDetail;
