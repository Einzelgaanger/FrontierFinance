import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ARTICLE_CONTENT: Record<string, { title: string; subtitle: string; date: string; body: React.ReactNode }> = {
  "empowering-emerging-fund-managers": {
    title: "Empowering Emerging Fund Managers in Underserved Markets",
    subtitle: "The Role of Development Finance Technical Assistance",
    date: "Dec 20, 2023",
    body: (
      <>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Established in 2020 as a business-to-business marketplace connecting African producers to global buyers, Kwely quickly established traction with a revenue-generating model. But within 18 months it was caught in the &ldquo;missing middle&rdquo; funding gap, a challenge faced by small and growing businesses that are too big for microfinance and too small or risky for traditional bank lending.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Fortunately, <a href="https://corp.kwely.com/" target="_blank" rel="noopener noreferrer">Kwely</a> secured an investment from <a href="https://wicsenegal.com/" target="_blank" rel="noopener noreferrer">WIC Capital</a> (a former grantee of ours at FMO) in 2022, in the form of a <a href="https://www.forbes.com/sites/kylewestaway/2023/01/06/understanding-safe-agreements-benefits-and-risks-for-startups/?sh=216424de3433" target="_blank" rel="noopener noreferrer">Simple Agreement for Future Equity (SAFE)</a> note to support its efforts to continue scaling. But without suitable early-stage financing, businesses like Kwely risk failing before they ever have a chance to reach scale, with the wider economy losing out on a key source of innovation, employment and growth.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          The challenge of serving businesses like Kwely is well-known and widely discussed in the development finance sector. But though emerging fund managers and other capital allocators are playing a vital role in addressing the missing middle financing gap in many underserved markets, the demand for this funding vastly outweighs the current supply. In this article — the first in a <a href="https://nextbillion.net/next-generation-dfi-technical-assistance-development-finance-institutions-standardised-approach/" target="_blank" rel="noopener noreferrer">two-part series exploring the uses of technical assistance (TA) in development finance</a> — we&apos;ll explore how development finance institutions (DFIs) can leverage technical assistance to meet the earlier-stage financing needs of missing middle businesses and improve the pipeline for later-stage investors.
        </p>

        <h2 className="text-xl font-display font-semibold text-navy-900 mt-10 mb-4">THE CHALLENGES OF FUNDING MISSING MIDDLE BUSINESSES</h2>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          The <a href="https://www.ifc.org/content/dam/ifc/doc/mgrt/2022-gsmef-progress-report.pdf" target="_blank" rel="noopener noreferrer">IFC estimates</a> that 43% of formal SMEs in developing countries are financially constrained, representing a total funding gap of almost $4.1 trillion. Emerging capital allocators — including some accelerators, incubators and funds operating in frontier markets, as well as donor-supported grant-making mechanisms — can play an important role in filling this gap, particularly for earlier-stage businesses. This is because they understand local market dynamics and capital constraints, and are often physically close to the businesses they work with, which supports both pipeline development and ongoing investment monitoring.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Evelyne Dioh Simpa, Managing Director of <a href="https://wicsenegal.com/" target="_blank" rel="noopener noreferrer">WIC Capital</a>, the first investment fund in West Africa that exclusively targets women-led small and growing businesses, explains this role as follows: &ldquo;We&apos;re not just providing capital, we&apos;re deeply involved in the field. We understand the unique challenges businesses face here and step in when traditional financing falls short. Our close involvement allows us to guide new ventures and keep track of progress. In brief, we don&apos;t just fund — we&apos;re partners at every step.&rdquo;
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Despite this potential, emerging capital allocators <a href="https://english.dggf.nl/documents/publications/2019/1/15/study-on-scaling-access-to-finance-for-early-stage-enterprises" target="_blank" rel="noopener noreferrer">still face significant challenges</a>, resulting in uneven distribution of their capital among businesses across different growth stages and geographies. And higher-risk markets — arguably those in the greatest need — are often the least well-served, with around three quarters of deals in Africa historically going to Nigeria, Kenya, Egypt and South Africa, according to the <a href="https://briterbridges.com/africa-investment-report-2022-by-briter-bridges" target="_blank" rel="noopener noreferrer">Africa Investment Report 2022</a>.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          So what is holding these investors back from reaching more businesses? Part of the answer relates to fund economics. Traditional fund structures aren&apos;t geared towards supporting higher-volume, lower-ticket size transactions (often in the range of US $50,000 – $1 million), since their transaction costs as a percentage of deal size are often too high to be viable. In addition, fund manager compensation — often based on a &ldquo;two and 20&rdquo; model where fund managers charge 2% of total asset value for management fees and 20% of profits as performance fees — fails to reflect the true cost and risk of operating in frontier and growth markets.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          An added challenge is that traditional equity investment instruments tend to focus on businesses already operating at scale, with alternative products like venture debt (i.e., loans to early-stage businesses) still nascent. To compound the problem, the lending practices of many financial institutions still call for high levels of collateral and detailed financial records, both of which early-stage businesses often struggle to provide.
        </p>

        <h2 className="text-xl font-display font-semibold text-navy-900 mt-10 mb-4">INNOVATIVE APPROACHES TO DEVELOPMENT FINANCE TECHNICAL ASSISTANCE</h2>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          With these challenges in mind, how can development finance TA play a meaningful role in increasing the reach and relevance of early-stage financing?
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          One way is by supporting innovation and experimentation to identify, test and scale alternative models that better meet the needs of early-stage capital providers and the businesses in which they invest. Since 2021, <a href="https://www.fmo.nl/ventures-program" target="_blank" rel="noopener noreferrer">FMO&apos;s Ventures Program</a> has supported the <a href="/learning-hub" className="text-gold-600 hover:text-gold-700 underline">Collaborative for Frontier Finance</a>, a multi-stakeholder platform providing mentoring and peer-to-peer exchange to over 100 early-stage capital providers across 30 countries, including first-time and women fund managers — two groups that are historically underrepresented. FMO partnered with the Collaborative on the initial round of the <a href="https://www.fmo.nl/news-detail/4340151a-a42d-4b2c-8404-8ebc45244c63/promoting-the-investment-readiness-of-local-capital-providers-in-africa" target="_blank" rel="noopener noreferrer">LAUNCH Capital Provider Program</a>, which provided 10 funds with customized TA support and to date has enabled eight of these emerging fund managers to raise nearly $15 million in total, with 35 investments made. Some of these innovative funds include:
        </p>
        <ul className="list-disc pl-6 font-sans text-slate-600 leading-relaxed mb-6 space-y-2">
          <li><strong><a href="https://www.five35.ventures/" target="_blank" rel="noopener noreferrer">FIVE35 Ventures</a>:</strong> a high-volume, pan-African gender lens equity fund closely linked to the continent&apos;s STEM ecosystem;</li>
          <li><strong><a href="https://mirepaglobal.com/" target="_blank" rel="noopener noreferrer">Mirepa Capital</a>:</strong> a <a href="https://www.investopedia.com/terms/c/closed-endinvestment.asp" target="_blank" rel="noopener noreferrer">closed-end fund</a> based in Ghana and focusing across Africa that&apos;s raising capital from local funds of funds (FoFs) and pension funds using a mixture of debt and equity to invest;</li>
          <li><strong><a href="https://wicsenegal.com/" target="_blank" rel="noopener noreferrer">WIC Capital</a>:</strong> an open-ended fund seeded by the Women&apos;s Investment Club (WIC) and receiving TA from <a href="https://wicsenegal.com/wic-academie/missions-wic-academie/" target="_blank" rel="noopener noreferrer">WIC Academy</a>, with significant input from female mentors in Senegal.</li>
        </ul>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          There is also growing interest from DFIs and the donor community in supporting more <a href="https://static1.squarespace.com/static/59d679428dd0414c16f59855/t/63060a1fed97bb69afa53d8c/1661340209826/CFF+Fund+of+Funds+Design+Considerations.pdf" target="_blank" rel="noopener noreferrer">FoF models</a> targeting the missing middle, particularly <a href="https://www.proparco.fr/en/carte-des-projets/ip-developpement-2" target="_blank" rel="noopener noreferrer">those operating at a local level</a>. Leveraging funding or TA from DFIs, this new breed of FoFs can support non-traditional, impact-driven venture capital approaches by making use of blended finance, providing training and guidance to emerging fund managers, and offering financial &ldquo;warehousing,&rdquo; which allows fund managers to start building a portfolio before launching a full-scale fund. These kind of FoFs can also offer early-stage capital providers access to large-scale sources of capital — including local pension funds such as the South African SME Fund, which raised capital from South African pension funds using a <a href="https://www.theimpactprogramme.org.uk/wp-content/uploads/2021/12/IIWV_Learning-Outcomes_October-2021.pdf" target="_blank" rel="noopener noreferrer">USAID first-loss guarantee</a>, without which it would not have been able to invest in the missing middle.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Another way DFI TA can support early-stage capital providers is by rethinking the TA &ldquo;toolbox&rdquo; to provide more relevant support to these funders. TA is traditionally not used to cover &ldquo;business as usual&rdquo; costs — for example, management salaries — because this weakens the case for additionality and has the potential to compromise sustainability, raising the question of who will keep paying for those staff salaries after the intervention finishes. But what if this type of subsidy encouraged a high-potential fund manager to enter a new and challenging geography, or helped establish a revolving fund with high operating costs that will operate in an underserved market? Taking these potential uses of TA into account, the Collaborative for Frontier Finance has highlighted emerging <a href="https://static1.squarespace.com/static/59d679428dd0414c16f59855/t/63060a1fed97bb69afa53d8c/1661340209826/CFF+Fund+of+Funds+Design+Considerations.pdf" target="_blank" rel="noopener noreferrer">alternative approaches</a> to compensation, including grant-supported management costs — as exemplified by <a href="https://www.nyalaventure.com/" target="_blank" rel="noopener noreferrer">Nyala Venture</a> — and the potential for cross-subsidisation between funds.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          In another innovative approach, DFI TA can be clearly linked and granted alongside investment capital, with the aim of extending DFI investments to earlier-stage fund managers or those working in the most challenging markets. Smarter use of grant capital, for example concessional or interest-free loans, offers an opportunity to take on riskier but more impactful investments. TA can also help to offset structuring expenses associated with blended finance mechanisms, as demonstrated by <a href="https://impactalpha.com/teranga-capital-taking-risks-to-build-an-impact-ecosystem-in-west-africa/" target="_blank" rel="noopener noreferrer">Teranga Capital in its first fund</a>.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Thinking beyond the level of an individual firm or fund manager, development finance TA is also increasingly being used to help strengthen entrepreneurial ecosystems. One example of this is the aforementioned FMO Ventures Program Technical Assistance Facility, which fits into <a href="https://www.fmo.nl/news-detail/b0f991df-5b7e-44f7-8b7f-7849b900b717/updated-strategy-towards-2030-pioneer-develop-scale" target="_blank" rel="noopener noreferrer">FMO&apos;s market creation</a> remit as part of a broader strategy supporting longer-term investable pipeline opportunities for FMO. Another is the <a href="https://www.ifc.org/en/what-we-do/sector-expertise/venture-capital/startup-catalyst" target="_blank" rel="noopener noreferrer">IFC&apos;s Startup Catalyst</a>, which has supported 19 accelerators, which in turn have invested in nearly 1,200 startups in emerging markets.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          However, to maximise the effectiveness of these TA innovations, the sector needs more and better data. More regular sector-wide studies would provide a signal to the market, highlighting sectors and geographies with pressing financing gaps and untapped potential. Establishing transparent benchmarks for fund economics would enable actors from across the ecosystem to make more informed decisions and set realistic expectations on risk and returns. And improved results measurement would highlight what types of TA are yielding the most promising results, directing resources to the areas of greatest potential.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          The key role that emerging fund managers and other early-stage capital providers can play in addressing the missing middle financing gap is increasingly recognised and understood. As momentum builds, there has never been a better opportunity for DFI TA to support innovative, scalable models, and direct attention towards the markets in greatest need.
        </p>

        <div className="border-t border-slate-200 pt-6 mt-10 space-y-4">
          <p className="text-sm font-sans text-slate-600 leading-relaxed italic">
            Note: In late 2022, Boost Africa Technical Assistance Facility, a European Investment Bank initiative co-financed by the European Union and implemented by Adam Smith International, facilitated a series of conversations that aimed to support coordination efforts and the sharing of best practices between DFIs and development partners providing technical assistance to fund managers and the early-stage investment ecosystem in emerging economies, particularly in sub-Saharan Africa. This is the first article in a two-part series that shares key insights from participants in these conversations — <a href="https://nextbillion.net/next-generation-dfi-technical-assistance-development-finance-institutions-standardised-approach/" target="_blank" rel="noopener noreferrer">the second article can be read here</a>.
          </p>
          <p className="text-sm font-sans text-slate-600 leading-relaxed">
            <a href="https://nextbillion.net/authors/robert-haynie/" target="_blank" rel="noopener noreferrer">Robert Haynie</a> is an impact investing consultant focusing on frontier and growth markets. <a href="https://nextbillion.net/authors/justin-van-rhyn/" target="_blank" rel="noopener noreferrer">Justin van Rhyn</a> is an independent consultant with a background in delivering large-scale TA programming.
          </p>
          <p className="text-sm font-sans text-slate-500">
            <strong>Disclaimer:</strong> This article was featured by our partner Next Billion website{" "}
            <a href="https://nextbillion.net/next-generation-dfi-technical-assistance-development-finance-institutions-standardised-approach/" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 underline">Next Billion</a>
          </p>
        </div>
      </>
    ),
  },
  "funds-of-funds-provide-more-than-capital": {
    title: "Funds of funds provide more than capital for local investors in small and growing businesses",
    subtitle: "",
    date: "Dec 4, 2023",
    body: (
      <>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          An expanding range of financing mechanisms and vehicles are emerging to help private capital providers direct money and resources to their small business communities. Among these, fund of funds are proving to be an instrumental early supply of capital for fund managers investing in small and growing businesses in Africa and the Middle East.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Fund of funds are private investment funds that invest in other private funds aligned with their impact theses. Such vehicles are established in the private equity and microfinance sectors. They&apos;re now emerging in the global small business finance sector to help mobilize the roughly $5 trillion that small and growing businesses need annually.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          A <a href="https://static1.squarespace.com/static/59d679428dd0414c16f59855/t/6579adf52eddbc2c9e5b1f95/1702473238883/2311106+CFF+African+Fund+of+Funds+Report.pdf" target="_blank" rel="noopener noreferrer">new survey</a> from the Collaborative for Frontier Finance finds that fund of funds employ a range of strategies to evaluate local fund managers&apos; risk, which is in turn helping fund managers transition from raising from angel and high-net worth investors, family offices and foundations to institutional investors. They&apos;re also providing other critical support, such as track-record building, proving fund economics, and contributing capital to warehouse deals.
        </p>

        <h2 className="text-xl font-display font-semibold text-navy-900 mt-10 mb-4">Evaluating manager risk</h2>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Half of local fund managers in Africa and the Middle East include fund of funds among their first institutional backers, according to CFF&apos;s <a href="https://static1.squarespace.com/static/59d679428dd0414c16f59855/t/6540bc7cf4c8160e5bc97bf0/1698741389546/CFF+Annual+Local+Capital+Provider+Survey+2023.pdf" target="_blank" rel="noopener noreferrer">most recent annual network survey</a>. The 60 respondents, all managing small business-focused funds, collectively expect fund of funds to contribute $310 million of a targeted $1.5 billion in total fundraising targets. About $50 million has been raised from fund of funds so far.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          The network&apos;s fund of funds backers include the Dutch Good Growth Fund, Mastercard Foundation&apos;s Africa Growth Fund, FSDAi&apos;s Nyala Ventures, Ghana Venture Capital Trust Fund, Egypt&apos;s MSMEDA Fund of Funds and I&P, all of which invest in early-stage managers who may need concessionary capital and time to hone their investment theses and capabilities. More commercially-focused fund of funds include Avanz Capital, Kuramo Capital and 27four Investment Managers.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Fund of funds often consider the biggest determinant of portfolio funds&apos; performance—and risk—to be the investment teams they invest in. Team cohesion is a key investment consideration says Justin James of Thuso Incubation Partners who invests in emerging, black mid-cap PE fund managers in South Africa.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          &ldquo;Generally, fund managers fail not because they&apos;ve done bad deals but because the dynamics within the team causes a partner to split,&rdquo; says James.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          What do fund of funds&apos; investment teams look for? The soft interactions in and outside of meetings, historical team links, and team members; external motivating factors. &ldquo;Do you have one deep-pocketed sponsor, and are they the one pushing the whole thing across? Do the others feel that this commitment to raising a fund is a stretch on them on their personal finances,&rdquo; says James.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Fund of funds set investment baselines for fund economics and whether teams are sustained long-term. They scrutinize whether team sizes and salaries match the investment thesis, as well as the strength of salary incentives and bonus structures.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          &ldquo;The most important part for us is the analysis of the team itself,&rdquo; says Hany Asaad of Avanz Capital, investing across emerging markets with a focus on Africa. &ldquo;The biggest risk we face is that the team is not able to raise enough money and is not able to sustain itself. And in those circumstances, there is a very high attrition rate.&rdquo;
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          Most fund of funds exclude solo general partners from their pipeline to avoid key-man risk, and because they like to see a team of general partners with complementary skillsets.
        </p>

        <h2 className="text-xl font-display font-semibold text-navy-900 mt-10 mb-4">Considering fund economics</h2>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Institutional investors, particularly DFIs, typically require fund managers to raise funds of $30 million or more to be considered for investment. One reason is the impression that funds must be at least $30 million to be financially sustainable.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Sixty percent of the funds in CFF&apos;s network are raising sub-$30 million, with fund size constrained by their small ticket sizes and managers&apos; (lack of) traditional track records.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          There is emerging evidence from fund of funds that have been willing to invest in smaller funds that some are reaching viability at much smaller sizes. Thelma Kodowu at Mastercard Foundation&apos;s Africa Growth Fund attests that at $20 million, a fee model of less than 3% can adequately cover market-based salaries and robust due diligence processes.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          &ldquo;Those initiating their journeys in fund management with a fund size below $30 million, coupled with limited or no track record, are adept at devising innovative strategies to manage cash flow effectively,&rdquo; she observes.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          They may adjust their fee structures, taking higher percentage fees during deployment and reducing fees during divestment, for example. They may use permanent vehicles or holding company structures. Or they may use self-liquidating instruments.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          &ldquo;Additionally, they leverage their relationships within their investor network and broader ecosystem to secure pro bono or low-fee support services for both operations and business development,&rdquo; says Kodowu.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Begaim Sadyrova of Dutch Good Growth Fund&apos;s Seed Capital and Business Development Facility says it is part of catalytic fund of funds&apos; mandate to support emerging fund managers on their fund development journeys.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          &ldquo;We work with first time fund managers to grow their fund size to a scale that sufficiently proves the model and hopefully brings them close to breakeven, usually at around €10,&rdquo; Sadyrova says. &ldquo;And we provide some additional support, like a technical assistance facility, in combination with seed capital, that would bring them to a higher chance of success in raising the second fund&rdquo;.
        </p>

        <h2 className="text-xl font-display font-semibold text-navy-900 mt-10 mb-4">Rethinking track record</h2>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Fund of funds are often willing to look past managers&apos; lack of traditional investment track records and instead focus on complementary skillsets.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          &ldquo;We look at your track record, what you&apos;ve previously done in your investment space or in your career, in terms of the investment process, whether you&apos;ve done direct investments [within an] investment firm, or venture building, where you understand the businesses you want to deploy capital to,&rdquo; Kodowu says.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Teams need to demonstrate consistency between track records they do have, team members, investment strategy and pipeline, as well as a clear understanding of small businesses&apos; financing needs.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Fund of funds also look for a demonstrable ability to raise capital. Fund managers are encouraged to grow active limited partner networks.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          &ldquo;It&apos;s important that there is an active network that the funds continuously reach out to,&rdquo; says Sadyrova. &ldquo;There needs to be a certain level of energy within the founding team. Those that have been quite consistent in reaching out and not only the immediate circle, but a larger circle through second and third parties—we&apos;ve seen them doing all right on the fundraising side.&rdquo;
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Thuso Incubation Partners places a premium on individuals&apos; fundraising experience. Those with an asset management background, for instance, often come with established institutional investor or asset consultant relationships. Teams coming out of banking may instead be excellent deal makers.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          &ldquo;For people to allocate, there needs to be a level of trust, and trust is built up over a long period of time,&rdquo; observes James. &ldquo;The guys who have built that up in other organizations seem to be able to attract money more easily than somebody just walking in the door.&rdquo;
        </p>

        <h2 className="text-xl font-display font-semibold text-navy-900 mt-10 mb-4">Strategy-pipeline alignment</h2>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          It can take new emerging market fund managers three years or more to reach a first close. Many deals can be lost in that time. Fund of funds therefore often look for alignment between fund managers&apos; investment strategies and pipelines more than robustness of individual deals.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Some go to the extent of due-diligencing pipeline companies to test veracity and alignment.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Having a shovel-ready pipeline can also mitigate the risk of delay when it comes to first investments. Delays in execution causes a significant drag on returns—so much so that 27four Investment Managers builds financial penalties into their contracts if managers do not invest within an agreed period after a first close. That&apos;s because they and other commercial fund of funds need to demonstrate to their limited partners that their assets are producing returns in order to raise further capital.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          One way funds of funds are supporting managers&apos; pipeline opportunities is by supplying deal warehousing capital. As a fund of funds usually takes 100% risk on warehoused assets, they have a direct line of sight into the investment process, enabling them to scrutinize management teams in advance of follow-on investments.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Warehoused assets are also being used judiciously to de-risk funds, thereby helping crowd in institutional LPs.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          &ldquo;The warehouse capital is provided for two reasons other than the track record,&rdquo; observes Marde van Wyk from 27four Investment Managers. &ldquo;It provides for better economics in terms of institutional investors coming in. And it potentially has the added benefit of mitigating against the dreaded J-curve when those warehoused assets are transferred into the fund.&rdquo;
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          The unconventional due diligence methodologies fund of funds are using to evaluate emerging fund managers&apos; can inform the broader institutional investor market and support the pipeline of fund managers servicing small businesses in emerging markets.
        </p>

        <div className="border-t border-slate-200 pt-6 mt-10">
          <p className="text-sm font-sans text-slate-500">
            <strong>Disclaimer:</strong> This article was featured by our partner Impact Alpha website{" "}
            <a href="https://impactalpha.com/103172-2/" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 underline">Impact Alpha</a>
          </p>
        </div>
      </>
    ),
  },
  "tapping-creativity-local-fund-managers": {
    title: "Tapping the creativity of local fund managers to scale small business finance",
    subtitle: "",
    date: "Oct 17, 2023",
    body: (
      <>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Small businesses are the growth engine for inclusive and resilient development in Africa. Yet the $330 billion annual financing gap remains stubbornly sticky because few financial institutions and investors are prepared to fund small businesses.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Local fund managers and other capital providers are key to finally unlocking the capital small businesses need. How? By nimbly, creatively and economically identifying the types of financing local businesses truly need, and proving both the financial and impact case for rethinking small business finance.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          The Collaborative for Frontier Finance&apos;s <a href="https://static1.squarespace.com/static/59d679428dd0414c16f59855/t/650d7ca1ead3997465b522c7/1695382704738/CFF+Annual+Local+Capital+Provider+Survey.pdf" target="_blank" rel="noopener noreferrer">most recent research</a> reveals an unprecedented level of experimentation in African small business finance. More than 60 local capital providers, collectively working to mobilize $1.5 billion for small businesses and local ventures in Africa and the Middle East are reengineering financial products and investment terms to fit businesses&apos; needs; redesigning fund structures to work for small ticket investments; and galvanizing participation from local institutional investors.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          Considering many traditional financial institutions are reaching the limit of what they can achieve in the market, there is tremendous opportunity for investors and market builders to track and support the success of alternative models.
        </p>

        <h2 className="text-xl font-display font-semibold text-navy-900 mt-10 mb-4">Right capital, more impact</h2>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Traditional approaches and structures of financing haven&apos;t adequately reached small businesses or enabled them to thrive.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Local fund managers are taking a different approach by embedding flexibility in their funding terms, using a mix of investment instruments, and providing post-investment business support, all while encouraging businesses to double down on local impact. This is not something most banks or digital lending platforms are able to do, yet these approaches are crucial to small business growth.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          CFF&apos;s survey finds that 60% of local capital providers&apos; investment volume is allocated using a variety of self-liquidating instrument including debt but also mezzanine structures, convertible notes and revenue sharing instruments. Almost 90% of managers are using some self-liquidating instrument in their mix.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          <a href="https://www.amamventures.com/" target="_blank" rel="noopener noreferrer">Amam Ventures</a> in Jordan uses self-liquidating instruments, combining debt and equity with revenue sharing and/or convertible notes, to provide patient, non-dilutive capital and flexible repayment options tailored to the needs of the women founders. The team&apos;s approach is entrepreneur-friendly, offering support beyond just capital and minimizing exit challenges.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          &ldquo;With this type of instrument our performance flows with the performance of the business,&rdquo; says Amam&apos;s Jenny Atout Ahlzen. &ldquo;The better the company does, the better we do.&rdquo;
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Moreover, the better a local company does, the more local impact it has. Small businesses are key to local economic resilience and future opportunities, particularly for youth and women.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Sixty percent of the funds in CFF&apos;s network are led by women, compared to 12% in private equity and 5% in venture capital globally. These women are bringing other women investment decision-making, thereby influencing the gender balance in financial services. And they&apos;re giving more women access to finance, boosting women&apos;s long-term economic opportunities and wealth.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          <a href="https://www.gbfund.org/" target="_blank" rel="noopener noreferrer">Grassroots Business Fund</a> knows the impact opportunity of investing in small businesses in the agriculture sector in particular. The 15-year-old impact investment firm says agri-businesses in its portfolio – once given access to finance – promote gender equity within companies and value chains, enhance climate resilience for their networks of smallholder farmers, and stimulate job growth.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          &ldquo;Agriculture finance is more than just about supplying capital to SMEs,&rdquo; says GBF&apos;s Lilian Mramba. &ldquo;It&apos;s a vehicle through which local capital providers can address intersectional impact issues.&rdquo;
        </p>

        <h2 className="text-xl font-display font-semibold text-navy-900 mt-10 mb-4">Better fund economics</h2>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          One obstacle to the flow of small business finance is traditional fund economics, which don&apos;t fit organizations dealing in small ticket sizes. Most traditional closed-ended private equity and venture capital funds are designed for multi-million-dollar investments. That doesn&apos;t work for organizations serving businesses that need $50,000 or $500,000 investments.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Sixty percent of the fund managers in CFF&apos;s network are raising sub-$30 million funds. The sustainability of these smaller funds requires using a variety of strategies to manage cashflow effectively, especially in the early part of a fund&apos;s lifecycle.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          <a href="http://www.terangacapital.com/en/" target="_blank" rel="noopener noreferrer">Teranga Capital</a>, which invests in local businesses in Senegal, offers an investment readiness programs for early-stage ventures to build pipeline for their core fund while generating additional income. This approach helped with Teranga&apos;s fund economics by augmenting back-office resourcing. It also provided career growth opportunities and talent retention within the organization.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Investing across Sub-Saharan Africa, <a href="https://www.unconventional.capital/" target="_blank" rel="noopener noreferrer">Unconventional Capital</a>, is set up as an open-ended fund and uses revenue sharing agreements to support economics. By simplifying portfolio management using a bespoke technology platform, they have created efficiencies to enable a high volume of deals.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          Having tested their operator-investor model with support of public monies, <a href="https://www.sechacapital.com/" target="_blank" rel="noopener noreferrer">Secha Capital</a> are able to transition to a more traditionally sustainable model whilst maintaining a focus on job creation.
        </p>

        <h2 className="text-xl font-display font-semibold text-navy-900 mt-10 mb-4">Engaging local investors</h2>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          International development financing institutions played a pivotal role in developing private equity and venture capital in emerging markets by backing new fund managers. They have been largely absent in catalyzing private small business finance funds, however.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Fund managers in CFF&apos;s network expect to raise about $320 million of their targeted $1.5 billion from development finance institutions. Just 4% of it has been secured. By contrast, fund managers expect to raise $250 million from family offices, angel and high net-worth investors, and have reached 36% of that goal.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          In total, CFF&apos;s network has secured $260 million, or 17%, of their $1.5 billion target.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          To plug their own capital gaps, local capital providers are increasingly turning to local institutional investors. Mirepa Investment Advisors notched half of its $10 million fund goal from local investors, including pension fund managers.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          <a href="https://www.vakayi.com/" target="_blank" rel="noopener noreferrer">Vakayi Capital</a> in Zimbabwe has also successfully engaged local investors. The value goes beyond money, says Vakayi&apos;s Chai Musoni: local investors have a similar view on perceived and actual risk.
        </p>

        <h2 className="text-xl font-display font-semibold text-navy-900 mt-10 mb-4">Data transparency drives allocation</h2>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          Data collection and sharing of the kind that CFF is doing with its member surveys is critical to unlocking small business finance because it teaches capital holders about the real risks, lessons and opportunities in the sector.
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          &ldquo;Growing participation in the CFF annual survey provides ongoing insights to investors and serves to showcase how fund managers are innovatively raising, deploying and managing capital,&rdquo; says Amos Gachiuri of FSDAi, a CFF partner. &ldquo;More data will serve to reduce risk for investors and provide peer learning among fund managers.&rdquo;
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-6">
          There is, of course, a key dataset available to development finance institutions—the GEMS database—that likely details such risks and opportunities already. But this data has yet to be made available to the public. Making GEMS public would enable better understanding of where DFI capital is deployed, why certain deployment choices are made, and what constraints exist for deploying capital differently, says Nicholas Colloff of Argidius Foundation. &ldquo;The goal is to encourage DFIs to collaborate and share data more openly to improve transparency and decision-making in the impact investment space.&rdquo;
        </p>
        <p className="font-sans text-slate-600 leading-relaxed mb-8">
          The opportunity at the heart of small business finance sits with a set of capital players who are local, have deep knowledge of their communities and the markets&apos; business needs – and a willingness and capability to assess and design appropriate financing approaches. It is time for investors and market builders to help them replicate and scale by supporting models and approaches that work.
        </p>
        <div className="border-t border-slate-200 pt-6 mt-10">
          <p className="text-sm font-sans text-slate-500">
            <strong>Disclaimer:</strong> This article was featured by our partner Impact Alpha website{" "}
            <a href="https://impactalpha.com/103172-2/" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 underline">Impact Alpha</a>
          </p>
        </div>
      </>
    ),
  },
};

