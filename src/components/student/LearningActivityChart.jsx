import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const FALLBACK_DATA = [
  { day: 'Mon', hours: 0 },
  { day: 'Tue', hours: 0 },
  { day: 'Wed', hours: 0 },
  { day: 'Thu', hours: 0 },
  { day: 'Fri', hours: 0 },
  { day: 'Sat', hours: 0 },
  { day: 'Sun', hours: 0 },
]

function LearningActivityChart({ data }) {
  const chartData = Array.isArray(data) && data.length > 0 ? data : FALLBACK_DATA
  return <div className="h-64 w-full" role="img" aria-label="Weekly learning activity chart"><ResponsiveContainer height="100%" width="100%"><BarChart data={chartData} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}><XAxis axisLine={false} dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} /><YAxis axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(value) => `${value}h`} tickLine={false} /><Tooltip cursor={{ fill: '#EFF6FF' }} formatter={(value) => [`${value} hours`, 'Learning']} labelStyle={{ color: '#1E293B' }} /><Bar dataKey="hours" fill="#2563EB" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
}

export default LearningActivityChart
