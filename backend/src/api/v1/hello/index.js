import express from "express";
import { redisClient } from "../../../server";
import { promisify } from "util";
import axios from "axios";
import { getToken } from "../../../spotify/client";

export const helloApi = express.Router();

helloApi.post("/", async (req, res) => {
  if (!req.body.key) {
    return res.status(403).json({ message: "key missing in body request" });
  }
  if (!req.body.value) {
    return res.status(403).json({ message: "value missing in body request" });
  }
  const key = req.body.key;
  const value = req.body.value;

  const exist = promisify(redisClient.exists).bind(redisClient);
  const doExist = await exist(key).catch((err) => {
    if (err) console.error(err);
  });

  console.log("do exist:", doExist);

  redisClient.set(key, value, async (err, reply) => {
    if (err) {
      res.status(500).send({ key: key, message: err.message });
    }
  });
  res.status(200).json({ key: key, message: "success" });
});

helloApi.get("/test_user", async (request, response) => {
  try {
    let token = getToken();
    let userResp = await axios.get(
      "https://api.spotify.com/v1/users/greg9702",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
        json: true,
      }
    );
    let errMessage = "Unknown error";
    if (userResp.data) {
      errMessage = userResp.data;
    }

    response.status(userResp.status).json({ message: errMessage });
  } catch (err) {
    response.status(500).json({ error: "internal error", message: err });
  }
});

helloApi.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    redisClient.get(id, (err, data) => {
      if (err) {
        console.error(err);
        throw err;
      }

      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ id: id, message: "doesn't exist" });
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
