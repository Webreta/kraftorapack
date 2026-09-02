import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { hash } from "bcryptjs";
import { users } from "./schema";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const name = process.env.SEED_ADMIN_NAME ?? "Admin";
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL ve SEED_ADMIN_PASSWORD tanımlı olmalı");
  }

  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(client);

  const passwordHash = await hash(password, 12);
  await db
    .insert(users)
    .values({ email, name, passwordHash, role: "admin" })
    .onConflictDoNothing({ target: users.email });

  console.log(`Admin kullanıcısı hazır: ${email}`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
