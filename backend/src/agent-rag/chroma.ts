import { ChromaClient, Collection, EmbeddingFunction } from "chromadb";

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false,
});
let collection: Collection;

// async function deleteCollection() {
//   await client.deleteCollection({ name: "my-agent" });
//   console.log("Collection deleted");
// }

// deleteCollection();

export async function initVectorStore() {
  collection = await client.getOrCreateCollection({
    name: "my-agent",
    embeddingFunction: getOllamaEmbeddingFunction(),
  });
}

export async function addToVectorStore(agentId: string, texts: string[]) {
  if (!collection) throw new Error("Vector store not initialized.");
  const embeddings = await getEmbeddings(texts);

  await collection.add({
    ids: texts.map((_, i) => `${agentId}_${Date.now()}_${i}`),
    embeddings,
    documents: texts,
    metadatas: texts.map(() => ({ agentId })),
  });
}

export async function queryVectorStore(agentId: string, query: string, topK = 10) {
  if (!collection) throw new Error("Vector store not initialized.");

  const queryEmbedding = await getEmbeddings([query]);

  const results = await collection.query({
    queryEmbeddings: queryEmbedding,
    nResults: topK,
    where: { agentId },
  });
  console.log(results)
  return results.documents?.[0] || [];
}

const getOllamaEmbeddingFunction = (): EmbeddingFunction => ({
  generate: async (texts: string[]): Promise<number[][]> => {
    const results: number[][] = [];

    for (const text of texts) {
      const res = await fetch("http://localhost:11434/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "nomic-embed-text",
          prompt: text,
        }),
      });

      const data : any = await res.json();
      results.push(data.embedding);
    }
    console.log(results)
    return results;
  },
});

// Optional: reuse this in case you need external embeddings (OpenAI, etc.)
export const getEmbeddings = getOllamaEmbeddingFunction().generate;
