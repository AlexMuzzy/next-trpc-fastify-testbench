import type { DrizzleClient } from "../index.js";
import * as schema from "../db/schema.js";

export const getUsers = async (db: DrizzleClient) => {
  return await db.query.users.findMany();
};

export const createUser = async (
  db: DrizzleClient,
  name: string,
  email: string,
) => {
  const [user] = await db
    .insert(schema.users)
    .values({ name, email })
    .returning();
  return user;
};
