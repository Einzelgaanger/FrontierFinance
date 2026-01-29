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
      title: "Ingredients for World Class SGB Financing Vehicles",
      items: ["a.\tOutline services that L+ offers, and value proposition (quantify)*"],
    },
    {
      num: "2",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      title: "Pathways to Capital Mobilization",
      items: ["a.\tRole of FoFs*", "b.\tIncentivizing Pension Funds", "c.\tAligning patient capital"],
    },
    {
      num: "3",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      title: "Small Business Finance – LCP Performance",
      items: ["a.\tUse of SoP and L+ Assessment Tool to provide anonymous data on trends*", "b.\tData on provision of portfolio Technical Support*"],
    },
    {
      num: "4",
      icon: Lightbulb,
      color: "from-purple-500 to-pink-500",
      title: "World Class Innovations and Solutions to SGB Finance",
      items: ["a.\tCase studies on different LCP models with supporting performance data*"],
    },
    {
      num: "5",
      icon: Coins,
      color: "from-yellow-500 to-orange-500",
      title: "Smart Subsidies that Advance the Financing of SGBs",
      items: ["a.\tOperating overhead support in early years of fund establishment*", "b.\tJunior tranche capital to incentivize institutional capital*", "c.\tPortfolio level technical support*"],
    },
    {
      num: "6",
      icon: Users,
      color: "from-rose-500 to-red-500",
      title: "Addressing the Youth & Women underemployment through Sustainable SGBs",
      items: ["a.\tData on ESCP network's impact on employment*", "b.\tWhat are most appropriate measures of impact*"],
    },
    {
      num: "7",
      icon: Building2,
      color: "from-indigo-500 to-violet-500",
      title: "Public Markets – Creating Liquidity and Scale for SGBs",
      items: ["a.\tSecondary capital markets for loans and equity investments", "i.\tEquity - Include the restructuring of BII's GIP concept", "ii.\tLoan securitization"],
    },
    {
      num: "8",
      icon: Scale,
      color: "from-slate-500 to-zinc-500",
      title: "Regulatory Factors constraining small business funds",
      items: ["a.\tLandscape analysis across Africa*"],
    },
  ];

  return (
    <div className="drew-scroll fixed inset-0 bg-white p-4 overflow-y-auto flex flex-col">
      <style>{`
        .drew-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .drew-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
          CFF Thought Leadership
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-gray-700 mt-1">
          Potential 2026 Topics/Themes
        </p>
      </div>

      {/* Content Grid - 2x4 */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4 pb-8">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <div
              key={topic.num}
              className="bg-white rounded-xl p-3 border-2 border-gray-200 shadow-sm flex gap-3 items-start hover:scale-[1.02] hover:shadow-md transition-all"
            >
              {/* Icon & Number - coloured */}
              <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${topic.color} text-white`}>
                    {topic.num}
                  </span>
                  <h3 className={`font-bold text-lg md:text-xl lg:text-2xl leading-tight line-clamp-2 bg-gradient-to-r ${topic.color} bg-clip-text text-transparent`}>
                    {topic.title}
                  </h3>
                </div>
                <ul className="space-y-0.5">
                  {topic.items.map((item, idx) => {
                    const isSubItem = item.startsWith("i.\t") || item.startsWith("ii.\t");
                    return (
                      <li key={idx} className={`text-base md:text-lg lg:text-xl text-gray-700 flex items-start gap-1 ${isSubItem ? "pl-4" : ""}`}>
                        <span className="text-gray-400 font-bold shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-2 text-center">
        <p className="text-gray-600 text-sm">
          * = data extracted from revamped SoP survey in 2026 and L+ Assessment
        </p>
      </div>
    </div>
  );
};

export default Drew;
