import React from 'react';
import GameCard from '../components/GameCard';
import TicTacToeIcon from '../components/icons/TicTacToeIcon';
import ChessIcon from '../components/icons/ChessIcon';

const HomePage = () => {
  return (
    <div className="text-center w-full max-w-md">
      <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
        Game Hub
      </h1>
      <p className="text-slate-400 mb-12">Select a game to begin your challenge.</p>
      
      <div className="space-y-6">
        <GameCard
          title="Tic Tac Toe"
          description="Classic Xs and Os. Play against AI or a friend."
          icon={<TicTacToeIcon />}
          path="/tic-tac-toe"
          color="110, 231, 183" // Emerald-300
        />
        <GameCard
          title="Chess"
          description="The ultimate strategy game. Challenge our AI."
          icon={<ChessIcon />}
          path="/chess"
          color="244, 114, 182" // Pink-400
        />
      </div>
    </div>
  );
};

export default HomePage;