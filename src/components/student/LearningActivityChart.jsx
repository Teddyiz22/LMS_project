import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { weeklyLearningActivity } from '../../data/studentMockData.js'

function LearningActivityChart() {
  return <div className="h-64 w-full" role="img" aria-label="Weekly learning activity chart"><ResponsiveContainer height="100%" width="100%"><BarChart data={weeklyLearningActivity} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}><XAxis axisLine={false} dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} /><YAxis axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(value) => `${value}h`} tickLine={false} /><Tooltip cursor={{ fill: '#EFF6FF' }} formatter={(value) => [`${value} hours`, 'Learning']} labelStyle={{ color: '#1E293B' }} /><Bar dataKey="hours" fill="#2563EB" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
}

export default LearningActivityChart
