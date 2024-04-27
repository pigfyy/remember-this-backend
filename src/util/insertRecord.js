import { index } from "../lib/pinecone.js";

function extractUserId(url) {
  const regex = /user_([^\/]+)/;
  const match = url.match(regex);

  if (match) {
    return match[1];
  } else {
    return null;
  }
}

async function insertRecord(id, embedding, imageUrl) {
  const userId = extractUserId(imageUrl);

  const record = {
    id: id,
    values: embedding,
    metadata: {
      imageUrl: imageUrl,
      userId: userId,
    },
  };

  await index.upsert([record]);

  return true;
}

export default insertRecord;
