import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import axiosInstance from "@/api/axios";

// --- Types ---
type Message = {
  role: "user" | "ai";
  content: string;
  action?: string | null;
  action_payload?: Record<string, any> | null;
};

type ChatPanelProps = {
  config: any;
};

// --- Helper for rendering action UIs ---
const ActionUI: React.FC<{
  action: string;
  payload: any;
  onSubmitLead?: (fields: Record<string, string>, content: any) => void;
  content?: string;
}> = ({ action, payload, onSubmitLead, content }) => {
  console.log(action, payload);
  if (!action) return null;

  // Action: Redirect
  if (action === "redirect" && payload) {
    return (
      <div className="mt-2">
        <Button
          variant="secondary"
          onClick={() => window.open(payload, "_blank")}
        >
          Go to {payload}
        </Button>
      </div>
    );
  }

  // Action: API Call
  if (action === "api_call" && payload?.url) {
    return (
      <div className="mt-2 text-xs opacity-70">
        <span>API Called: </span>
        <code>
          {payload.method?.toUpperCase() || "POST"} {payload.url}
        </code>
      </div>
    );
  }

  // Action: Button
  if (action === "button") {
    return (
      <div className="mt-2">
        <Button
          variant="outline"
          onClick={() => alert("Button action triggered!")}
        >
          {payload?.label || "Action"}
        </Button>
      </div>
    );
  }

  // Action: Collect Leads (form rendering)
  // Action: Collect Leads (form rendering)
  if (action === "collect_leads") {
    const [formData, setFormData] = useState<Record<string, string>>({
      username: "",
      email: "",
      phone: "",
    });

    console.log("rendering action collect leads");

    const fields = [
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone Number" },
    ];

    return (
      <form
        className="flex flex-col gap-2 mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmitLead) onSubmitLead(formData, content);
        }}
      >
        {fields.map((field) => (
          <Input
            key={field.key}
            type={field.key === "email" ? "email" : "text"}
            placeholder={field.label}
            value={formData[field.key] || ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, [field.key]: e.target.value }))
            }
            required
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    );
  }

  // Default: not handled
  return null;


  // Default: not handled
  return null;
};

// --- Main ChatPanel ---
const ChatPanel: React.FC<ChatPanelProps> = ({ config }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hey there, this is your personalized AI assistant. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle sending user message + AI response (with actions)
  const sendMessage = async (leadPayload?: Record<string, string>) => {
    if (!input.trim()) return;

    if (!leadPayload) {
      const userMessage: Message = { role: "user", content: input };
      setMessages(prev => [...prev, userMessage]);
    }
    setInput("");
    setLoading(true);

    try {
      const messagesPayload: any = {
        prompt: input,
        agentId: config._id,
      };
      // if (leadPayload) {
      //   messagesPayload.leadPayload = leadPayload;
      // }

      const response = await axiosInstance.post(
        `/agents/chat/${config._id}`,
        messagesPayload
      );

      console.log("API Response:", response.data);

      const { chatLog, action, action_payload } = response.data || {};

      const aiMessage: Message = {
        role: "ai",
        content: chatLog?.response || "No response.",
        action: action ?? null,
        action_payload: action_payload ?? null,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "ai", content: "Error communicating with AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };


  // Load chat history (no action UI for history by default)
  useEffect(() => {
    if (!config?._id) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstance.get(`/agents/chat/${config._id}`);
        const logs = response.data.chatLogs || [];
        const formatted: Message[] = [];

        logs.forEach((log: any) => {
          if (log.prompt)
            formatted.push({ role: "user", content: log.prompt });
          if (log.response)
            formatted.push({ role: "ai", content: log.response });
        });

        setMessages(
          formatted.length
            ? formatted
            : [
              {
                role: "ai",
                content:
                  "Hey there, this is your personalized AI assistant. How can I help you?",
              },
            ]
        );
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, [config?._id]);

  const sendLead = async (fields: Record<string, string>, content: string) => {
    console.log(fields, content);
    try {
      const response = await axiosInstance.post(`/activity/leads/${config._id}`, {
        name: fields.username,
        email: fields.email,
        phone: fields.phone,
        message: content
      });
      console.log(response);
    } catch (error) {
      console.error("Failed to send lead:", error);
    }
  };

  // Helper: handle leads form submit from ActionUI
  const handleLeadSubmit = (fields: Record<string, string>, content: string) => {
    setInput(""); // Clear any user-typed input
    sendMessage(); // Send as next user message
    sendLead(fields, content); // Also send as lead
  };

  // --- Rendering messages with action UI where appropriate ---
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
            <div>{msg.content}</div>
            {/* Only AI can trigger actions */}
            {msg.role === "ai" && msg.action && msg.action_payload && (
              <ActionUI
                action={msg.action}
                payload={msg.action_payload}
                onSubmitLead={handleLeadSubmit}
                content={msg.content}
              />
            )}
          </div>
        ))}
      </ScrollArea>

      {/* Input bar */}
      <div className="border-t p-4 flex gap-2 bg-background">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <Button onClick={() => sendMessage()} disabled={loading || !input.trim()}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default ChatPanel;
