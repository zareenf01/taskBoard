import React from "react";
import { Calendar, User, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Task as TaskType } from "../types";
import { formatDate, isOverdue, isToday } from "../localStorage";
import { useBoardContext } from "../contexts/BoardContext";

interface TaskProps {
  task: TaskType;
  onEdit: (task: TaskType) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const Task: React.FC<TaskProps> = ({
  task,
  onEdit,
  onDragStart,
  onDragEnd,
}) => {
  const { deleteTask } = useBoardContext();

  const getPriorityColor = (priority: TaskType["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getDueDateColor = () => {
    if (isOverdue(task.dueDate)) {
      return "text-red-600";
    }
    if (isToday(task.dueDate)) {
      return "text-orange-600";
    }
    return "text-gray-600";
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
    }
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

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      className="bg-white rounded-xl border border-gray-200 p-4 cursor-move hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm flex-1 pr-2">
          {task.title}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority.toUpperCase()}
        </span>
        {isOverdue(task.dueDate) && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <AlertTriangle size={12} />
            OVERDUE
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full ${getAvatarColor(
              task.createdBy
            )} flex items-center justify-center text-white text-xs font-medium`}
          >
            {getInitials(task.createdBy)}
          </div>
          <span className="text-gray-600">{task.createdBy}</span>
        </div>
        <div className={`flex items-center gap-1 ${getDueDateColor()}`}>
          <Calendar size={12} />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default Task;
