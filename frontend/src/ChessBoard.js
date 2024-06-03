import React from 'react';
import { Chess } from 'chess.js';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const PieceTypes = {
  PIECE: 'piece',
};

function ChessBoard({ fen, playerTurn, legalMoves, onMove }) {
  const [game, setGame] = React.useState(new Chess(fen));
  const [board, setBoard] = React.useState(game.board());

  React.useEffect(() => {
    game.load(fen);
    setBoard(game.board());
  }, [fen, game]);

  const isValidMove = (from, to) => {
    // Implement logic to check if the move is valid
    // This could involve using the chess.js library methods
    return true; // Placeholder return value
  };

  const handleDrop = (from, to) => {
    const move = `${from}${to}`;
    if (legalMoves.includes(move) && isValidMove(from, to)) {
      onMove(move); // Notify parent component to send the move to the server
      // Update game state locally
      const updatedGame = game.move(move);
      setGame(updatedGame);
      setBoard(updatedGame.board());
      // Assuming the server updates the game status and player turn
      // You would need to fetch the updated game state from the server
    }
  };

  const Square = ({ piece, position }) => {
    const [{ isDragging }, drag] = useDrag({
      type: PieceTypes.PIECE,
      item: { position },
      canDrag: piece && (piece.color === playerTurn.toLowerCase()),
      collect: (monitor) => ({
        isDragging:!!monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: PieceTypes.PIECE,
      drop: (item) => handleDrop(item.position, position),
    });

    const squareColor = (position[1] % 2 === position[0].charCodeAt(0) % 2)? 'light-cell' : 'dark-cell';
    const pieceImage = piece? `${process.env.PUBLIC_URL}/pieces/${piece.color}${piece.type.toUpperCase()}.png` : '';

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`board-cell ${squareColor} ${isDragging? 'selected' : ''}`}
      >
        {piece && <img src={pieceImage} alt={`${piece.color}${piece.type}`} className="chess-piece" />}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="chessboard">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((square, squareIndex) => {
              const piece = square? { color: square.color, type: square.type } : null;
              const position = `${String.fromCharCode(97 + squareIndex)}${8 - rowIndex}`;
              return (
                <Square
                  key={squareIndex}
                  piece={piece}
                  position={position}
                />
              );
            })}
          </div>
        ))}
      </div>
    </DndProvider>
  );
}

export default ChessBoard;