const NAVBAR_OFFSET = 72;

export default function MarketInsightArticle() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const article = slug ? ARTICLE_CONTENT[slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!article) return;
    const header = headerRef.current;
    if (!header) return;
    const observer = new IntersectionObserver(
      ([e]) => setStickyVisible(!e.isIntersecting),
      { threshold: 0, rootMargin: `-${NAVBAR_OFFSET}px 0px 0px 0px` }
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-navy-950 font-sans flex items-center justify-center">
        <div className="container mx-auto px-3 sm:px-6 py-16 sm:py-24 text-center text-white max-w-md min-w-0">
          <p className="mb-6 text-slate-300">Article not found.</p>
          <Button
            onClick={() => navigate("/learning-hub")}
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 focus-visible:ring-gold-400"
          >
            Back to Learning Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30 overflow-x-hidden">
      {/* Sticky bar when scrolled past header */}
      {article && stickyVisible && (
        <div
          className="sticky z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm"
          style={{ top: NAVBAR_OFFSET }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/learning-hub#market-insights"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-gold-600 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 rounded"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden /> Market Insights
              </Link>
              <span className="text-slate-300" aria-hidden>/</span>
              <p className="text-sm font-medium text-navy-900 truncate" title={article.title}>
                {article.title}
              </p>
            </div>
          </div>
        </div>
      )}
      <section className="bg-white rounded-t-[2.5rem] sm:rounded-t-[3rem] -mt-0 min-h-screen pt-8 sm:pt-12 pb-24 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 font-sans">
              <li>
                <Link
                  to="/learning-hub"
                  className="text-gold-600 hover:text-gold-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 rounded"
                >
                  Learning Hub
                </Link>
              </li>
              <li aria-hidden className="text-slate-300">/</li>
              <li>
                <Link
                  to="/learning-hub#market-insights"
                  className="text-gold-600 hover:text-gold-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 rounded"
                >
                  Market Insights
                </Link>
              </li>
              <li aria-hidden className="text-slate-300">/</li>
              <li className="text-slate-700 font-medium truncate max-w-[12rem] sm:max-w-xs" title={article.title}>
                Article
              </li>
            </ol>
          </nav>

          {/* Article header */}
          <header ref={headerRef} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 font-sans mb-3">
              Market Insights
            </p>
            <span className="text-sm text-slate-500 font-sans">{article.date}</span>
            <h1 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-display font-normal text-navy-900 mt-2 mb-3 leading-[1.2] tracking-tight">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-xl sm:text-2xl text-gold-600 font-sans font-medium leading-snug text-balance">
                {article.subtitle}
              </p>
            )}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <Link
                to="/learning-hub#market-insights"
                className="inline-flex items-center gap-2 min-h-[44px] py-2 px-3 -ml-3 rounded-lg text-sm font-medium text-slate-600 hover:text-gold-600 font-sans hover:bg-gold-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden /> All Market Insights
              </Link>
            </div>
          </header>

          <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:leading-[1.75] prose-p:text-slate-600 prose-a:text-gold-600 prose-a:no-underline hover:prose-a:underline prose-a:transition-colors break-words">
            {article.body}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
