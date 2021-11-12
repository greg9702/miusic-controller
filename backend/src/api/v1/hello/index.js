import express from "express";
import { redisClient } from "../../../server";
import { promisify } from "util";

export const helloApi = express.Router();

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
