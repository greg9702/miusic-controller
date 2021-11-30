import express from "express";
import { helloApi } from "./api/v1/hello";
import morgan from "morgan";
import { clientApi } from "./api/v1/client";
import { requestTokens } from "./client/spotify";

const app = express();

app.use(morgan("combined"));
app.use(express.json());

app.set("json spaces", 2);

app.use("/v1/hello", helloApi);
app.use("/v1/client", clientApi);

app.use("/v1/auth/spotify/callback", async (req, res) => {
    let receivedCode = req.query.code;
    if (!receivedCode) {
        res.json(500).json({ error: "not user code received" });
        return;
    }
    console.log("received user code, setting it", receivedCode);
    try {
        await requestTokens(receivedCode);
        res.status(200).json({
            message:
                "user code was set sucesfully, application is ready to use",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "login failed",
            error: err,
        });
    }
});

app.use("/v1/auth/spotify/login", (req, res) => {
    // TODO move this stuff to client/spotify
    const clientID = process.env.CLIENT_ID;
    if (!clientID) {
        res.status(500).json({ message: "Client ID missing" });
    }
    let urlParams = new URLSearchParams({
        client_id: clientID,
        response_type: "code",
        redirect_uri: "http://localhost:8000/v1/auth/spotify/callback",
        scope: "user-library-read streaming",
        show_dialog: true,
    });
    res.redirect(
        "https://accounts.spotify.com/authorize?" + urlParams.toString()
    );
});

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
