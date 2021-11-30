import app from "./app";
import { config as configInit } from "dotenv";
import { refreshToken, getToken } from "./client/spotify";
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
        if (status === 401 && error.config && !error.config.__isRetryRequest) {
            await refreshToken();
            let token = getToken();
            error.config.headers["Authorization"] = "Bearer " + token;
            error.config.__isRetryRequest = true;
            return axios(error.config);
        }
        if (status === 401 && error.config.__isRetryRequest) {
            throw "Max retries for token reached";
        }
        return error.response;
    }
);

app.listen(nodePort, () => console.log(`Service running at port ${nodePort}`));
