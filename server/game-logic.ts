import { type TileData } from "@shared/schema";

// Spanish letter distribution for Scrabble
export const SPANISH_LETTER_DISTRIBUTION = [
  { letter: 'A', points: 1, count: 12 },
  { letter: 'B', points: 3, count: 2 },
  { letter: 'C', points: 3, count: 4 },
  { letter: 'D', points: 2, count: 5 },
  { letter: 'E', points: 1, count: 12 },
  { letter: 'F', points: 4, count: 1 },
  { letter: 'G', points: 2, count: 2 },
  { letter: 'H', points: 4, count: 2 },
  { letter: 'I', points: 1, count: 6 },
  { letter: 'J', points: 8, count: 1 },
  { letter: 'L', points: 1, count: 4 },
  { letter: 'M', points: 3, count: 2 },
  { letter: 'N', points: 1, count: 5 },
  { letter: 'Ñ', points: 8, count: 1 },
  { letter: 'O', points: 1, count: 9 },
  { letter: 'P', points: 3, count: 2 },
  { letter: 'Q', points: 5, count: 1 },
  { letter: 'R', points: 1, count: 5 },
  { letter: 'S', points: 1, count: 6 },
  { letter: 'T', points: 1, count: 4 },
  { letter: 'U', points: 1, count: 5 },
  { letter: 'V', points: 4, count: 1 },
  { letter: 'X', points: 8, count: 1 },
  { letter: 'Y', points: 4, count: 1 },
  { letter: 'Z', points: 10, count: 1 },
  { letter: '', points: 0, count: 2 }, // blank tiles
];

// Premium square multipliers
export type SquareType = "normal" | "DL" | "TL" | "DW" | "TW" | "center";

const BOARD_LAYOUT: SquareType[][] = [
  ["TW", "normal", "normal", "DL", "normal", "normal", "normal", "TW", "normal", "normal", "normal", "DL", "normal", "normal", "TW"],
  ["normal", "DW", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "DW", "normal"],
  ["normal", "normal", "DW", "normal", "normal", "normal", "DL", "normal", "DL", "normal", "normal", "normal", "DW", "normal", "normal"],
  ["DL", "normal", "normal", "DW", "normal", "normal", "normal", "DL", "normal", "normal", "normal", "DW", "normal", "normal", "DL"],
  ["normal", "normal", "normal", "normal", "DW", "normal", "normal", "normal", "normal", "normal", "DW", "normal", "normal", "normal", "normal"],
  ["normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal"],
  ["normal", "normal", "DL", "normal", "normal", "normal", "DL", "normal", "DL", "normal", "normal", "normal", "DL", "normal", "normal"],
  ["TW", "normal", "normal", "DL", "normal", "normal", "normal", "center", "normal", "normal", "normal", "DL", "normal", "normal", "TW"],
  ["normal", "normal", "DL", "normal", "normal", "normal", "DL", "normal", "DL", "normal", "normal", "normal", "DL", "normal", "normal"],
  ["normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal"],
  ["normal", "normal", "normal", "normal", "DW", "normal", "normal", "normal", "normal", "normal", "DW", "normal", "normal", "normal", "normal"],
  ["DL", "normal", "normal", "DW", "normal", "normal", "normal", "DL", "normal", "normal", "normal", "DW", "normal", "normal", "DL"],
  ["normal", "normal", "DW", "normal", "normal", "normal", "DL", "normal", "DL", "normal", "normal", "normal", "DW", "normal", "normal"],
  ["normal", "DW", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "TL", "normal", "normal", "normal", "DW", "normal"],
  ["TW", "normal", "normal", "DL", "normal", "normal", "normal", "TW", "normal", "normal", "normal", "DL", "normal", "normal", "TW"],
];

export function createTileBag(): TileData[] {
  const tiles: TileData[] = [];
  let idCounter = 0;

  for (const letterData of SPANISH_LETTER_DISTRIBUTION) {
    for (let i = 0; i < letterData.count; i++) {
      tiles.push({
        letter: letterData.letter,
        points: letterData.points,
        id: `tile-${idCounter++}`,
      });
    }
  }

  // Shuffle the bag
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  return tiles;
}

export function drawTiles(tileBag: TileData[], count: number): { drawnTiles: TileData[], remainingBag: TileData[] } {
  const drawnTiles = tileBag.slice(0, count);
  const remainingBag = tileBag.slice(count);
  return { drawnTiles, remainingBag };
}

interface WordScore {
  word: string;
  baseScore: number;
  multiplier: number;
  totalScore: number;
}

export function calculateWordScore(
  word: string,
  positions: { row: number; col: number }[],
  tiles: (TileData | null)[][],
  newTilePositions: { row: number; col: number }[]
): WordScore {
  let baseScore = 0;
  let wordMultiplier = 1;

  for (let i = 0; i < positions.length; i++) {
    const { row, col } = positions[i];
    const tile = tiles[row][col];
    if (!tile) continue;

    let letterScore = tile.points;
    const isNewTile = newTilePositions.some(p => p.row === row && p.col === col);

    // Only apply premium squares for newly placed tiles
    if (isNewTile) {
      const squareType = BOARD_LAYOUT[row][col];
      
      switch (squareType) {
        case "DL":
          letterScore *= 2;
          break;
        case "TL":
          letterScore *= 3;
          break;
        case "DW":
        case "center":
          wordMultiplier *= 2;
          break;
        case "TW":
          wordMultiplier *= 3;
          break;
      }
    }

    baseScore += letterScore;
  }

  const totalScore = baseScore * wordMultiplier;

  return {
    word,
    baseScore,
    multiplier: wordMultiplier,
    totalScore,
  };
}

export async function validateSpanishWord(word: string): Promise<{
  valid: boolean;
  translation?: string;
  definition?: string;
}> {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/es/${encodeURIComponent(word.toLowerCase())}`
    );

    if (!response.ok) {
      return { valid: false };
    }

    const data = await response.json();

    if (data.title === "No Definitions Found") {
      return { valid: false };
    }

    // Extract definition and try to get translation
    const firstMeaning = data[0]?.meanings?.[0];
    const definition = firstMeaning?.definitions?.[0]?.definition || '';
    
    // Try to get English translation from definition or synonyms
    // For now, we'll use the Spanish definition
    const translation = firstMeaning?.partOfSpeech || word;

    return {
      valid: true,
      translation: translation,
      definition: definition,
    };
  } catch (error) {
    console.error('Error validating word:', error);
    return { valid: false };
  }
}
