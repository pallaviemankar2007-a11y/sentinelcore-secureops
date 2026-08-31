import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { averageMetrics } from '../utils/assetHelpers';

const BAR_COLOR = '#6C8CFF';

export default function MetricsOverview({ assets }) {
  const avg = averageMetrics(assets);
  const data = [
    { metric: 'CPU', value: avg.cpu },
    { metric: 'Memory', value: avg.memory },
    { metric: 'Disk', value: avg.disk },
    { metric: 'Network', value: avg.network },
  ];

  return (
    <div style={{ background: '#0F1830', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#8B98B0', marginBottom: 4 }}>
        Average resource usage
      </div>
      {assets.length === 0 ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, color: '#3E4867' }}>
          No assets yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="metric" tick={{ fill: '#5B6684', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickLine={false} />
            <YAxis unit="%" domain={[0, 100]} tick={{ fill: '#5B6684', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#141F3D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#E2E8F0' }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              formatter={(value) => [`${value}%`, 'Avg usage']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={BAR_COLOR}>
              {data.map((entry) => <Cell key={entry.metric} fill={BAR_COLOR} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}