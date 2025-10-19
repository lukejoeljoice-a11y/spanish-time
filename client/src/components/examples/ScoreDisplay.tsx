import { ScoreDisplay } from '../ScoreDisplay';

export default function ScoreDisplayExample() {
  const players = [
    { name: 'Jugador 1', score: 124 },
    { name: 'Jugador 2', score: 98 },
  ];

  return (
    <div className="p-6 max-w-2xl">
      <ScoreDisplay 
        players={players} 
        currentPlayerIndex={0} 
        tilesRemaining={42}
      />
    </div>
  );
}
