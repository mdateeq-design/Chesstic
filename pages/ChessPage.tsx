import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import { useSounds } from '../hooks/useSounds';

// --- Simplified chess logic inspired by chess.js ---
const PAWN = 'p', KNIGHT = 'n', BISHOP = 'b', ROOK = 'r', QUEEN = 'q', KING = 'k';
const WHITE = 'w', BLACK = 'b';
const initialBoard = () => [
  { type: ROOK, color: BLACK }, { type: KNIGHT, color: BLACK }, { type: BISHOP, color: BLACK }, { type: QUEEN, color: BLACK }, { type: KING, color: BLACK }, { type: BISHOP, color: BLACK }, { type: KNIGHT, color: BLACK }, { type: ROOK, color: BLACK },
  { type: PAWN, color: BLACK }, { type: PAWN, color: BLACK }, { type: PAWN, color: BLACK }, { type: PAWN, color: BLACK }, { type: PAWN, color: BLACK }, { type: PAWN, color: BLACK }, { type: PAWN, color: BLACK }, { type: PAWN, color: BLACK },
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  { type: PAWN, color: WHITE }, { type: PAWN, color: WHITE }, { type: PAWN, color: WHITE }, { type: PAWN, color: WHITE }, { type: PAWN, color: WHITE }, { type: PAWN, color: WHITE }, { type: PAWN, color: WHITE }, { type: PAWN, color: WHITE },
  { type: ROOK, color: WHITE }, { type: KNIGHT, color: WHITE }, { type: BISHOP, color: WHITE }, { type: QUEEN, color: WHITE }, { type: KING, color: WHITE }, { type: BISHOP, color: WHITE }, { type: KNIGHT, color: WHITE }, { type: ROOK, color: WHITE },
];

