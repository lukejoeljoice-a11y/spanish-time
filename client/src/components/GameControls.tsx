import { Button } from "@/components/ui/button";
import { Shuffle, RotateCcw, Share2, Play } from "lucide-react";

interface GameControlsProps {
  onPlayWord: () => void;
  onShuffleTiles: () => void;
  onPassTurn: () => void;
  onNewGame: () => void;
  onShareLink: () => void;
  isPlayDisabled?: boolean;
}

export function GameControls({
  onPlayWord,
  onShuffleTiles,
  onPassTurn,
  onNewGame,
  onShareLink,
  isPlayDisabled = false,
}: GameControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={onPlayWord} 
          disabled={isPlayDisabled}
          className="flex-1 min-w-[140px]"
          data-testid="button-play-word"
        >
          <Play className="w-4 h-4 mr-2" />
          Play Word
        </Button>
        <Button 
          variant="outline" 
          onClick={onShuffleTiles}
          data-testid="button-shuffle"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle
        </Button>
        <Button 
          variant="outline" 
          onClick={onPassTurn}
          data-testid="button-pass"
        >
          Pass Turn
        </Button>
      </div>
      
      <div className="flex gap-2 pt-2 border-t border-border">
        <Button 
          variant="secondary" 
          onClick={onNewGame}
          className="flex-1"
          data-testid="button-new-game"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
        <Button 
          variant="secondary" 
          onClick={onShareLink}
          data-testid="button-share"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Link
        </Button>
      </div>
    </div>
  );
}
