import { useEffect, useState } from "react";
import ChatPanel from "./playground/ChatPanel";
import axiosInstance from "@/api/axios";
import { useParams } from "react-router-dom";

export default function ChatEmbed() {
  const { botId } = useParams();

  const [agentConfig, setAgentConfig] = useState(null);

  useEffect(() => {
    const fetchAgentConfig = async () => {
      if (botId) {
        const agentResponse = await axiosInstance.get(`/agents/${botId}`);
        console.log(agentResponse);
        setAgentConfig(agentResponse.data);
      }
    };
    fetchAgentConfig();
  }, [botId]);

  if (!agentConfig) {
    return <div>Loading chatbot...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <ChatPanel config={agentConfig} />
    </div>
  );
}
