import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// MOCK DATA — placeholder average usage numbers, not pulled from real assets yet.
// Swap this for real data later: average each field (cpuUsage, memoryUsage,
// diskUsage, networkUsage) across the `assets` array the same way `counts` is
// computed in App.jsx, then pass that averaged object in as a prop instead.
const MOCK_METRICS = [
  { metric: 'CPU', value: 34 },
  { metric: 'Memory', value: 58 },
  { metric: 'Disk', value: 41 },
  { metric: 'Network', value: 19 },
];

const BAR_COLOR = '#6C8CFF';

export default function MetricsOverview() {
  return (
    <div style={{ background: '#0F1830', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#8B98B0' }}>Average resource usage</span>
        <span style={{ fontSize: 10, color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)', background: 'rgba(245,166,35,0.1)', borderRadius: 99, padding: '2px 8px' }}>
          Mock data
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={MOCK_METRICS} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="metric" tick={{ fill: '#5B6684', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickLine={false} />
          <YAxis unit="%" domain={[0, 100]} tick={{ fill: '#5B6684', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#141F3D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#E2E8F0' }}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            formatter={(value) => [`${value}%`, 'Usage']}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={BAR_COLOR}>
            {MOCK_METRICS.map((entry) => (
              <Cell key={entry.metric} fill={BAR_COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}