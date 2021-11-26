import express from "express";
import { spotifyApi } from "./spotify";

export const clientApi = express.Router();

clientApi.use("/spotify", spotifyApi);
clientApi.get("*", (req, res) => {
    res.status(404).json({
        path: req.originalUrl,
        message: "path doesn't exist",
    });
});
