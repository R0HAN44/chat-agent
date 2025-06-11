import ConfigPanel from "./ConfigPanel";
import ChatPanel from "./ChatPanel";
import { useAgentStore } from "@/store/useAgentStore";

const Playground = () => {
  const { selectedAgent } = useAgentStore();

  return (
    <div className="grid grid-cols-2 gap-4 p-4" style={{ height: "calc(100vh - 100px)" }}>
      {/* Left - Config Panel */}
      <div className="overflow-y-auto pr-2">
        <h2 className="text-xl font-semibold mb-4">AI Agent Configuration</h2>
        <ConfigPanel config={selectedAgent} />
      </div>

      {/* Right - Chat Panel */}
      <div className="flex flex-col h-full overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">Chat Interface</h2>
        <div className="flex-1 overflow-hidden">
          <ChatPanel config={selectedAgent} />
        </div>
      </div>
    </div>
  );
};

export default Playground;
