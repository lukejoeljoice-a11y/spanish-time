import { useState, useCallback, useEffect } from "react";
import { ScrabbleBoard } from "@/components/ScrabbleBoard";
import { TileRack } from "@/components/TileRack";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { GameControls } from "@/components/GameControls";
import { TranslationModal } from "@/components/TranslationModal";
import { type TileData } from "@/components/ScrabbleTile";
import { useToast } from "@/hooks/use-toast";

import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const { toast } = useToast();
  
  const [boardTiles, setBoardTiles] = useState<(TileData | null)[][]>(() =>
    Array(15).fill(null).map(() => Array(15).fill(null))
  );

  const [players, setPlayers] = useState([
    { name: 'Player 1', score: 0 },
    { name: 'Player 2', score: 0 },
  ]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [tileBag, setTileBag] = useState<TileData[]>([]);
  const [tilesRemaining, setTilesRemaining] = useState(0);

  const [playerRack, setPlayerRack] = useState<(TileData | null)[]>(Array(7).fill(null));
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize game on mount
  const initializeGame = useCallback(async () => {
    try {
      const bagResponse = await apiRequest('POST', '/api/new-tile-bag');
      const bagResult = await bagResponse.json();

      const drawResponse = await apiRequest('POST', '/api/draw-tiles', { 
        tileBag: bagResult.tileBag, 
        count: 7 
      });
      const drawResult = await drawResponse.json();

      setTileBag(drawResult.remainingBag);
      setTilesRemaining(drawResult.remainingBag.length);
      setPlayerRack(drawResult.drawnTiles);
      setIsInitialized(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize game.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!isInitialized) {
      initializeGame();
    }
  }, [isInitialized, initializeGame]);

  const [draggedTile, setDraggedTile] = useState<{ tile: TileData; source: 'rack' | 'board'; index?: number; row?: number; col?: number } | null>(null);
  const [recentlyPlacedTiles, setRecentlyPlacedTiles] = useState<{ row: number; col: number }[]>([]);
  
  const [translationModal, setTranslationModal] = useState<{
    isOpen: boolean;
    word: string;
    translation: string;
    definition: string;
    points: number;
  }>({
    isOpen: false,
    word: '',
    translation: '',
    definition: '',
    points: 0,
  });

  const handleRackDragStart = useCallback((index: number, e: React.DragEvent) => {
    const tile = playerRack[index];
    if (tile) {
      setDraggedTile({ tile, source: 'rack', index });
      e.dataTransfer.effectAllowed = 'move';
    }
  }, [playerRack]);

  const handleBoardTileDragStart = useCallback((row: number, col: number, e: React.DragEvent) => {
    const tile = boardTiles[row][col];
    if (tile) {
      setDraggedTile({ tile, source: 'board', row, col });
      e.dataTransfer.effectAllowed = 'move';
    }
  }, [boardTiles]);

  const handleRackDrop = useCallback((index: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTile) return;

    if (playerRack[index]) {
      toast({
        title: "Slot occupied",
        description: "There's already a tile in this slot.",
        variant: "destructive",
      });
      return;
    }

    const newRack = [...playerRack];
    newRack[index] = draggedTile.tile;
    setPlayerRack(newRack);

    if (draggedTile.source === 'board' && draggedTile.row !== undefined && draggedTile.col !== undefined) {
      const newBoardTiles = boardTiles.map(r => [...r]);
      newBoardTiles[draggedTile.row][draggedTile.col] = null;
      setBoardTiles(newBoardTiles);
      setRecentlyPlacedTiles(recentlyPlacedTiles.filter(t => t.row !== draggedTile.row || t.col !== draggedTile.col));
    }

    setDraggedTile(null);
  }, [draggedTile, playerRack, boardTiles, recentlyPlacedTiles, toast]);

  const handleSquareDrop = useCallback((row: number, col: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTile) return;

    if (boardTiles[row][col]) {
      toast({
        title: "Square occupied",
        description: "There's already a tile on this square.",
        variant: "destructive",
      });
      return;
    }

    const newBoardTiles = boardTiles.map(r => [...r]);
    newBoardTiles[row][col] = draggedTile.tile;
    setBoardTiles(newBoardTiles);

    if (draggedTile.source === 'rack' && draggedTile.index !== undefined) {
      const newRack = [...playerRack];
      newRack[draggedTile.index] = null;
      setPlayerRack(newRack);
      setRecentlyPlacedTiles([...recentlyPlacedTiles, { row, col }]);
    } else if (draggedTile.source === 'board' && draggedTile.row !== undefined && draggedTile.col !== undefined) {
      const newBoardTiles2 = boardTiles.map(r => [...r]);
      newBoardTiles2[draggedTile.row][draggedTile.col] = null;
      setBoardTiles(newBoardTiles2);
      setRecentlyPlacedTiles([
        ...recentlyPlacedTiles.filter(t => t.row !== draggedTile.row || t.col !== draggedTile.col),
        { row, col }
      ]);
    }

    setDraggedTile(null);
  }, [draggedTile, boardTiles, playerRack, recentlyPlacedTiles, toast]);

  // Check if board has any tiles (to determine first move)
  const isBoardEmpty = useCallback(() => {
    return boardTiles.every(row => row.every(tile => tile === null));
  }, [boardTiles]);

  // Validate first word touches center
  const validateFirstWord = useCallback(() => {
    return recentlyPlacedTiles.some(t => t.row === 7 && t.col === 7);
  }, [recentlyPlacedTiles]);

  // Check if newly placed tiles connect to existing tiles
  const validateConnection = useCallback(() => {
    for (const newTile of recentlyPlacedTiles) {
      const { row, col } = newTile;
      // Check all 4 directions for existing tiles
      const directions = [
        [row - 1, col], [row + 1, col],
        [row, col - 1], [row, col + 1]
      ];
      
      for (const [r, c] of directions) {
        if (r >= 0 && r < 15 && c >= 0 && c < 15) {
          const tile = boardTiles[r][c];
          // If there's a tile and it's not recently placed, we have a connection
          if (tile && !recentlyPlacedTiles.some(t => t.row === r && t.col === c)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [recentlyPlacedTiles, boardTiles]);

  // Extract all words formed by recently placed tiles
  const extractFormedWords = useCallback(() => {
    const words: string[] = [];
    
    // Check horizontal and vertical words
    const processedPositions = new Set<string>();
    
    for (const tile of recentlyPlacedTiles) {
      const { row, col } = tile;
      
      // Check horizontal word
      const hKey = `h-${row}`;
      if (!processedPositions.has(hKey)) {
        let startCol = col;
        while (startCol > 0 && boardTiles[row][startCol - 1]) startCol--;
        
        let endCol = col;
        while (endCol < 14 && boardTiles[row][endCol + 1]) endCol++;
        
        if (endCol > startCol) {
          let word = '';
          for (let c = startCol; c <= endCol; c++) {
            word += boardTiles[row][c]?.letter || '';
          }
          if (word.length > 1) {
            words.push(word);
            processedPositions.add(hKey);
          }
        }
      }
      
      // Check vertical word
      const vKey = `v-${col}`;
      if (!processedPositions.has(vKey)) {
        let startRow = row;
        while (startRow > 0 && boardTiles[startRow - 1][col]) startRow--;
        
        let endRow = row;
        while (endRow < 14 && boardTiles[endRow + 1][col]) endRow++;
        
        if (endRow > startRow) {
          let word = '';
          for (let r = startRow; r <= endRow; r++) {
            word += boardTiles[r][col]?.letter || '';
          }
          if (word.length > 1) {
            words.push(word);
            processedPositions.add(vKey);
          }
        }
      }
    }
    
    return words;
  }, [recentlyPlacedTiles, boardTiles]);

  const handlePlayWord = useCallback(async () => {
    if (recentlyPlacedTiles.length === 0) {
      toast({
        title: "No tiles placed",
        description: "Place tiles on the board before playing.",
        variant: "destructive",
      });
      return;
    }

    // Rule 1: First word must touch center
    if (isBoardEmpty()) {
      if (!validateFirstWord()) {
        toast({
          title: "Invalid first word",
          description: "The first word must touch the center star tile.",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Rule 2: All words must connect to existing tiles
      if (!validateConnection()) {
        toast({
          title: "Invalid placement",
          description: "New tiles must connect to existing tiles on the board.",
          variant: "destructive",
        });
        return;
      }
    }

    // Extract all words formed
    const formedWords = extractFormedWords();
    
    if (formedWords.length === 0) {
      toast({
        title: "No valid word",
        description: "You must form at least one word with your tiles.",
        variant: "destructive",
      });
      return;
    }

    // Rule 3: Validate all formed words exist in dictionary
    try {
      const validationPromises = formedWords.map(async word => {
        const response = await apiRequest('POST', '/api/validate-word', { word });
        return response.json();
      });

      const validationResults = await Promise.all(validationPromises);

      for (let i = 0; i < formedWords.length; i++) {
        const result = validationResults[i];
        if (!result.valid) {
          toast({
            title: "Invalid word",
            description: `"${formedWords[i]}" is not a valid Spanish word.`,
            variant: "destructive",
          });
          return;
        }
      }

      // Calculate score for main word
      const mainWord = formedWords[0];
      const mainWordPositions: { row: number; col: number }[] = [];
      
      // Find positions of main word
      for (const tile of recentlyPlacedTiles) {
        const { row, col } = tile;
        
        // Check if this tile is part of a horizontal or vertical word
        let startCol = col;
        while (startCol > 0 && boardTiles[row][startCol - 1]) startCol--;
        let endCol = col;
        while (endCol < 14 && boardTiles[row][endCol + 1]) endCol++;
        
        if (endCol > startCol) {
          // Horizontal word found
          for (let c = startCol; c <= endCol; c++) {
            if (!mainWordPositions.some(p => p.row === row && p.col === c)) {
              mainWordPositions.push({ row, col: c });
            }
          }
          break;
        }
        
        let startRow = row;
        while (startRow > 0 && boardTiles[startRow - 1][col]) startRow--;
        let endRow = row;
        while (endRow < 14 && boardTiles[endRow + 1][col]) endRow++;
        
        if (endRow > startRow) {
          // Vertical word found
          for (let r = startRow; r <= endRow; r++) {
            if (!mainWordPositions.some(p => p.row === r && p.col === col)) {
              mainWordPositions.push({ row: r, col });
            }
          }
          break;
        }
      }

      const scoreResponse = await apiRequest('POST', '/api/calculate-score', {
        word: mainWord,
        positions: mainWordPositions,
        tiles: boardTiles,
        newTilePositions: recentlyPlacedTiles,
      });
      const scoreResult = await scoreResponse.json();

      const points = scoreResult.totalScore;

      // Update current player's score
      const newPlayers = [...players];
      newPlayers[currentPlayerIndex] = {
        ...newPlayers[currentPlayerIndex],
        score: newPlayers[currentPlayerIndex].score + points,
      };
      setPlayers(newPlayers);

      // Get translation for main word
      const wordData = validationResults[0];
      setTranslationModal({
        isOpen: true,
        word: mainWord.toUpperCase(),
        translation: wordData.translation || mainWord,
        definition: wordData.definition || 'No definition available',
        points,
      });

      // Draw new tiles to refill rack
      const emptySlots = playerRack.filter(t => t === null).length + recentlyPlacedTiles.length;
      if (tileBag.length > 0 && emptySlots > 0) {
        const drawResponse = await apiRequest('POST', '/api/draw-tiles', { 
          tileBag, 
          count: Math.min(emptySlots, tileBag.length) 
        });
        const drawResult = await drawResponse.json();

        setTileBag(drawResult.remainingBag);
        setTilesRemaining(drawResult.remainingBag.length);
        
        // Add drawn tiles to rack
        const newRack = [...playerRack];
        let drawnIndex = 0;
        for (let i = 0; i < newRack.length && drawnIndex < drawResult.drawnTiles.length; i++) {
          if (newRack[i] === null) {
            newRack[i] = drawResult.drawnTiles[drawnIndex++];
          }
        }
        setPlayerRack(newRack);
      }

      setRecentlyPlacedTiles([]);
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate word. Please try again.",
        variant: "destructive",
      });
    }
  }, [recentlyPlacedTiles, currentPlayerIndex, players, toast, boardTiles, isBoardEmpty, validateFirstWord, validateConnection, extractFormedWords, playerRack, tileBag]);

  const handleShuffleTiles = useCallback(() => {
    const nonNullTiles = playerRack.filter((t): t is TileData => t !== null);
    const shuffled = [...nonNullTiles].sort(() => Math.random() - 0.5);
    const newRack: (TileData | null)[] = Array(7).fill(null);
    shuffled.forEach((tile, i) => {
      newRack[i] = tile;
    });
    setPlayerRack(newRack);
    
    toast({
      title: "Tiles shuffled",
      description: "Your tiles have been reorganized.",
    });
  }, [playerRack, toast]);

  const handlePassTurn = useCallback(() => {
    setRecentlyPlacedTiles([]);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    
    toast({
      title: "Turn passed",
      description: `It's ${players[(currentPlayerIndex + 1) % players.length].name}'s turn.`,
    });
  }, [currentPlayerIndex, players, toast]);

  const handleNewGame = useCallback(async () => {
    try {
      // Create new tile bag
      const bagResponse = await apiRequest('POST', '/api/new-tile-bag');
      const bagResult = await bagResponse.json();

      // Draw initial tiles for first player
      const drawResponse = await apiRequest('POST', '/api/draw-tiles', { 
        tileBag: bagResult.tileBag, 
        count: 7 
      });
      const drawResult = await drawResponse.json();

      setBoardTiles(Array(15).fill(null).map(() => Array(15).fill(null)));
      setRecentlyPlacedTiles([]);
      setCurrentPlayerIndex(0);
      setPlayers([
        { name: 'Player 1', score: 0 },
        { name: 'Player 2', score: 0 },
      ]);
      setTileBag(drawResult.remainingBag);
      setTilesRemaining(drawResult.remainingBag.length);
      setPlayerRack(drawResult.drawnTiles);

      toast({
        title: "New game",
        description: "The game has been reset.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start new game.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleShareLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    
    toast({
      title: "Link copied",
      description: "Share this link with your friend to play together.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2" data-testid="title-game">
            Spanish Scrabble
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn Spanish while playing Scrabble! Form words in Spanish and see their English translations after each turn.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <div className="space-y-6 w-full lg:w-auto">
            <ScoreDisplay
              players={players}
              currentPlayerIndex={currentPlayerIndex}
              tilesRemaining={tilesRemaining}
            />
            <GameControls
              onPlayWord={handlePlayWord}
              onShuffleTiles={handleShuffleTiles}
              onPassTurn={handlePassTurn}
              onNewGame={handleNewGame}
              onShareLink={handleShareLink}
              isPlayDisabled={recentlyPlacedTiles.length === 0}
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <ScrabbleBoard
              tiles={boardTiles}
              onSquareDrop={handleSquareDrop}
              onBoardTileDragStart={handleBoardTileDragStart}
              recentlyPlacedTiles={recentlyPlacedTiles}
            />
            
            <TileRack
              tiles={playerRack}
              onTileDragStart={handleRackDragStart}
              onTileDrop={handleRackDrop}
            />
          </div>
        </div>
      </div>

      <TranslationModal
        isOpen={translationModal.isOpen}
        onClose={() => setTranslationModal({ ...translationModal, isOpen: false })}
        spanishWord={translationModal.word}
        englishTranslation={translationModal.translation}
        definition={translationModal.definition}
        points={translationModal.points}
      />
    </div>
  );
}
