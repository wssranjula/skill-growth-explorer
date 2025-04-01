
import { 
  useMicroLessons, 
  useLearningItems, 
  useSkills,
  Skill,
  MicroLesson,
  LearningItem
} from "@/lib/data-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  X,
  ArrowRight,
  CalendarDays
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const LearningPlan = () => {
  const navigate = useNavigate();
  const { data: skills, isLoading: isSkillsLoading } = useSkills();
  const { data: microLessons, isLoading: isMicroLessonsLoading } = useMicroLessons();
  const { data: learningItems, isLoading: isLearningItemsLoading } = useLearningItems();

  // Group learning items by skill
  const getLearningItemsBySkill = (skillId: string): LearningItem[] => {
    return learningItems?.filter(item => item.skillIds.includes(skillId)) || [];
  };

  // Get micro-lessons by skill
  const getMicroLessonsBySkill = (skillId: string): MicroLesson[] => {
    return microLessons?.filter(lesson => lesson.skillId === skillId) || [];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Plan</h1>
        <p className="text-muted-foreground">
          Your personalized roadmap for skill development
        </p>
      </div>

      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-primary" />
            <span>Plan Overview</span>
          </CardTitle>
          <CardDescription>
            Based on skill gaps and company priorities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h3 className="font-medium text-primary mb-2">Focus Areas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-primary/20 rounded p-3 bg-white">
                  <div className="font-medium">Short-term (1 month)</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    JavaScript advanced concepts, React performance
                  </p>
                </div>
                <div className="border border-primary/20 rounded p-3 bg-white">
                  <div className="font-medium">Mid-term (3 months)</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cloud architecture fundamentals, Python for data analysis
                  </p>
                </div>
                <div className="border border-primary/20 rounded p-3 bg-white">
                  <div className="font-medium">Long-term (6 months)</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    System design, advanced data structures
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center p-4 rounded-lg border bg-green-50 border-green-200">
                <div className="p-2 rounded-full bg-green-100 mr-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-green-800">Daily Micro-Lessons</div>
                  <p className="text-sm text-green-700">
                    5-minute lessons to build consistent learning habits
                  </p>
                </div>
              </div>
              
              <div className="flex-1 flex items-center p-4 rounded-lg border bg-blue-50 border-blue-200">
                <div className="p-2 rounded-full bg-blue-100 mr-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-800">Curated Resources</div>
                  <p className="text-sm text-blue-700">
                    Selected materials to deepen your understanding
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Learning Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Skill-Specific Learning</h2>
        {isSkillsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {skills?.slice(0, 3).map((skill) => (
              <SkillLearningCard 
                key={skill.id}
                skill={skill}
                microLessons={getMicroLessonsBySkill(skill.id)}
                learningItems={getLearningItemsBySkill(skill.id)}
                isMicroLessonsLoading={isMicroLessonsLoading}
                isLearningItemsLoading={isLearningItemsLoading}
                onViewLesson={(lessonId) => navigate(`/micro-lesson/${lessonId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface SkillLearningCardProps {
  skill: Skill;
  microLessons: MicroLesson[];
  learningItems: LearningItem[];
  isMicroLessonsLoading: boolean;
  isLearningItemsLoading: boolean;
  onViewLesson: (lessonId: string) => void;
}

const SkillLearningCard = ({ 
  skill, 
  microLessons, 
  learningItems,
  isMicroLessonsLoading,
  isLearningItemsLoading,
  onViewLesson
}: SkillLearningCardProps) => {
  // Calculate completion percentage for micro-lessons
  const completedLessons = microLessons.filter(lesson => lesson.completed).length;
  const completionPercentage = microLessons.length > 0 
    ? Math.round((completedLessons / microLessons.length) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{skill.name}</CardTitle>
          <Badge variant="outline">{skill.category}</Badge>
        </div>
        <CardDescription>
          Progress from {skill.currentLevel} to {skill.targetLevel}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="lessons">
          <TabsList className="grid grid-cols-2 w-full max-w-xs mb-4">
            <TabsTrigger value="lessons">Micro-Lessons</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lessons" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Completion Progress</div>
              <div className="text-sm text-muted-foreground">
                {completedLessons}/{microLessons.length} completed
              </div>
            </div>
            <Progress value={completionPercentage} className="h-2 mb-4" />
            
            {isMicroLessonsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            ) : microLessons.length > 0 ? (
              <div className="space-y-3">
                {microLessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className={`p-3 rounded-lg border ${
                      lesson.completed 
                        ? 'bg-muted/50 border-muted' 
                        : 'bg-card border-border'
                    } micro-lesson-card`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-grow mr-4">
                        <div className="flex items-center">
                          <h3 className={`font-medium line-clamp-1 ${lesson.completed ? 'text-muted-foreground' : ''}`}>
                            {lesson.title}
                          </h3>
                          {lesson.completed && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{lesson.duration} min</span>
                          {lesson.hasQuiz && (
                            <>
                              <span className="mx-1">•</span>
                              <span>Includes quiz</span>
                            </>
                          )}
                        </div>
                      </div>
                      {!lesson.completed && (
                        <Button size="sm" onClick={() => onViewLesson(lesson.id)}>
                          Start <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No micro-lessons available for this skill yet.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            {isLearningItemsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full" />
                ))}
              </div>
            ) : learningItems.length > 0 ? (
              <div className="space-y-3">
                {learningItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-lg border ${
                      item.completed 
                        ? 'bg-muted/50 border-muted' 
                        : 'bg-card border-border'
                    } micro-lesson-card`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow mr-4">
                        <div className="flex items-center">
                          <h3 className={`font-medium line-clamp-1 ${item.completed ? 'text-muted-foreground' : ''}`}>
                            {item.title}
                          </h3>
                          {item.completed && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                          )}
                        </div>
                        <p className={`text-sm line-clamp-2 mt-1 ${item.completed ? 'text-muted-foreground' : ''}`}>
                          {item.description}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {item.type}
                          </Badge>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{item.duration} min</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No resources available for this skill yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LearningPlan;
