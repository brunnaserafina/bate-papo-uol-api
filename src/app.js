import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import Joi from "joi";
import { stripHtml } from "string-strip-html";
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
  name: Joi.string().empty("").required(),
});

const schemaMessage = Joi.object({
  to: Joi.string().empty("").required(),
  text: Joi.string().empty("").required(),
  type: Joi.valid("message").valid("private_message").optional(),
});

// setInterval(async () => {
//   const participants = await db.collection("participants").find().toArray();
//   const statusNow = Date.now();
//   const hour = dayjs().format("HH:mm:ss");

//   for (let i = 0; i < participants.length; i++) {
//     let result = statusNow - participants[i].lastStatus;
//     const maxTimeOn = 10000;

//     if (result > maxTimeOn) {
//       db.collection("participants").deleteOne({
//         name: participants[i].name,
//       });

//       db.collection("messages").insertOne({
//         from: participants[i].name,
//         to: "Todos",
//         text: "sai da sala...",
//         type: "status",
//         time: hour,
//       });
//     }
//   }
// }, 15000);

server.post("/participants", async (req, res) => {
  let { name } = req.body;
  const hour = dayjs().format("HH:mm:ss");

  name = stripHtml(name).result.trim();

  const validation = schemaUser.validate({ name }, { abortEarly: false });
  if (validation.error) {
    const err = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(err);
  }

  try {
    const participantsCollect = db.collection("participants");
    const containName = await participantsCollect.findOne({ name: name });

    if (containName) {
      return res.sendStatus(409);
    }

    const messagesCollect = db.collection("messages");

    participantsCollect.insertOne({ name, lastStatus: Date.now() });

    messagesCollect.insertOne({
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

server.post("/messages", async (req, res) => {
  let { to, text, type } = req.body;
  let name = req.headers.user;
  const hour = dayjs().format("HH:mm:ss");

  to = stripHtml(to).result.trim();
  text = stripHtml(text).result.trim();
  type = stripHtml(type).result;
  name = stripHtml(name).result.trim();

  const validation = schemaMessage.validate(
    { to, text, type },
    { abortEarly: false }
  );
  if (validation.error) {
    const err = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(err);
  }

  try {
    const participantsCollect = db.collection("participants");
    const containUser = await participantsCollect.findOne({ name: name });

    if (!containUser) {
      return res.sendStatus(422);
    }

    db.collection("messages").insertOne({
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

  try {
    const participantContain = await db
      .collection("participants")
      .findOne({ name: username });

    if (!participantContain) {
      return res.sendStatus(404);
    }

    await db
      .collection("participants")
      .updateOne({ name: username }, { $set: { lastStatus: Date.now() } });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

server.delete("/messages/:idMessage", async (req, res) => {
  const username = req.headers.user;
  const { idMessage } = req.params;

  try {
    const message = await db
      .collection("messages")
      .find({ _id: ObjectId(idMessage) })
      .toArray();

    if (message.length === 0) {
      return res.sendStatus(404);
    }

    if (message[0].from !== username) {
      return res.sendStatus(401);
    }

    await db.collection("messages").deleteOne({ _id: new ObjectId(idMessage) });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

server.listen(5000, () => console.log("Listening on port 5000"));
