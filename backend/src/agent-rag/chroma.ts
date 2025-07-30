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

export async function queryVectorStore(agentId: string, query: string, topK = 3): Promise<any> {
  try {
    // Get or create collection for the agent
    const collection = await client.getOrCreateCollection({
      name: agentId,
      embeddingFunction: customEmbeddingFunction,
    });

    // Embed the query text
    const queryEmbedding = (await getTextEmbeddings([query]))[0];

    // Query the collection for topK similar documents
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
      include: ["documents", "distances"], // include distances if you want to debug similarity scores
    });

    // Extract and return matched documents
    const matchedDocs = results.documents?.[0] || [];

    return matchedDocs;
  } catch (error) {
    console.error("Error querying vector store:", error);
    return [];
  }
}