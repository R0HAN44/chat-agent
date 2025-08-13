import { useState } from "react";
import { useAgentStore } from "@/store/useAgentStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const Integrate = () => {
  const { selectedAgent } = useAgentStore();

  const embedUrl = selectedAgent?._id
    ? `http://localhost:5173/embed/${selectedAgent._id}`
    : "";

  const scriptSnippet = selectedAgent?._id
    ? `<script src="https://localhost:5173/widget.js" data-bot-id="${selectedAgent._id}"></script>`
    : "";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleOpenInNewTab = () => {
    if (embedUrl) {
      window.open(embedUrl, "_blank");
    }
  };

  if (!selectedAgent) {
    return (
      <div className="p-6 text-muted-foreground italic">
        Please select an agent to view integration options.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Embed via iFrame */}
      <Card>
        <CardHeader>
          <CardTitle>iFrame Embed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <iframe
            src={embedUrl}
            title="Chatbot Embed"
            className="w-full border rounded-md min-h-[400px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleOpenInNewTab}>Open in New Tab</Button>
            <Button
              variant="outline"
              onClick={() => handleCopy(embedUrl)}
            >
              <Copy className="w-4 h-4 mr-1" /> Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Script Embed */}
      <Card>
        <CardHeader>
          <CardTitle>Script Embed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto flex justify-between items-center">
            <code>{scriptSnippet}</code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(scriptSnippet)}
            >
              <Copy className="w-4 h-4 mr-1" /> Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrate;
