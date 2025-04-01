
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
import { BookOpen, BarChart3, Calendar, ArrowRight, BookText, CheckCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Alex. Here's your learning progress.
        </p>
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
        {/* Today's lesson */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Today's Micro-Lesson</CardTitle>
            <CardDescription>5-minute focused learning</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {isLessonsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : todayLesson ? (
              <div>
                <h3 className="text-xl font-semibold mb-2">{todayLesson.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4 mr-1" /> 
                  <span>{todayLesson.duration} minutes</span>
                  {todayLesson.hasQuiz && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Includes quiz</span>
                    </>
                  )}
                </div>
                <p className="line-clamp-3 text-muted-foreground">
                  {todayLesson.content.split('\n')[0]}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-muted-foreground">You've completed all your micro-lessons.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {todayLesson && (
              <Button 
                className="w-full sm:w-auto" 
                onClick={() => navigate(`/micro-lesson/${todayLesson.id}`)}
              >
                Start Lesson <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Weekly progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>Last 7 days of learning</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <Progress value={progressData?.weeklyProgress[index] || 0} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Skills */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Priority Skills</CardTitle>
            <CardDescription>Focus areas based on your analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {isSkillsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {prioritySkills?.map(skill => (
                  <div key={skill.id} className="flex items-center space-x-4 p-3 rounded-lg border">
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
                    </div>
                    <Button variant="outline" onClick={() => navigate("/skills")}>
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/skills")}>
              View All Skills
            </Button>
          </CardFooter>
        </Card>

        {/* Recommended Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Resources</CardTitle>
            <CardDescription>Curated for your learning plan</CardDescription>
          </CardHeader>
          <CardContent>
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
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/resources")}>
              Browse All Resources
            </Button>
          </CardFooter>
        </Card>
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
    <Card>
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
