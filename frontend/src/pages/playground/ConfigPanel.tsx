import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const models = ['gpt-4', 'claude-3', 'custom'];
const statuses = ['active', 'inactive'];

const ConfigPanel = ({ config }: any) => {
  const [agentConfig, setAgentConfig] = useState(config);
  const [loading, setLoading] = useState(false);

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

      <div className="pt-4">
        <Button onClick={handleUpdateAgent} disabled={loading}>
          {loading ? "Updating..." : "Update Agent"}
        </Button>
      </div>
    </div>
  );
};

export default ConfigPanel;
