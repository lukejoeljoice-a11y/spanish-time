import { BoardSquare } from '../BoardSquare';

export default function BoardSquareExample() {
  return (
    <div className="flex gap-2 p-6">
      <BoardSquare type="normal" tile={null} row={0} col={0} />
      <BoardSquare type="DL" tile={null} row={0} col={1} />
      <BoardSquare type="TL" tile={null} row={0} col={2} />
      <BoardSquare type="DW" tile={null} row={0} col={3} />
      <BoardSquare type="TW" tile={null} row={0} col={4} />
      <BoardSquare type="center" tile={null} row={0} col={5} />
      <BoardSquare 
        type="normal" 
        tile={{ letter: 'A', points: 1, id: '1' }} 
        row={0} 
        col={6} 
      />
    </div>
  );
}
