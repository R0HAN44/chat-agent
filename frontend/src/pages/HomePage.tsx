import { useNavigate } from "react-router-dom";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("chat-agent-token");
    navigate("/login");
  };

  

  return (
    <div className="w-full border-b">

      {/* Page Content */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold">HomePage</h1>
      </div>
    </div>
  );
};

export default HomePage;
