import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Column as ColumnType, Task as TaskType } from "../types";
import { useBoardContext } from "../contexts/BoardContext";
import Task from "./Task";
import CreateTaskModal from "./CreateTaskModal";

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onEditTask: (task: TaskType) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onEditTask,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
}) => {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const { updateColumn, deleteColumn } = useBoardContext();

  const handleUpdateTitle = () => {
    if (newTitle.trim() && newTitle !== column.title) {
      updateColumn(column.id, newTitle.trim());
    }
    setIsEditingTitle(false);
    setNewTitle(column.title);
  };

  const handleDeleteColumn = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this column? All tasks in this column will be deleted."
      )
    ) {
      deleteColumn(column.id);
    }
    setShowMenu(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateTitle();
    }
    if (e.key === "Escape") {
      setIsEditingTitle(false);
      setNewTitle(column.title);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 min-h-[600px] w-80 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={handleKeyPress}
              className="text-lg font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          ) : (
            <h2 className="text-lg font-semibold text-gray-900">
              {column.title}
            </h2>
          )}
          <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>

        <div className="relative flex gap-1">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDeleteColumn}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
          >
            <Trash2 size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => {
                  setIsEditingTitle(true);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={handleDeleteColumn}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, column.id)}
        className="min-h-[500px] space-y-3"
      >
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}

        <button
          onClick={() => setIsCreateTaskModalOpen(true)}
          className="w-full p-4 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        columnId={column.id}
      />
    </div>
  );
};

export default Column;
