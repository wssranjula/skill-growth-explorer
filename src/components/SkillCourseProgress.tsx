import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useSkills, useLearningItems, getSkillLevelText } from "@/lib/data-service";
import { BookOpen, CheckCircle, Clock, Trophy } from "lucide-react";

export const SkillCourseProgress = () => {
  const { data: skills, isLoading: isSkillsLoading } = useSkills();
  const { data: learningItems, isLoading: isLearningItemsLoading } = useLearningItems();

  // Calculate course progress for each skill
  const skillsWithCourseProgress = useMemo(() => {
    if (!skills || !learningItems) return [];

    return skills.map(skill => {
      // Get learning items for this skill
      const skillItems = learningItems?.filter(item => item.skillIds.includes(skill.id)) || [];
      
      // Filter courses only
      const courses = skillItems.filter(item => item.type === 'course');
      const totalCourses = courses.length;
      const completedCourses = courses.filter(item => item.completed).length;
      
      // Calculate completion percentage
      const courseProgressPercentage = totalCourses > 0 
        ? Math.round((completedCourses / totalCourses) * 100) 
        : 0;
      
      return {
        ...skill,
        courses,
        totalCourses,
        completedCourses,
        courseProgressPercentage
      };
    }).filter(skill => skill.totalCourses > 0); // Only include skills with courses
  }, [skills, learningItems]);

  // Prepare data for bar chart
  const chartData = useMemo(() => {
    return skillsWithCourseProgress
      .sort((a, b) => b.courseProgressPercentage - a.courseProgressPercentage)
      .slice(0, 5) // Top 5 skills by course completion
      .map(skill => ({
        name: skill.name,
        progress: skill.courseProgressPercentage,
        fill: skill.courseProgressPercentage === 100 ? '#22c55e' : '#3b82f6'
      }));
  }, [skillsWithCourseProgress]);

  // Calculate total stats
  const totalStats = useMemo(() => {
    const totalCourses = skillsWithCourseProgress.reduce((sum, skill) => sum + skill.totalCourses, 0);
    const completedCourses = skillsWithCourseProgress.reduce((sum, skill) => sum + skill.completedCourses, 0);
    
    return {
      totalCourses,
      completedCourses,
      completionPercentage: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0
    };
  }, [skillsWithCourseProgress]);

  if (isSkillsLoading || isLearningItemsLoading) {
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
            <h3 className="font-medium text-blue-800 dark:text-blue-200">Course Completion</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {totalStats.completedCourses} of {totalStats.totalCourses} courses completed
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
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Top Skills by Course Completion</h3>
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
              formatter={(value) => [`${value}%`, 'Completion']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                padding: '8px 12px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