const PIECE_UNICODE = {
    w: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' },
    b: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' },
};
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const ChessPage = () => {
    const [board, setBoard] = useState(initialBoard());
    const [turn, setTurn] = useState(WHITE);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [winner, setWinner] = useState(null);
    const [message, setMessage] = useState("White's turn.");
    const { playSound } = useSounds();
    const gameEnded = useRef(false);

    useEffect(() => {
        if (winner && !gameEnded.current) {
            playSound(winner === WHITE ? 'win' : 'lose');
            gameEnded.current = true;
        }
    }, [winner, playSound]);

    const getValidMoves = (sq, currentBoard) => {
        const piece = currentBoard[sq];
        if (!piece) return [];
        const moves = [];
        const row = Math.floor(sq / 8);
        const col = sq % 8;

        const addMove = (r, c) => {
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const destSq = r * 8 + c;
                const destPiece = currentBoard[destSq];
                if (!destPiece || destPiece.color !== piece.color) {
                    moves.push(destSq);
                }
            }
        };

        switch (piece.type) {
            case PAWN:
                const dir = piece.color === WHITE ? -1 : 1;
                const startRow = piece.color === WHITE ? 6 : 1;
                // Move forward
                if (!currentBoard[(row + dir) * 8 + col]) {
                    moves.push((row + dir) * 8 + col);
                    if (row === startRow && !currentBoard[(row + 2 * dir) * 8 + col]) {
                        moves.push((row + 2 * dir) * 8 + col);
                    }
                }
                // Captures
                [-1, 1].forEach(cDir => {
                    if (col + cDir >= 0 && col + cDir < 8) {
                      const dest = currentBoard[(row + dir) * 8 + (col + cDir)];
                      if (dest && dest.color !== piece.color) moves.push((row + dir) * 8 + (col + cDir));
                    }
                });
                break;
            case KNIGHT:
                [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => addMove(row + dr, col + dc));
                break;
            case ROOK:
            case BISHOP:
            case QUEEN:
                const directions = {
                    [ROOK]: [[-1, 0], [1, 0], [0, -1], [0, 1]],
                    [BISHOP]: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
                    [QUEEN]: [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
                }[piece.type];

                directions.forEach(([dr, dc]) => {
                    for (let i = 1; i < 8; i++) {
                        const r = row + i * dr;
                        const c = col + i * dc;
                        if (r < 0 || r >= 8 || c < 0 || c >= 8) break;
                        const destSq = r * 8 + c;
                        const destPiece = currentBoard[destSq];
                        if (destPiece) {
                            if (destPiece.color !== piece.color) moves.push(destSq);
                            break;
                        }
                        moves.push(destSq);
                    }
                });
                break;
            case KING:
                [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]].forEach(([dr,dc]) => addMove(row+dr, col+dc));
                break;
        }
        return moves;
    };
    
    const validMoves = useMemo(() => selectedSquare !== null ? getValidMoves(selectedSquare, board) : [], [selectedSquare, board]);

    const makeMove = (from, to, currentBoard) => {
        const isCapture = !!currentBoard[to];
        const newBoard = [...currentBoard];
        const piece = newBoard[from];
        newBoard[to] = piece;
        newBoard[from] = null;

        // Pawn promotion to Queen
        const row = Math.floor(to / 8);
        if (piece.type === PAWN && (row === 0 || row === 7)) {
            newBoard[to] = { ...piece, type: QUEEN };
        }
        
        playSound(isCapture ? 'capture' : 'move');
        return newBoard;
    };

    const handleSquareClick = (index) => {
        if (winner || turn !== WHITE) return;

        if (selectedSquare === null) {
            if (board[index] && board[index].color === turn) {
                setSelectedSquare(index);
                playSound('click');
            }
        } else {
            if (validMoves.includes(index)) {
                const newBoard = makeMove(selectedSquare, index, board);
                
                const kingStillExists = newBoard.some(p => p && p.type === KING && p.color === BLACK);
                if (!kingStillExists) {
                    setWinner(WHITE);
                    setMessage(`White wins by capturing the king!`);
                } else {
                    setTurn(BLACK);
                    setMessage(`Black's turn.`);
                }
                
                setBoard(newBoard);
            }
            setSelectedSquare(null);
        }
    };

    const handleReset = () => {
        playSound('click');
        gameEnded.current = false;
        setBoard(initialBoard());
        setTurn(WHITE);
        setSelectedSquare(null);
        setWinner(null);
        setMessage("White's turn.");
    };

    // AI Logic
    useEffect(() => {
        if (turn === BLACK && !winner) {
            const timeoutId = setTimeout(() => {
                playSound('notify');
                const allBlackMoves = [];
                board.forEach((piece, sq) => {
                    if (piece && piece.color === BLACK) {
                        const moves = getValidMoves(sq, board);
                        moves.forEach(move => {
                            allBlackMoves.push({ from: sq, to: move });
                        });
                    }
                });

                if (allBlackMoves.length > 0) {
                    // Very simple AI: prefer captures, then random
                    const captureMoves = allBlackMoves.filter(m => board[m.to] && board[m.to].color === WHITE);
                    const move = captureMoves.length > 0 ? captureMoves[Math.floor(Math.random() * captureMoves.length)] : allBlackMoves[Math.floor(Math.random() * allBlackMoves.length)];
                    
                    const newBoard = makeMove(move.from, move.to, board);

                    const kingStillExists = newBoard.some(p => p && p.type === KING && p.color === WHITE);
                    if (!kingStillExists) {
                        setWinner(BLACK);
                        setMessage("Black wins by capturing the king!");
                    } else {
                        setTurn(WHITE);
                        setMessage("White's turn.");
                    }
                    setBoard(newBoard);
                } else {
                    // Stalemate or Checkmate
                    setMessage("Game over. Black has no moves.");
                    setWinner('draw'); // simple stalemate
                }
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [turn, winner, board, playSound]);

    return (
        <div className="flex flex-col items-center justify-center w-full p-4 h-full">
            <div className="absolute top-4 left-4">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800">
                <ArrowLeftIcon />
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">Chess</h1>
            <p className="text-xl text-slate-300 mb-6 h-7">{message}</p>
            
            <div className="w-full max-w-[calc(100vh-16rem)] sm:max-w-lg md:max-w-xl aspect-square">
              <div className="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] w-full h-full">
                <div className="grid grid-rows-8 pr-2 text-slate-400 text-sm sm:text-base">{RANKS.map(r => <div key={r} className="flex items-center justify-center">{r}</div>)}</div>
                
                <div className="grid grid-cols-8 grid-rows-8 shadow-2xl">
                    {board.map((piece, index) => {
                        const row = Math.floor(index / 8);
                        const col = index % 8;
                        const isLight = (row + col) % 2 === 0;
                        const isSelected = selectedSquare === index;
                        const isPossibleMove = validMoves.includes(index);
                        return (
                            <div 
                                key={index} 
                                onClick={() => handleSquareClick(index)}
                                className={`w-full h-full flex items-center justify-center relative cursor-pointer ${isLight ? 'bg-slate-500' : 'bg-slate-800'}`}
                            >
                                <span className="text-4xl sm:text-5xl lg:text-6xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    {piece ? PIECE_UNICODE[piece.color][piece.type] : ''}
                                </span>
                                {isSelected && <div className="absolute inset-0 ring-4 ring-yellow-400 z-10"></div>}
                                {isPossibleMove && (
                                  <div className="absolute w-full h-full flex items-center justify-center">
                                    <div className="w-1/3 h-1/3 rounded-full bg-slate-50 opacity-40"></div>
                                  </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div></div>
                <div className="grid grid-cols-8 pt-2 text-slate-400 text-sm sm:text-base">{FILES.map(f => <div key={f} className="flex items-center justify-center">{f}</div>)}</div>
              </div>
            </div>

            {(winner) && (
                <div className="mt-8 text-center">
                    <button onClick={handleReset} className="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold transition-colors duration-300 shadow-[0_0_10px_rgba(219,39,119,0.5)]">
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChessPage;