import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  useSkills, 
  getSkillLevelText, 
  getSkillLevelColor, 
  getSkillLevelBgColor, 
  Skill, 
  SkillLevel,
  useMicroLessons,
  useLearningItems,
  getPointsForDifficulty
} from "@/lib/data-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  TrendingUp, 
  BrainCircuit, 
  Plus, 
  BarChart3, 
  Lightbulb,
  Code,
  Database,
  Server,
  Layers,
  Cpu,
  Globe,
  AlertCircle,
  X,
  GraduationCap,
  Trophy,
  Target,
  Star
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SkillsAnalysis = () => {
  const navigate = useNavigate();
  const { data: skills, isLoading } = useSkills();
  const { data: microLessons } = useMicroLessons();
  const { data: learningItems } = useLearningItems();
  const [prioritizedSkills, setPrioritizedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "",
    currentLevel: "beginner" as SkillLevel,
    targetLevel: "intermediate" as SkillLevel,
    relevance: 85,
  });

  // Convert skill level to progress percentage
  const getLevelProgressPercentage = (current: SkillLevel, target: SkillLevel, skillId: string): number => {
    const levels = ["beginner", "intermediate", "advanced", "expert"];
    const currentIndex = levels.indexOf(current);
    const targetIndex = levels.indexOf(target);
    
    if (currentIndex === targetIndex) return 100;
    if (targetIndex < currentIndex) return 100; // Already exceeded target
    
    // For skills in progress, show partial progress based on points earned
    const totalPoints = calculateSkillPoints(skillId);
    
    // Base progress is 0% at current level
    let progressPercentage = 0;
    
    // If they have points, calculate a percentage (max 99% until they reach next level)
    if (totalPoints > 0) {
      // More points = more progress, but cap at 99% until they reach next level
      progressPercentage = Math.min(Math.round((totalPoints / 100) * 50), 99);
    }
    
    return progressPercentage;
  };

  // Calculate points for each skill based on completed lessons and resources
  const calculateSkillPoints = (skillId: string): number => {
    if (!microLessons || !learningItems) return 0;
    
    // Get completed lessons for this skill
    const completedLessons = microLessons.filter(
      lesson => lesson.skillId === skillId && lesson.completed
    );
    
    // Get completed resources for this skill
    const completedResources = learningItems.filter(
      item => item.skillIds.includes(skillId) && item.completed
    );
    
    // Calculate points
    const lessonPoints = completedLessons.reduce(
      (total, lesson) => total + getPointsForDifficulty(lesson.difficulty),
      0
    );
    
    const resourcePoints = completedResources.reduce(
      (total, resource) => total + getPointsForDifficulty(resource.difficulty),
      0
    );
    
    return lessonPoints + resourcePoints;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill({
      ...newSkill,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewSkill({
      ...newSkill,
      [name]: value,
    });
  };

  // Sort skills to show prioritized ones first
  const sortedSkills = useMemo(() => {
    if (!skills) return [];
    return [...skills].sort((a, b) => {
      // Prioritized skills come first
      const aPrioritized = prioritizedSkills.includes(a.id);
      const bPrioritized = prioritizedSkills.includes(b.id);
      
      if (aPrioritized && !bPrioritized) return -1;
      if (!aPrioritized && bPrioritized) return 1;
      
      // Then sort by relevance
      return b.relevance - a.relevance;
    });
  }, [skills, prioritizedSkills]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative mb-8">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl opacity-70 -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl opacity-70 -z-10 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="relative z-10">
            <div className="flex items-center">
              <div className="mr-4 bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl shadow-sm border border-primary/10">
                <BrainCircuit className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary/90">Skills Analysis</h1>
                <p className="text-muted-foreground mt-1">
                  Review your skill profile and identify development opportunities
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button 
              variant="outline"
              onClick={() => navigate("/trending")}
              className="border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-200"
            >
              <TrendingUp className="mr-2 h-4 w-4 text-primary/80" />
              Trending Skills
            </Button>
            <Button 
              onClick={() => navigate("/learning-plan")}
              className="bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200"
            >
              View Learning Plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Analysis summary */}
      <div className="bg-white rounded-xl border border-primary/10 shadow-[0_10px_25px_-12px_rgba(0,0,0,0.15),0_4px_6px_-2px_rgba(0,0,0,0.05)] p-5 relative overflow-hidden transform hover:translate-y-[-2px] transition-all duration-300">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
        
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-primary/10 mr-3 border border-primary/20">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Skills Assessment Summary</h3>
            <p className="text-sm text-muted-foreground">Based on your current profile and company needs</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <div className="p-2 rounded-lg bg-white mr-3 shadow-sm border border-amber-100 flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800">Skill Gap Analysis</h3>
                <p className="text-sm text-amber-700/90 mt-1">
                  Our analysis shows opportunities to develop cloud architecture skills to meet upcoming project requirements. 
                  Focus on AWS or Azure fundamentals as a priority.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <div className="p-2 rounded-lg bg-white mr-3 shadow-sm border border-blue-100 flex-shrink-0">
                <Code className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800">Strategic Skills</h3>
                <p className="text-sm text-blue-700/90 mt-1">
                  JavaScript and React skills remain highly relevant to your role. 
                  Continue deepening these skills while expanding cloud knowledge for a well-rounded profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills grid */}
      <div className="bg-white rounded-xl border border-primary/10 shadow-[0_10px_25px_-12px_rgba(0,0,0,0.15),0_4px_6px_-2px_rgba(0,0,0,0.05)] p-5 relative overflow-hidden mt-6">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/10 mr-3 border border-primary/20">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Your Skills</h2>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Target className="h-4 w-4 mr-1 text-red-500" />
            <span>Click star icon on a skill to prioritize it</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="skill-card border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-6" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual skills cards sorted with prioritized skills first
            sortedSkills.map((skill) => (
              <Card 
                key={skill.id} 
                className="skill-card border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/20 relative overflow-hidden"
                onClick={() => navigate(`/learning-plan?skill=${skill.id}`)}
              >
                {/* No separate toggle button anymore */}
                
                {/* Prioritized indicator */}
                {prioritizedSkills.includes(skill.id) && (
                  <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-red-500 border-r-transparent z-10">
                    <div className="absolute top-[8px] left-[8px]">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-lg text-gray-800">{skill.name}</h3>
                      <div 
                        className="ml-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click navigation
                          if (prioritizedSkills.includes(skill.id)) {
                            setPrioritizedSkills(prioritizedSkills.filter(id => id !== skill.id));
                            toast.success(`${skill.name} removed from priorities`);
                          } else {
                            setPrioritizedSkills([...prioritizedSkills, skill.id]);
                            toast.success(`${skill.name} added to priorities`);
                          }
                        }}
                      >
                        {prioritizedSkills.includes(skill.id) ? (
                          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                        ) : (
                          <Star className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/10">{skill.category}</Badge>
                  </div>
                  
                  <div className="flex flex-col space-y-3 mb-4">
                    <div className="flex items-center">
                      <div className="w-24 text-sm text-gray-500 font-medium">Current:</div>
                      <span 
                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${getSkillLevelBgColor(skill.currentLevel)} ${getSkillLevelColor(skill.currentLevel)}`}
                      >
                        {getSkillLevelText(skill.currentLevel)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-sm text-gray-500 font-medium">Target:</div>
                      <span 
                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${getSkillLevelBgColor(skill.targetLevel)} ${getSkillLevelColor(skill.targetLevel)}`}
                      >
                        {getSkillLevelText(skill.targetLevel)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-1">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-medium text-gray-500">Progress to target</span>
                      <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                        <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                        <span className="font-medium text-amber-700">{calculateSkillPoints(skill.id)} pts</span>
                      </div>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" 
                        style={{ width: `${getLevelProgressPercentage(skill.currentLevel, skill.targetLevel, skill.id)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <div className="text-xs text-primary flex items-center font-medium">
                      Start Learning <ArrowRight className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsAnalysis;
