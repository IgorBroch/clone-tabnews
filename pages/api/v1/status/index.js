import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  const databaseMajorVersion = databaseVersionValue.split(".")[0]; // Extract "16" from "16.11 (f45eb12)"

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpenedCOnnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseMajorVersion, // Changed: now returns just "16"
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedCOnnectionsValue,
      },
    },
  });
}

export default status;
