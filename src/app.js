import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
  db = mongoClient.db("test");
});

const server = express();
server.use(cors());
server.use(express.json());

server.listen(5000, () => console.log("Listening on port 5000"));
