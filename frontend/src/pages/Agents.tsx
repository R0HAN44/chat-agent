import axiosInstance from "@/api/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAgentStore } from "@/store/useAgentStore";

const sampleAgents = [
  {
    _id: "1",
    userId: "user-123",
    name: "Research Assistant",
    aimodel: "gpt-4",
    systemPrompt: "You are a research assistant helping with academic paper summaries.You are a research assistant helping with academic paper summaries.You are a research assistant helping with academic paper summaries.You are a research assistant helping with academic paper summaries.You are a research assistant helping with academic paper summaries.You are a research assistant helping with academic paper summaries.",
    status: "active",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    _id: "2",
    userId: "user-456",
    name: "Claude Bot",
    aimodel: "claude-3",
    systemPrompt: "You are Claude, assisting users in drafting emails politely.",
    status: "inactive",
    createdAt: "2024-06-02T12:30:00Z",
    updatedAt: "2024-06-02T12:30:00Z",
  },
  {
    _id: "3",
    userId: "user-789",
    name: "Custom Data Agent",
    aimodel: "custom",
    systemPrompt: "You analyze financial reports and provide insights.",
    status: "active",
    createdAt: "2024-06-03T15:45:00Z",
    updatedAt: "2024-06-03T15:45:00Z",
  },
];


interface IAgent {
  _id: string;
  userId: string;
  name: string;
  aimodel: 'gpt-4' | 'claude-3' | 'custom';
  systemPrompt: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const Agents = () => {
  const [agents, setAgents] = useState<IAgent[]>([]);

  const navigate = useNavigate();
  const { setSelectedAgent } = useAgentStore();

  useEffect(() => {
    getAgentsData();
  }, []);

  const getAgentsData = async () => {
    try {
      const response = await axiosInstance.get("/agents");
      setAgents(response.data);
      
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch agents");
    }
  };

  const handleAddAgent = () => {
    // Logic for adding agent (e.g., open modal or navigate)
    navigate(`/create-new-agent/files`);
  };

  const handleAgentClick = (agent: any) => {
    navigate(`/playground`, { state: { agent } });
    setSelectedAgent(agent);
  };


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Agents</h2>
        <Button onClick={handleAddAgent}>Add Agent</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {agents?.map((agent) => (
          <Card
            key={agent._id}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-primary border border-muted"
            onClick={() => handleAgentClick(agent)}
          >

            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {agent.name}
                <Badge variant={agent.status === "active" ? "default" : "destructive"}>
                  {agent.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">
                <span className="font-medium">AI Model:</span> {agent.aimodel}
              </div>
              <div className="text-sm">
                <span className="font-medium">Prompt:</span>{" "}
                {agent.systemPrompt.length > 100
                  ? agent.systemPrompt.slice(0, 100) + "..."
                  : agent.systemPrompt}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Agents;
