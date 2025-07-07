import React, { useState } from 'react';
import { useBoardContext } from '../contexts/BoardContext';
import { Priority } from '../types';
import Modal from './Modal';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, columnId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const { createTask } = useBoardContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && createdBy.trim() && dueDate) {
      createTask({
        title: title.trim(),
        description: description.trim(),
        createdBy: createdBy.trim(),
        priority,
        dueDate,
        columnId,
      });
      setTitle('');
      setDescription('');
      setCreatedBy('');
      setPriority('medium');
      setDueDate('');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setCreatedBy('');
    setPriority('medium');
    setDueDate('');
    onClose();
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="taskTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task title"
            required
          />
        </div>
        
        <div>
          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="taskDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Enter task description"
          />
        </div>
        
        <div>
          <label htmlFor="taskCreatedBy" className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To *
          </label>
          <input
            type="text"
            id="taskCreatedBy"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter assignee name"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              id="taskPriority"
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
            <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              id="taskDueDate"
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
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;