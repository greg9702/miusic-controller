import express from "express";
import { getUser } from "../../../../client/spotify";

export const spotifyApi = express.Router();

spotifyApi.get("/user/:name", async (req, res) => {
    const userName = req.params.name;
    try {
        let userResp = await getUser(userName);
        let errMessage = "Unknown error";
        if (userResp.data) {
            errMessage = userResp.data;
        }
        res.status(userResp.status).json({ message: errMessage });
    } catch (err) {
        res.status(500).json({ error: "internal error", message: err });
    }
});

spotifyApi.get("*", (req, res) => {
    res.status(404).json({
        path: req.originalUrl,
        message: "path doesn't exist",
    });
});
