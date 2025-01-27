import database from "../../../../infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const maxConnections = await database.query("SHOW max_connections;");
  const maxConnectionsResult = parseInt(maxConnections.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const openedConnections = await database.query({
    text: "SELECT COUNT(*)::int AS OpenedConnections FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });

  const openedConnectionsResult = openedConnections.rows[0].openedconnections;

  const version = await database.query("SHOW server_version;");
  const versionResult = version.rows[0].server_version;

  return res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: maxConnectionsResult,
        opened_connections: openedConnectionsResult,
        version: versionResult,
      },
    },
  });
}

export default status;
