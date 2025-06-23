// src/layouts/SourceLayout.tsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSourceStore } from "@/store/useSourcesStore";
import { useEffect, useState } from "react";
import { DEFAULT_PROMPT } from "@/utils/systemPrompts";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";
import { useAgentStore } from "@/store/useAgentStore";

const navItems = [
  { label: "Files", path: "files" },
  { label: "Text", path: "text" },
  { label: "Website", path: "website" },
  { label: "QNA", path: "qna" },
];

const SourceLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.includes(path);

  const [agentTitle, setAgentTitle] = useState("")
  const [filesDetails,setFilesDetails] = useState({numberOfFiles : 0, size : 0})

  const { sources } = useSourceStore();
  console.log(sources)
  const { selectedAgent } = useAgentStore();

  const retrainAgent = async () => {
    let response: any;
    for (const source of sources) {
      try {
        response = await axiosInstance.post("/sources", { ...source, agentId: selectedAgent?._id });
        console.log("Source created:", response.data);
      } catch (err) {
        console.error("Error creating source:", err);
      }
    }
    if (response.success) {
      toast.success("Agent Created successfully");
      navigate("/agents")
    }
  };

  useEffect(() => {
    let totalSizeMB = 0;
    let totalFiles = 0;

    totalFiles = sources.reduce((acc: number, source: any) => {
      if (source.type === "document") {
        return acc + 1; // each document is 1 file
      } else {
        return acc + (source.sourcesArray?.length || 0);
      }
    }, 0);

    totalSizeMB = sources.reduce((acc: number, source: any) => {
      if (source.type === "document") {
        return acc + (source.metadata?.size || 0) / 1_000_000; // bytes to MB
      } else {
        return acc + (source.sourcesArray?.length || 0) / 1000; // approximate size
      }
    }, 0);
    setFilesDetails({ numberOfFiles: totalFiles, size: Number(totalSizeMB.toFixed(2)) })
  }, [sources]);

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Left Sidebar */}
      <aside className="w-56 border-r bg-background p-4">
        <NavigationMenu orientation="vertical">
          <NavigationMenuList className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <NavigationMenuLink
                  className={cn(
                    "w-full px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  )}
                  onClick={() => navigate(`/sources/${item.path}`)}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>

      {/* Right Sidebar */}
      <aside className="w-72 border-l bg-background p-4 hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Source Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm mb-4 space-y-1 text-muted-foreground">
              <p><strong className="text-foreground">Total Files:</strong> {filesDetails.numberOfFiles}</p>
              <p><strong className="text-foreground">Total Size:</strong> {filesDetails.size} MB</p>
            </div>
            <div className="space-y-2">
              <Button onClick={retrainAgent} variant="secondary" className="w-full">
                Retrain Agent
              </Button>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
};

export default SourceLayout;
