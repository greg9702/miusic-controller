import axios from "axios";

let accessToken = "123";
let userCode = undefined;
let rToken = "123";

export function getToken() {
    return accessToken;
}

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

export function requestTokens(newUserCode) {
    console.log("requesting new tokens");
    userCode = newUserCode;
    return new Promise((resolve, reject) => {
        axios
            .post(
                "https://accounts.spotify.com/api/token",
                new URLSearchParams({
                    grant_type: "authorization_code",
                    code: userCode,
                    redirect_uri:
                        "http://localhost:8000/v1/auth/spotify/callback",
                }),
                {
                    headers: {
                        Authorization:
                            "Basic " +
                            Buffer.from(
                                client_id + ":" + client_secret
                            ).toString("base64"),
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    json: true,
                }
            )
            .then((response) => {
                accessToken = response.data.access_token;
                rToken = response.data.refresh_token;
                console.log(
                    "Requesting tokens, status:",
                    response.status,
                    "received:",
                    response.data
                );
                resolve(true);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function refreshToken() {
    return new Promise((resolve, reject) => {
        if (!userCode) {
            throw "Please log in";
        }
        console.log("Refreshing token", accessToken);
        axios
            .post(
                "https://accounts.spotify.com/api/token",
                new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: rToken,
                }),
                {
                    headers: {
                        Authorization:
                            "Basic " +
                            Buffer.from(
                                client_id + ":" + client_secret
                            ).toString("base64"),
                    },
                    json: true,
                }
            )
            .then((response) => {
                accessToken = response.data.access_token;
                console.log(
                    "Refreshing token, status:",
                    response.status,
                    "new token:",
                    accessToken
                );
                resolve(true);
            })
            .catch((err) => {
                reject(err);
            });
        return;
    });
}

export function getUser(userName) {
    return axios.get("https://api.spotify.com/v1/users/" + userName, {
        headers: {
            Authorization: "Bearer " + accessToken,
        },
        json: true,
    });
}

export function searchForTrack(searchQuery) {
    return axios.get("https://api.spotify.com/v1/search", {
        params: {
            query: searchQuery,
            type: "track",
        },
        headers: {
            Authorization: "Bearer " + accessToken,
        },
        json: true,
    });
}

export function skipCurrentTrack() {
    return axios.post("https://api.spotify.com/v1/me/player/next", null, {
        headers: {
            Authorization: "Bearer " + accessToken,
        },
        json: true,
    });
}

export function addTrackToPlayQueue(trackUri) {
    return axios.post("https://api.spotify.com/v1/me/player/queue", null, {
        params: {
            uri: trackUri,
        },
        headers: {
            Authorization: "Bearer " + accessToken,
        },
        json: true,
    });
}
