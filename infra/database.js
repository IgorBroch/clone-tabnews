import { Client } from "pg";

async function query(queryObject) {
  const config = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  };

  const client = new Client(config);

  try {
    await client.connect();
    console.log("Connected successfully!");
    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    console.error("Connection failed:", error.message);
    throw error;
  } finally {
    await client.end();
  }
}

export default { query };
