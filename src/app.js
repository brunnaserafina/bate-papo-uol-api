import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import Joi from "joi";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
  db = mongoClient.db("batepapouol");
});

const server = express();
server.use(cors());
server.use(express.json());

const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(10).required(),
});

server.post("/participants", async (req, res) => {
  const { name } = req.body;
  const hour = dayjs().format("HH:mm:ss");

  try {
    try {
      await schema.validateAsync({ name });
    } catch (err) {
      console.error("Not validated");
      return res.sendStatus(422);
    }

    const participantsCollect = db.collection("participants");
    const containName = await participantsCollect.findOne({ name: name });

    if (containName) {
      //console.log(containName);
      return res.sendStatus(409);
    }

    const messagesCollect = db.collection("messages");

    await participantsCollect.insertOne({ name, lastStatus: Date.now() });
    await messagesCollect.insertOne({
      from: name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: hour,
    });

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

server.get("/participants", async (req, res) => {
  try {
    const participants = await db.collection("participants").find().toArray();
    res.send(participants);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

server.listen(5000, () => console.log("Listening on port 5000"));
