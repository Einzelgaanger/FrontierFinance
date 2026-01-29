import { useEffect } from "react";

const Drew = () => {
  useEffect(() => {
    // Prevent scrolling on this page
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const topics = [
    {
      num: "1",
      title: "Ingredients for World Class SGB Financing Vehicles",
      sub: "L+ services & value proposition",
    },
    {
      num: "2",
      title: "Pathways to Capital Mobilization",
      sub: "FoFs, Pension Funds, Patient Capital",
    },
    {
      num: "3",
      title: "Small Business Finance – LCP Performance",
      sub: "SoP & L+ Assessment Tool data trends",
    },
    {
      num: "4",
      title: "World Class Innovations & Solutions",
      sub: "Case studies on LCP models",
    },
    {
      num: "5",
      title: "Smart Subsidies for SGBs",
      sub: "Overhead support, Junior tranche, TA",
    },
    {
      num: "6",
      title: "Youth & Women Employment",
      sub: "ESCP network impact data",
    },
    {
      num: "7",
      title: "Public Markets & Liquidity",
      sub: "Secondary markets, BII GIP, Securitization",
    },
    {
      num: "8",
      title: "Regulatory Constraints",
      sub: "Landscape analysis across Africa",
    },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          CFF Thought Leadership
        </h1>
        <p className="text-xl md:text-2xl text-blue-300 mt-2 font-light">
          Potential 2026 Topics & Themes
        </p>
      </div>

      {/* Circular Grid Layout */}
      <div className="relative w-full max-w-7xl aspect-[16/9] flex items-center justify-center">
        {/* Center Circle */}
        <div className="absolute z-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
          <span className="text-slate-900 font-bold text-lg md:text-xl text-center leading-tight">
            2026<br />Vision
          </span>
        </div>

        {/* Topics arranged in a circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          {topics.map((topic, index) => {
            const totalTopics = topics.length;
            const angle = (index * 360) / totalTopics - 90;
            const radius = 38; // percentage from center
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

            return (
              <div
                key={topic.num}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 w-[140px] md:w-[180px] lg:w-[200px]"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default">
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-500 text-slate-900 font-bold text-sm md:text-base flex items-center justify-center">
                      {topic.num}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold text-xs md:text-sm lg:text-base leading-tight line-clamp-2">
                        {topic.title}
                      </h3>
                      <p className="text-blue-200/80 text-[10px] md:text-xs mt-1 line-clamp-1">
                        {topic.sub}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-blue-200/60 text-sm">
          * Indicates data-driven content from ESCP Network
        </p>
      </div>
    </div>
  );
};

export default Drew;
