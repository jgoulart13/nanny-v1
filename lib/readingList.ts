// lib/readingList.ts
// "Around Boston" links for the home page, from data/reading-list.json.
// Validated when the site builds, like the cost data.

import { z } from "zod";
import raw from "@/data/reading-list.json";

const itemSchema = z.object({
  /** Short topic tag, e.g. "Taxes". */
  topic: z.string().min(1).max(20),
  title: z.string().min(1),
  /** Who published it, e.g. "IRS". */
  source: z.string().min(1),
  url: z.url(),
  /** "2026", "2026-10" or "2026-10-01". */
  date: z.string().regex(/^\d{4}(-\d{2}){0,2}$/),
  /** One line, in our own words. Never copied text. */
  takeaway: z.string().min(1).max(280),
});

export type ReadingItem = z.infer<typeof itemSchema>;

const parsed = z
  .object({ month: z.string().min(1), items: z.array(itemSchema).min(1) })
  .parse(raw);

export const readingList: ReadingItem[] = parsed.items;
/** e.g. "November", shown as "Around Boston · November". */
export const readingListMonth = parsed.month;
