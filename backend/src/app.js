import express from "express";
import { helloApi } from "./api/v1/hello";
import morgan from "morgan";
import { clientApi } from "./api/v1/client";

const app = express();

app.use(morgan("combined"));
app.use(express.json());

app.set("json spaces", 2);

app.use("/v1/hello", helloApi);
app.use("/v1/client", clientApi);

app.get("/", (request, response) => {
    response.status(200).json({ message: "proxy music backend API, welcome!" });
});
app.get("*", (req, res) => {
    res.status(404).json({
        path: req.originalUrl,
        message: "path doesn't exist",
    });
});

export default app;
