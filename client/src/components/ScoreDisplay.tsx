import { cn } from "@/lib/utils";

interface Player {
  name: string;
  score: number;
}

interface ScoreDisplayProps {
  players: Player[];
  currentPlayerIndex: number;
  tilesRemaining: number;
}

export function ScoreDisplay({ players, currentPlayerIndex, tilesRemaining }: ScoreDisplayProps) {
  return (
    <div className="space-y-4" data-testid="score-display">
      <div className="flex gap-4">
        {players.map((player, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 rounded-lg border p-4 transition-all",
              index === currentPlayerIndex
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-card-border bg-card"
            )}
            data-testid={`player-${index}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className={cn(
                  "text-sm font-medium",
                  index === currentPlayerIndex ? "text-primary" : "text-muted-foreground"
                )}>
                  {player.name}
                  {index === currentPlayerIndex && (
                    <span className="ml-2 text-xs">(Your turn)</span>
                  )}
                </p>
                <p className="text-3xl font-bold text-foreground" data-testid={`score-${index}`}>
                  {player.score}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <span data-testid="tiles-remaining">
          Tiles remaining: <span className="font-semibold">{tilesRemaining}</span>
        </span>
      </div>
    </div>
  );
}
