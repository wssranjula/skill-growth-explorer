import { useState } from "react";
import logoImage from "./logo.png";
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
  TrendingUp,
  ChevronDown,
  Bell,
  CloudLightning,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
    { path: "/quick-learning", label: "Quick Learning", icon: CloudLightning },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 z-50 md:hidden shadow-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg transition-all duration-300 fixed md:relative top-0 bottom-0 z-40 flex flex-col",
          sidebarOpen ? "left-0" : "-left-72"
        )}
      >
        {/* Brand */}
        <div className="flex items-center p-6 h-20">
          <img src={logoImage} alt="Clarity Logo" className="h-12 w-12 mr-4 " />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Clarity</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Professional Learning Platform</p>
          </div>
        </div>
        
        <Separator className="bg-slate-200 dark:bg-slate-700" />
        
        {/* Navigation Categories */}
        <div className="px-4 pt-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-2">Main Navigation</p>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-2 px-3 overflow-y-auto">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-12 px-4 rounded-lg font-medium",
                      isActive 
                        ? "bg-gradient-to-r from-primary/90 to-indigo-600/90 text-white shadow-md" 
                        : "hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    )}
                    onClick={() => {
                      navigate(item.path);
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <div className={cn(
                      "rounded-md p-1.5 mr-3", 
                      isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-700"
                    )}>
                      <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-primary dark:text-slate-300")} />
                    </div>
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* User profile - sticky at the bottom */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm mt-auto sticky bottom-0">
          <div className="p-3 bg-white dark:bg-slate-700/30 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-md">
                <AvatarImage src="/api/placeholder/40/40" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-600 text-white font-medium">AC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold dark:text-white">Alex Chen</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Software Engineer</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <ChevronDown size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="grid gap-1">
                    <Button variant="ghost" size="sm" className="justify-start h-10 hover:bg-slate-100 dark:hover:bg-slate-700">
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start h-10 hover:bg-slate-100 dark:hover:bg-slate-700">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start h-10 hover:bg-slate-100 dark:hover:bg-slate-700">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Separator className="my-1" />
                    <Button variant="ghost" size="sm" className="justify-start h-10 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <Badge className="px-2 py-1 text-xs bg-gradient-to-r from-primary/90 to-indigo-600/90 text-white border-0">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></div>
                22% Progress
              </Badge>
              <Badge className="px-2 py-1 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></div>
                5 Day Streak
              </Badge>
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
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