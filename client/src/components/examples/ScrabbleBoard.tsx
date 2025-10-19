import { ScrabbleBoard } from '../ScrabbleBoard';
import { useState } from 'react';

export default function ScrabbleBoardExample() {
  const [tiles] = useState(() => {
    const emptyBoard = Array(15).fill(null).map(() => Array(15).fill(null));
    emptyBoard[7][7] = { letter: 'H', points: 4, id: '1' };
    emptyBoard[7][8] = { letter: 'O', points: 1, id: '2' };
    emptyBoard[7][9] = { letter: 'L', points: 1, id: '3' };
    emptyBoard[7][10] = { letter: 'A', points: 1, id: '4' };
    return emptyBoard;
  });

  const handleDrop = (row: number, col: number, e: React.DragEvent) => {
    console.log(`Dropped tile at ${row}, ${col}`);
  };

  return (
    <div className="p-6 flex justify-center">
      <ScrabbleBoard tiles={tiles} onSquareDrop={handleDrop} />
    </div>
  );
}
