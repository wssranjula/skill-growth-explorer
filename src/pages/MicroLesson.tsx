
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMicroLesson } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, ArrowLeft, AlertTriangle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

const MicroLesson = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lesson, isLoading } = useMicroLesson(id);
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    toast({
      title: "Lesson completed!",
      description: "Your progress has been saved.",
      duration: 3000,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Render code blocks with syntax highlighting
  const renderContent = (content: string) => {
    // Split content by code blocks (```...```)
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Check if this is a code block
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract the code and language
        const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
        if (match) {
          const [_, language, code] = match;
          return (
            <pre key={index} className="bg-slate-900 text-slate-50 p-4 rounded-md my-4 overflow-x-auto">
              <code>{code}</code>
            </pre>
          );
        }
      }
      
      // Regular text - split by newlines and create paragraphs
      return part.split('\n\n').map((paragraph, pIndex) => (
        <p key={`${index}-${pIndex}`} className="my-2">
          {paragraph}
        </p>
      ));
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto mt-8 mb-16 animate-fade-in">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto mt-8 mb-16 animate-fade-in">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Lesson Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The lesson you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/learning-plan")}>
              Return to Learning Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-16 animate-fade-in">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      {/* Micro-lesson card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="mb-2">Daily Micro-Lesson</Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>{lesson.duration} minutes</span>
            </div>
          </div>
          <CardTitle className="text-2xl">{lesson.title}</CardTitle>
          <CardDescription className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" /> 
            <span>Focus on understanding the concept</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="prose prose-slate max-w-none">
            {renderContent(lesson.content)}
          </div>
          
          {lesson.hasQuiz && currentStep === 1 && (
            <>
              <Separator className="my-6" />
              <div className="bg-accent/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Quick Check</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Test your understanding of the lesson concept.
                </p>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md hover:bg-accent/20 cursor-pointer transition-colors">
                    Based on the lesson, what is the key benefit of the concept discussed?
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {currentStep === 1 && lesson.hasQuiz ? (
            <Button onClick={() => setCurrentStep(2)}>Continue to Quiz</Button>
          ) : (
            <>
              <div />
              {completed ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Completed!</span>
                </div>
              ) : (
                <Button onClick={handleComplete}>
                  Mark as Completed
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
      
      {/* Related content suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Continue Learning</CardTitle>
          <CardDescription>Suggested resources to deepen your knowledge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 hover:bg-accent/10 cursor-pointer transition-colors">
              <Badge variant="outline" className="mb-2">Article</Badge>
              <h3 className="font-medium mb-1">Advanced Concepts</h3>
              <p className="text-sm text-muted-foreground">
                Explore advanced topics related to this lesson.
              </p>
            </div>
            <div className="border rounded-md p-4 hover:bg-accent/10 cursor-pointer transition-colors">
              <Badge variant="outline" className="mb-2">Video</Badge>
              <h3 className="font-medium mb-1">Practical Examples</h3>
              <p className="text-sm text-muted-foreground">
                See real-world applications of these concepts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MicroLesson;
