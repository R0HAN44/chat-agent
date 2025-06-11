import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"; // Utility for className merging (optional)

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
    content : "Hey there this your personalized ai assistant. How can i help you?"
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, config }),
      });

      const data = await response.json();
      const aiMessage: Message = {
        role: "ai",
        content: data.reply || "No response.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error communicating with AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
