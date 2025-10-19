import { cn } from "@/lib/utils";
import { ScrabbleTile, type TileData } from "./ScrabbleTile";

export type SquareType = "normal" | "DL" | "TL" | "DW" | "TW" | "center";

interface BoardSquareProps {
  type: SquareType;
  tile: TileData | null;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onTileDragStart?: (e: React.DragEvent) => void;
  tileDraggable?: boolean;
  row: number;
  col: number;
}

const squareLabels = {
  DL: "DOUBLE LETTER",
  TL: "TRIPLE LETTER",
  DW: "DOUBLE WORD",
  TW: "TRIPLE WORD",
  center: "★",
};

export function BoardSquare({ type, tile, onDrop, onDragOver, onTileDragStart, tileDraggable = false, row, col }: BoardSquareProps) {
  const squareColors = {
    normal: "bg-board-base",
    DL: "bg-special-dl",
    TL: "bg-special-tl",
    DW: "bg-special-dw",
    TW: "bg-special-tw",
    center: "bg-special-dw",
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={cn(
        "relative flex items-center justify-center border border-board-grid",
        "w-12 h-12",
        squareColors[type],
        !tile && "transition-colors hover-elevate"
      )}
      data-testid={`square-${row}-${col}`}
    >
      {!tile && type !== "normal" && (
        <span className={cn(
          "text-[7px] sm:text-[8px] font-semibold text-center leading-tight px-0.5",
          type === "TL" || type === "TW" ? "text-white" : "text-foreground/60"
        )}>
          {squareLabels[type]}
        </span>
      )}
      {tile && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ScrabbleTile tile={tile} draggable={tileDraggable} onDragStart={onTileDragStart} size="small" />
        </div>
      )}
    </div>
  );
}
