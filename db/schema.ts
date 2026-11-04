import { sqliteTable, text } from "drizzle-orm/sqlite-core";
export const submissions = sqliteTable("submissions", {
 id: text("id").primaryKey(), createdAt: text("created_at").notNull(), language: text("language").notNull(), groupLabel: text("group_label").notNull(), moral: text("moral").notNull(), practical: text("practical").notNull(), amplificant: text("amplificant").notNull(), renunciant: text("renunciant").notNull()
});
