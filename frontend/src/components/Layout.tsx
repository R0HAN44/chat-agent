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

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();  // Get current path

  const handleLogout = () => {
    localStorage.removeItem("chat-agent-token");
    navigate("/login");
  };

  const navItem = (label: string, path: string) => {
    const isActive = location.pathname === path;
    return (
      <NavigationMenuItem key={label}>
        <NavigationMenuLink
          className={cn(
            "cursor-pointer px-4 py-2 text-sm font-medium",
            isActive ? "bg-primary text-primary-foreground rounded" : "hover:bg-primary/10"
          )}
          onClick={() => navigate(path)}
        >
          {label}
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  };

  return (
    <div className="w-full">
      <div className="border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <NavigationMenu>
            <NavigationMenuList className="space-x-4">
              {navItem("Agents", "/agents")}
              {/* {navItem("Usage", "/usage")} */}
              {/* {navItem("Settings", "/settings")} */}
            </NavigationMenuList>
          </NavigationMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

