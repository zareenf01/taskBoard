import React, { useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { useBoardContext } from "../contexts/BoardContext";
import { formatDate } from "../localStorage";
import CreateBoardModal from "./CreateBoardModal";

interface BoardViewProps {
  onSelectBoard: (boardId: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ onSelectBoard }) => {
  const { state, deleteBoard } = useBoardContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleDeleteBoard = (boardId: string, boardTitle: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${boardTitle}"? This action cannot be undone.`
      )
    ) {
      deleteBoard(boardId);
    }
  };

  const getColumnCount = (boardId: string) => {
    return state.columns.filter((col) => col.boardId === boardId).length;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Task Boards
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Organize your projects and collaborate with your team using our
          intuitive task board system
        </p>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Create New Board
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6">
        {state.boards.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              No boards yet
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Create your first board to start organizing your tasks and
              collaborating with your team.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Create Your First Board
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700 uppercase tracking-wide">
                <div>Board Name</div>
                <div>Description</div>
                <div>Created By</div>
                <div>Created Date</div>
                <div>Columns</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {state.boards.map((board) => (
                <div
                  key={board.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* Board Name */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${getAvatarColor(
                          board.title
                        )} flex items-center justify-center text-white font-medium`}
                      >
                        {getInitials(board.title)}
                      </div>
                      <span className="font-medium text-gray-900">
                        {board.title}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="text-gray-600 text-sm">
                      {board.description || "-"}
                    </div>

                    {/* Created By */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full ${getAvatarColor(
                          board.createdBy
                        )} flex items-center justify-center text-white text-sm font-medium`}
                      >
                        {getInitials(board.createdBy)}
                      </div>
                      <span className="text-gray-700 text-sm">
                        {board.createdBy}
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="text-gray-600 text-sm">
                      {formatDate(board.createdAt)}
                    </div>

                    {/* Columns */}
                    <div className="text-purple-600 text-sm font-medium">
                      {getColumnCount(board.id)} columns
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectBoard(board.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Board
                      </button>
                      <button
                        onClick={() => handleDeleteBoard(board.id, board.title)}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Avatar in bottom left */}
      <div className="fixed bottom-6 left-6">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
          N
        </div>
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default BoardView;
