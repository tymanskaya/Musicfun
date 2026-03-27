import * as z from "zod";

export const createPlaylistSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000),
})