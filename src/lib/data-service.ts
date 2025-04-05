import { useQuery } from "@tanstack/react-query";

// Types
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Skill {
  id: string;
  name: string;
  category: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  relevance: number; // 0-100
  term: "short" | "mid" | "long"; // short-term (1 month), mid-term (3 months), long-term (6 months)
}

export interface LearningItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "article" | "course" | "documentation";
  duration: number; // in minutes
  skillIds: string[];
  completed: boolean;
  url: string;
  difficulty: DifficultyLevel;
}

export interface MicroLesson {
  id: string;
  title: string;
  content: string;
  skillId: string;
  duration: number; // in minutes
  completed: boolean;
  hasQuiz: boolean;
  difficulty: DifficultyLevel;
}

export interface ProgressData {
  skillsCompleted: number;
  lessonsCompleted: number;
  resourcesViewed: number;
  streakDays: number;
  weeklyProgress: number[]; // Percentage complete for each day of the week
  totalPoints: number;
}

// Mock data
const mockSkills: Skill[] = [
  {
    id: "skill-1",
    name: "JavaScript",
    category: "Programming",
    currentLevel: "intermediate",
    targetLevel: "advanced",
    relevance: 95,
    term: "short"
  },
  {
    id: "skill-2",
    name: "Python",
    category: "Programming",
    currentLevel: "intermediate",
    targetLevel: "advanced",
    relevance: 100,
    term: "mid"
  },
  {
    id: "skill-3",
    name: "Cloud Architecture",
    category: "Infrastructure",
    currentLevel: "beginner",
    targetLevel: "intermediate",
    relevance: 85,
    term: "mid"
  },
  {
    id: "skill-4",
    name: "React",
    category: "Frontend",
    currentLevel: "intermediate",
    targetLevel: "advanced",
    relevance: 92,
    term: "short"
  },
  {
    id: "skill-5",
    name: "Data Structures",
    category: "Computer Science",
    currentLevel: "intermediate",
    targetLevel: "advanced",
    relevance: 88,
    term: "long"
  },
  {
    id: "skill-6",
    name: "System Design",
    category: "Architecture",
    currentLevel: "beginner",
    targetLevel: "intermediate",
    relevance: 80,
    term: "long"
  },
];

const mockLearningItems: LearningItem[] = [
  {
    id: "resource-1",
    title: "Advanced JavaScript Concepts",
    description: "Deep dive into JavaScript closures, prototypes, and async patterns",
    type: "course",
    duration: 120,
    skillIds: ["skill-1"],
    completed: false,
    url: "#",
    difficulty: "advanced"
  },
  {
    id: "resource-2",
    title: "Python for Data Science",
    description: "Learn how to use Python for data analysis and visualization",
    type: "course",
    duration: 180,
    skillIds: ["skill-2"],
    completed: false,
    url: "#",
    difficulty: "advanced"
  },
  {
    id: "resource-3",
    title: "AWS Cloud Architecture Fundamentals",
    description: "Introduction to designing scalable systems on AWS",
    type: "documentation",
    duration: 60,
    skillIds: ["skill-3"],
    completed: false,
    url: "#",
    difficulty: "intermediate"
  },
  {
    id: "resource-4",
    title: "React Performance Optimization",
    description: "Techniques to improve React application performance",
    type: "article",
    duration: 20,
    skillIds: ["skill-4"],
    completed: true,
    url: "#",
    difficulty: "advanced"
  },
  {
    id: "resource-5",
    title: "Common Data Structure Operations",
    description: "Understanding time and space complexity of data structures",
    type: "video",
    duration: 45,
    skillIds: ["skill-5"],
    completed: false,
    url: "#",
    difficulty: "advanced"
  },
  {
    id: "resource-6",
    title: "Microservices Architecture Patterns",
    description: "Design patterns for building robust microservices",
    type: "article",
    duration: 25,
    skillIds: ["skill-6"],
    completed: false,
    url: "#",
    difficulty: "advanced"
  },
];

