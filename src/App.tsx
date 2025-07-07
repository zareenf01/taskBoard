import React from 'react';
import { BoardProvider, useBoardContext } from './contexts/BoardContext';
import BoardView from './components/BoardView';
import BoardDetail from './components/BoardDetail';

const AppContent: React.FC = () => {
  const { state, setCurrentBoard } = useBoardContext();

  const handleSelectBoard = (boardId: string) => {
    setCurrentBoard(boardId);
  };

  const handleBackToBoards = () => {
    setCurrentBoard(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {state.currentBoardId ? (
        <BoardDetail 
          boardId={state.currentBoardId} 
          onBack={handleBackToBoards}
        />
      ) : (
        <BoardView onSelectBoard={handleSelectBoard} />
      )}
    </div>
  );
};

function App() {
  return (
    <BoardProvider>
      <AppContent />
    </BoardProvider>
  );
}

export default App;