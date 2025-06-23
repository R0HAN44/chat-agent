import { queryVectorStore } from "./chroma";

export async function chatWithAgent(agentId: string, query: string): Promise<string> {
    const docs = await queryVectorStore(agentId, query);
    const context = docs.join("\n");
    console.log(context)

    const prompt = `You are an AI agent. Answer the question strictly in this JSON format:

            {
            "answer": "your answer here"
            }

            Use the context below to answer.

            Context:
            ${context}

            Question: ${query}`;


    const result = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama3",
            prompt: prompt,
            temperature: 0.2,
            stream: false
        }),
    });

    const data: any = await result.json();
    try {
        const jsonOutput = JSON.parse(data.response); // ⬅️ Now this works
        return jsonOutput.answer;
    } catch (err) {
        console.error("Failed to parse JSON:", data.response);
        return "❌ Error: Agent did not return valid JSON.";
    }
}
