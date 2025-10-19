import { TileRack } from '../TileRack';

export default function TileRackExample() {
  const tiles = [
    { letter: 'A', points: 1, id: '1' },
    { letter: 'B', points: 3, id: '2' },
    { letter: 'C', points: 3, id: '3' },
    null,
    { letter: 'E', points: 1, id: '5' },
    { letter: 'Ñ', points: 8, id: '6' },
    { letter: 'R', points: 1, id: '7' },
  ];

  const handleDragStart = (index: number, e: React.DragEvent) => {
    console.log('Drag started from index:', index);
  };

  return (
    <div className="p-6">
      <TileRack tiles={tiles} onTileDragStart={handleDragStart} />
    </div>
  );
}
