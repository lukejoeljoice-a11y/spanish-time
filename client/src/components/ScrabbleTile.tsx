import { cn } from "@/lib/utils";

export interface TileData {
  letter: string;
  points: number;
  id: string;
}

interface ScrabbleTileProps {
  tile: TileData | null;
  onDragStart?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  draggable?: boolean;
  size?: "small" | "normal";
  className?: string;
}

export function ScrabbleTile({ 
  tile, 
  onDragStart, 
  onDrop,
  onDragOver,
  draggable = true,
  size = "normal",
  className 
}: ScrabbleTileProps) {
  if (!tile) return null;

  const sizeClasses = size === "small" 
    ? "w-10 h-10 text-lg" 
    : "w-12 h-12 text-2xl sm:w-14 sm:h-14";

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={cn(
        "relative flex items-center justify-center rounded-md bg-tile font-bold uppercase select-none",
        "shadow-md transition-transform",
        draggable && "cursor-grab active:cursor-grabbing hover:-translate-y-0.5",
        sizeClasses,
        className
      )}
      data-testid={`tile-${tile.letter}`}
    >
      <span className="text-tile-text">{tile.letter}</span>
      <span className="absolute bottom-0.5 right-1 text-[10px] text-tile-text/70">
        {tile.points}
      </span>
    </div>
  );
}
