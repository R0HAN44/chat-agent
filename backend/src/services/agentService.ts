import Agent, { IAgent } from '../models/Agent';
import mongoose, { Types } from 'mongoose';
import ChatLog from '../models/ChatLog';
import { queryVectorStore } from '../agent-rag/chroma';
import UsageLog from '../models/UsageLog';

export const createAgent = async (data: Partial<IAgent>) => {
  const agent = new Agent(data);
  console.log(data)
  return await agent.save();
};

export const getAgentsByUser = async (userId: string) => {
  return await Agent.find({ userId });
};

export const getAgentById = async (agentId: string, userId: string) => {
  return await Agent.findOne({ _id: agentId, userId });
};

export const updateAgentById = async (agentId: string, userId: string, updatedData: any) => {
  return await Agent.findOneAndUpdate(
    { _id: agentId, userId },
    { $set: updatedData },
    { new: true } // return the updated document
  );
};


export const deleteAgent = async (agentId: string, userId: string) => {
  return await Agent.findOneAndDelete({ _id: agentId, userId });
};


export const getAgentChatLogs = async (agentId: string, userId: string) => {
  return await ChatLog.find({ agentId, userId }).sort({ createdAt: -1 });
};

// Minimal approximate token count function (replace with your actual tokenizer)
function approximateTokenCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export async function chatWithAgent(
  agentId: string,
  query: string,
  userId: string  // Add this so you can save usage logs for the user
): Promise<string> {
  try {
    // 1. Query your vector store for relevant docs based on the query
    const docs = await queryVectorStore(agentId, query);
    const context = docs.join("\n---\n");

    // 2. Compose prompt
    const prompt = `You are an AI agent. Answer the question strictly in this JSON format:

{
  "answer": "your answer here"
}

Use the context below to answer.

Context:
${context}

Question: ${query}
`;

    console.log("Prompt sent to agent:", prompt);

    // 3. Call Ollama local API
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        temperature: 0.2,
        stream: false,
      }),
    });

    const data: any = await response.json();

    // 4. Parse JSON response
    let answer = "";
    try {
      const jsonOutput = JSON.parse(data.response);
      console.log("Agent response:", jsonOutput);
      answer = jsonOutput.answer;
    } catch (err) {
      console.error("❌ Failed to parse JSON response from agent:", data.response);
      answer = "❌ Error: Agent did not return valid JSON.";
    }

    // 5. Calculate tokens (approximate example)
    const promptTokens = approximateTokenCount(prompt);
    const responseTokens = approximateTokenCount(answer);
    const totalTokens = promptTokens + responseTokens;

    // 6. Save usage log
    try {
      await UsageLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        agentId: new mongoose.Types.ObjectId(agentId),
        prompt: query,
        response: answer,
        promptTokens,
        responseTokens,
        totalTokens,
        createdAt: new Date(),
      });
      console.log("Usage log saved successfully");
    } catch (saveError) {
      console.error("Failed to save usage log:", saveError);
    }

    return answer;
  } catch (error) {
    console.error("❌ Error communicating with local LLaMA agent:", error);
    return "❌ Error: Unable to get response from AI agent.";
  }
}


