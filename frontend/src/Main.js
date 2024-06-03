import React, { useEffect, useState } from 'react';
import './styles.css';
import ChessBoard from './ChessBoard'; // Import the ChessBoard component

function Main() {
  const [gameStatus, setGameStatus] = useState('waiting');
  const [fen, setFen] = useState('');
  const [playerTurn, setPlayerTurn] = useState('');
  const [legalMoves, setLegalMoves] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const wsUrl = `ws://localhost:8000/play?token=${token}`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.status === 'waiting') {
        setGameStatus('waiting');
      } else {
        setGameStatus('playing');
        setFen(data.fen);
        setPlayerTurn(data.player_turn);
        setLegalMoves(data.legal_moves);
        console.log(data.fen);
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleMove = (move) => {
    if (socket) {
      socket.send(JSON.stringify({ move }));
    }
  };

  return (
    <div className="main-container">
      {gameStatus === 'playing' && (
        <ChessBoard fen={fen} playerTurn={playerTurn} legalMoves={legalMoves} onMove={handleMove} />
      )}
    </div>
  );
}

export default Main;
