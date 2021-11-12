import app from "./app";
import { config as configInit } from "dotenv";
import { createClient } from "redis";

export const config = configInit();

const nodePort = 8000;
const redisPort = 6379;

export const redisClient = createClient({
  host: "redis",
  port: redisPort,
});

app.listen(nodePort, () => console.log(`Service running at port ${nodePort}`));
