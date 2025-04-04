import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClimbingProgressProps {
  totalPoints: number;
  maxPoints: number;
  progressPercentage: number;
}

const TOTAL_STEPS = 5;

export const ClimbingProgress = ({ totalPoints, maxPoints, progressPercentage }: ClimbingProgressProps) => {
  // Calculate current step (0-based index)
  const currentStep = Math.floor((progressPercentage / 100) * TOTAL_STEPS);
  
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="bg-white border-t-4 border-blue-500 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Your Learning Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative h-[200px] w-full bg-white rounded-lg overflow-hidden">
          {/* Progress Badge */}
          <div className="absolute top-0 right-0 z-10">
            <Badge variant="secondary" className="text-sm px-2 py-1">
              {totalPoints} / {maxPoints} points
            </Badge>
          </div>

          {/* SVG Container */}
          <div className="absolute inset-0">
            <svg
              viewBox="0 0 300 200"
              className="w-full h-full"
              preserveAspectRatio="xMidYMax meet"
            >
              {/* 3D Steps */}
              {[...Array(TOTAL_STEPS)].map((_, index) => {
                const isCompleted = index <= currentStep;
                const y = 170 - (index * 35);
                const width = 200 - (index * 20);
                const x = (300 - width) / 2;
                const depth = 8; // 3D depth effect
                return (
                  <g key={index} className="transition-all duration-300">
                    {/* Step Platform with 3D effect */}
                    <g className={cn(
                      "transition-colors duration-500",
                      isCompleted ? "text-green-500" : "text-gray-300"
                    )}>
                      {/* Front face */}
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={6}
                        rx={2}
                        className="fill-current"
                      />
                      {/* Side face */}
                      <path
                        d={`M${x + width},${y} l${depth},${depth} l0,6 l-${depth},-${depth} Z`}
                        className="fill-current opacity-70"
                      />
                      {/* Top face */}
                      <path
                        d={`M${x},${y} l${depth},${depth} l${width},0 l-${depth},-${depth} Z`}
                        className="fill-current opacity-85"
                      />
                    </g>
                    {/* Level Label */}
                    <text
                      x={x}
                      y={y + 20}
                      className="fill-gray-500 text-[10px] font-medium"
                    >
                      Level {index + 1}
                    </text>
                  </g>
                );
              })}

              {/* Flag at the top */}
              <g className={cn(
                "transition-opacity duration-500",
                progressPercentage === 100 ? "opacity-100" : "opacity-40"
              )}>
                <line
                  x1="150"
                  y1="40"
                  x2="150"
                  y2="20"
                  className="stroke-blue-500"
                  strokeWidth="2"
                />
                <path
                  d="M150,20 L170,25 L150,30 Z"
                  className="fill-blue-500"
                />
              </g>

              {/* 3D Climbing Person */}
              <g
                transform={`translate(150, ${170 - (currentStep * 35)})`}
                className="transition-transform duration-500 ease-out"
              >
                {/* Body */}
                <g className="fill-primary stroke-primary stroke-[1.5]">
                  {/* Head */}
                  <ellipse cx="0" cy="-15" rx="5" ry="6" />
                  {/* Body */}
                  <line x1="0" y1="-9" x2="0" y2="5" />
                  {/* Arms */}
                  <path d="M-6,-5 Q0,-8 6,-5">
                    <animate
                      attributeName="d"
                      values="M-6,-5 Q0,-8 6,-5;M-6,-3 Q0,-10 6,-3;M-6,-5 Q0,-8 6,-5"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* Legs */}
                  <path d="M0,5 L-4,15">
                    <animate
                      attributeName="d"
                      values="M0,5 L-4,15;M0,5 L-2,15;M0,5 L-4,15"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <path d="M0,5 L4,15">
                    <animate
                      attributeName="d"
                      values="M0,5 L4,15;M0,5 L2,15;M0,5 L4,15"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
