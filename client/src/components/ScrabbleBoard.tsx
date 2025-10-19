import { BoardSquare, type SquareType } from "./BoardSquare";
import { type TileData } from "./ScrabbleTile";

interface ScrabbleBoardProps {
  tiles: (TileData | null)[][];
  onSquareDrop: (row: number, col: number, e: React.DragEvent) => void;
  onBoardTileDragStart?: (row: number, col: number, e: React.DragEvent) => void;
  recentlyPlacedTiles?: { row: number; col: number }[];
}

const boardLayout: SquareType[][] = [
  ["TW", "normal", "normal", "DL", "normal", "normal", "normal", "TW", "normal", "normal", "normal", "DL", "normal", "normal", "TW"],
  ["normal", "DW", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "DW", "normal"],
  ["normal", "normal", "DW", "normal", "normal", "normal", "DL", "normal", "DL", "normal", "normal", "normal", "DW", "normal", "normal"],
  ["DL", "normal", "normal", "DW", "normal", "normal", "normal", "DL", "normal", "normal", "normal", "DW", "normal", "normal", "DL"],
  ["normal", "normal", "normal", "normal", "DW", "normal", "normal", "normal", "normal", "normal", "DW", "normal", "normal", "normal", "normal"],
  ["normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal"],
  ["normal", "normal", "DL", "normal", "normal", "normal", "DL", "normal", "DL", "normal", "normal", "normal", "DL", "normal", "normal"],
  ["TW", "normal", "normal", "DL", "normal", "normal", "normal", "center", "normal", "normal", "normal", "DL", "normal", "normal", "TW"],
  ["normal", "normal", "DL", "normal", "normal", "normal", "DL", "normal", "DL", "normal", "normal", "normal", "DL", "normal", "normal"],
  ["normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal"],
  ["normal", "normal", "normal", "normal", "DW", "normal", "normal", "normal", "normal", "normal", "DW", "normal", "normal", "normal", "normal"],
  ["DL", "normal", "normal", "DW", "normal", "normal", "normal", "DL", "normal", "normal", "normal", "DW", "normal", "normal", "DL"],
  ["normal", "normal", "DW", "normal", "normal", "normal", "DL", "normal", "DL", "normal", "normal", "normal", "DW", "normal", "normal"],
  ["normal", "DW", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "DW", "normal"],
  ["TW", "normal", "normal", "DL", "normal", "normal", "normal", "TW", "normal", "normal", "normal", "DL", "normal", "normal", "TW"],
];

export function ScrabbleBoard({ tiles, onSquareDrop, onBoardTileDragStart, recentlyPlacedTiles = [] }: ScrabbleBoardProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="inline-block rounded-lg border-4 border-board-grid shadow-xl bg-board-base p-1.5"
      data-testid="scrabble-board"
    >
      <div 
        className="grid gap-0" 
        style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(15, 48px)',
          gridTemplateRows: 'repeat(15, 48px)',
        }}
      >
        {boardLayout.map((row, rowIndex) =>
          row.map((squareType, colIndex) => {
            const isRecentlyPlaced = recentlyPlacedTiles.some(t => t.row === rowIndex && t.col === colIndex);
            return (
              <BoardSquare
                key={`${rowIndex}-${colIndex}`}
                type={squareType}
                tile={tiles[rowIndex][colIndex]}
                row={rowIndex}
                col={colIndex}
                onDrop={(e) => onSquareDrop(rowIndex, colIndex, e)}
                onDragOver={handleDragOver}
                onTileDragStart={isRecentlyPlaced && onBoardTileDragStart ? (e) => onBoardTileDragStart(rowIndex, colIndex, e) : undefined}
                tileDraggable={isRecentlyPlaced}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
