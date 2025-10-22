import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Player, CellValue } from '../types';
import { getStrategyTips } from '../services/geminiService';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import { useSounds } from '../hooks/useSounds';

type GameMode = 'menu' | 'ai' | 'player';

const calculateWinner = (squares: CellValue[]): { winner: Player | null, line: number[] | null } => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
};

const Cell: React.FC<{ value: CellValue; onClick: () => void, isWinning: boolean }> = ({ value, onClick, isWinning }) => (
    <button
        onClick={onClick}
        className={`w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-5xl font-bold rounded-lg transition-all duration-300 transform active:scale-90
        ${isWinning ? 'bg-emerald-500/30 text-emerald-300 scale-105' : 'bg-slate-800/70 hover:bg-slate-700/70'}
        ${value === 'X' ? 'text-cyan-400' : 'text-pink-400'}`}
    >
        {value}
    </button>
);

const TicTacToePage = () => {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [tips, setTips] = useState<string>('');
  const [isLoadingTips, setIsLoadingTips] = useState<boolean>(false);
  
  const { playSound } = useSounds();
  const gameEnded = useRef(false);

  const { winner, line: winningLine } = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  useEffect(() => {
    if (winner && !gameEnded.current) {
        playSound(winner === 'X' ? 'win' : 'lose');
        gameEnded.current = true;
    } else if (isDraw && !gameEnded.current) {
        playSound('lose');
        gameEnded.current = true;
    }
  }, [winner, isDraw, playSound]);

  const findBestMove = (currentBoard: CellValue[]): number => {
    for (let i = 0; i < 9; i++) { if (!currentBoard[i]) { const temp = [...currentBoard]; temp[i] = 'O'; if (calculateWinner(temp).winner === 'O') return i; } }
    for (let i = 0; i < 9; i++) { if (!currentBoard[i]) { const temp = [...currentBoard]; temp[i] = 'X'; if (calculateWinner(temp).winner === 'X') return i; } }
    if (!currentBoard[4]) return 4;
    const corners = [0, 2, 6, 8].filter(i => !currentBoard[i]);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    const empty = currentBoard.map((sq, i) => sq === null ? i : -1).filter(i => i !== -1);
    return empty[Math.floor(Math.random() * empty.length)];
  };

  const handleClick = (index: number) => {
    if (winner || board[index] || gameMode === 'menu') return;
    if (gameMode === 'ai' && !isXNext) return;

    playSound('move');
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };
  
  const handleReset = (fullReset = false) => {
    playSound('click');
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setTips('');
    gameEnded.current = false;
    if (fullReset) {
        setGameMode('menu');
    }
  };

  const handleModeSelect = (mode: GameMode) => {
    playSound('click');
    setGameMode(mode);
  }

  const handleGetTips = useCallback(async () => {
    playSound('click');
    setIsLoadingTips(true);
    const fetchedTips = await getStrategyTips('Tic Tac Toe');
    setTips(fetchedTips);
    setIsLoadingTips(false);
  }, [playSound]);

  useEffect(() => {
    if (gameMode === 'ai' && !isXNext && !winner && !isDraw) {
      const timeoutId = setTimeout(() => {
        playSound('notify');
        const aiMove = findBestMove(board);
        if (aiMove !== undefined) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
          playSound('move');
        }
      }, 600);
      return () => clearTimeout(timeoutId);
    }
  }, [isXNext, board, winner, isDraw, gameMode, playSound]);

  const getStatusMessage = () => {
    if (winner) return `Winner: ${winner}!`;
    if (isDraw) return "It's a draw!";
    return `Next player: ${isXNext ? 'X' : 'O'}`;
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Choose Mode</h1>
        <div className="space-y-4">
            <button onClick={() => handleModeSelect('ai')} className="w-64 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors duration-300 shadow-[0_0_10px_rgba(22,163,175,0.5)]">
                Play vs AI
            </button>
            <button onClick={() => handleModeSelect('player')} className="w-64 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold transition-colors duration-300 shadow-[0_0_10px_rgba(219,39,119,0.5)]">
                Play vs Player
            </button>
        </div>
    </div>
  );

  const renderGame = () => (
    <>
      <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Tic Tac Toe</h1>
      <p className="text-xl text-slate-300 mb-8 h-7">{getStatusMessage()}</p>
      
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
        {board.map((cell, index) => (
            <Cell key={index} value={cell} onClick={() => handleClick(index)} isWinning={winningLine?.includes(index) ?? false}/>
        ))}
      </div>

      {(winner || isDraw) && (
        <div className="flex flex-col items-center space-y-4">
            <button onClick={() => handleReset(false)} className="px-6 py-2 w-48 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-colors duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                Play Again
            </button>
            <button onClick={() => handleReset(true)} className="px-6 py-2 w-48 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold transition-colors duration-300">
                Change Mode
            </button>
        </div>
      )}

      <div className="mt-12 w-full max-w-md text-center">
          <button 
            onClick={handleGetTips} 
            disabled={isLoadingTips}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(147,51,234,0.5)]"
          >
              {isLoadingTips ? 'Thinking...' : 'Get Gemini Tips'}
          </button>
          {tips && (
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg text-left whitespace-pre-wrap">
                  <h3 className="font-bold mb-2 text-purple-300">Strategy Corner</h3>
                  <p className="text-slate-300 text-sm">{tips}</p>
              </div>
          )}
      </div>
    </>
  )

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 h-full">
      <div className="absolute top-4 left-4">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800">
            <ArrowLeftIcon />
          </Link>
      </div>
      {gameMode === 'menu' ? renderMenu() : renderGame()}
    </div>
  );
};

export default TicTacToePage;