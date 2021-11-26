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
                querystring.stringify({
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
                resolve(true);
            })
            .catch((err) => reject(err));
    });
}
