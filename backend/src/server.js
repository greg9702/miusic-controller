import app from "./app";
import { config as configInit } from "dotenv";
import { refreshToken, getToken } from "./spotify/client";
import axios from "axios";
import { createClient } from "redis";

export const config = configInit();

const nodePort = 8000;
const redisPort = 6379;

export const redisClient = createClient({
  host: "redis",
  port: redisPort,
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    try {
      if (status === 401 && error.config && !error.config.__isRetryRequest) {
        console.log("got 401");
        await refreshToken();
        let token = getToken();
        console.log("new token", token);
        error.config.headers["Authorization"] = "Bearer " + token;
        error.config.__isRetryRequest = true;
        return axios(error.config);
      } else {
        throw "Max retries for token reached";
      }
    } catch (err) {
      console.log("catch");
      return new Promise((resolve) => resolve(error.response));
    }
  }
);

app.listen(nodePort, () => console.log(`Service running at port ${nodePort}`));
