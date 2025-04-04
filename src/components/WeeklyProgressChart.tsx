import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, RadialBar } from 'recharts';
import { Progress } from "@/components/ui/progress";
import { Trophy } from 'lucide-react';

interface WeeklyProgressChartProps {
  weeklyProgress: number[];
  weeklyTarget: number;
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ weeklyProgress, weeklyTarget }) => {
  // Calculate average progress
  const averageProgress = Math.round(
    weeklyProgress.reduce((acc, curr) => acc + curr, 0) / weeklyProgress.length
  );

  // Data for donut chart
  const data = [
    { name: 'Progress', value: averageProgress },
    { name: 'Remaining', value: Math.max(0, 100 - averageProgress) }
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
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Weekly Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-72 h-72 relative mt-2"> {/* Increased size for better visibility */}
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
                    innerRadius={55}
                    outerRadius={75}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#${index === 0 ? 'progressGradient' : 'remainingGradient'})`}
                        className="drop-shadow-lg"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
                <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-6 shadow-lg ring-1 ring-gray-100 dark:ring-gray-700">
                  <span className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    {averageProgress}%
                  </span>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">Weekly Average</p>
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
                  <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500 ease-out rounded-full bg-gradient-to-r from-green-500 to-emerald-600" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
