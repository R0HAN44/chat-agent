import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAgentStore } from "@/store/useAgentStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

export type ActionType = 'api_call' | 'button' | 'redirect' | 'collect_leads';

interface IAction {
  _id?: string;
  agentId: string;
  name: string;
  type: ActionType;
  payload: Record<string, any>;
  createdBy?: string;
  createdAt?: string;
}

const defaultForm = (agentId: string): IAction => ({
  agentId,
  name: "",
  type: "api_call",
  payload: {},
});

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"];

// Example functions for demonstration
const availableFunctions = [
  { name: "FetchUser", id: "fetchUser" },
  { name: "SendEmail", id: "sendEmail" },
];

const Actions = () => {
  const [actions, setActions] = useState<IAction[]>([]);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingAction, setEditingAction] = useState<IAction | null>(null);
  const [form, setForm] = useState<IAction>(defaultForm(""));
  const { selectedAgent } = useAgentStore();

  // Lead fields for collect_leads
  const [leadFields, setLeadFields] = useState<{ label: string; key: string }[]>([{ label: "", key: "" }]);

  useEffect(() => {
    if (selectedAgent?._id) {
      setForm(defaultForm(selectedAgent._id));
      getActionsForAgent(selectedAgent._id);
    }
  }, [selectedAgent]);

  useEffect(() => {
    if (form.type === "collect_leads" && form.payload?.fields) {
      setLeadFields(form.payload.fields);
    }
  }, [form.type, form.payload]);


  const getActionsForAgent = async (agentId: string) => {
    try {
      const res = await axiosInstance.get(`/actions/${agentId}`);
      setActions(res.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch actions");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.type) {
        toast.error("Action name and type are required");
        return;
      }

      if (form.type === "api_call" && form.payload.body) {
        try {
          JSON.parse(form.payload.body);
        } catch {
          toast.error("Invalid JSON in payload body");
          return;
        }
      }
      // Create a clone with the correct payload for collect_leads
      let submitForm = { ...form };
      if (form.type === "collect_leads") {
        const filteredFields = leadFields.filter(
          field => field.label.trim() !== "" || field.key.trim() !== ""
        );

        submitForm.payload = {
          ...form.payload, // retain original payload keys such as `trigger`
          fields: filteredFields,
        };
      }


      console.log(submitForm);
      // Use submitForm in your API call:
      if (mode === "create") {
        await axiosInstance.post("/actions", submitForm);
        toast.success("Action created");
      } else if (mode === "edit" && editingAction?._id) {
        console.log(editingAction)
        await axiosInstance.put(`/actions/${editingAction._id}`, submitForm);
        toast.success("Action updated");
      }
      setMode("list");
      setForm(defaultForm(selectedAgent?._id || ""));
      setEditingAction(null);
      getActionsForAgent(selectedAgent?._id || "");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit action");
    }
  };


  const handleEdit = (action: IAction) => {
    setEditingAction(action);
    setForm(action);
    setMode("edit");
    if (action.type === "collect_leads" && action.payload?.fields) {
      setLeadFields(action.payload.fields);
    }
  };

  const handleDelete = async (actionId: string) => {
    if (!window.confirm("Are you sure you want to delete this action?")) return;

    try {
      await axiosInstance.delete(`/actions/${actionId}`);
      toast.success("Action deleted");
      getActionsForAgent(selectedAgent?._id || "");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete action");
    }
  };


  const handleCancel = () => {
    setMode("list");
    setEditingAction(null);
    setForm(defaultForm(selectedAgent?._id || ""));
    setLeadFields([{ label: "", key: "" }]);
  };

  const handleChange = (field: keyof IAction, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // HANDLER for fields within 'payload'
  const handlePayloadField = (payloadKey: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      payload: { ...prev.payload, [payloadKey]: value },
    }));
  };

  // For raw JSON editing
  const handlePayloadChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setForm((prev) => ({ ...prev, payload: parsed }));
    } catch (err) {
      // Optionally show JSON parse error in UI
    }
  };

  // collect_leads methods
  const handleLeadFieldChange = (idx: number, field: "label" | "key", value: string) => {
    setLeadFields((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addLeadField = () => setLeadFields((prev) => [...prev, { label: "", key: "" }]);
  const removeLeadField = (idx: number) => setLeadFields((prev) => prev.filter((_, i) => i !== idx));

  // FORMS PER ACTION TYPE:
  const renderPayloadForm = () => {
    // Common trigger input that will appear on all types
    const triggerInput = (
      <div>
        <label className="block mb-1 text-sm font-medium">Trigger</label>
        <Input
          placeholder="Trigger event or condition"
          value={form.payload.trigger || ""}
          onChange={e => handlePayloadField("trigger", e.target.value)}
        />
      </div>
    );

    switch (form.type) {
      case "api_call":
        return (
          <>
            {triggerInput}
            <div>
              <label className="block mb-1 text-sm font-medium">API URL</label>
              <Input
                value={form.payload.url || ""}
                onChange={e => handlePayloadField("url", e.target.value)}
                placeholder="https://api.example.com/resource"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">HTTP Method</label>
              <select
                className="w-full border px-3 py-2 rounded-md text-sm"
                value={form.payload.method || "GET"}
                onChange={(e) => handlePayloadField("method", e.target.value)}
              >
                {HTTP_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">JSON Payload</label>
              <Textarea
                className="min-h-[60px]"
                value={form.payload.body || ""}
                onChange={e => handlePayloadField("body", e.target.value)}  // direct string update, no JSON parsing
                placeholder='{ "foo": "bar" }'
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Result Accessor</label>
              <Input
                value={form.payload.result_accessor || ""}
                onChange={e => handlePayloadField("result_accessor", e.target.value)}
                placeholder="e.g. data.result or leave empty"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">API Key</label>
              <Input
                type="password"
                value={form.payload.apiKey || ""}
                onChange={e => handlePayloadField("apiKey", e.target.value)}
                placeholder="Enter API key if required"
                autoComplete="off"
              />
            </div>
          </>
        );

      case "redirect":
        return (
          <>
            {triggerInput}
            <div>
              <label className="block mb-1 text-sm font-medium">Destination URL</label>
              <Input
                value={form.payload.url || ""}
                onChange={e => handlePayloadField("url", e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>
          </>
        );

      case "button":
        return (
          <>
            {triggerInput}
            <div>
              <label className="block mb-1 text-sm font-medium">Display Name</label>
              <Input
                value={form.payload.displayName || ""}
                onChange={e => handlePayloadField("displayName", e.target.value)}
                placeholder="e.g. Click Me"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Function to Call</label>
              <select
                className="w-full border px-3 py-2 rounded-md text-sm"
                value={form.payload.functionId || ""}
                onChange={e => handlePayloadField("functionId", e.target.value)}
              >
                <option value="">-- Select Function --</option>
                {availableFunctions.map(fn => (
                  <option key={fn.id} value={fn.id}>{fn.name}</option>
                ))}
              </select>
            </div>
          </>
        );

      case "collect_leads":
        return (
          <>
            {triggerInput}
            <div>
              <label className="block mb-1 text-sm font-medium">Form Fields</label>
              <div className="space-y-2">
                {leadFields.map((field, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      className="flex-1"
                      placeholder="Label (e.g. Email)"
                      value={field.label}
                      onChange={e => handleLeadFieldChange(i, "label", e.target.value)}
                    />
                    <Input
                      className="flex-1"
                      placeholder="Key (e.g. email)"
                      value={field.key}
                      onChange={e => handleLeadFieldChange(i, "key", e.target.value)}
                    />
                    <Button type="button" size="icon" onClick={() => removeLeadField(i)} disabled={leadFields.length <= 1}>-</Button>
                  </div>
                ))}
                <Button type="button" variant="ghost" onClick={addLeadField}>Add Field</Button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          {mode === "list" ? "Actions" : mode === "create" ? "Create Action" : "Edit Action"}
        </h2>
        {mode === "list" ? (
          <Button onClick={() => setMode("create")}>Add Action</Button>
        ) : (
          <Button variant="destructive" onClick={handleCancel}>Cancel</Button>
        )}
      </div>
      {!selectedAgent && (
        <div className="text-muted-foreground text-sm italic mb-4">
          Select an agent to view its actions.
        </div>
      )}

      {mode === "list" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Card
              key={action._id}
              className="relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-primary border border-muted"
              onClick={() => handleEdit(action)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {action.name}
                  <Badge variant="outline">{action.type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="mb-1">
                  <span className="font-medium">Created:</span>{" "}
                  {action.createdAt ? new Date(action.createdAt).toLocaleString() : "-"}
                </div>
              </CardContent>

              {/* Delete button in bottom right */}
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent edit trigger
                  if (action._id) handleDelete(action._id);
                }}
                className="absolute bottom-2 right-2 rounded-full bg-red-500 hover:bg-red-800 text-white cursor-pointer"
                aria-label={`Delete action ${action.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}

        </div>
      )}

      {mode !== "list" && (
        <div className="max-w-xl space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <Input
              placeholder="Action name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Type</label>
            <select
              className="w-full border px-3 py-2 rounded-md text-sm"
              value={form.type}
              onChange={(e) => {
                const type = e.target.value as ActionType;
                setForm({
                  ...form,
                  type,
                  payload: {},
                });
                if (type === "collect_leads") setLeadFields([{ label: "", key: "" }]);
              }}
            >
              <option value="api_call">API Call</option>
              <option value="button">Button</option>
              <option value="redirect">Redirect</option>
              <option value="collect_leads">Collect Leads</option>
            </select>
          </div>
          {renderPayloadForm()}
          <Button onClick={handleSubmit}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Actions;
