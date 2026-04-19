interface Breakdown {
  urban: number;
  agriculture: number;
  rangeland: number;
  forest: number;
  water: number;
  barren: number;
  unknown: number;
}

interface LandCoverBarProps {
  breakdown: Breakdown | null;
  loading?: boolean;
}

const CLASSES: { key: keyof Breakdown; label: string; color: string }[] = [
  { key: "urban", label: "Urban", color: "hsl(0 0% 65%)" },
  { key: "agriculture", label: "Agriculture", color: "hsl(45 85% 55%)" },
  { key: "rangeland", label: "Rangeland", color: "hsl(75 55% 50%)" },
  { key: "forest", label: "Forest", color: "hsl(140 60% 35%)" },
  { key: "water", label: "Water", color: "hsl(210 80% 55%)" },
  { key: "barren", label: "Barren", color: "hsl(25 50% 50%)" },
  { key: "unknown", label: "Unknown", color: "hsl(280 30% 55%)" },
];

const LandCoverBar = ({ breakdown, loading }: LandCoverBarProps) => {
  if (loading) {
    return (
      <div className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-2">Land Cover</p>
        <div className="h-2 rounded-full bg-foreground/[0.06] animate-pulse" />
        <p className="text-[10px] text-muted-foreground/50 mt-2">Analyzing land cover...</p>
      </div>
    );
  }
  if (!breakdown) return null;

  const visible = CLASSES.filter((c) => breakdown[c.key] > 0);

  return (
    <div className="mt-3">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mb-2">Land Cover</p>
      <div className="flex h-2 w-full rounded-full overflow-hidden bg-foreground/[0.04]">
        {visible.map((c) => (
          <div
            key={c.key}
            title={c.label}
            style={{ width: `${breakdown[c.key]}%`, backgroundColor: c.color }}
            className="h-full transition-all"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3">
        {visible.map((c) => (
          <div key={c.key} className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: c.color }} />
            <span className="text-muted-foreground/80 truncate">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandCoverBar;
