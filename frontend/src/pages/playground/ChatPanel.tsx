import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"; // Utility for className merging (optional)
import axiosInstance from "@/api/axios";

type Message = {
  role: "user" | "ai";
  content: string;
};

type ChatPanelProps = {
  config: any;
};

const ChatPanel: React.FC<ChatPanelProps> = ({ config }) => {
  const [messages, setMessages] = useState<Message[]>([{
    role: "ai",
    content: "Hey there this your personalized ai assistant. How can i help you?"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Prepare the payload according to your backend API expectations
      const messagesPayload = {
        prompt: input,
        agentId: config._id,  // or agentConfig._id if you use that variable name
        // add more fields if your backend needs (e.g., userId)
      };

      // POST to the backend using axiosInstance and the agent's ID route
      const response = await axiosInstance.post(
        `/agents/chat/${config._id}`, // or `/agents/${agentConfig._id}` if your prop is agentConfig
        messagesPayload
      );

      // Assuming your backend returns a ChatLog doc (with .response):
      const data = response.data;
      if (data && data.response) {
        const aiMessage: Message = {
          role: "ai",
          content: data.response || "No response.",
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "No response from AI." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error communicating with AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (!config?._id) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstance.get(`/agents/chat/${config?._id}`);
        const logs = response.data.chatLogs || [];
        const formatted: Message[] = [];

        logs.forEach((log: any) => {
          // Push user message if there's a prompt
          if (log.prompt) formatted.push({ role: "user", content: log.prompt });
          // Push AI message if there's a response
          if (log.response) formatted.push({ role: "ai", content: log.response });
        });

        setMessages(
          formatted.length
            ? formatted
            : [{
              role: "ai",
              content: "Hey there this your personalized ai assistant. How can I help you?"
            }]
        );
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);


  return (
    <div className="flex flex-col h-full border-l bg-background">
      {/* Message area */}
      <ScrollArea className="flex-1 p-4 space-y-2 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg p-3 max-w-[75%] text-sm mb-4",
              msg.role === "user"
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted text-muted-foreground"
            )}
          >
            {msg.content}
          </div>
        ))}
      </ScrollArea>

      {/* Input bar */}
      <div className="border-t p-4 flex gap-2 bg-background">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default ChatPanel;
