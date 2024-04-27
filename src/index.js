import express from "express";
import axios from "axios";

import getEmbedding from "./util/getEmbedding.js";
import insertRecord from "./util/insertRecord.js";
import getAnswer from "./util/getAnswer.js";
import { index } from "./lib/pinecone.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  console.log(process.env.PINECONE_API_KEY);
  res.sendStatus(200);
});

// {
//   id: string,
//   imageUrl: string (url)
// }
app.post("/upload-to-pinecone", async (req, res) => {
  const id = req.body?.id;
  const imageUrl = req.body?.imageUrl;
  console.log(`id: ${id} \nimageUrl: ${imageUrl}`);

  const embedding = await getEmbedding({ imageUrl: imageUrl });
  console.log(`embedding: ${embedding}`);

  await insertRecord(id, embedding, imageUrl);
  console.log("record inserted");

  res.sendStatus(200);
});

// {
//   userId: string (id),
//   question: string
// }
app.post("/query-image", async (req, res) => {
  const userId = req.body?.userId;
  const question = req.body?.question;
  const embedding = await getEmbedding({ text: question });

  const queryResponse = await index.query({
    vector: embedding,
    filter: {
      userId: userId,
    },
    topK: 1,
    includeValues: false,
    includeMetadata: true,
  });

  res.send({ ...queryResponse });
});

// {
//   imageUrl: string (url),
//   question: string
// }
app.post("/query-response", async (req, res) => {
  const imageUrl = req.body?.imageUrl;
  const question = req.body?.question;

  const answer = await getAnswer(imageUrl, question);
  res.send(answer);
});

// {
//   imageIds: string[]
// }
app.post("/delete-records", async (req, res) => {
  const imageIds = req.body?.imageIds;

  if (imageIds.length == 1) {
    index.deleteOne(imageIds[0]);
  } else if (imageIds.length > 1) {
    index.deleteMany(imageIds);
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
