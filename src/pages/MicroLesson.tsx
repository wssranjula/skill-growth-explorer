
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMicroLesson } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, ArrowLeft, AlertTriangle, BookOpen, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

// Sample quiz questions for React Hooks lesson
const sampleQuizQuestions = [
  {
    id: "q1",
    question: "Which hook is used to manage state in functional components?",
    options: [
      { id: "a", text: "useEffect" },
      { id: "b", text: "useState" },
      { id: "c", text: "useContext" },
      { id: "d", text: "useReducer" }
    ],
    correctAnswer: "b"
  },
  {
    id: "q2",
    question: "When is useEffect called?",
    options: [
      { id: "a", text: "Only once when the component mounts" },
      { id: "b", text: "Only when state changes" },
      { id: "c", text: "After every render by default" },
      { id: "d", text: "Only when props change" }
    ],
    correctAnswer: "c"
  },
  {
    id: "q3",
    question: "Which hook would you use to access a Context?",
    options: [
      { id: "a", text: "useContext" },
      { id: "b", text: "useRef" },
      { id: "c", text: "useContextProvider" },
      { id: "d", text: "useConsumer" }
    ],
    correctAnswer: "a"
  }
];

// Sample lesson content for React Hooks
const sampleLessonContent = `
# Understanding React Hooks

React Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class component.

## Why Hooks Matter

Hooks solve several problems in React:
- They let you reuse stateful logic between components
- They let you split one component into smaller functions based on related pieces
- They let you use React features without classes

## The useState Hook

The useState hook is the most basic hook for managing local state in a component.

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## The useEffect Hook

The useEffect hook lets you perform side effects in function components. It serves a similar purpose to componentDidMount, componentDidUpdate, and componentWillUnmount in class components, but unified into a single API.

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = \`You clicked \${count} times\`;
    
    // Clean up function (similar to componentWillUnmount)
    return () => {
      document.title = 'React App';
    };
  }, [count]); // Only re-run the effect if count changes

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Rules of Hooks

There are two important rules to follow when using Hooks:

1. **Only call Hooks at the top level** - Don't call Hooks inside loops, conditions, or nested functions
2. **Only call Hooks from React function components** - Don't call Hooks from regular JavaScript functions
`;

const MicroLesson = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lesson, isLoading } = useMicroLesson(id);
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Use sample content if no lesson data available
  const lessonContent = lesson?.content || sampleLessonContent;
  const quizQuestions = sampleQuizQuestions;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const quizProgress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

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

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswers(0);
  };

  const handleSubmitAnswer = () => {
    setIsAnswerSubmitted(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed
      setQuizStarted(false);
      setCompleted(true);
      toast({
        title: "Quiz completed!",
        description: `You got ${correctAnswers + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)} out of ${quizQuestions.length} correct.`,
        duration: 5000,
      });
    }
  };

  const isCorrectAnswer = selectedAnswer === currentQuestion?.correctAnswer;

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
      
      // Handle headers
      if (part.includes('# ')) {
        return part.split('\n').map((line, lineIndex) => {
          if (line.startsWith('# ')) {
            return <h1 key={`${index}-${lineIndex}`} className="text-2xl font-bold mt-6 mb-4">{line.replace('# ', '')}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={`${index}-${lineIndex}`} className="text-xl font-semibold mt-5 mb-3">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={`${index}-${lineIndex}`} className="text-lg font-medium mt-4 mb-2">{line.replace('### ', '')}</h3>;
          }
          
          // Regular text
          return line ? <p key={`${index}-${lineIndex}`} className="my-2">{line}</p> : null;
        });
      }
      
      // Regular text - split by newlines and create paragraphs
      return part.split('\n\n').map((paragraph, pIndex) => (
        paragraph ? <p key={`${index}-${pIndex}`} className="my-2">{paragraph}</p> : null
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

  if (!lesson && !lessonContent) {
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
              <span>{lesson?.duration || 5} minutes</span>
            </div>
          </div>
          <CardTitle className="text-2xl">{lesson?.title || "Understanding React Hooks"}</CardTitle>
          <CardDescription className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" /> 
            <span>Focus on understanding the concept</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!quizStarted ? (
            <div className="prose prose-slate max-w-none">
              {renderContent(lessonContent)}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                <Progress value={quizProgress} className="w-1/3" />
              </div>
              
              <div className="bg-accent/10 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-4">{currentQuestion.question}</h3>
                
                {!isAnswerSubmitted ? (
                  <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent/20">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">{option.text}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <div 
                        key={option.id} 
                        className={cn(
                          "flex items-center space-x-2 p-3 border rounded-md",
                          option.id === currentQuestion.correctAnswer ? "bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700" : 
                          option.id === selectedAnswer ? "bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-700" : 
                          "bg-transparent"
                        )}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          {option.id === currentQuestion.correctAnswer ? (
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : option.id === selectedAnswer ? (
                            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                          ) : null}
                        </div>
                        <span className={cn(
                          "flex-1",
                          option.id === currentQuestion.correctAnswer ? "font-medium text-green-800 dark:text-green-400" : 
                          option.id === selectedAnswer ? "text-red-800 dark:text-red-400" : ""
                        )}>
                          {option.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {isAnswerSubmitted && (
                <div className={cn(
                  "p-4 rounded-md border",
                  isCorrectAnswer ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400" : 
                  "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400"
                )}>
                  <div className="flex items-center mb-2">
                    {isCorrectAnswer ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <p className="font-medium">Correct!</p>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <p className="font-medium">Not quite right</p>
                      </>
                    )}
                  </div>
                  <p className="text-sm">
                    {isCorrectAnswer 
                      ? "Great job! You've got the right answer." 
                      : `The correct answer is "${currentQuestion.options.find(o => o.id === currentQuestion.correctAnswer)?.text}".`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {!quizStarted ? (
            <>
              <div />
              {completed ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Completed!</span>
                </div>
              ) : (
                <div className="space-x-4">
                  <Button variant="outline" onClick={handleComplete}>
                    Mark as Completed
                  </Button>
                  <Button onClick={handleStartQuiz}>
                    Take Quiz
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-end w-full">
              {isAnswerSubmitted ? (
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              ) : (
                <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
                  Submit Answer
                </Button>
              )}
            </div>
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
              <h3 className="font-medium mb-1">Advanced React Hooks</h3>
              <p className="text-sm text-muted-foreground">
                Learn about useCallback, useMemo, and custom hooks.
              </p>
            </div>
            <div className="border rounded-md p-4 hover:bg-accent/10 cursor-pointer transition-colors">
              <Badge variant="outline" className="mb-2">Video</Badge>
              <h3 className="font-medium mb-1">Practical React Hook Examples</h3>
              <p className="text-sm text-muted-foreground">
                See real-world applications of React hooks in complex UIs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MicroLesson;
