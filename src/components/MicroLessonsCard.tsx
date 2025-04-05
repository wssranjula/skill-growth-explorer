
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
  LampDesk,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
    hasQuiz: true,
    preview: "React Hooks are a powerful feature introduced in React 16.8 that allow you to use state and lifecycle features without classes."
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
    hasQuiz: true,
    preview: "Database indexing is a technique to optimize the performance of database queries by minimizing disk access when searching for specific data."
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
    hasQuiz: false,
    preview: "Model evaluation metrics are crucial for determining how well your machine learning models are performing relative to their objectives."
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
    hasQuiz: true,
    preview: "Network security encompasses the policies, practices, and technologies designed to protect data, systems, and networks from unauthorized access or attacks."
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
    hasQuiz: false,
    preview: "Effective data visualization transforms complex data into intuitive visual representations that reveal insights more easily than raw numbers."
  }
];

// Quiz questions for different lessons
const lessonQuizzes = {
  ml1: [
    {
      question: "What is the main advantage of using React hooks?",
      options: [
        { id: "a", text: "They make code more complex" },
        { id: "b", text: "They allow using state in functional components" },
        { id: "c", text: "They always improve performance" },
        { id: "d", text: "They replace the need for components" }
      ],
      correctAnswer: "b",
      explanation: "React hooks allow you to use state and other React features without writing class components, making functional components more powerful."
    }
  ],
  ml2: [
    {
      question: "What is the primary purpose of database indexing?",
      options: [
        { id: "a", text: "To validate data before insertion" },
        { id: "b", text: "To encrypt sensitive information" },
        { id: "c", text: "To speed up data retrieval operations" },
        { id: "d", text: "To reduce the size of the database" }
      ],
      correctAnswer: "c",
      explanation: "Database indexing primarily speeds up data retrieval operations by creating data structures that enable faster searches."
    }
  ],
  ml4: [
    {
      question: "Which of these is NOT a common network security measure?",
      options: [
        { id: "a", text: "Firewalls" },
        { id: "b", text: "Encryption" },
        { id: "c", text: "Data compression" },
        { id: "d", text: "Intrusion detection systems" }
      ],
      correctAnswer: "c",
      explanation: "Data compression is primarily used to reduce file sizes and bandwidth usage, not as a security measure."
    }
  ]
};

const MicroLessonsCard = () => {
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState(dailyLessons[0]);
  const [isLessonOpen, setIsLessonOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<{[key: string]: number}>({
    ml1: 0,
    ml2: 0,
    ml3: 0,
    ml4: 0,
    ml5: 0
  });
  const [activeTab, setActiveTab] = useState("all");

  const filteredLessons = activeTab === "all" 
    ? dailyLessons 
    : activeTab === "new" 
      ? dailyLessons.filter(lesson => lesson.badge === "New")
      : dailyLessons.filter(lesson => lesson.category.toLowerCase().includes(activeTab));

  const handleSelectLesson = (lesson: any) => {
    setActiveLesson(lesson);
    setIsLessonOpen(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    
    // Set initial progress if not started
    if (lessonProgress[lesson.id] === 0) {
      setLessonProgress({
        ...lessonProgress,
        [lesson.id]: 10 // Started
      });
    }
  };

  const handleViewFullLesson = () => {
    navigate(`/micro-lesson/${activeLesson.id}`);
  };

  const handleSubmitAnswer = () => {
    setIsAnswerSubmitted(true);
    
    // Update progress
    setLessonProgress({
      ...lessonProgress,
      [activeLesson.id]: 80 // Almost complete
    });
  };

  const handleCompleteLesson = () => {
    // Update progress
    setLessonProgress({
      ...lessonProgress,
      [activeLesson.id]: 100 // Complete
    });
    
    // Close lesson view
    setIsLessonOpen(false);
  };

  const quizQuestions = lessonQuizzes[activeLesson.id as keyof typeof lessonQuizzes] || [];
  const isCorrectAnswer = selectedAnswer === quizQuestions[currentQuestion]?.correctAnswer;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Daily <span className="text-primary">Micro-Lessons</span>
              </h2>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 mr-2">
                  <LampDesk className="h-3 w-3 mr-1" /> 
                  Quick Learning
                </Badge>
                <span className="text-sm text-muted-foreground">5-minute lessons</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-3 pl-16">
          Build your skills with these focused lessons designed for daily practice
        </p>
      </CardHeader>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className={`${isLessonOpen ? 'hidden' : 'block'}`}>
        <div className="px-4 pt-2">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      
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
              
              <div className="bg-accent/5 rounded-md p-4 border mt-2">
                <p className="text-sm">{activeLesson.preview}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 text-xs"
                  onClick={handleViewFullLesson}
                >
                  Read full lesson
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
              
              {activeLesson.hasQuiz && quizQuestions.length > 0 && !isAnswerSubmitted && (
                <div className="bg-card border rounded-md p-4 mt-4">
                  <h4 className="font-medium mb-3">Quick Quiz</h4>
                  <p className="mb-3">{quizQuestions[currentQuestion].question}</p>
                  
                  <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
                    {quizQuestions[currentQuestion].options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 mb-2 p-2 rounded hover:bg-accent/10 cursor-pointer">
                        <RadioGroupItem value={option.id} id={`${activeLesson.id}-${option.id}`} />
                        <label htmlFor={`${activeLesson.id}-${option.id}`} className="text-sm cursor-pointer flex-1">{option.text}</label>
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
                        <X className="h-5 w-5 mr-2" />
                        <p className="font-medium">Not quite right</p>
                      </>
                    )}
                  </div>
                  <p className="text-sm">
                    {quizQuestions[currentQuestion].explanation}
                  </p>
                  <Button className="mt-3" onClick={handleCompleteLesson}>
                    Complete Lesson
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
        
        <CardContent className={`p-0 ${isLessonOpen ? 'hidden' : 'block'}`}>
          <ScrollArea className="h-[280px]">
            <div className="p-4 space-y-3">
              {filteredLessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-lg cursor-pointer border transition-colors",
                    lessonProgress[lesson.id] === 100 ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800/30" : "hover:bg-blue-50/50 hover:border-blue-100"
                  )}
                  onClick={() => handleSelectLesson(lesson)}
                >
                  <div className={`p-2 rounded-md ${lesson.color} bg-opacity-10`}>
                    <lesson.icon className={`h-5 w-5 ${lesson.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate flex items-center">
                        {lesson.title}
                        {lessonProgress[lesson.id] === 100 && (
                          <CheckCircle2 className="ml-1.5 h-3.5 w-3.5 text-green-500" />
                        )}
                      </h3>
                      {lesson.badge && (
                        <Badge variant="outline" className="text-xs">{lesson.badge}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {lesson.description}
                    </p>
                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground">
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
                      
                      {lessonProgress[lesson.id] > 0 && (
                        <div className="w-full">
                          <Progress value={lessonProgress[lesson.id]} className="h-1" />
                        </div>
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

export default MicroLessonsCard;
