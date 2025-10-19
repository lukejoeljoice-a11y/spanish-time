import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game-related types
export interface TileData {
  letter: string;
  points: number;
  id: string;
}

export const validateWordSchema = z.object({
  word: z.string().min(1),
});

export const calculateScoreSchema = z.object({
  word: z.string(),
  positions: z.array(z.object({
    row: z.number(),
    col: z.number(),
  })),
  tiles: z.array(z.array(z.nullable(z.object({
    letter: z.string(),
    points: z.number(),
    id: z.string(),
  })))),
  newTilePositions: z.array(z.object({
    row: z.number(),
    col: z.number(),
  })),
});
