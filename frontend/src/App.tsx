import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import Agents from "./pages/Agents";
import Usage from "./pages/Usage";
import Settings from "./pages/Settings";
import { Toaster } from "sonner";
import Playground from "./pages/playground/Playground";
import AgentDetailLayout from "./components/AgentDetailLayout";
import Sources from "./pages/Sources";
import Activity from "./pages/Activity";
import Analytics from "./pages/Analytics";
import Actions from "./pages/Actions";
import Connect from "./pages/Connect";
import AgentSettings from "./pages/AgentSettings";
import SourceLayout from "./components/SourceLayout";
import FilesSource from "./pages/FilesSource";
import TextSource from "./pages/TextSource";
import WebsiteSource from "./pages/WebsiteSource";
import QNASource from "./pages/QNASource";
import CreateAgentSourceLayout from "./components/CreateAgentSourceLayout";
import ChatEmbed from "./pages/ChatEmbed";
import Integrate from "./pages/Integrate";


const isAuthenticated = () => {
  return !!localStorage.getItem("chat-agent-token");
};

function App() {

  return (
    <>

      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/embed/:botId" element={<ChatEmbed />} />

            {/* Protected Route */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/agents" element={<Agents />} />
                <Route path="/usage" element={<Usage />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route element={<AgentDetailLayout />}>
                <Route path="/playground" element={<Playground />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/actions" element={<Actions />} />
                <Route path="/integrate" element={<Integrate />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/agent-settings" element={<AgentSettings />} />
                <Route element={<SourceLayout />}>
                  <Route path="/sources/:id" element={<FilesSource />} />
                  <Route path="/sources" element={<FilesSource />} />
                  <Route path="/sources/files" element={<FilesSource />} />
                  <Route path="/sources/text" element={<TextSource />} />
                  <Route path="/sources/website" element={<WebsiteSource />} />
                  <Route path="/sources/qna" element={<QNASource />} />
                </Route>
              </Route>
              <Route element={<CreateAgentSourceLayout />}>
                <Route path="/create-new-agent/files" element={<FilesSource />} />
                <Route path="/create-new-agent/text" element={<TextSource />} />
                <Route path="/create-new-agent/website" element={<WebsiteSource />} />
                <Route path="/create-new-agent/qna" element={<QNASource />} />
              </Route>

            </Route>

            <Route
              path="*"
              element={<Navigate to={isAuthenticated() ? "/agents" : "/login"} replace />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
