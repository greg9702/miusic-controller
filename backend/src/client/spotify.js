import axios from "axios";
import querystring from "querystring";

let token = "123";

export function getToken() {
    return token;
}

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

export function refreshToken() {
    return new Promise((resolve, reject) => {
        axios
            .post(
                "https://accounts.spotify.com/api/token",
                new URLSearchParams({
                    grant_type: "client_credentials",
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
                token = response.data["access_token"];
                console.log("Received new token:", token);
                resolve(true);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function getUser(userName) {
    return axios.get("https://api.spotify.com/v1/users/" + userName, {
        headers: {
            Authorization: "Bearer " + token,
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
            Authorization: "Bearer " + token,
        },
        json: true,
    });
}

export function skipCurrentTrack() {
    return axios.post("https://api.spotify.com/v1/me/player/next", null, {
        headers: {
            Authorization: "Bearer " + token,
        },
        json: true,
    });
}