const mockMicroLessons: MicroLesson[] = [
  {
    id: "lesson-1",
    title: "JavaScript Closures Explained",
    content: "Closures are functions that have access to variables from an outer function scope, even after the outer function has returned. They're a powerful feature of JavaScript that enables data encapsulation and private variables.\n\nExample:\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```\n\nThis pattern is commonly used in modern JavaScript frameworks and libraries.",
    skillId: "skill-1",
    duration: 5,
    completed: false,
    hasQuiz: false,
    difficulty: "advanced"
  },
  {
    id: "lesson-2",
    title: "Python List Comprehensions",
    content: "List comprehensions provide a concise way to create lists based on existing lists or other iterable objects. They follow the pattern:\n\n```python\n[expression for item in iterable if condition]\n```\n\nFor example:\n```python\n# Create a list of squares for even numbers from 0 to 9\nsquares = [x**2 for x in range(10) if x % 2 == 0]\nprint(squares)  # [0, 4, 16, 36, 64]\n```\n\nList comprehensions are more readable and often faster than equivalent for loops.",
    skillId: "skill-2",
    duration: 5,
    completed: true,
    hasQuiz: true,
    difficulty: "advanced"
  },
  {
    id: "lesson-3",
    title: "Cloud Architecture: Stateless Services",
    content: "Stateless services don't store client data between requests. Each request contains all the information needed to process it. This design makes services easier to scale horizontally and improves reliability.\n\nKey benefits of stateless services:\n- Easier scaling (just add more instances)\n- Better fault tolerance (any instance can handle any request)\n- Simpler deployment and updates\n\nWhen designing cloud services, start with stateless design where possible, and carefully isolate any stateful components.",
    skillId: "skill-3",
    duration: 5,
    completed: false,
    hasQuiz: false,
    difficulty: "intermediate"
  },
];

const mockProgressData: ProgressData = {
  skillsCompleted: 2,
  lessonsCompleted: 1,
  resourcesViewed: 8,
  streakDays: 5,
  weeklyProgress: [65, 70, 75, 80, 60, 0, 0], // Mon-Sun
  totalPoints: 750 // Initial points
};

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchSkills = async (): Promise<Skill[]> => {
  await delay(500);
  return [...mockSkills];
};

export const fetchLearningItems = async (): Promise<LearningItem[]> => {
  await delay(600);
  return [...mockLearningItems];
};

export const fetchMicroLessons = async (): Promise<MicroLesson[]> => {
  await delay(300);
  return [...mockMicroLessons];
};

export const fetchProgressData = async (): Promise<ProgressData> => {
  await delay(400);
  return { ...mockProgressData };
};

export const fetchMicroLesson = async (id: string): Promise<MicroLesson | undefined> => {
  await delay(200);
  return mockMicroLessons.find(lesson => lesson.id === id);
};

// React Query hooks
export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });
};

export const useLearningItems = () => {
  return useQuery({
    queryKey: ["learningItems"],
    queryFn: fetchLearningItems,
  });
};

export const useMicroLessons = () => {
  return useQuery({
    queryKey: ["microLessons"],
    queryFn: fetchMicroLessons,
  });
};

export const useProgressData = () => {
  return useQuery({
    queryKey: ["progressData"],
    queryFn: fetchProgressData,
  });
};

export const useMicroLesson = (id: string | undefined) => {
  return useQuery({
    queryKey: ["microLesson", id],
    queryFn: () => fetchMicroLesson(id ?? ""),
    enabled: !!id,
  });
};

// Helper function to get skill level in readable format
export const getSkillLevelText = (level: SkillLevel): string => {
  return {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    expert: "Expert",
  }[level] || "Unknown";
};

// Helper function to get skill level color
export const getSkillLevelColor = (level: SkillLevel): string => {
  return {
    beginner: "text-skill-beginner",
    intermediate: "text-skill-intermediate",
    advanced: "text-skill-advanced",
    expert: "text-skill-expert",
  }[level] || "text-gray-500";
};

// Helper function to get skill level background color
export const getSkillLevelBgColor = (level: SkillLevel): string => {
  switch (level) {
    case "beginner":
      return "bg-blue-100";
    case "intermediate":
      return "bg-green-100";
    case "advanced":
      return "bg-purple-100";
    case "expert":
      return "bg-amber-100";
    default:
      return "bg-gray-100";
  }
};

// Points calculation utility functions
export const getPointsForDifficulty = (difficulty: DifficultyLevel): number => {
  switch (difficulty) {
    case "beginner":
      return 10;
    case "intermediate":
      return 25;
    case "advanced":
      return 50;
    default:
      return 5;
  }
};

export const calculateTotalPoints = (
  completedLessons: MicroLesson[], 
  completedResources: LearningItem[]
): number => {
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
