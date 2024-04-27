import axios from "axios";

async function getEmbedding({ text, imageUrl }) {
  try {
    const response = await axios.post(
      `${process.env.EMBEDDING_API_URL}/get-embedding`,
      {
        text: text,
        image: imageUrl,
      }
    );

    if (response.status === 200) {
      return await JSON.parse(response.data.embedding);
    } else {
      console.error("Failed to get embedding:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching embedding:", error.message);
    return null;
  }
}

export default getEmbedding;
