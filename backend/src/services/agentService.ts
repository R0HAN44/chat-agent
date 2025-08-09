import Agent, { IAgent } from '../models/Agent';
import mongoose, { Types } from 'mongoose';
import ChatLog, { IChatLog } from '../models/ChatLog';
import { queryVectorStore } from '../agent-rag/chroma';
import UsageLog from '../models/UsageLog';
import Action, { IAction } from '../models/Action';

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

// Add in your agentService file
export const getRecentAgentChatLogs = async (agentId: string, userId: string, limit = 5) => {
  return await ChatLog.find({ agentId, userId })
    .sort({ createdAt: -1 }) // newest first
    .limit(limit)
    .lean()
    .exec();
};

export const getAgentActions = async (agentId: string) => {
  return await Action.find({ agentId }).lean().exec();
};

// Helper to format chatlogs for prompt
function formatChatLogs(chatLogs: IChatLog[]) {
  // You could do: `[{prompt: "...", response: "..."}, ...]`
  return chatLogs.reverse().map(log => (
    `User: ${log.prompt}\nAgent: ${log.response}`
  )).join('\n---\n');
}

// Helper to format actions for prompt
function formatActions(actions: IAction[]) {
  // List each action with its name, type, trigger, and basic payload
  return actions.map(a => (
    `- Name: ${a.name}
  Type: ${a.type}
  Trigger: ${a.payload.trigger || ""}
  ${(a.type === 'redirect') ? `URL: ${a.payload.url}\n` : ''}
  ${(a.type === 'api_call') ? `URL: ${a.payload.url}\nMethod: ${a.payload.method}\n` : ''}
  ${(a.type === 'collect_leads' && a.payload.fields) ? `Fields: ${a.payload.fields.map((f: any) => `${f.label}`).join(', ')}\n` : ''}`
  )).join('\n');
}


export async function chatWithAgent(
  agentId: string,
  query: string,
  userId: string
): Promise<{ answer: string; action: string | null; action_payload: Record<string, any> | null }> {
  try {
    // 1. Vector store documents
    const docs = await queryVectorStore(agentId, query);
    const context = docs.join("\n---\n");

    // 2. Recent chatlogs
    const recentChatLogs = await getRecentAgentChatLogs(agentId, userId, 5);
    const chatHistory = formatChatLogs(recentChatLogs);

    // 3. Agent actions
    const actions = await getAgentActions(agentId);
    const actionsList = formatActions(actions);

    // 4. Compose the prompt
    const prompt = `You are an AI agent. Answer the question strictly in this JSON format:

{
  "answer": "your answer here",
  "action": "optional, one of [api_call, button, redirect, collect_leads] or null",
  "action_payload": "optional, details for the action - use the payload from actions list if relevant"
}

Use the provided context, chat history, and actions.

Context:
${context}

Chat History:
${chatHistory}

Actions you can trigger:
${actionsList}

Now answer this new user question:
${query}
`;

    // console.log("Prompt sent to agent:", prompt);

    // 5. Call Ollama local API
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

    // 6. Parse JSON from model
    let answer = "";
    let action: string | null = null;
    let action_payload: any = null;
    try {
      const jsonOutput = JSON.parse(data.response);
      console.log("Agent JSON response:", jsonOutput);
      answer = jsonOutput.answer;
      action = jsonOutput.action ?? null;
      action_payload = jsonOutput.action_payload ?? null;
    } catch (err) {
      console.error("❌ Failed to parse JSON response from agent:", data.response);
      answer = "❌ Error: Agent did not return valid JSON.";
    }

    // 7. Token usage
    const promptTokens = approximateTokenCount(prompt);
    const responseTokens = approximateTokenCount(answer);
    const totalTokens = promptTokens + responseTokens;

    // 8. Save usage log
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

    // 9. Return all details so API handler can save/chat/respond
    return { answer, action, action_payload };
  } catch (error) {
    console.error("❌ Error communicating with local LLaMA agent:", error);
    return { answer: "❌ Error: Unable to get response from AI agent.", action: null, action_payload: null };
  }
}


