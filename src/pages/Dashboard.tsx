import { useNavigate } from "react-router-dom";
import { 
  useProgressData, 
  useSkills,
  useLearningItems,
  getSkillLevelText,
  getSkillLevelColor,
  getSkillLevelBgColor,
  calculateTotalPoints
} from "@/lib/data-service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";
import { ClimbingProgress } from "@/components/ClimbingProgress";
import { SkillCourseProgress } from "@/components/SkillCourseProgress";
import { 
  BookOpen, 
  BarChart3, 
  Calendar, 
  ArrowRight, 
  BookText, 
  CheckCircle, 
  Clock, 
  Award,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Flame,
  Sparkles,
  UserCircle
} from "lucide-react";
import MicroLessonsCard from "@/components/MicroLessonsCard";

// MetricCard Component
interface MetricCardProps {
  title: string;
  value: number | null;
  icon: React.ElementType;
  description: string;
  color: string;
}

const MetricCard = ({ title, value, icon: Icon, description, color }: MetricCardProps) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {value === null ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-3xl font-bold">{value}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`p-2 rounded-full ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: progressData, isLoading: isProgressLoading } = useProgressData();
  const { data: skills, isLoading: isSkillsLoading } = useSkills();
  const { data: learningItems, isLoading: isItemsLoading } = useLearningItems();
  
  // Get priority skills (those with large gaps and high relevance)
  const prioritySkills = skills
    ?.filter(skill => {
      const levelGap = 
        ["beginner", "intermediate", "advanced", "expert"].indexOf(skill.targetLevel) - 
        ["beginner", "intermediate", "advanced", "expert"].indexOf(skill.currentLevel);
      return levelGap > 0 && skill.relevance > 80;
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);
  
  // Get recommended resources
  const recommendedResources = learningItems
    ?.filter(item => !item.completed)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Calculate progress percentage for each skill based on current level vs target level
  const calculateSkillProgress = (skill) => {
    const levels = ["beginner", "intermediate", "advanced", "expert"];
    const currentIndex = levels.indexOf(skill.currentLevel);
    const targetIndex = levels.indexOf(skill.targetLevel);
    
    if (targetIndex <= currentIndex) return 100;
    
    // Calculate progress as percentage of the way from current to target
    return Math.round((currentIndex / targetIndex) * 100);
  };

  // Calculate total points and progress
  const completedResources = learningItems?.filter(item => item.completed) || [];
  const totalPoints = calculateTotalPoints([], completedResources);
  const maxPoints = 1000; // Maximum points possible
  const progressPercentage = Math.min(100, Math.round((totalPoints / maxPoints) * 100));

  return (
    <div className="space-y-6 animate-fade-in">
    <div className="mb-6 rounded-2xl shadow-lg overflow-hidden">
      {/* Styled section only for the welcome message */}
      <div className="relative">
        {/* Background gradient limited to this section */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-500 opacity-90"></div>
        
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-20" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
               backgroundSize: '120px'
             }}></div>
        
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fill-opacity="0.2" d="M0,160L48,138.7C96,117,192,75,288,74.7C384,75,480,117,576,160C672,203,768,245,864,229.3C960,213,1056,139,1152,117.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Content with glass effect */}
        <div className="relative p-8 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                <span className="text-white text-sm font-medium tracking-wider uppercase">Premium Account</span>
              </div>
              
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">Alex!</span>
              </h1>
              
              <p className="text-white/80 mt-2">
                Keep up the good work! You're making progress every day.
              </p>
            </div>
            
            <div className="hidden md:block">
              <div className="relative h-20 w-20">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Skills Completed"
          value={isProgressLoading ? null : progressData?.skillsCompleted || 0}
          icon={BarChart3}
          description="Skills fully developed"
          color="bg-blue-100 text-blue-700"
        />
        <MetricCard
          title="Micro-Lessons Completed"
          value={isProgressLoading ? null : progressData?.lessonsCompleted || 0}
          icon={BookOpen}
          description="5-minute lessons"
          color="bg-green-100 text-green-700"
        />
        <MetricCard
          title="Learning Streak"
          value={isProgressLoading ? null : progressData?.streakDays || 0}
          icon={Calendar}
          description="Consecutive days"
          color="bg-orange-100 text-orange-700"
        />
        <MetricCard
          title="Resources Viewed"
          value={isProgressLoading ? null : progressData?.resourcesViewed || 0}
          icon={BookText}
          description="Articles, videos, etc."
          color="bg-purple-100 text-purple-700"
        />
      </div>

      {/* Main content */}
      <div className="min-h-screen p-6">
        {/* Header section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and explore recommended resources.</p>
        </div>

        {/* Main content - Two rows layout */}
        <div className="grid gap-6 h-[calc(100vh-12rem)]">
          {/* First row - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Progress */}
          <div className="h-full">
            <div className="h-full rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden relative">
              {/* Blue gradient border on top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800" />
              
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Skills Course Progress</h3>
                      <p className="text-sm text-muted-foreground">Track your course completion by skill</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                    Courses
                  </Badge>
                </div>

                {/* Chart */}
                <div className="pt-4">
                  <SkillCourseProgress />
                </div>

              
              </div>
            </div>
          </div>

          {/* Your Learning Journey */}
          <div className="h-full">
            <div className="h-full rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden relative">
              {/* Yellow gradient border on top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
              
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Learning Journey</h3>
                      <p className="text-sm text-muted-foreground">Climb your way to track your progress</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300">
                    Level {Math.floor(progressPercentage / 20) + 1}
                  </Badge>
                </div>

                {/* Climbing Progress */}
                <div className="pt-4">
                  <ClimbingProgress 
                    totalPoints={totalPoints}
                    maxPoints={maxPoints}
                    progressPercentage={progressPercentage}
                  />
                </div>
              </div>
            </div>
          </div>

          </div>

          {/* Second row - Full width */}
          <div className="h-full">
            <Card className="shadow-md h-full">

            <CardHeader className="bg-purple-50/50 dark:bg-purple-900/10 rounded-t-lg border-b pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-lg">Recommended</CardTitle>
                </div>
              </div>
              <CardDescription>
                Curated resources for your learning plan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isItemsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedResources?.map((resource, index) => (
                    <div key={resource.id}>
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium line-clamp-1">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {resource.description}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {resource.type}
                            </Badge>
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{resource.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0 pb-4 px-4">
              <Button variant="outline" className="w-full" onClick={() => navigate("/resources")}>
                Browse All Resources
              </Button>
            </CardFooter>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
