import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "/infra/database.js";

async function migrations(req, res) {
  if (req.method != "GET" && req.method != "POST") return res.status(404).end();
  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    dbClient,
    dir: join("infra", "migrations"),
    dryRun: true,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (req.method == "GET") {
    const pedingMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbClient.end();

    return res.status(200).json(pedingMigrations);
  }

  if (req.method == "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end();

    return res
      .status(migratedMigrations.length > 0 ? 201 : 200)
      .json(migratedMigrations);
  }

  return res.status(405).end();
}

export default migrations;
