import { GameControls } from '../GameControls';

export default function GameControlsExample() {
  return (
    <div className="p-6 max-w-md">
      <GameControls
        onPlayWord={() => console.log('Play word')}
        onShuffleTiles={() => console.log('Shuffle tiles')}
        onPassTurn={() => console.log('Pass turn')}
        onNewGame={() => console.log('New game')}
        onShareLink={() => console.log('Share link')}
      />
    </div>
  );
}
