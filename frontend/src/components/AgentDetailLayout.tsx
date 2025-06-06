// src/components/Layout.tsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/store/useAgentStore";
import { Button } from "./ui/button";

const AgentDetailLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();  // Get current path

    const { selectedAgent, clearSelectedAgent } = useAgentStore();

    const handleLogout = () => {
        localStorage.removeItem("chat-agent-token");
        navigate("/login");
    };

    const navItem = (label: string, path: string) => {
        const isActive = location.pathname.includes(label.toLowerCase());
        console.log(location.pathname)
        console.log(location.state)
        return (
            <NavigationMenuItem key={label}>
                <NavigationMenuLink
                    className={cn(
                        "cursor-pointer px-4 py-2 text-sm font-medium",
                        isActive ? "bg-primary text-primary-foreground rounded" : "hover:bg-primary/10"
                    )}
                    onClick={() => navigate(`${path}`)}
                >
                    {label}
                </NavigationMenuLink>
            </NavigationMenuItem>
        );
    };

    const goBackToAgents = () => {
        clearSelectedAgent();
        navigate("/agents")
    }

    return (
        <div className="w-full">
            <div className="border-b shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <Button
                            variant="ghost"
                            onClick={goBackToAgents}
                            className="px-2"
                        >
                            ← Back to Agents
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 w-full md:w-auto">
                        <NavigationMenu>
                            <NavigationMenuList className="flex flex-wrap gap-2 md:gap-4">
                                {navItem("Playground", "/playground")}
                                {navItem("Activity", "/activity")}
                                {navItem("Analytics", "/analytics")}
                                {navItem("Sources", "/sources/files")}
                                {navItem("Actions", "/actions")}
                                {navItem("Contacts", "/contacts")}
                                {navItem("Connect", "/connect")}
                                {navItem("Settings", "/agent-settings")}
                            </NavigationMenuList>
                        </NavigationMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage
                                        src="https://github.com/shadcn.png"
                                        alt="@evilrabbit"
                                    />
                                    <AvatarFallback />
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default AgentDetailLayout;

