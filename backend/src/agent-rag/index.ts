import "dotenv/config";
import { initVectorStore, addToVectorStore, getEmbeddings } from "./chroma";
import { chatWithAgent } from "./rag";

const text = [
    "Rohan is a full-stack developer working on AI agent systems.",
    "He loves using TypeScript and React.",
    "He is currently implementing a Retrieval-Augmented Generation (RAG) system."
  ]

export async function main() {
  await initVectorStore();

  const agentId = "agent-001";

//   Step 1: Add knowledge
  await addToVectorStore(agentId, [
    "Rohan is a full-stack developer working on AI agent systems.",
    "He loves using TypeScript and React.",
    "He is currently implementing a Retrieval-Augmented Generation (RAG) system."
  ]);

  // Step 2: Ask a question
  const response = await chatWithAgent(agentId, "what is rohan currently implementing");
  console.log("🤖 Agent says:", response);
}

