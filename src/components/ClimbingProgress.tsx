import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sparkles, Zap, Trophy, Star, Award, TrendingUp, Target } from "lucide-react";

interface ClimbingProgressProps {
  totalPoints: number;
  maxPoints: number;
  progressPercentage: number;
}

const TOTAL_STEPS = 5;

export const ClimbingProgress = ({ totalPoints, maxPoints, progressPercentage }: ClimbingProgressProps) => {
  // Calculate current step (0-based index)
  const currentStep = Math.floor((progressPercentage / 100) * TOTAL_STEPS);
  
  // Points per level
  const pointsPerLevel = maxPoints / TOTAL_STEPS;
  
  // Animation state for points counter
  const [animatedPoints, setAnimatedPoints] = useState(0);
  
  // Animate points counter when totalPoints changes
  useEffect(() => {
    let start = 0;
    const end = totalPoints;
    const duration = 1000; // 1 second animation
    const startTime = Date.now();
    
    const animateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = t => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      const value = Math.floor(easedProgress * (end - start) + start);
      setAnimatedPoints(value);
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    
    requestAnimationFrame(animateCount);
    
    return () => setAnimatedPoints(totalPoints); // Ensure final value is set on cleanup
  }, [totalPoints]);
  
  // Calculate points needed for next level
  const currentLevelPoints = currentStep * pointsPerLevel;
  const nextLevelPoints = Math.min((currentStep + 1) * pointsPerLevel, maxPoints);
  const pointsToNextLevel = nextLevelPoints - totalPoints;
  
  return (
    <div className="relative h-[300px] w-full">
      {/* Progress Badge */}
      <div className="absolute top-2 right-2 z-10 flex items-center space-x-2">
        <div className="relative group">
          <Badge variant="secondary" className="text-sm px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 shadow-sm backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
            <span className="font-bold">{animatedPoints}</span> / {maxPoints} points
          </Badge>
          
          <div className="absolute -bottom-12 right-0 w-48 bg-black/80 text-white text-xs rounded p-2 invisible group-hover:visible transition-opacity duration-200 z-20">
            {pointsToNextLevel > 0 ? (
              <span>Need {pointsToNextLevel} more points for Level {currentStep + 2}</span>
            ) : (
              <span>Maximum level reached! Congratulations!</span>
            )}
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Decorative background elements */}
          <defs>
            <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="platformGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0000001a" />
            </filter>
          </defs>
          
          {/* Background grid */}
          <g className="text-gray-100 dark:text-gray-800">
            {[...Array(12)].map((_, i) => (
              <line 
                key={`vline-${i}`}
                x1={(i * 25)}
                y1="0"
                x2={(i * 25)}
                y2="300"
                className="stroke-current"
                strokeWidth="0.5"
                strokeDasharray="1 4"
              />
            ))}
            {[...Array(12)].map((_, i) => (
              <line 
                key={`hline-${i}`}
                x1="0"
                y1={(i * 25)}
                x2="300"
                y2={(i * 25)}
                className="stroke-current"
                strokeWidth="0.5"
                strokeDasharray="1 4"
              />
            ))}
          </g>
          
          {/* Background elements - removed yellow gradient */}
          
          {/* 3D Steps with points indicators */}
          {[...Array(TOTAL_STEPS)].map((_, index) => {
            const isCompleted = index <= currentStep;
            const isCurrentLevel = index === currentStep;
            const y = 240 - (index * 45); // Further increased spacing for bigger component
            const width = 200 - (index * 20);
            const x = (300 - width) / 2;
            const depth = 10; // Enhanced 3D depth effect
            
            // Calculate points for this level
            const levelMinPoints = index * pointsPerLevel;
            const levelMaxPoints = Math.min((index + 1) * pointsPerLevel, maxPoints);
            
            return (
              <g key={index} className="transition-all duration-500">
                {/* Step Platform with premium 3D effect and glow for current level */}
                <g 
                  className="transition-all duration-700"
                  filter={isCurrentLevel ? "url(#glow)" : "url(#shadow)"}
                >
                  {/* Platform base with gradient */}
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={10} // Taller for more premium look
                    rx={4}
                    className={`${isCurrentLevel ? 'animate-pulse' : ''}`}
                    style={{ 
                      animationDuration: '3s',
                      fill: isCompleted 
                        ? (isCurrentLevel ? 'url(#currentGradient)' : 'url(#completedGradient)') 
                        : 'url(#platformGradient)'
                    }}
                  />
                  
                  {/* Glass effect overlay */}
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={5} // Half height for glass effect
                    rx={4}
                    className="fill-white dark:fill-white opacity-30"
                  />
                  
                  {/* Side face with gradient */}
                  <path
                    d={`M${x + width},${y} l${depth},${depth} l0,10 l-${depth},-${depth} Z`}
                    className="opacity-70"
                    style={{ 
                      fill: isCompleted 
                        ? (isCurrentLevel ? '#f59e0b' : '#10b981') 
                        : '#0ea5e9'
                    }}
                  />
                  
                  {/* Top face with gradient */}
                  <path
                    d={`M${x},${y} l${depth},${depth} l${width},0 l-${depth},-${depth} Z`}
                    className="opacity-85"
                    style={{ 
                      fill: isCompleted 
                        ? (isCurrentLevel ? '#fbbf24' : '#34d399') 
                        : '#38bdf8'
                    }}
                  />
                </g>
                
                {/* Level Label with Points Range */}
                <g className={`${isCurrentLevel ? 'animate-pulse' : ''}`} style={{ animationDuration: '3s' }}>
                  {/* Level label with premium styling */}
                  <g filter={isCurrentLevel ? "url(#glow)" : undefined}>
                    <text
                      x={x}
                      y={y + 24}
                      className={`text-[12px] font-bold ${isCompleted 
                        ? (isCurrentLevel ? 'fill-amber-600 dark:fill-amber-300' : 'fill-emerald-600 dark:fill-emerald-300') 
                        : 'fill-sky-600 dark:fill-sky-300'}`}
                    >
                      Level {index + 1}
                    </text>
                    <text
                      x={x + width - 10}
                      y={y + 24}
                      textAnchor="end"
                      className={`text-[10px] font-medium ${isCompleted 
                        ? (isCurrentLevel ? 'fill-amber-500 dark:fill-amber-400' : 'fill-emerald-500 dark:fill-emerald-400') 
                        : 'fill-sky-500 dark:fill-sky-400'}`}
                    >
                      {levelMinPoints} - {levelMaxPoints} pts
                    </text>
                  </g>
                </g>
                
                {/* Achievement badges for completed levels */}
                {isCompleted && (
                  <g transform={`translate(${x - 18}, ${y - 5})`}>
                    {index === TOTAL_STEPS - 1 ? (
                      <Trophy className="h-7 w-7 text-amber-400 fill-amber-400 drop-shadow-md" />
                    ) : index >= 3 ? (
                      <Award className="h-7 w-7 text-amber-400 fill-amber-400 drop-shadow-md" />
                    ) : index >= 1 ? (
                      <Star className="h-7 w-7 text-amber-400 fill-amber-400 drop-shadow-md" />
                    ) : (
                      <Target className="h-7 w-7 text-amber-400 fill-amber-400 drop-shadow-md" />
                    )}
                  </g>
                )}
              </g>
            );
          })}

          {/* Trophy at the top */}
          <g className={cn(
            "transition-all duration-700",
            progressPercentage === 100 ? "opacity-100 scale-110" : "opacity-40 scale-100"
          )} transform="translate(150, 30)">
            
            {progressPercentage === 100 && (
              <>
                {/* Celebration rays */}
                {[...Array(8)].map((_, i) => (
                  <line 
                    key={i}
                    x1="0" 
                    y1="0" 
                    x2={Math.cos(i * Math.PI / 4) * 25} 
                    y2={Math.sin(i * Math.PI / 4) * 25}
                    className="stroke-yellow-400"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  >
                    <animate 
                      attributeName="opacity" 
                      values="0;1;0" 
                      dur="1.5s" 
                      repeatCount="indefinite"
                      begin={`${i * 0.2}s`}
                    />
                  </line>
                ))}
              </>
            )}
          </g>

          {/* 3D Climbing Person with sparkle effect */}
          <g
            transform={`translate(150, ${240 - (currentStep * 45)})`}
            className="transition-transform duration-700 ease-out"
          >
            {/* Sparkle effects around character */}
            {currentStep > 0 && (
              <g className="animate-pulse" style={{ animationDuration: '1.5s' }}>
                {[...Array(5)].map((_, i) => {
                  const angle = (i * 72) * Math.PI / 180;
                  const distance = 12 + (i % 2) * 5;
                  return (
                    <circle 
                      key={i}
                      cx={Math.cos(angle) * distance} 
                      cy={Math.sin(angle) * distance - 5}
                      r="1.5"
                      className="fill-yellow-400"
                    >
                      <animate 
                        attributeName="opacity" 
                        values="0;1;0" 
                        dur="1.5s" 
                        repeatCount="indefinite"
                        begin={`${i * 0.3}s`}
                      />
                    </circle>
                  );
                })}
              </g>
            )}
            
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
      
      {/* Next level indicator */}
      <div className="absolute top-[290px] left-0 right-0 text-center">
        {currentStep < TOTAL_STEPS - 1 ? (
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-gradient-to-r from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 rounded-full py-1.5 px-4 mx-auto inline-block shadow-sm border border-slate-200 dark:border-slate-700">
            <Sparkles className="h-3.5 w-3.5 inline-block mr-1.5 text-amber-500" />
            <span className="font-semibold">{pointsToNextLevel}</span> points to Level {currentStep + 2}
          </div>
        ) : progressPercentage === 100 ? (
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-full py-1.5 px-4 mx-auto inline-block shadow-sm border border-emerald-200 dark:border-emerald-800/50">
            <Trophy className="h-3.5 w-3.5 inline-block mr-1.5 text-amber-500" />
            Maximum level achieved! Congratulations!
          </div>
        ) : (
          <div className="text-xs font-medium text-amber-600 dark:text-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-full py-1.5 px-4 mx-auto inline-block shadow-sm border border-amber-200 dark:border-amber-800/50">
            <Zap className="h-3.5 w-3.5 inline-block mr-1.5 text-amber-500" />
            <span className="font-semibold">{pointsToNextLevel}</span> points to complete your journey
          </div>
        )}
      </div>
    </div>
  );
};
