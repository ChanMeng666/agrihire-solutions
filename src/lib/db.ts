import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../../drizzle/schema";
import * as relations from "../../drizzle/relations";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, {
  schema: { ...schema, ...relations },
});
