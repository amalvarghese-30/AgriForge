import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  href?: string;
}

export function StatsCard({ title, value, icon: Icon, href }: StatsCardProps) {
  const content = (
    <div className="rounded-2xl border border-border bg-card p-6 hover:border-accent/40 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-accent/10 grid place-items-center">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  if (href) return <Link to={href}>{content}</Link>;
  return content;
}
