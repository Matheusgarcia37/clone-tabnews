import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

async function migrations(req, res) {
  const defaultMigrationsOptions = {
    databaseUrl: process.env.DATABASE_URL,
    dir: join("infra", "migrations"),
    dryRun: true,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (req.method == "GET") {
    const pedingMigrations = await migrationRunner(defaultMigrationsOptions);

    return res.status(200).json(pedingMigrations);
  }

  if (req.method == "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });

    return res
      .status(migratedMigrations.length > 0 ? 201 : 200)
      .json(migratedMigrations);
  }

  return res.status(405).end();
}

export default migrations;
