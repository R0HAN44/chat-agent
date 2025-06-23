import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, Trash2 } from "lucide-react";
import { useSourceStore } from "@/store/useSourcesStore";
import axiosInstance from "@/api/axios";
import { useAgentStore } from "@/store/useAgentStore";

const MAX_FILE_SIZE_MB = 1;

const FilesSource = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [filesData, setFilesData] = useState<any[]>([]);

  const { addSource } = useSourceStore();
  const { selectedAgent } = useAgentStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setUploadedFileName(null);

    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError("File must be less than 1MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axiosInstance.post("/sources/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const fileUrl = response.data.fileUrl;

      const newSource: any = {
        type: "document",
        title: file.name,
        fileUrl,
        metadata: {
          size: file.size,
          type: file.type,
        },
        agentId: selectedAgent?._id,
      };
        addSource(newSource);
        setUploadedFileName(file.name);

    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const getSourcesByAgent = async () => {
    try {
      const response: any = await axiosInstance.get(`/sources?agentId=${selectedAgent?._id}&type=document`);
      if (response.success) {
        setFilesData(response.data);
      }
    } catch (error) {
      console.log("Fetch error", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response : any = await axiosInstance.delete(`/sources/${id}`);
      if (response.success) {
        setFilesData(prev => prev.filter(file => file._id !== id));
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  useEffect(() => {
    if (selectedAgent?._id) {
      getSourcesByAgent();
    }
  }, [selectedAgent]);

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mt-10 bg-background text-foreground shadow-lg rounded-2xl p-6">
        {/* Top Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-1">Files</h2>
          <p className="text-sm text-muted-foreground">
            The Files tab allows you to upload and manage various document types to train your AI agent.
          </p>
        </div>

        {/* File Upload Section */}
        <CardContent className="flex flex-col items-center justify-center border-2 border-dashed border-muted p-10 rounded-lg bg-muted/10 hover:bg-muted/20 transition">
          <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
          <Label htmlFor="file-upload" className="cursor-pointer font-medium">
            {uploading ? "Uploading..." : "Click to upload a file"}
          </Label>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Only PDF, DOCX, TXT, etc. (max 1MB)
          </p>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          {uploadedFileName && (
            <p className="text-sm text-green-600 mt-3">Uploaded: {uploadedFileName}</p>
          )}
        </CardContent>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          If you are uploading a PDF, make sure you can select/highlight the text.
        </p>
      </Card>

      {/* Render Uploaded Files */}
      {filesData.length > 0 && (
        <div className="w-full max-w-2xl mx-auto mt-6 space-y-4">
          <h3 className="text-lg font-medium mb-2">Uploaded Files</h3>
          {filesData?.map((file) => (
            <Card key={file._id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{file.title}</p>
                <p className="text-xs text-muted-foreground">{(file.metadata?.type || "Unknown")} - {(file.metadata?.size / 1024).toFixed(1)} KB</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(file._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default FilesSource;
