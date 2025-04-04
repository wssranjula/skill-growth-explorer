
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  BarChart, 
  GraduationCap, 
  BookText, 
  Menu, 
  X, 
  User,
  BrainCircuit,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart },
    { path: "/skills", label: "Skills Analysis", icon: BrainCircuit },
    { path: "/learning-plan", label: "Learning Plan", icon: GraduationCap },
    { path: "/resources", label: "Resources", icon: BookText },
    { path: "/trending", label: "Trending Content", icon: TrendingUp },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 fixed md:relative top-0 bottom-0 z-40",
          sidebarOpen ? "left-0" : "-left-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center p-4 h-16">
            <BookOpen className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-xl font-bold text-primary">SkillGrowth</h1>
          </div>
          
          <Separator />
          
          {/* Navigation */}
          <nav className="flex-1 py-4 px-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Button
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => {
                      navigate(item.path);
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User profile */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">AC</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Alex Chen</p>
                <p className="text-xs text-muted-foreground">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "md:ml-0" : "md:ml-0"
      )}>
        {/* Semi-transparent overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        
        <main className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
