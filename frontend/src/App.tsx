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

          {/* Protected Route */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/usage" element={<Usage />} />
              <Route path="/settings" element={<Settings />} />
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
