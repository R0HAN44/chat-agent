import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check } from "lucide-react";
import { useSourceStore } from "@/store/useSourcesStore";

const TextSource = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [textSources, setTextSources] = useState<{ title: string; content: string }[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

    const { addSource } = useSourceStore();
  

  const handleAddOrUpdate = () => {
    if (!title.trim() || !content.trim()) return;

    if (editIndex !== null) {
      // Update existing item
      const updated = [...textSources];
      updated[editIndex] = { title, content };
      setTextSources(updated);
      setEditIndex(null);
    } else {
      // Add new item
      setTextSources([...textSources, { title, content }]);
    }

    setTitle("");
    setContent("");
  };

  const handleEdit = (index: number) => {
    const item = textSources[index];
    setTitle(item.title);
    setContent(item.content);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = [...textSources];
    updated.splice(index, 1);
    setTextSources(updated);

    // If you're deleting the item being edited, reset the form
    if (editIndex === index) {
      setEditIndex(null);
      setTitle("");
      setContent("");
    }
  };

  useEffect(()=>{
    const newSource: any = {
        type: "text",
        sourcesArray : textSources
      };
    addSource(newSource);
  },[textSources])

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 space-y-8">
      {/* Add/Edit Text Card */}
      <Card className="bg-background text-foreground shadow-lg rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-1">Text</h2>
          <p className="text-sm text-muted-foreground">
            Add and process plain text-based sources to train your AI Agent with precise information.
          </p>
        </div>

        <div className="mb-4">
          <Label htmlFor="title" className="block mb-1">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your text snippet"
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="text" className="block mb-1">Text Content</Label>
          <Textarea
            id="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your text here..."
            className="h-48"
          />
        </div>

        <div className="flex justify-end gap-3">
          {editIndex !== null && (
            <Button
              variant="outline"
              onClick={() => {
                setEditIndex(null);
                setTitle("");
                setContent("");
              }}
            >
              Cancel
            </Button>
          )}
          <Button onClick={handleAddOrUpdate}>
            {editIndex !== null ? <><Check className="h-4 w-4 mr-1" /> Save Changes</> : "Add Text Snippet"}
          </Button>
        </div>
      </Card>

      {/* Text List Card */}
      <Card className="bg-background text-foreground shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Text Sources</h3>
        {textSources.length === 0 ? (
          <p className="text-sm text-muted-foreground">No text sources added yet.</p>
        ) : (
          <ul className="space-y-4">
            {textSources.map((source, index) => (
              <li key={index} className="border rounded-lg p-4 bg-muted/10">
                <h4 className="font-medium mb-1">{source.title}</h4>
                <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">{source.content}</p>
                <div className="flex gap-3">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(index)}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(index)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default TextSource;
