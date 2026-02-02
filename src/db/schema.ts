import { sql } from "drizzle-orm";
import {
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = mysqlTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  status: int("status").default(0).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
});

export const selectTasksSchema = createSelectSchema(tasks);

export const insertTasksSchema = createInsertSchema(tasks, {
  title: z.string().min(1, 'title must not be empty'),
})
  .required({
    title: true,
  })
  .omit({
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  });

export const patchTasksSchema = insertTasksSchema.partial();
