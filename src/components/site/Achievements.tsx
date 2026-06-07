import { Award, Star, TrendingUp, Users, ShieldCheck, Trophy } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    year: "2021",
    title: "#1 Dealer — Maharashtra Region",
    desc: "John Deere Gold Circle Award for highest customer satisfaction and sales volume across West India.",
  },
  {
    icon: TrendingUp,
    year: "2020",
    title: "Highest Market Share Growth",
    desc: "Recognised for achieving 32% year-on-year market share growth in the 50–75 HP tractor segment.",
  },
  {
    icon: Star,
    year: "2019",
    title: "Best After-Sales Service Award",
    desc: "Mahindra & Mahindra North Star Award for service excellence — 98.7% customer satisfaction score.",
  },
  {
    icon: Users,
    year: "2018",
    title: "Customer Retention Leadership",
    desc: "Sonalika Platinum Partner recognition for 92% customer retention and repeat purchase rate.",
  },
  {
    icon: ShieldCheck,
    year: "2017",
    title: "ISO 9001:2015 Certification",
    desc: "Certified for quality management across sales, service, spare parts distribution and customer support operations.",
  },
  {
    icon: Award,
    year: "2017",
    title: "Dealer of the Year — Implements",
    desc: "Shaktiman Gold Dealer Award for highest implement attachment ratio and farmer training programs.",
  },
];

export function Achievements() {
  return (
    <section className="py-20 bg-card">
      <div className="container-px mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">Trust Built Over Decades</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl tracking-wide">Our Achievements</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Awards and recognitions earned through hard work, honest service and farmer-first values since 1998.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a) => (
            <div
              key={a.title}
              className="relative rounded-2xl border border-border bg-background p-6 hover:shadow-card transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                  {a.year}
                </span>
              </div>
              <h3 className="font-semibold text-base mb-2">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
