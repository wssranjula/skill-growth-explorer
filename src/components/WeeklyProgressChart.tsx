import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface WeeklyProgressChartProps {
  weeklyProgress: number[];
  weeklyTarget: number;
}

export const WeeklyProgressChart = ({ weeklyProgress, weeklyTarget }: WeeklyProgressChartProps) => {
  // Calculate average progress
  const averageProgress = Math.round(weeklyProgress.reduce((a, b) => a + b, 0) / 7);
  
  // Data for the donut chart
  const data = [
    { name: 'Progress', value: averageProgress, fill: 'url(#progressGradient)' },
    { name: 'Remaining', value: 100 - averageProgress, fill: 'url(#remainingGradient)' },
  ];

  // Premium gradient colors
  const gradientOffset = {
    x0: '0%',
    y0: '0%',
    x1: '100%',
    y1: '100%'
  };

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-xl">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-80 h-80 relative mt-2"> {/* Increased size for better visibility */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="progressGradient" {...gradientOffset}>
                      <stop offset="0%" stopColor="#4ade80" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    <linearGradient id="remainingGradient" {...gradientOffset}>
                      <stop offset="0%" stopColor="#f87171" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    formatter={(value) => value === 'Progress' ? 'Completed' : 'Remaining'}
                    wrapperStyle={{
                      paddingTop: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center w-32"> {/* Fixed width for better centering */}
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent block mb-1">
                    {averageProgress}%
                  </span>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Weekly Average</p>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Progress Bars */}
          <div className="space-y-4 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Daily Breakdown</h3>
            {weeklyProgress.map((progress, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index]}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className={`h-2 ${progress >= weeklyTarget ? "[&>div]:bg-green-500" : "[&>div]:bg-blue-500"}`}
                />
                {progress >= weeklyTarget && (
                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Target Met
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
