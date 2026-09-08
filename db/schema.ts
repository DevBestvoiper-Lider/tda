import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const reviews = pgTable("reviews", {
  id: serial().primaryKey(),
  name: text().notNull(),
  text: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
