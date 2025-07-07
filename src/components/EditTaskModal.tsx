import React, { useState, useEffect } from 'react';
import { useBoardContext } from '../contexts/BoardContext';
import { Task, Priority } from '../types';
import Modal from './Modal';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const { updateTask } = useBoardContext();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setCreatedBy(task.createdBy);
      setPriority(task.priority);
      setDueDate(task.dueDate);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task && title.trim() && createdBy.trim() && dueDate) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        createdBy: createdBy.trim(),
        priority,
        dueDate,
      });
      onClose();
    }
  };

  const handleClose = () => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setCreatedBy(task.createdBy);
      setPriority(task.priority);
      setDueDate(task.dueDate);
    }
    onClose();
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="editTaskTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="editTaskTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task title"
            required
          />
        </div>
        
        <div>
          <label htmlFor="editTaskDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="editTaskDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Enter task description"
          />
        </div>
        
        <div>
          <label htmlFor="editTaskCreatedBy" className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To *
          </label>
          <input
            type="text"
            id="editTaskCreatedBy"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter assignee name"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="editTaskPriority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              id="editTaskPriority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="editTaskDueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              id="editTaskDueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={minDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Task
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;