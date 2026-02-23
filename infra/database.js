import { Client } from "pg";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Connection failed:", error.message);
    throw error;
  } finally {
    if (client) {
      // ← only call end() if client was successfully created
      await client.end();
    }
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

export default {
  query,
  getNewClient,
};

function getSSLValues() {
  if (process.env.NODE_ENV === "production") {
    return true;
  }
  return { rejectUnauthorized: false };
}
