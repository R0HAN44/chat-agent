// src/layouts/CreateAgentSourceLayout.tsx
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

const navItems = [
    { label: "Files", path: "files" },
    { label: "Text", path: "text" },
    { label: "Website", path: "website" },
    { label: "QNA", path: "qna" },
];

const CreateAgentSourceLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname.includes(path);

    const goBackToAgents = () => {
        navigate("/agents");
    };

    return (
        <>
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-24">
                    <Button variant="ghost" onClick={goBackToAgents}>
                        ← Back to Agents
                    </Button>
                    <h1 className="text-xl font-semibold">Create New Agent</h1>
                </div>
            </div>

            <div className="flex min-h-screen">
                {/* Left Sidebar */}
                <aside className="w-56 border-r bg-background p-4">
                    <NavigationMenu orientation="vertical">
                        <NavigationMenuList className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <NavigationMenuItem key={item.path}>
                                    <NavigationMenuLink
                                        className={cn(
                                            "block w-full px-3 py-2 text-sm font-medium rounded transition-colors cursor-pointer",
                                            isActive(item.path)
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-primary/10"
                                        )}
                                        onClick={() => navigate(`/create-new-agent/${item.path}`)}
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
                                <p><strong className="text-foreground">Total Files:</strong> 22</p>
                                <p><strong className="text-foreground">Total Size:</strong> 145 MB</p>
                            </div>
                            <div className="space-y-2">
                                <Button className="w-full">Create New Agent</Button>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </>
    );
};

export default CreateAgentSourceLayout;
