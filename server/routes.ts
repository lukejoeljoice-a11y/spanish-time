import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { validateWordSchema, calculateScoreSchema } from "@shared/schema";
import { validateSpanishWord, calculateWordScore, createTileBag, drawTiles } from "./game-logic";

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate a Spanish word
  app.post("/api/validate-word", async (req, res) => {
    try {
      const { word } = validateWordSchema.parse(req.body);
      const result = await validateSpanishWord(word);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Calculate score for a word
  app.post("/api/calculate-score", async (req, res) => {
    try {
      const { word, positions, tiles, newTilePositions } = calculateScoreSchema.parse(req.body);
      const score = calculateWordScore(word, positions, tiles, newTilePositions);
      res.json(score);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Create a new tile bag
  app.post("/api/new-tile-bag", (req, res) => {
    const tileBag = createTileBag();
    res.json({ tileBag });
  });

  // Draw tiles from bag
  app.post("/api/draw-tiles", (req, res) => {
    try {
      const { tileBag, count } = req.body;
      const result = drawTiles(tileBag, count);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
