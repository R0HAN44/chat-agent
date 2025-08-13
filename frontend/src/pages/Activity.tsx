import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAgentStore } from "@/store/useAgentStore";
import { ThumbsUp, ThumbsDown, Edit2, Save, X, Minus } from "lucide-react";

interface IChatLog {
  _id: string;
  userId: string;
  agentId: string;
  prompt: string;
  response: string;
  createdAt: string;
  sentiment: "positive" | "neutral" | "negative";
  keywords: string[];
}

interface ILead {
  _id: string;
  userId: string;
  agentId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
}

type TabType = "chatlogs" | "leads";

const Activity = () => {
  const { selectedAgent } = useAgentStore();
  const [activeTab, setActiveTab] = useState<TabType>("chatlogs");
  const [chatLogs, setChatLogs] = useState<IChatLog[]>([]);
  const [leads, setLeads] = useState<ILead[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editResponse, setEditResponse] = useState("");

  useEffect(() => {
    if (!selectedAgent?._id) return;
    if (activeTab === "chatlogs") {
      fetchChatLogs();
    } else {
      fetchLeads();
    }
  }, [activeTab, selectedAgent]);

  const fetchChatLogs = async () => {
    if (!selectedAgent?._id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `activity/chats/${selectedAgent._id}`
      );
      setChatLogs(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch chat logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    if (!selectedAgent?._id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `activity/leads/${selectedAgent._id}`
      );
      setLeads(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const handleSetSentiment = async (
    chatId: string,
    sentiment: "positive" | "neutral" | "negative"
  ) => {
    try {
      await axiosInstance.put(`activity/updatechatlog/${chatId}`, { sentiment });
      toast.success(`Marked as ${sentiment}`);
      fetchChatLogs();
    } catch (err: any) {
      toast.error("Failed to update sentiment");
    }
  };

  const handleEditStart = (chat: IChatLog) => {
    setEditingChatId(chat._id);
    setEditResponse(chat.response);
  };

  const handleEditCancel = () => {
    setEditingChatId(null);
    setEditResponse("");
  };

  const handleEditSave = async (chatId: string) => {
    try {
      await axiosInstance.put(`activity/updatechatlog/${chatId}`, {
        response: editResponse,
      });
      toast.success("Response updated");
      setEditingChatId(null);
      fetchChatLogs();
    } catch (err: any) {
      toast.error("Failed to update response");
    }
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === "chatlogs" ? "default" : "outline"}
          onClick={() => setActiveTab("chatlogs")}
        >
          Chat Logs
        </Button>
        <Button
          variant={activeTab === "leads" ? "default" : "outline"}
          onClick={() => setActiveTab("leads")}
        >
          Leads
        </Button>
      </div>

      {!selectedAgent && (
        <div className="text-muted-foreground italic mb-4">
          Please select an agent to view activity.
        </div>
      )}

      {loading && (
        <div className="text-sm text-muted-foreground">Loading...</div>
      )}

      {/* Chat Logs Tab */}
      {activeTab === "chatlogs" && !loading && (
        <div className="space-y-4">
          {chatLogs.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No chat logs found.
            </div>
          )}
          {chatLogs.map((chat) => (
            <Card key={chat._id} className="border border-muted">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate text-base">{chat.prompt}</span>
                  <Badge variant="outline" className="capitalize">
                    {chat.sentiment}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Response:</span>
                  {editingChatId === chat._id ? (
                    <div className="mt-2 space-y-2">
                      <Textarea
                        value={editResponse}
                        onChange={(e) => setEditResponse(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditSave(chat._id)}
                        >
                          <Save className="w-4 h-4 mr-1" /> Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditCancel}
                        >
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 whitespace-pre-wrap">{chat.response}</p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(chat.createdAt).toLocaleString()}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSetSentiment(chat._id, "positive")}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" /> Like
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSetSentiment(chat._id, "negative")}
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" /> Dislike
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSetSentiment(chat._id, "neutral")}
                  >
                    <Minus className="w-4 h-4 mr-1" /> Neutral
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditStart(chat)}
                  >
                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === "leads" && !loading && (
        <div className="space-y-4">
          {leads.length === 0 && (
            <div className="text-sm text-muted-foreground">No leads found.</div>
          )}
          {leads.map((lead) => (
            <Card key={lead._id} className="border border-muted">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {lead.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Email:</span> {lead.email}
                </div>
                {lead.phone && (
                  <div>
                    <span className="font-medium">Phone:</span> {lead.phone}
                  </div>
                )}
                {lead.message && (
                  <div>
                    <span className="font-medium">Message:</span>{" "}
                    {lead.message}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {new Date(lead.createdAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
