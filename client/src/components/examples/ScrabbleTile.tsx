import { ScrabbleTile } from '../ScrabbleTile';

export default function ScrabbleTileExample() {
  const sampleTiles = [
    { letter: 'A', points: 1, id: '1' },
    { letter: 'Q', points: 8, id: '2' },
    { letter: 'Ñ', points: 8, id: '3' },
  ];

  return (
    <div className="flex gap-4 p-6">
      {sampleTiles.map(tile => (
        <ScrabbleTile key={tile.id} tile={tile} />
      ))}
    </div>
  );
}
