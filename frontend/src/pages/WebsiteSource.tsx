import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Pencil, Trash2, Check } from "lucide-react";
import { useSourceStore } from "@/store/useSourcesStore";

type FetchedGroup = {
  url: string;
  links: string[];
};

const WebsiteSource = () => {
  const [url, setUrl] = useState("");
  const [includePath, setIncludePath] = useState("");
  const [excludePath, setExcludePath] = useState("");
  const [fetchedGroups, setFetchedGroups] = useState<FetchedGroup[]>([]);
  const [editing, setEditing] = useState<{ groupIdx: number; linkIdx: number } | null>(null);
  const [editedLink, setEditedLink] = useState("");

  const { addSource } = useSourceStore();


  const handleFetchLinks = () => {
    if (!url) return;

    const dummyLinks = [
      `${url}/about`,
      `${url}/blog`,
      `${url}/products/item-1`,
      `${url}/products/item-2`,
    ];

    const filteredLinks = dummyLinks.filter(link => {
      const path = new URL(link).pathname;
      const includeMatch = includePath ? path.includes(includePath) : true;
      const excludeMatch = excludePath ? !path.includes(excludePath) : true;
      return includeMatch && excludeMatch;
    });

    const newGroup: FetchedGroup = { url, links: filteredLinks };
    setFetchedGroups(prev => [...prev, newGroup]);

    // Clear form
    setUrl("");
    setIncludePath("");
    setExcludePath("");
  };

  const handleDeleteLink = (groupIdx: number, linkIdx: number) => {
    const updatedGroups = [...fetchedGroups];
    updatedGroups[groupIdx].links.splice(linkIdx, 1);
    setFetchedGroups(updatedGroups);
  };

  const handleEditLink = (groupIdx: number, linkIdx: number) => {
    setEditing({ groupIdx, linkIdx });
    setEditedLink(fetchedGroups[groupIdx].links[linkIdx]);
  };

  const handleSaveEdit = () => {
    if (editing) {
      const updatedGroups = [...fetchedGroups];
      updatedGroups[editing.groupIdx].links[editing.linkIdx] = editedLink;
      setFetchedGroups(updatedGroups);
      setEditing(null);
      setEditedLink("");
    }
  };

  useEffect(() => {
    const newSource: any = {
      type: "website",
      sourcesArray: fetchedGroups
    };
    addSource(newSource);
  }, [fetchedGroups])

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 space-y-8">
      {/* Website Source Input */}
      <Card className="bg-background text-foreground shadow-lg rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-1">Link</h2>
          <p className="text-sm text-muted-foreground">
            Crawl specific web pages or submit sitemaps to continuously update your AI with the latest content. Configure included and excluded paths to refine what your AI learns.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <Label htmlFor="include-path">Include Only Path</Label>
            <Input
              id="include-path"
              value={includePath}
              onChange={(e) => setIncludePath(e.target.value)}
              placeholder="/blog"
            />
          </div>
          <div>
            <Label htmlFor="exclude-path">Exclude Path</Label>
            <Input
              id="exclude-path"
              value={excludePath}
              onChange={(e) => setExcludePath(e.target.value)}
              placeholder="/admin"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleFetchLinks}>
              <Globe className="w-4 h-4 mr-2" /> Fetch Links
            </Button>
          </div>
        </div>
      </Card>

      {/* Fetched Groups Display */}
      <div className="h-[400px] overflow-y-auto space-y-4 pr-2">
        {fetchedGroups.map((group, groupIdx) => (
          <Card
            key={groupIdx}
            className="bg-background text-foreground shadow-md rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-2">
              Fetched from:{" "}
              <span className="text-muted-foreground break-all">{group.url}</span>
            </h3>

            {group.links.length === 0 ? (
              <p className="text-sm text-muted-foreground">No links found.</p>
            ) : (
              <ul className="space-y-2 mt-2">
                {group.links.map((link, linkIdx) => (
                  <li
                    key={linkIdx}
                    className="flex justify-between items-center border rounded px-3 py-2 bg-muted/10"
                  >
                    {editing?.groupIdx === groupIdx &&
                      editing?.linkIdx === linkIdx ? (
                      <>
                        <Input
                          value={editedLink}
                          onChange={(e) => setEditedLink(e.target.value)}
                          className="mr-2"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditing(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-sm break-all">{link}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditLink(groupIdx, linkIdx)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteLink(groupIdx, linkIdx)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>


    </div>
  );
};

export default WebsiteSource;
