import { createClient } from "redis";

const port = parseInt(process.env.REDIS_PORT ?? "0");

export const client = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PSWD,
  socket: {
    host: process.env.REDIS_HOST,
    port: port,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();
