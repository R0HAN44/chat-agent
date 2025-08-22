import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import { useAgentStore } from "@/store/useAgentStore";

const models = ["gpt-4", "claude-3", "custom"];
const statuses = ["active", "inactive"];

const AgentSettings = () => {
  const { selectedAgent, clearSelectedAgent } = useAgentStore();
  const [agentConfig, setAgentConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (selectedAgent?._id) {
      getAgentSettings();
    }
  }, [selectedAgent?._id]);

  const getAgentSettings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/agents/${selectedAgent?._id}`);
      setAgentConfig(response.data);
    } catch (error) {
      console.error("Error fetching agent settings:", error);
      toast.error("Failed to fetch agent settings.");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: any) => {
    setAgentConfig((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdateAgent = async () => {
    try {
      setLoading(true);
      await axiosInstance.put(`/agents/${agentConfig._id}`, agentConfig);
      toast.success("Agent updated successfully!");
    } catch (error) {
      console.error("Failed to update agent:", error);
      toast.error("Failed to update agent.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async () => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      setDeleting(true);
      await axiosInstance.delete(`/agents/${agentConfig._id}`);
      toast.success("Agent deleted successfully!");
      clearSelectedAgent();
      setAgentConfig(null);
    } catch (error) {
      console.error("Failed to delete agent:", error);
      toast.error("Failed to delete agent.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !agentConfig) {
    return <div>Loading agent settings...</div>;
  }

  if (!agentConfig) {
    return <div>No agent selected.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Agent Name</Label>
        <Input
          value={agentConfig?.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>AI Model</Label>
        <Select
          value={agentConfig?.aimodel}
          onValueChange={(value) => update("aimodel", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models?.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>System Prompt</Label>
        <Textarea
          value={agentConfig?.systemPrompt}
          onChange={(e) => update("systemPrompt", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={agentConfig?.status}
          onValueChange={(value) => update("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statuses?.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={handleUpdateAgent} disabled={loading}>
          {loading ? "Updating..." : "Update Agent"}
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteAgent}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Agent"}
        </Button>
      </div>
    </div>
  );
};

export default AgentSettings;
