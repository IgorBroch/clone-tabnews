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
    const pedingMigrations = await migrationsRunner(defaultMigrationOptions);
    await dbClient.end();
    return response.status(200).json(pedingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationsRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();

    return response.status(200).json(migratedMigrations);
  }

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(405).end();
}
