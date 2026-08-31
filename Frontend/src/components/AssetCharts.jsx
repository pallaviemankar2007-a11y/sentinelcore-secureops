import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const STATUS_COLORS = { HEALTHY: '#2DD4BF', WARNING: '#F5A623', CRITICAL: '#F0455D' };
const TYPE_COLORS = { SERVER: '#6C8CFF', CLOUD: '#8B98B0', NETWORK: '#5EEAD4' };

const tooltipStyle = {
  background: '#141F3D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
  fontSize: 12, color: '#E2E8F0',
};

export function StatusPieChart({ counts }) {
  const data = Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([status, value]) => ({ name: status, value }));

  if (data.length === 0) {
    return <EmptyChart label="No assets yet" />;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#5B6684'} stroke="none" />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          verticalAlign="bottom"
          height={28}
          formatter={(value) => <span style={{ color: '#8B98B0', fontSize: 11.5 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TypeBarChart({ assets }) {
  const counts = assets.reduce((acc, a) => ({ ...acc, [a.type]: (acc[a.type] || 0) + 1 }), {});
  const data = Object.entries(counts).map(([type, value]) => ({ type, value }));

  if (data.length === 0) {
    return <EmptyChart label="No assets yet" />;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="type" tick={{ fill: '#5B6684', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: '#5B6684', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || '#6C8CFF'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ label }) {
  return (
    <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, color: '#3E4867' }}>
      {label}
    </div>
  );
}