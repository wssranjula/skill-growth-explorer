import { 
  useMicroLessons, 
  useLearningItems, 
  useSkills,
  useProgressData,
  Skill,
  MicroLesson,
  LearningItem,
  getPointsForDifficulty,
  calculateTotalPoints
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
  CalendarDays,
  Zap,
  Target,
  Award,
  Trophy,
  ExternalLink,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const LearningPlan = () => {
  const navigate = useNavigate();
  const { data: skills, isLoading: isSkillsLoading } = useSkills();
  const { data: microLessons, isLoading: isMicroLessonsLoading } = useMicroLessons();
  const { data: learningItems, isLoading: isLearningItemsLoading } = useLearningItems();
  const { data: progressData, isLoading: isProgressLoading } = useProgressData();
  const [selectedTerm, setSelectedTerm] = useState<"all" | "short" | "mid" | "long">("all");

  // Group learning items by skill
  const getLearningItemsBySkill = (skillId: string): LearningItem[] => {
    return learningItems?.filter(item => item.skillIds.includes(skillId)) || [];
  };

  // Get micro-lessons by skill
  const getMicroLessonsBySkill = (skillId: string): MicroLesson[] => {
    return microLessons?.filter(lesson => lesson.skillId === skillId) || [];
  };

  // Filter skills by term
  const filteredSkills = useMemo(() => {
    if (selectedTerm === "all") {
      return skills;
    }
    return skills?.filter(skill => skill.term === selectedTerm);
  }, [skills, selectedTerm]);

  // Calculate points from completed lessons and resources
  const completedLessons = useMemo(() => 
    microLessons?.filter(lesson => lesson.completed) || [], 
    [microLessons]
  );
  
  const completedResources = useMemo(() => 
    learningItems?.filter(item => item.completed) || [], 
    [learningItems]
  );
  
  const totalPoints = useMemo(() => 
    calculateTotalPoints(completedLessons, completedResources),
    [completedLessons, completedResources]
  );

  // Calculate points by difficulty level for the breakdown
  const pointsByDifficulty = useMemo(() => {
    const result = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };
    
    completedLessons.forEach(lesson => {
      result[lesson.difficulty] += getPointsForDifficulty(lesson.difficulty);
    });
    
    completedResources.forEach(resource => {
      result[resource.difficulty] += getPointsForDifficulty(resource.difficulty);
    });
    
    return result;
  }, [completedLessons, completedResources]);

  // Get skill ID from URL parameter if present
  const [focusedSkillId, setFocusedSkillId] = useState<string | null>(null);
  
  // Parse URL parameters on component mount
  useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const skillParam = urlParams.get('skill');
    if (skillParam) {
      setFocusedSkillId(skillParam);
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative mb-8">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-2xl -z-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 rounded-r-2xl -z-10"></div>
        <div className="absolute bottom-0 left-0 h-1 w-1/4 bg-gradient-to-r from-primary to-primary/30 rounded-full -z-10"></div>
        
        {/* Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Left Column - Title and Description */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Learning <span className="text-primary">Plan</span>
                </h1>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 mr-2">
                    Professional Development
                  </Badge>
                  <span className="text-sm text-muted-foreground">Updated today</span>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground pl-14">
              Track, develop, and master your professional skills
            </p>
            
       
          </div>
          
          {/* Right Column - Stats */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-primary/10 shadow-[0_10px_25px_-12px_rgba(0,0,0,0.15),0_4px_6px_-2px_rgba(0,0,0,0.05)] p-5 relative overflow-hidden transform hover:translate-y-[-2px] transition-all duration-300">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/30"></div>
              
              {/* Points Display */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-sm text-gray-800 tracking-wide">LEARNING POINTS</h3>
                  <div className="flex items-center mt-1">
                    <div className="text-2xl font-bold text-primary">{totalPoints}</div>
                    <div className="ml-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                        <span className="mr-1">+</span>
                        {pointsByDifficulty.beginner + pointsByDifficulty.intermediate + pointsByDifficulty.advanced} pts
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-blue-600 bg-blue-50 w-6 h-6 rounded-full flex items-center justify-center">B</div>
                    <div className="text-xs mt-0.5">{pointsByDifficulty.beginner}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-green-600 bg-green-50 w-6 h-6 rounded-full flex items-center justify-center">I</div>
                    <div className="text-xs mt-0.5">{pointsByDifficulty.intermediate}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-purple-600 bg-purple-50 w-6 h-6 rounded-full flex items-center justify-center">A</div>
                    <div className="text-xs mt-0.5">{pointsByDifficulty.advanced}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-800 tracking-wide">LEARNING DASHBOARD</h3>
                  <p className="text-xs text-muted-foreground">Last 30 days activity</p>
                </div>
                <div className="flex items-center text-xs text-primary/70 bg-primary/5 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3 mr-1" /> Updated today
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-b from-primary/5 to-transparent border border-primary/5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 mb-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">{skills?.length || 0}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Skills</span>
                </div>
                
                <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-b from-amber-50 to-transparent border border-amber-100/30 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 mb-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                    <Zap className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">{microLessons?.filter(l => l.completed).length || 0}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Completed</span>
                </div>
                
                <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-b from-blue-50 to-transparent border border-blue-100/30 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 mb-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">{microLessons?.length || 0}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Lessons</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <div className="flex-1 mr-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">Completion</span>
                    <span className="font-semibold text-primary">
                      {Math.round(microLessons?.length ? (microLessons.filter(l => l.completed).length / microLessons.length) * 100 : 0)}%
                    </span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-gray-100">
                    {[...Array(10)].map((_, i) => {
                      const segmentFilled = microLessons?.length ? 
                        ((microLessons.filter(l => l.completed).length / microLessons.length) * 10) > i : false;
                      return (
                        <div 
                          key={i} 
                          className={`h-full w-[10%] ${segmentFilled ? 'bg-primary' : 'bg-gray-200'} 
                            ${i > 0 ? 'border-l border-white/30' : ''}`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-primary shadow-[0_4px_10px_rgba(0,0,0,0.1)] text-white font-bold text-sm">
                  {microLessons?.filter(l => l.completed).length || 0}/{microLessons?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Overview */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-primary/80 to-primary p-1"></div>
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Your Learning Journey</CardTitle>
                <CardDescription className="mt-1">
                  Customized plan based on your skill gaps and career goals
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
              Professional Growth Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden border border-primary/20 shadow-sm">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-5 py-3 border-b border-primary/20">
                <h3 className="font-medium text-primary flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Focus Areas
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-x divide-y sm:divide-y-0 divide-primary/10">
                <div 
                  className={`p-5 bg-white cursor-pointer hover:bg-primary/5 transition-colors relative ${selectedTerm === 'short' ? 'bg-primary/5' : ''}`}
                  onClick={() => setSelectedTerm(selectedTerm === 'short' ? 'all' : 'short')}
                >
                  {selectedTerm === 'short' && <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>}
                  <div className="flex items-center mb-2">
                    <div className="bg-amber-100 p-1.5 rounded-full mr-2">
                      <Zap className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="font-medium">Short-term</div>
                    <Badge variant="outline" className="ml-2 text-xs bg-amber-50 border-amber-200 text-amber-700">1 month</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    JavaScript advanced concepts, React performance
                  </p>
                </div>
                <div 
                  className={`p-5 bg-white cursor-pointer hover:bg-primary/5 transition-colors relative ${selectedTerm === 'mid' ? 'bg-primary/5' : ''}`}
                  onClick={() => setSelectedTerm(selectedTerm === 'mid' ? 'all' : 'mid')}
                >
                  {selectedTerm === 'mid' && <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>}
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="font-medium">Mid-term</div>
                    <Badge variant="outline" className="ml-2 text-xs bg-blue-50 border-blue-200 text-blue-700">3 months</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cloud architecture fundamentals, Python for data analysis
                  </p>
                </div>
                <div 
                  className={`p-5 bg-white cursor-pointer hover:bg-primary/5 transition-colors relative ${selectedTerm === 'long' ? 'bg-primary/5' : ''}`}
                  onClick={() => setSelectedTerm(selectedTerm === 'long' ? 'all' : 'long')}
                >
                  {selectedTerm === 'long' && <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>}
                  <div className="flex items-center mb-2">
                    <div className="bg-purple-100 p-1.5 rounded-full mr-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="font-medium">Long-term</div>
                    <Badge variant="outline" className="ml-2 text-xs bg-purple-50 border-purple-200 text-purple-700">6 months</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    System design, advanced data structures
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start p-5 rounded-xl border shadow-sm bg-gradient-to-br from-green-50 to-transparent border-green-100">
                <div className="p-3 rounded-full bg-green-100 mr-4 shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-green-800 text-lg">Daily Micro-Lessons</div>
                  <p className="text-sm text-green-700 mt-1">
                    Build consistent learning habits with focused 5-minute lessons designed to fit into your busy schedule.
                  </p>
                  <div className="mt-2 flex items-center text-xs text-green-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>5 min daily commitment</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start p-5 rounded-xl border shadow-sm bg-gradient-to-br from-blue-50 to-transparent border-blue-100">
                <div className="p-3 rounded-full bg-blue-100 mr-4 shrink-0">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-800 text-lg">Curated Resources</div>
                  <p className="text-sm text-blue-700 mt-1">
                    Handpicked materials from industry experts to deepen your understanding and accelerate your progress.
                  </p>
                  <div className="mt-2 flex items-center text-xs text-blue-600">
                    <Award className="h-3 w-3 mr-1" />
                    <span>Expert-selected content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Term filter tabs */}
      <Tabs value={selectedTerm} onValueChange={(value) => setSelectedTerm(value as "all" | "short" | "mid" | "long")}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
          <TabsTrigger value="all">All Skills</TabsTrigger>
          <TabsTrigger value="short">Short-term</TabsTrigger>
          <TabsTrigger value="mid">Mid-term</TabsTrigger>
          <TabsTrigger value="long">Long-term</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Skill Learning Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {selectedTerm === "all" 
            ? "Skill-Specific Learning" 
            : `${selectedTerm === "short" ? "Short" : selectedTerm === "mid" ? "Mid" : "Long"}-Term Skills`}
        </h2>
        {isSkillsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-full" />
            ))}
          </div>
        ) : filteredSkills && filteredSkills.length > 0 ? (
          <div className="space-y-6">
            {filteredSkills.map((skill) => {
              // Check if this is the focused skill
              const isFocusedSkill = focusedSkillId === skill.id;
              
              // If there's a focused skill and this isn't it, don't render it
              if (focusedSkillId && !isFocusedSkill) {
                return null;
              }
              
              // If this is the focused skill, scroll to it
              if (isFocusedSkill) {
                // Use setTimeout to ensure the DOM is ready
                setTimeout(() => {
                  document.getElementById(`skill-${skill.id}`)?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }, 100);
              }
              
              return (
                <div key={skill.id} id={`skill-${skill.id}`}>
                  <SkillLearningCard
                    skill={skill}
                    microLessons={getMicroLessonsBySkill(skill.id)}
                    learningItems={getLearningItemsBySkill(skill.id)}
                    isMicroLessonsLoading={isMicroLessonsLoading}
                    isLearningItemsLoading={isLearningItemsLoading}
                    onViewLesson={(lessonId) => navigate(`/micro-lesson/${lessonId}`)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg border">
            <h3 className="text-lg font-medium mb-2">No skills found for this term</h3>
            <p className="text-muted-foreground">
              Try selecting a different time frame or view all skills
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setSelectedTerm("all")}
            >
              View All Skills
            </Button>
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
    
  // Calculate completion percentage for resources
  const completedResources = learningItems.filter(item => item.completed).length;
  const resourceCompletionPercentage = learningItems.length > 0
    ? Math.round((completedResources / learningItems.length) * 100)
    : 0;
    
  // Calculate points for completed lessons and resources
  const lessonPoints = microLessons
    .filter(lesson => lesson.completed)
    .reduce((total, lesson) => {
      switch(lesson.difficulty) {
        case "beginner": return total + 10;
        case "intermediate": return total + 25;
        case "advanced": return total + 50;
        default: return total + 5;
      }
    }, 0);
    
  const resourcePoints = learningItems
    .filter(item => item.completed)
    .reduce((total, item) => {
      switch(item.difficulty) {
        case "beginner": return total + 10;
        case "intermediate": return total + 25;
        case "advanced": return total + 50;
        default: return total + 5;
      }
    }, 0);

  const totalSkillPoints = lessonPoints + resourcePoints;

  return (
    <Card className="overflow-hidden border-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.04),0_4px_10px_rgba(0,0,0,0.05)]">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/10 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <CardTitle className="text-primary/90 flex items-center">
              {skill.name}
              <div className="ml-2 flex items-center">
                <Badge variant="secondary" className="text-xs bg-primary/10 border-primary/20 text-primary/80">
                  {skill.currentLevel} → {skill.targetLevel}
                </Badge>
              </div>
            </CardTitle>
            <CardDescription className="mt-1 text-primary/70">
              {skill.category}
            </CardDescription>
          </div>
          <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full shadow-sm border border-green-200">
            <Trophy className="h-4 w-4 mr-1.5 text-green-600" />
            <span className="text-base font-bold text-green-700">{totalSkillPoints} pts</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="lessons" className="skill-learning-tabs">
          <TabsList className="w-full rounded-none border-b border-primary/10 bg-gradient-to-b from-white to-gray-50 p-0 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
            <TabsTrigger 
              value="lessons" 
              className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-[0_4px_10px_rgba(0,0,0,0.04)] data-[state=active]:border-b-2 data-[state=active]:border-primary py-4 font-medium transition-all duration-200 relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Micro-Lessons
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 opacity-0 data-[state=active]:opacity-0 transition-opacity"></div>
            </TabsTrigger>
            <TabsTrigger 
              value="resources" 
              className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-[0_4px_10px_rgba(0,0,0,0.04)] data-[state=active]:border-b-2 data-[state=active]:border-primary py-4 font-medium transition-all duration-200 relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center">
                <FileText className="h-4 w-4 mr-2" />
                Resources
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 opacity-0 data-[state=active]:opacity-0 transition-opacity"></div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lessons" className="p-6 space-y-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="text-sm font-medium">Completion Progress</div>
                <div className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 font-medium">
                  {completionPercentage}%
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-muted-foreground">
                  {completedLessons}/{microLessons.length} completed
                </div>
              </div>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            
            {isMicroLessonsLoading ? (
              <div className="space-y-4 mt-6">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full" />
                ))}
              </div>
            ) : microLessons.length > 0 ? (
              <div className="space-y-4 mt-6">
                {microLessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className={`p-5 rounded-lg border ${
                      lesson.completed 
                        ? 'bg-green-50/50 border-green-200' 
                        : 'bg-white border-border hover:border-primary/30 hover:shadow-md transition-all duration-200'
                    } micro-lesson-card relative overflow-hidden`}
                  >
                    {lesson.completed && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex-grow mr-4">
                        <div className="flex items-center">
                          <h3 className={`font-medium line-clamp-1 ${lesson.completed ? 'text-green-800' : ''}`}>
                            {lesson.title}
                          </h3>
                          {lesson.completed && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                          )}
                          <div className="ml-2">
                            <Badge variant="outline" className={`text-xs ${
                              lesson.difficulty === "beginner" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              lesson.difficulty === "intermediate" ? "bg-green-50 text-green-700 border-green-200" :
                              "bg-purple-50 text-purple-700 border-purple-200"
                            }`}>
                              {lesson.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{lesson.duration} min</span>
                          {lesson.hasQuiz && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="flex items-center">
                                <BookOpen className="h-3 w-3 mr-1" />
                                Quiz
                              </span>
                            </>
                          )}
                          {lesson.completed && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="flex items-center text-green-600">
                                <Trophy className="h-3 w-3 mr-1" />
                                {lesson.difficulty === "beginner" ? "10" : 
                                 lesson.difficulty === "intermediate" ? "25" : "50"} pts
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {!lesson.completed && (
                        <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-sm">
                          Start <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No micro-lessons available for this skill yet.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="resources" className="p-6 space-y-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="text-sm font-medium">Completion Progress</div>
                <div className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 font-medium">
                  {resourceCompletionPercentage}%
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-muted-foreground">
                  {completedResources}/{learningItems.length} completed
                </div>
              </div>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" 
                style={{ width: `${resourceCompletionPercentage}%` }}
              ></div>
            </div>
            
            {isLearningItemsLoading ? (
              <div className="space-y-4 mt-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 w-full" />
                ))}
              </div>
            ) : learningItems.length > 0 ? (
              <div className="space-y-4 mt-6">
                {learningItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-5 rounded-lg border ${
                      item.completed 
                        ? 'bg-green-50/50 border-green-200' 
                        : 'bg-white border-border hover:border-primary/30 hover:shadow-md transition-all duration-200'
                    } micro-lesson-card relative overflow-hidden`}
                  >
                    {item.completed && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    )}
                    <div className="flex justify-between items-start">
                      <div className="flex-grow mr-4">
                        <div className="flex items-center">
                          <h3 className={`font-medium line-clamp-1 ${item.completed ? 'text-green-800' : ''}`}>
                            {item.title}
                          </h3>
                          {item.completed && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                          )}
                          <div className="ml-2">
                            <Badge variant="outline" className={`text-xs ${
                              item.difficulty === "beginner" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              item.difficulty === "intermediate" ? "bg-green-50 text-green-700 border-green-200" :
                              "bg-purple-50 text-purple-700 border-purple-200"
                            }`}>
                              {item.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <p className={`text-sm line-clamp-2 mt-2 ${item.completed ? 'text-green-800/80' : ''}`}>
                          {item.description}
                        </p>
                        <div className="flex items-center mt-3 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {item.type}
                          </Badge>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{item.duration} min</span>
                          {item.completed && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="flex items-center text-green-600">
                                <Trophy className="h-3 w-3 mr-1" />
                                {item.difficulty === "beginner" ? "10" : 
                                 item.difficulty === "intermediate" ? "25" : "50"} pts
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={item.completed ? "outline" : "default"} 
                        asChild 
                        className={!item.completed ? "bg-primary hover:bg-primary/90 shadow-sm" : "border-green-200 text-green-700 hover:bg-green-50"}
                      >
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.completed ? "Review" : "View"}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
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
