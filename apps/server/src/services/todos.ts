import type { DrizzleClient } from "../index.js";
import * as schema from "../db/schema.js";
import { eq } from "drizzle-orm";

export const listTodos = async (db: DrizzleClient) =>
  await db.query.todos.findMany();

export const createTodo = async (db: DrizzleClient, title: string) => {
  const [todo] = await db
    .insert(schema.todos)
    .values({ title, completed: false })
    .returning();
  return todo;
};

export const updateTodo = async (
  db: DrizzleClient,
  id: number,
  title: string,
  completed: boolean,
) => {
  const [todo] = await db
    .update(schema.todos)
    .set({ title, completed })
    .where(eq(schema.todos.id, id))
    .returning();
  return todo;
};
