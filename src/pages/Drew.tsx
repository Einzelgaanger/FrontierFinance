import { useEffect } from "react";

const Drew = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900 text-white p-3 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-400">
          CFF Thought Leadership — 2026 Topics
        </h1>
      </div>

      {/* Content Grid - 2 columns */}
      <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] md:text-sm lg:text-base xl:text-lg leading-tight">
        
        {/* Topic 1 */}
        <div className="flex gap-2">
          <span className="text-amber-400 font-bold shrink-0">1.</span>
          <div>
            <p className="font-bold">Ingredients for World Class SGB Financing Vehicles</p>
            <p className="text-blue-300">• Outline services that L+ offers, and value proposition (quantify)</p>
          </div>
        </div>

        {/* Topic 2 */}
        <div className="flex gap-2">
          <span className="text-amber-400 font-bold shrink-0">2.</span>
          <div>
            <p className="font-bold">Pathways to Capital Mobilization</p>
            <p className="text-blue-300">• Role of FoFs</p>
            <p className="text-blue-300">• Incentivizing Pension Funds</p>
            <p className="text-blue-300">• Aligning patient capital</p>
          </div>
        </div>

        {/* Topic 3 */}
        <div className="flex gap-2">
          <span className="text-amber-400 font-bold shrink-0">3.</span>
          <div>
            <p className="font-bold">Small Business Finance – LCP Performance</p>
            <p className="text-blue-300">• Use of SoP and L+ Assessment Tool to provide anonymous data on trends</p>
            <p className="text-blue-300">• Data on provision of portfolio Technical Support</p>
          </div>
        </div>

        {/* Topic 4 */}
        <div className="flex gap-2">
          <span className="text-amber-400 font-bold shrink-0">4.</span>
          <div>
            <p className="font-bold">World Class Innovations and Solutions to SGB Finance</p>
            <p className="text-blue-300">• Case studies on different LCP models with supporting performance data</p>
          </div>
        </div>

        {/* Topic 5 */}
        <div className="flex gap-2">
          <span className="text-amber-400 font-bold shrink-0">5.</span>
          <div>
            <p className="font-bold">Smart Subsidies that Advance the Financing of SGBs</p>
            <p className="text-blue-300">• Operating overhead support in early years of fund establishment</p>
            <p className="text-blue-300">• Junior tranche capital to incentivize institutional capital</p>
            <p className="text-blue-300">• Portfolio level technical support</p>
          </div>
        </div>

        {/* Topic 6 */}
        <div className="flex gap-2">
          <span className="text-amber-400 font-bold shrink-0">6.</span>
          <div>
            <p className="font-bold">Addressing Youth & Women Underemployment through Sustainable SGBs</p>
            <p className="text-blue-300">• Data on ESCP network's impact on employment</p>
            <p className="text-blue-300">• What are most appropriate measures of impact</p>
          </div>
        </div>

        {/* Topic 7 */}
        <div className="flex gap-2">
          <span className="text-amber-400 font-bold shrink-0">7.</span>
          <div>
            <p className="font-bold">Public Markets – Creating Liquidity and Scale for SGBs</p>
            <p className="text-blue-300">• Secondary capital markets for loans and equity investments</p>
            <p className="text-blue-300 pl-3">– Equity: Include restructuring of BII's GIP concept</p>
            <p className="text-blue-300 pl-3">– Loan securitization</p>
          </div>
        </div>

        {/* Topic 8 */}
        <div className="flex gap-2">
          <span className="text-amber-400 font-bold shrink-0">8.</span>
          <div>
            <p className="font-bold">Regulatory Factors Constraining Small Business Finance</p>
            <p className="text-blue-300">• Landscape analysis across Africa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drew;
