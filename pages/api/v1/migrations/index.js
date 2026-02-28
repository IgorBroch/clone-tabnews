import migrationsRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    try {
      const pendingMigrations = await migrationsRunner(defaultMigrationOptions);
      return response.status(200).json(pendingMigrations);
    } catch (error) {
      console.error("GET migration error:", error);
      return response.status(500).json({ error: error.message });
    } finally {
      await dbClient.end(); // ← always closes, even on error
    }
  }

  if (request.method === "POST") {
    try {
      const migratedMigrations = await migrationsRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });
      return response.status(201).json(migratedMigrations); // ← 201 for POST
    } catch (error) {
      console.error("POST migration error:", error);
      return response.status(500).json({ error: error.message });
    } finally {
      await dbClient.end(); // ← always closes, even on error
    }
  }

  await dbClient.end();
  return response.status(405).end(); // ← method not allowed
}
