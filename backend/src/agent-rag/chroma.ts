import { ChromaClient } from "chromadb";
import { getTextEmbeddings } from "../utils/embedder";

// ChromaDB client configured for port 8001 (fixed deprecated path)
const client = new ChromaClient({
  host: "localhost",
  port: 8001,
  ssl: false,
});

const customEmbeddingFunction = {
  generate: async (texts: string[]) => {
    return await getTextEmbeddings(texts);
  },
};

export async function addToVectorStore(agentId: string, texts: string[]) {
  try {
    // First, test the connection
    console.log("Testing ChromaDB connection...");
    const heartbeat = await client.heartbeat();
    console.log("ChromaDB heartbeat:", heartbeat);

    const embeddings = await getTextEmbeddings(texts);
    console.log("embeddings", embeddings);

    console.log("Attempting to get or create collection...");
    const collection = await client.getOrCreateCollection({
      name: agentId,
      embeddingFunction: customEmbeddingFunction,
    });
    console.log("Collection retrieved:", collection);

    // Add documents to collection
    const ids = texts.map((_, index) => `doc_${Date.now()}_${index}`);
    
    await collection.add({
      ids: ids,
      documents: texts,
      embeddings: embeddings,
    });

    console.log(`Successfully added ${texts.length} documents to collection ${agentId}`);
    return { success: true, message: `Added ${texts.length} documents` };

  } catch (error: any) {
    console.error("Error in addToVectorStore:", error);
    return { success: false, message: `Error: ${error.message}` };
  }
}