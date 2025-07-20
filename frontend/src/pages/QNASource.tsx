import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Check } from "lucide-react";
import { useSourceStore } from "@/store/useSourcesStore";
import axiosInstance from "@/api/axios";
import { useAgentStore } from "@/store/useAgentStore";

type QNAGroup = {
  title: string;
  questions: string[];
  answer: string;
};

const QNASource = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [answer, setAnswer] = useState("");
  const [qnaGroups, setQnaGroups] = useState<QNAGroup[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { addSource, sources } = useSourceStore();
    const { selectedAgent } = useAgentStore();
  

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleSaveGroup = () => {
    const newGroup: QNAGroup = { title, questions, answer };

    if (editingIndex !== null) {
      const updated = [...qnaGroups];
      updated[editingIndex] = newGroup;
      setQnaGroups(updated);
      setEditingIndex(null);
    } else {
      console.log(qnaGroups)
      if(qnaGroups){
        setQnaGroups([...qnaGroups, newGroup]);
      }else{
        setQnaGroups([newGroup]);
      }
      
    }

    // Reset
    setTitle("");
    setQuestions([""]);
    setAnswer("");
  };

  const handleEdit = (index: number) => {
    const group = qnaGroups[index];
    setTitle(group.title);
    setQuestions(group.questions);
    setAnswer(group.answer);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = [...qnaGroups];
    updated.splice(index, 1);
    setQnaGroups(updated);
    if (editingIndex === index) {
      setTitle("");
      setQuestions([""]);
      setAnswer("");
      setEditingIndex(null);
    }
  };

  useEffect(()=>{
      const newSource: any = {
          type: "qna",
          sourcesArray : qnaGroups
        };
      addSource(newSource);
    },[qnaGroups])

    useEffect(()=>{
    getSourcesByAgent()
  },[])

  const getSourcesByAgent = async () => {
    try {
      const response : any = await axiosInstance.get(`/sources?agentId=${selectedAgent?._id}&type=qna`);
      console.log(response)
      if(response.success){
        setQnaGroups(response?.data[0]?.sourcesArray);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 space-y-8">
      {/* QNA Input Card */}
      <Card className="bg-background text-foreground shadow-lg rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Q&A</h2>
          <p className="text-sm text-muted-foreground">
            Create grouped Q&A data to train your AI agent more accurately.
          </p>
        </div>

        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Group title"
          />
        </div>

        {questions.map((q, i) => (
          <div key={i}>
            <Label>Question {i + 1}</Label>
            <Input
              value={q}
              onChange={(e) => handleQuestionChange(i, e.target.value)}
              placeholder={`Enter question ${i + 1}`}
            />
          </div>
        ))}

        <Button variant="ghost" onClick={handleAddQuestion} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add Question
        </Button>

        <div>
          <Label>Answer</Label>
          <Textarea
            rows={5}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Provide a detailed answer"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveGroup}>
            {editingIndex !== null ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              "Save Group"
            )}
          </Button>
        </div>
      </Card>

      {/* Scrollable list of groups */}
      <div className="h-[300px] overflow-y-auto space-y-4 pr-2">
        {qnaGroups?.map((group, idx) => (
          <Card
            key={idx}
            className="bg-background text-foreground rounded-xl p-4 space-y-2 shadow"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{group.title}</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(idx)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(idx)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              {group.questions.map((q, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  Q{i + 1}: {q}
                </p>
              ))}
              <p className="text-sm text-foreground mt-2">
                <span className="font-semibold">Answer:</span> {group.answer}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QNASource;
