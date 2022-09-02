import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import Joi from "joi";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("batepapouol");
});

const server = express();
server.use(cors());
server.use(express.json());

const schemaUser = Joi.object({
  name: Joi.string().min(1).required(),
});

const schemaMessage = Joi.object({
  to: Joi.string().min(1).required(),
  text: Joi.string().min(1).required(),
  type: Joi.valid("message").valid("private_message").optional(),
});

async function updateParticipants() {
  const participants = await db.collection("participants").find().toArray();
  const statusNow = Date.now();
  const hour = dayjs().format("HH:mm:ss");

  for (let i = 0; i < participants.length; i++) {
    let result = statusNow - participants[i].lastStatus;
    if (result > 10000) {
      db.collection("participants").deleteMany({
        name: participants[i].name,
      });

      db.collection("messages").insertOne({
        from: participants[i].name,
        to: "Todos",
        text: "sai da sala...",
        type: "status",
        time: hour,
      });
    }
  }
}

server.post("/participants", async (req, res) => {
  const { name } = req.body;
  const hour = dayjs().format("HH:mm:ss");
  setInterval(updateParticipants, 15000);

  try {
    try {
      await schemaUser.validateAsync({ name });
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
  setInterval(updateParticipants, 15000);
  try {
    const participants = await db.collection("participants").find().toArray();
    res.send(participants);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

server.post("/messages", async (req, res) => {
  const { to, text, type } = req.body;
  const name = req.headers.user;
  const hour = dayjs().format("HH:mm:ss");

  try {
    try {
      await schemaMessage.validateAsync({ to, text, type });
    } catch (err) {
      console.error(err);
      return res.sendStatus(422);
    }

    const participantsCollect = db.collection("participants");
    const containUser = await participantsCollect.findOne({ name: name });

    if (!containUser) {
      return res.sendStatus(422);
    }

    await db.collection("messages").insertOne({
      from: name,
      to,
      text,
      type,
      time: hour,
    });

    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

server.get("/messages", async (req, res) => {
  const limit = Number(req.query.limit);
  const username = req.headers.user;

  setInterval(updateParticipants, 15000);

  try {
    const messages = await db.collection("messages").find().toArray();

    const visibleMessages = messages.filter(
      (value) =>
        value.type === "message" ||
        value.type === "status" ||
        value.from === username ||
        value.to === username
    );

    if (!limit) {
      return res.send(messages);
    }

    const lastMessages = visibleMessages.slice(-limit);

    res.send(lastMessages);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

server.post("/status", async (req, res) => {
  const username = req.headers.user;

  setInterval(updateParticipants, 15000);

  try {
    const participantContain = await db
      .collection("participants")
      .findOne({ name: username });

    if (!participantContain) {
      return res.sendStatus(404);
    }

    db.collection("participants").update(
      { name: username },
      { $set: { lastStatus: Date.now() } }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

server.listen(5000, () => console.log("Listening on port 5000"));
