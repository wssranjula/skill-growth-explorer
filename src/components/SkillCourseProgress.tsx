import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useSkills, useLearningItems, useMicroLessons, getSkillLevelText } from "@/lib/data-service";
import { BookOpen, CheckCircle, Clock, Trophy } from "lucide-react";

export const SkillCourseProgress = () => {
  const { data: skills, isLoading: isSkillsLoading } = useSkills();
  const { data: learningItems, isLoading: isLearningItemsLoading } = useLearningItems();
  const { data: microLessons, isLoading: isMicroLessonsLoading } = useMicroLessons();

  // Calculate learning progress for each skill (including both learning items and micro lessons)
  const skillsWithProgress = useMemo(() => {
    if (!skills || !learningItems || !microLessons) return [];

    return skills.map(skill => {
      // Get learning items for this skill
      const skillLearningItems = learningItems?.filter(item => item.skillIds.includes(skill.id)) || [];
      const skillMicroLessons = microLessons?.filter(lesson => lesson.skillId === skill.id) || [];
      
      // Calculate totals and completed counts
      const totalLearningItems = skillLearningItems.length;
      const completedLearningItems = skillLearningItems.filter(item => item.completed).length;
      
      const totalMicroLessons = skillMicroLessons.length;
      const completedMicroLessons = skillMicroLessons.filter(lesson => lesson.completed).length;
      
      const totalItems = totalLearningItems + totalMicroLessons;
      const completedItems = completedLearningItems + completedMicroLessons;
      
      // Calculate completion percentage
      const progressPercentage = totalItems > 0 
        ? Math.round((completedItems / totalItems) * 100) 
        : 0;
      
      return {
        ...skill,
        learningItems: skillLearningItems,
        microLessons: skillMicroLessons,
        totalLearningItems,
        completedLearningItems,
        totalMicroLessons,
        completedMicroLessons,
        totalItems,
        completedItems,
        progressPercentage
      };
    }).filter(skill => skill.totalItems > 0); // Only include skills with learning items or micro lessons
  }, [skills, learningItems]);

  // Prepare data for bar chart
  const chartData = useMemo(() => {
    return skillsWithProgress
      .sort((a, b) => b.progressPercentage - a.progressPercentage)
      .slice(0, 5) // Top 5 skills by learning item completion
      .map(skill => {
        // Determine color based on progress and total items
        // Only show green for 100% if there are at least 3 total items
        const hasEnoughItems = skill.totalItems >= 3;
        const isFullyComplete = skill.progressPercentage === 100 && hasEnoughItems;
        
        // For skills with few items, use a different color to indicate partial progress
        let fillColor;
        if (isFullyComplete) {
          fillColor = '#22c55e'; // Green for fully complete with enough items
        } else if (skill.progressPercentage > 50) {
          fillColor = '#3b82f6'; // Blue for good progress
        } else {
          fillColor = '#f59e0b'; // Amber for limited progress
        }
        
        return {
          name: skill.name,
          progress: skill.progressPercentage,
          fill: fillColor,
          totalItems: skill.totalItems,
          completedItems: skill.completedItems
        };
      });
  }, [skillsWithProgress]);

  // Calculate total stats
  const totalStats = useMemo(() => {
    const totalItems = skillsWithProgress.reduce((sum, skill) => sum + skill.totalItems, 0);
    const completedItems = skillsWithProgress.reduce((sum, skill) => sum + skill.completedItems, 0);
    
    return {
      totalItems,
      completedItems,
      completionPercentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  }, [skillsWithProgress]);

  if (isSkillsLoading || isLearningItemsLoading || isMicroLessonsLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-muted-foreground">Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
            <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200">Learning Progress</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {totalStats.completedItems} of {totalStats.totalItems} items completed
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {totalStats.completionPercentage}%
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Skills by Learning Progress</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name, props) => [`${value}%`, 'Completion']}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                padding: '8px 12px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar 
              dataKey="progress" 
              radius={[0, 4, 4, 0]}
              name="Completion"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
