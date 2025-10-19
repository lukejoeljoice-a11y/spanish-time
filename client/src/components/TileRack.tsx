import { ScrabbleTile, type TileData } from "./ScrabbleTile";
import { cn } from "@/lib/utils";

interface TileRackProps {
  tiles: (TileData | null)[];
  onTileDragStart: (index: number, e: React.DragEvent) => void;
  onTileDrop?: (index: number, e: React.DragEvent) => void;
  className?: string;
}

export function TileRack({ tiles, onTileDragStart, onTileDrop, className }: TileRackProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className={cn("flex gap-2 p-4 rounded-lg bg-card border border-card-border shadow-sm", className)}
      data-testid="tile-rack"
    >
      {tiles.map((tile, index) => (
        <div
          key={index}
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded bg-muted/30"
          onDrop={onTileDrop ? (e) => onTileDrop(index, e) : undefined}
          onDragOver={handleDragOver}
          data-testid={`rack-slot-${index}`}
        >
          {tile && (
            <ScrabbleTile
              tile={tile}
              onDragStart={(e) => onTileDragStart(index, e)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
