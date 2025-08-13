import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useAgentStore } from "@/store/useAgentStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartBar, TrendingUp } from "lucide-react";
import axiosInstance from "@/api/axios";

type UsageLog = {
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
  createdAt: string;
};

type ChatLog = {
  sentiment: "positive" | "neutral" | "negative";
  keywords: string[];
  createdAt: string;
};

const SENTIMENT_COLORS = {
  positive: "bg-green-400",
  neutral: "bg-yellow-400",
  negative: "bg-red-400",
};

const Analytics: React.FC = () => {
  const { selectedAgent } = useAgentStore();

  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data on agent selection
  useEffect(() => {
    if (!selectedAgent?._id) return;

    async function fetchAnalytics() {
      setLoading(true);
      setError("");
      try {
        // Fetch usage logs and chat logs for selected agent
        // const [usageRes, chatRes] = await Promise.all([
        //   axios.get(`/api/usage/?agentId=${selectedAgent?._id}`),
        //   axios.get(`/api/chat-logs?agentId=${selectedAgent?._id}`),
        // ]);
        const usageRes = await axiosInstance.get(`/analytics/usage-logs/${selectedAgent?._id}`);
        const chatRes = await axiosInstance.get(`/analytics/chat-logs/${selectedAgent?._id}`);

        // Ensure data are arrays
        setUsageLogs(Array.isArray(usageRes?.data) ? usageRes.data : []);
        setChatLogs(Array.isArray(chatRes?.data) ? chatRes.data : []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [selectedAgent?._id]);

  // Analytics computations
  const totalChats = chatLogs.length || 0;
  const totalPrompts = usageLogs.length || 0;

  const totalPromptTokens =
    Array.isArray(usageLogs) && usageLogs.length > 0
      ? usageLogs.reduce((acc, log) => acc + (log.promptTokens || 0), 0)
      : 0;
  const totalResponseTokens =
    Array.isArray(usageLogs) && usageLogs.length > 0
      ? usageLogs.reduce((acc, log) => acc + (log.responseTokens || 0), 0)
      : 0;
  const totalTokens =
    Array.isArray(usageLogs) && usageLogs.length > 0
      ? usageLogs.reduce((acc, log) => acc + (log.totalTokens || 0), 0)
      : 0;

  const avgPromptTokens =
    totalPrompts > 0 ? (totalPromptTokens / totalPrompts).toFixed(1) : "0";
  const avgResponseTokens =
    totalPrompts > 0 ? (totalResponseTokens / totalPrompts).toFixed(1) : "0";
  const avgTotalTokens =
    totalPrompts > 0 ? (totalTokens / totalPrompts).toFixed(1) : "0";

  // Sentiment distribution count (memoized)
  const sentimentCount = useMemo(() => {
    const counts = { positive: 0, neutral: 0, negative: 0 };
    chatLogs.forEach((cl) => {
      const s = cl.sentiment || "neutral";
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [chatLogs]);

  // Top keywords frequency map (memoized)
  const keywordFrequency = useMemo(() => {
    const freq: Record<string, number> = {};
    chatLogs.forEach(({ keywords }) => {
      keywords.forEach((kw) => {
        freq[kw.toLowerCase()] = (freq[kw.toLowerCase()] || 0) + 1;
      });
    });
    return freq;
  }, [chatLogs]);

  // Sorted keywords for display (top 20)
  const sortedKeywords = Object.entries(keywordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  // Date formatting helper
  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Sentiment data for bar chart
  const sentimentData = [
    { name: "Positive", count: sentimentCount.positive, fill: "#34D399" },
    { name: "Neutral", count: sentimentCount.neutral, fill: "#FBBF24" },
    { name: "Negative", count: sentimentCount.negative, fill: "#F87171" },
  ];

  if (loading)
    return (
      <p className="p-4 text-center text-gray-300">Loading analytics...</p>
    );
  if (error)
    return (
      <p className="p-4 text-center text-red-500">
        Error loading data: {error}
      </p>
    );

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg max-w-7xl mx-auto h-full flex flex-col">
      <h1 className="text-3xl font-semibold mb-6 text-white flex items-center gap-2">
        <TrendingUp size={28} /> Agent Analytics
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Chats"
          value={totalChats}
          icon={<ChartBar size={24} />}
        />
        <SummaryCard
          title="Total Prompts"
          value={totalPrompts}
          icon={<ChartBar size={24} />}
        />
        <SummaryCard
          title="Total Tokens Used"
          value={totalTokens}
          icon={<ChartBar size={24} />}
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Avg Prompt Tokens" value={avgPromptTokens} />
        <SummaryCard title="Avg Response Tokens" value={avgResponseTokens} />
        <SummaryCard title="Avg Total Tokens" value={avgTotalTokens} />
      </div>

      {/* Sentiment Distribution and Keywords */}
      <div className="flex gap-8 flex-wrap">
        {/* Sentiment Distribution */}
        <div className="flex-1 bg-gray-800 rounded-lg p-4 shadow-sm max-w-xl">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Sentiment Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={sentimentData}
              layout="vertical"
              margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={80}
                tick={{ fill: "white" }}
              />
              <Tooltip
                wrapperStyle={{ backgroundColor: "#1f2937", borderRadius: 8 }}
                contentStyle={{ backgroundColor: "#374151", borderRadius: 8 }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="count" fill="#8884d8">
                {sentimentData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Keywords List */}
        <div className="flex-1 bg-gray-800 rounded-lg p-4 shadow-sm max-w-xl max-h-[260px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-white">Top Keywords</h3>
          {sortedKeywords.length === 0 ? (
            <p className="text-sm text-gray-300">No keywords found.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {sortedKeywords.map(([keyword, count]) => (
                <li
                  key={keyword}
                  className="bg-primary/20 text-primary-foreground rounded-full px-3 py-1 text-sm font-medium"
                  title={`${keyword} (${count})`}
                >
                  {keyword} ({count})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Chat Activity */}
      <ScrollArea className="mt-8 flex-1 border border-gray-700 rounded bg-gray-900 p-4 overflow-auto">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Recent Chat Activity
        </h3>
        {chatLogs.length === 0 ? (
          <p className="text-sm text-gray-300">No chat logs available.</p>
        ) : (
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {chatLogs.slice(0, 20).map(({ sentiment, keywords, createdAt }, idx) => (
              <li
                key={idx}
                className="p-3 rounded border border-gray-700 bg-gray-800 flex flex-col"
                title={`Sentiment: ${sentiment}`}
              >
                <span className="text-gray-200">
                  <strong>Date:</strong> {formatDate(createdAt)}
                </span>
                <span className="text-gray-200">
                  <strong>Sentiment:</strong>{" "}
                  <span
                    className={`rounded px-2 py-0.5 text-xs text-white ${SENTIMENT_COLORS[sentiment]}`}
                  >
                    {sentiment}
                  </span>
                </span>
                <span className="text-gray-200">
                  <strong>Keywords:</strong> {keywords.join(", ") || "None"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};

// SummaryCard component for displaying individual stats
const SummaryCard: React.FC<{
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}> = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4">
      {icon && <div className="text-white">{icon}</div>}
      <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-1">{title}</h4>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default Analytics;
