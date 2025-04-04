
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  ChevronDown,
  Brain,
  Code,
  Network,
  Database,
  LineChart,
  Zap,
  LampDesk
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock data for daily micro-lessons
const dailyLessons = [
  {
    id: "ml1",
    title: "Understanding React Hooks",
    description: "Learn the basics of React hooks and how to use them effectively.",
    duration: 5,
    category: "Frontend Development",
    completed: false,
    icon: Code,
    color: "text-blue-500",
    badge: "New",
    hasQuiz: true
  },
  {
    id: "ml2",
    title: "Database Indexing Fundamentals",
    description: "Discover how database indexes work and when to use them.",
    duration: 4,
    category: "Database",
    completed: false,
    icon: Database,
    color: "text-green-500",
    badge: "Popular",
    hasQuiz: true
  },
  {
    id: "ml3",
    title: "ML Model Evaluation Metrics",
    description: "Learn different metrics for evaluating machine learning models.",
    duration: 5,
    category: "Machine Learning",
    completed: false,
    icon: Brain,
    color: "text-purple-500",
    hasQuiz: false
  },
  {
    id: "ml4",
    title: "Network Security Basics",
    description: "Understand fundamental concepts in network security.",
    duration: 3,
    category: "Security",
    completed: false,
    icon: Network,
    color: "text-red-500",
    hasQuiz: true
  },
  {
    id: "ml5",
    title: "Data Visualization Principles",
    description: "Learn core principles for effective data visualization.",
    duration: 5,
    category: "Data Science",
    completed: false,
    icon: LineChart,
    color: "text-amber-500",
    hasQuiz: false
  }
];

const MicroLessonsCard = () => {
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState(dailyLessons[0]);
  const [isLessonOpen, setIsLessonOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Mock quiz questions
  const quizQuestions = [
    {
      question: "What is the main advantage of using React hooks?",
      options: [
        { id: "a", text: "They make code more complex" },
        { id: "b", text: "They allow using state in functional components" },
        { id: "c", text: "They always improve performance" },
        { id: "d", text: "They replace the need for components" }
      ],
      correctAnswer: "b"
    },
    {
      question: "When should you use the useEffect hook?",
      options: [
        { id: "a", text: "Only for API calls" },
        { id: "b", text: "Never in functional components" },
        { id: "c", text: "For side effects in your component" },
        { id: "d", text: "Only once per application" }
      ],
      correctAnswer: "c"
    }
  ];

  const handleSelectLesson = (lesson: any) => {
    setActiveLesson(lesson);
    setIsLessonOpen(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  const handleSubmitAnswer = () => {
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed
      setIsLessonOpen(false);
    }
  };

  const isCorrectAnswer = selectedAnswer === quizQuestions[currentQuestion]?.correctAnswer;

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-primary/5 rounded-t-lg border-b pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Daily Micro-Lessons</CardTitle>
          </div>
          <Badge variant="outline" className="bg-primary/10 gap-1 items-center">
            <LampDesk className="h-3 w-3" /> 
            Quick Learning
          </Badge>
        </div>
        <CardDescription>
          Build your skills with these 5-minute focused lessons
        </CardDescription>
      </CardHeader>
      
      <Collapsible open={isLessonOpen} onOpenChange={setIsLessonOpen}>
        <CollapsibleContent>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <activeLesson.icon className={`mr-2 h-5 w-5 ${activeLesson.color}`} />
                    {activeLesson.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{activeLesson.description}</p>
                </div>
                <Badge className="bg-primary/10 text-primary">
                  {activeLesson.category}
                </Badge>
              </div>
              
              {activeLesson.hasQuiz && !isAnswerSubmitted && (
                <div className="bg-card border rounded-md p-4 mt-4">
                  <h4 className="font-medium mb-3">Quick Quiz</h4>
                  <p className="mb-3">{quizQuestions[currentQuestion].question}</p>
                  
                  <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
                    {quizQuestions[currentQuestion].options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <label htmlFor={option.id} className="text-sm">{option.text}</label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <Button 
                    className="mt-3" 
                    disabled={!selectedAnswer}
                    onClick={handleSubmitAnswer}
                  >
                    Submit Answer
                  </Button>
                </div>
              )}
              
              {isAnswerSubmitted && (
                <div className={`p-4 rounded-md mt-2 ${isCorrectAnswer ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                  <div className="flex items-center mb-2">
                    {isCorrectAnswer ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <p className="font-medium">Correct!</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 mr-2" />
                        <p className="font-medium">Not quite right</p>
                      </>
                    )}
                  </div>
                  <p className="text-sm">
                    {isCorrectAnswer 
                      ? "Great job! You've got the right answer." 
                      : `The correct answer is "${quizQuestions[currentQuestion].options.find(o => o.id === quizQuestions[currentQuestion].correctAnswer)?.text}".`
                    }
                  </p>
                  <Button className="mt-3" onClick={handleNextQuestion}>
                    {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Complete Lesson"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
        
        <CardContent className={`p-0 ${isLessonOpen ? 'hidden' : 'block'}`}>
          <ScrollArea className="h-[280px]">
            <div className="p-4 space-y-3">
              {dailyLessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer border transition-colors"
                  onClick={() => handleSelectLesson(lesson)}
                >
                  <div className={`p-2 rounded-md ${lesson.color} bg-opacity-10`}>
                    <lesson.icon className={`h-5 w-5 ${lesson.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">{lesson.title}</h3>
                      {lesson.badge && (
                        <Badge variant="outline" className="text-xs">{lesson.badge}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {lesson.description}
                    </p>
                    <div className="flex items-center mt-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{lesson.duration} min</span>
                      {lesson.hasQuiz && (
                        <>
                          <span className="mx-1.5">•</span>
                          <Award className="h-3 w-3 mr-1" />
                          <span>Quiz</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 px-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <Clock className="inline-block h-3.5 w-3.5 mr-1 align-text-bottom" />
            Learn in just 5 minutes a day
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1"
            onClick={() => navigate("/learning-plan")}
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Collapsible>
    </Card>
  );
};

// Define XCircle component as it was used but not imported
const XCircle = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

export default MicroLessonsCard;
