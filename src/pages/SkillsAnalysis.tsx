
import { useNavigate } from "react-router-dom";
import { useSkills, getSkillLevelText, getSkillLevelColor, getSkillLevelBgColor } from "@/lib/data-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrainCircuit, ArrowRight, TrendingUp, AlertCircle } from "lucide-react";

const SkillsAnalysis = () => {
  const navigate = useNavigate();
  const { data: skills, isLoading } = useSkills();

  // Convert skill level to progress percentage
  const getLevelProgressPercentage = (current: string, target: string) => {
    const levels = ["beginner", "intermediate", "advanced", "expert"];
    const currentIndex = levels.indexOf(current);
    const targetIndex = levels.indexOf(target);
    
    if (currentIndex === targetIndex) return 100;
    
    // Calculate progress within the journey from current to target
    const totalLevelsToGain = targetIndex - currentIndex;
    return Math.round((currentIndex / targetIndex) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills Analysis</h1>
          <p className="text-muted-foreground">
            Review your skill profile and development areas
          </p>
        </div>
        <Button 
          className="mt-4 sm:mt-0"
          onClick={() => navigate("/learning-plan")}
        >
          View Learning Plan <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Analysis summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
            <span>Skills Assessment Summary</span>
          </CardTitle>
          <CardDescription>
            Based on your current profile and company needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800">Skill Gap Analysis</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Our analysis shows opportunities to develop cloud architecture skills to meet upcoming project requirements. 
                  Focus on AWS or Azure fundamentals as a priority.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800">Strategic Skills</h3>
                <p className="text-sm text-blue-700 mt-1">
                  JavaScript and React skills remain highly relevant to your role. 
                  Continue deepening these skills while expanding cloud knowledge for a well-rounded profile.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="skill-card">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-6" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual skills cards
            skills?.map((skill) => (
              <Card key={skill.id} className="skill-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{skill.name}</h3>
                    <Badge>{skill.category}</Badge>
                  </div>
                  
                  <div className="flex items-center text-sm mb-2">
                    <span 
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getSkillLevelBgColor(skill.currentLevel)} ${getSkillLevelColor(skill.currentLevel)}`}
                    >
                      Current: {getSkillLevelText(skill.currentLevel)}
                    </span>
                    <ArrowRight className="mx-2 h-3 w-3 text-muted-foreground" />
                    <span 
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getSkillLevelBgColor(skill.targetLevel)} ${getSkillLevelColor(skill.targetLevel)}`}
                    >
                      Target: {getSkillLevelText(skill.targetLevel)}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress to target</span>
                      <span>Relevance: {skill.relevance}%</span>
                    </div>
                    <Progress value={getLevelProgressPercentage(skill.currentLevel, skill.targetLevel)} className="h-2" />
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
