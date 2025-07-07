import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useBoardContext } from '../contexts/BoardContext';
import { Priority, SearchFilters } from '../types';

const SearchAndFilter: React.FC = () => {
  const { searchFilters, setSearchFilters } = useBoardContext();

  const handleSearchChange = (searchTerm: string) => {
    setSearchFilters({ ...searchFilters, searchTerm });
  };

  const handlePriorityChange = (priority: Priority | 'all') => {
    setSearchFilters({ ...searchFilters, priority });
  };

  const handleDueDateChange = (dueDateFilter: SearchFilters['dueDateFilter']) => {
    setSearchFilters({ ...searchFilters, dueDateFilter });
  };

  const clearFilters = () => {
    setSearchFilters({
      searchTerm: '',
      priority: 'all',
      dueDateFilter: 'all',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchFilters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={searchFilters.priority}
              onChange={(e) => handlePriorityChange(e.target.value as Priority | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <select
            value={searchFilters.dueDateFilter}
            onChange={(e) => handleDueDateChange(e.target.value as SearchFilters['dueDateFilter'])}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="all">All Due Dates</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="week">Due This Week</option>
          </select>
          
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;