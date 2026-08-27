// Gráficos leves em SVG puro (sem dependência externa) para o dashboard.

export function Sparkline({ data, color = '#F2600C' }: { data: number[]; color?: string }) {
  if (data.length < 2) return <div className="h-10" />;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(' ');
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-10 w-full">
      <polyline points={points.split(' ').map((p) => { const [x, y] = p.split(','); return `${x},${(Number(y) * 0.4)}`; }).join(' ')} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function AreaChart({
  labels,
  data,
  color = '#F2600C',
}: {
  labels: string[];
  data: number[];
  color?: string;
}) {
  const width = 600;
  const height = 220;
  const max = Math.max(...data, 1);
  const stepX = data.length > 1 ? width / (data.length - 1) : width;
  const points = data.map((v, i) => [i * stepX, height - (v / max) * (height - 20)] as const);
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full min-w-[420px]">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaFill)" />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i === points.length - 1 ? 4 : 0} fill={color} />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-ink-600">
        {labels.filter((_, i) => i % Math.ceil(labels.length / 6 || 1) === 0).map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let acc = 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <svg viewBox="0 0 100 100" className="h-40 w-40 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F1F1F4" strokeWidth={16} />
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const dash = frac * c;
          const offset = acc * c;
          acc += frac;
          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={16}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
            />
          );
        })}
      </svg>
      <ul className="space-y-2 text-sm">
        {segments.map((seg, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: seg.color }} />
            <span className="text-ink-700">{seg.label}</span>
            <span className="font-semibold text-ink-900">
              {seg.value.toLocaleString('pt-BR')} ({total ? ((seg.value / total) * 100).toFixed(1) : 0}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
