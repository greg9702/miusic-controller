import express from "express";
import {
    getUser,
    searchForTrack,
    skipCurrentTrack,
    addTrackToPlayQueue,
} from "../../../../client/spotify";

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

spotifyApi.get("/search", async (req, res) => {
    let searchQuery = req.query.searchQuery;
    if (!searchQuery) {
        res.status(400).json({
            message: "missing query parameter",
            key: "searchQuery",
        });
        return;
    }
    try {
        let searchResp = await searchForTrack(searchQuery);
        if (searchResp.status === 200 && searchResp.data) {
            let trackList = [];
            searchResp.data.tracks.items.forEach((item, _) => {
                let artists = "";
                item.album.artists.forEach((artist, index) => {
                    artists += artist.name;
                    if (index < item.album.artists.length - 1) {
                        artists += ", ";
                    }
                });

                trackList.push({
                    artists: artists,
                    title: item.name,
                    uri: item.uri,
                });
            });
            res.status(200).json({ message: trackList });
            return;
        }
        let message = "Unknown error";
        if (searchResp.data) {
            message = searchResp.data;
        }
        res.status(searchResp.status).json({ message: message });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal error", message: err });
    }
});

spotifyApi.post("/skip", async (req, res) => {
    try {
        let skipResp = await skipCurrentTrack();
        if (skipResp.status === 204) {
            res.status(200).json({ message: "song skipped" });
            return;
        }
        let message = "Unknown error";
        if (skipResp.data) {
            message = skipResp.data;
        }
        res.status(skipResp.status).json({ message: message });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal error", message: err });
    }
});

spotifyApi.post("/queue/add", async (req, res) => {
    let trackUri = req.body.uri;
    if (!trackUri) {
        return res.status(403).json({ message: "uri missing in body request" });
    }

    try {
        let addResp = await addTrackToPlayQueue(trackUri);
        if (addResp.status === 204) {
            res.status(200).json({ message: "song added" });
            return;
        }
        let message = "Unknown error";
        if (addResp.data) {
            message = addResp.data;
        }
        res.status(addResp.status).json({ message: message });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal error", message: err });
    }
});

spotifyApi.get("*", (req, res) => {
    res.status(404).json({
        path: req.originalUrl,
        message: "path doesn't exist",
    });
});
