import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "/infra/database.js";

async function migrations(req, res) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(req.method))
    return res
      .status(405)
      .json({
        error: `Method ${req.method} not allowed!`,
      })
      .end();

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationsOptions = {
      dbClient,
      dir: resolve("infra", "migrations"),
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
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    dbClient.end();
  }
}

export default migrations;
