
import { useNavigate } from "react-router-dom";
import { 
  useProgressData, 
  useMicroLessons, 
  useSkills,
  useLearningItems,
  getSkillLevelText,
  getSkillLevelColor,
  getSkillLevelBgColor
} from "@/lib/data-service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Sparkles
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MicroLessonsCard from "@/components/MicroLessonsCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: progressData, isLoading: isProgressLoading } = useProgressData();
  const { data: microLessons, isLoading: isLessonsLoading } = useMicroLessons();
  const { data: skills, isLoading: isSkillsLoading } = useSkills();
  const { data: learningItems, isLoading: isItemsLoading } = useLearningItems();

  // Find today's lesson (first uncompleted one)
  const todayLesson = microLessons?.find(lesson => !lesson.completed);
  
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex</h1>
        <p className="text-muted-foreground mt-1">
          Your learning journey continues. You're making great progress!
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 gap-1">
            <Flame className="h-3.5 w-3.5" /> 5 Day Streak
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Trophy className="h-3.5 w-3.5 text-amber-500" /> 72% Monthly Goal
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Target className="h-3.5 w-3.5 text-blue-500" /> 3 Skills in Progress
          </Badge>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Skills in Progress"
          value={isSkillsLoading ? null : skills?.length || 0}
          icon={BarChart3}
          description="Skills being developed"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Micro Lessons Card - New component */}
          <MicroLessonsCard />
          
          {/* Priority Skills */}
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 rounded-t-lg border-b pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-lg">Priority Skills</CardTitle>
                </div>
                <Badge variant="outline" className="bg-blue-100/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 gap-1 items-center">
                  <Sparkles className="h-3 w-3" /> Focus Areas
                </Badge>
              </div>
              <CardDescription>
                Skills that need your attention based on analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isSkillsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {prioritySkills?.map(skill => {
                    const progressValue = calculateSkillProgress(skill);
                    return (
                    <div key={skill.id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{skill.name}</h3>
                          <Badge variant="outline">{skill.category}</Badge>
                        </div>
                        <div className="flex items-center mt-1 text-sm">
                          <span className={`${getSkillLevelColor(skill.currentLevel)}`}>
                            {getSkillLevelText(skill.currentLevel)}
                          </span>
                          <ArrowRight className="h-3 w-3 mx-2 text-muted-foreground" />
                          <span className={`${getSkillLevelColor(skill.targetLevel)}`}>
                            {getSkillLevelText(skill.targetLevel)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{progressValue}%</span>
                          </div>
                          <Progress value={progressValue} className="h-2" />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate("/skills")}>
                        Details
                      </Button>
                    </div>
                  )})}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0 pb-4 px-4">
              <Button variant="outline" className="w-full" onClick={() => navigate("/skills")}>
                View All Skills
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Weekly progress */}
          <Card className="shadow-md">
            <CardHeader className="bg-green-50/50 dark:bg-green-900/10 rounded-t-lg border-b pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-lg">Weekly Progress</CardTitle>
                </div>
              </div>
              <CardDescription>
                Your learning activity this week
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isProgressLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <div className="space-y-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                    <div key={day} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{day}</span>
                        <span className="text-muted-foreground">{progressData?.weeklyProgress[index] || 0}%</span>
                      </div>
                      <Progress value={progressData?.weeklyProgress[index] || 0} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Resources */}
          <Card className="shadow-md">
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
                    <div key={resource.id} className="micro-lesson-card">
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
  );
};

// Metric Card Component
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

export default Dashboard;
