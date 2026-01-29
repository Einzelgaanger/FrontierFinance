import { useEffect } from "react";
import { 
  Rocket, 
  TrendingUp, 
  BarChart3, 
  Lightbulb, 
  Coins, 
  Users, 
  Building2, 
  Scale 
} from "lucide-react";

const Drew = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const topics = [
    {
      num: "1",
      icon: Rocket,
      color: "from-orange-500 to-amber-500",
      bg: "bg-orange-500/20",
      title: "Ingredients for World Class SGB Financing Vehicles",
      items: ["Outline services that L+ offers, and value proposition (quantify)"],
    },
    {
      num: "2",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/20",
      title: "Pathways to Capital Mobilization",
      items: ["Role of FoFs", "Incentivizing Pension Funds", "Aligning patient capital"],
    },
    {
      num: "3",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/20",
      title: "Small Business Finance – LCP Performance",
      items: ["SoP and L+ Assessment Tool for anonymous data trends", "Portfolio Technical Support data"],
    },
    {
      num: "4",
      icon: Lightbulb,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/20",
      title: "World Class Innovations & Solutions to SGB Finance",
      items: ["Case studies on different LCP models with performance data"],
    },
    {
      num: "5",
      icon: Coins,
      color: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-500/20",
      title: "Smart Subsidies that Advance SGB Financing",
      items: ["Operating overhead support", "Junior tranche capital", "Portfolio level TA"],
    },
    {
      num: "6",
      icon: Users,
      color: "from-rose-500 to-red-500",
      bg: "bg-rose-500/20",
      title: "Youth & Women Underemployment via Sustainable SGBs",
      items: ["ESCP network employment impact data", "Appropriate impact measures"],
    },
    {
      num: "7",
      icon: Building2,
      color: "from-indigo-500 to-violet-500",
      bg: "bg-indigo-500/20",
      title: "Public Markets – Liquidity & Scale for SGBs",
      items: ["Secondary markets (equity & loans)", "BII's GIP restructuring", "Loan securitization"],
    },
    {
      num: "8",
      icon: Scale,
      color: "from-slate-500 to-zinc-500",
      bg: "bg-slate-500/20",
      title: "Regulatory Factors Constraining Small Business Finance",
      items: ["Landscape analysis across Africa"],
    },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
          CFF Thought Leadership — 2026 Topics
        </h1>
      </div>

      {/* Content Grid - 2x4 */}
      <div className="flex-1 grid grid-cols-2 gap-3 lg:gap-4">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <div
              key={topic.num}
              className={`${topic.bg} backdrop-blur-sm rounded-xl p-3 border border-white/10 flex gap-3 items-start hover:scale-[1.02] transition-transform`}
            >
              {/* Icon & Number */}
              <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${topic.color} text-white`}>
                    {topic.num}
                  </span>
                  <h3 className="font-bold text-sm md:text-base lg:text-lg leading-tight line-clamp-2">
                    {topic.title}
                  </h3>
                </div>
                <ul className="space-y-0.5">
                  {topic.items.map((item, idx) => (
                    <li key={idx} className="text-xs md:text-sm text-blue-200/90 flex items-start gap-1">
                      <span className="text-amber-400">•</span>
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-2 text-center">
        <p className="text-blue-300/60 text-xs">
          ✦ Data-driven content from ESCP Network & L+ Assessment Tools
        </p>
      </div>
    </div>
  );
};

export default Drew;
