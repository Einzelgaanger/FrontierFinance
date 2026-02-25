import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/home/NewsletterSection";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, CheckCircle2, Sparkles, Film, ExternalLink, Users, MessageCircle, LayoutGrid, CalendarRange, Link2, Layers } from "lucide-react";
import { motion } from "framer-motion";

const OurEvents = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const eventAims = [
    "Encourage shared learning through open dialogue and market-based discussions to accelerate investment readiness.",
    "Demystify small business finance by building a mutual understanding among ESCPs, ecosystem stakeholders, and institutional investors/LPs.",
    "Introduce emerging pathways and forge new ones to align institutional investment and ESCPs.",
    "Facilitate peer-to-peer learning between ESCP network members, demystify the current LP construct and their role in catalyzing this emerging asset class, and co-create solutions to address systemic bottlenecks.",
  ];

  const conveningDiffers = [
    { title: "A collective journey", text: "We're a small group in a shared experience from start to finish. Not a small fish in an ocean of attendees popping in and out of simultaneous sessions and tracks.", icon: Users },
    { title: "It's participatory", text: "Rather than being in the stands, talked to from a sage on stage, your engagement is essential. Sessions are curated for active sharing and discussions that draw in multiple perspectives.", icon: MessageCircle },
    { title: "Flexible spaces", text: "No amphitheatres or classrooms here. We bring people together in a variety of ways through the day, often in circles, rarely around tables. We shapeshift to shape new ideas.", icon: LayoutGrid },
    { title: "Intentional design", text: "Sessions are crafted to weave experiences and learning over the course of multiple days. What happens at the beginning sets the stage for the fruits that emerge at the end and beyond.", icon: CalendarRange },
    { title: "Relationships + Content", text: "Convenings are about connecting people in ways that make more possible. Activities invite play to spark creativity and learning.", icon: Link2 },
    { title: "Holistic + Diverse", text: "Convenings mix it up to avoid echo chambers and groupthink. We assemble as many perspectives in a system as possible so that we can put our pieces together and become greater than the sum of our parts.", icon: Layers },
  ];

  const encouragements = [
    "Be courageous – share successes and failures; initiate bold action and adapt to change before things are broken",
    "Practice humility – be humble in the face of complexity; value people and social learning as a process",
    "Integrate perspectives – actively seek out other voices, examine assumptions, and consider multiple worldviews",
    "Co-create from diversity – lean into creative tension and listen for opportunities to bridge differences",
    "Steward the future – hold the bigger picture in view, tell the long-term story",
    "Cultivate the ecosystem – think relationally, act in service of collective flourishing",
    "Foster synergies – champion cross-functional teams and inter-organizational collaborations",
  ];

  const previousConvenings: { year: string; location: string; subtitle: string; briefHref: string; briefLabel: string; videoHref?: string; videoLabel?: string; impactVideoHref?: string; impactVideoLabel?: string }[] = [
    { year: "2025", location: "Naivasha, Kenya", subtitle: "2025 Annual Convening held in Naivasha, Kenya", briefHref: "#", briefLabel: "2025 Annual Convening Brief" },
    { year: "2023", location: "Capetown, South Africa", subtitle: "2023 Annual Convening held in Capetown, South Africa", briefHref: "#", briefLabel: "2023 Annual Convening Brief", videoHref: "#", videoLabel: "2023 Annual Convening Video", impactVideoHref: "#", impactVideoLabel: "Impact of the ESCP Network Video" },
    { year: "2022", location: "Dar es Salaam, Tanzania", subtitle: "2022 Annual Convening held in Dar es Salaam, Tanzania", briefHref: "#", briefLabel: "2022 Annual Convening Brief" },
  ];

  const galleryImages = ["/dYua4R2w.jpg", "/CFF2025(Day2)-87+(1).webp"];
  const exploreLinks = [
    { title: "About the Event", subtitle: "Overview and aims", href: "#about-event" },
    { title: "How It's Different", subtitle: "Convening vs conference", href: "#how-different" },
    { title: "Previous Convenings", subtitle: "Past events and resources", href: "#previous-convenings" },
  ];

  return (
    <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30">
      {/* Hero – aligned with Learning Hub / About */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url(/CFF2025(Day2)-87+(1).webp)" }}
        >
          <div className="absolute inset-0 bg-navy-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 pb-16 sm:pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 order-1 text-center lg:text-left lg:pr-12 xl:pr-16"
            >
              <p className="font-display text-gold-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-5">
                Events
              </p>
              <h1 className="text-[2rem] sm:text-[2.6rem] md:text-[3.4rem] lg:text-[4rem] xl:text-[4.5rem] font-display font-normal text-white leading-[1.12] tracking-tight">
                Our Events
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-xl mt-5 sm:mt-6 mx-auto lg:mx-0 leading-[1.7] font-sans font-light">
                CFF convenings bring together capital providers, funders, and fieldbuilders for shared learning and action on small business finance in emerging markets.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mt-6 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold-400 shrink-0" aria-hidden />
                  Feb 28 – March 4, 2025
                </span>
                <span className="hidden sm:inline text-slate-500">·</span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0" aria-hidden />
                  Sawela Lodge, Kenya
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 order-2 relative"
            >
              <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 xl:-translate-x-8 w-px h-32 bg-gold-500/60" aria-hidden />
              <p className="font-display text-gold-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-5 sm:mb-6 text-center lg:text-left">
                Explore
              </p>
              <nav className="space-y-4 sm:space-y-5">
                {exploreLinks.map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                    className="group flex items-start gap-4 text-left rounded-xl p-2 -m-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 group-hover:border-gold-400/40 group-hover:scale-105 transition-all duration-300">
                      <Calendar className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-white group-hover:text-gold-200 transition-colors">
                        {item.title}
                      </p>
                      <p className="font-sans text-sm text-slate-400 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About the Event – white section with rounded top */}
      <section id="about-event" className="scroll-mt-24 py-24 bg-white rounded-t-[2.5rem] sm:rounded-t-[3rem] overflow-hidden -mt-8 sm:-mt-12 z-10 relative shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label text-gold-600">Overview</span>
              <h2 className="text-3xl sm:text-4xl font-display font-normal text-navy-900 mt-2 mb-6">
                About the Event
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg font-sans">
                The Collaborative for Frontier Finance (CFF) hosted its <strong className="text-navy-900">5th Annual Convening</strong> from February 28 to March 4, 2025; an in-person multi-day event at <strong className="text-navy-900">Sawela Lodge, Lake Naivasha, Kenya</strong>. The CFF Annual Convening is the only event explicitly focused on ESCPs who address the &quot;missing middle&quot; financing gap in emerging markets.
              </p>
              <p className="text-slate-700 font-sans font-medium mb-4">The event aimed to:</p>
              <ul className="space-y-4 mb-8">
                {eventAims.map((aim, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-gold-500/10 border border-gold-200 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-gold-600" aria-hidden />
                    </span>
                    <p className="text-slate-600 text-base leading-relaxed font-sans">{aim}</p>
                  </li>
                ))}
              </ul>
              <p className="text-slate-600 leading-relaxed font-sans mb-4">
                Explore the learning brief highlighting key takeaways from the event.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-navy-900 text-white hover:bg-navy-800 rounded-full px-6 py-5 text-base shadow-finance-lg focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2">
                  <a href="#" target="_blank" rel="noopener noreferrer">Explore the learning brief</a>
                </Button>
                <Button variant="outline" asChild className="border-navy-200 text-navy-800 hover:bg-navy-50 rounded-full px-6 py-5 text-base focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2">
                  <a href="#">Click here to view Agenda</a>
                </Button>
              </div>
            </motion.div>

            {/* Video + Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="rounded-2xl overflow-hidden shadow-finance border border-slate-100 bg-slate-50">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/vQmrvp8R2fc?rel=0&modestbranding=1"
                    title="CFF Annual Convening"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500 font-sans border-t border-slate-100">
                  <Film className="w-4 h-4 text-gold-500" aria-hidden /> CFF Annual Convening
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 aspect-[4/3]">
                  <img src="/home.png" alt="Event networking" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 aspect-[4/3]">
                  <img src="/eeee.png" alt="Event session" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How is a Convening different – editorial layout with icons */}
      <section id="how-different" className="scroll-mt-24 py-24 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,175,55,0.06),transparent_50%)] pointer-events-none" aria-hidden />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="section-label text-gold-600">Experience</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-normal text-navy-900 mt-2 leading-tight">
              How is a Convening different from a Conference?
            </h2>
            <p className="text-slate-500 font-sans italic mt-4 text-base">
              Answered by Circle Generation
            </p>
            <div className="w-14 h-0.5 bg-gold-500/60 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 lg:gap-14">
            {conveningDiffers.map((item, i) => {
              const Icon = item.icon;
              const isLeft = i % 2 === 0;
              return (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                  className={`flex gap-6 sm:gap-8 group ${!isLeft ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-200/60 flex items-center justify-center text-gold-600 group-hover:bg-gold-500/20 group-hover:border-gold-300 transition-colors">
                    <Icon className="w-7 h-7" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-display font-normal text-navy-900 mb-3 group-hover:text-gold-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-sans text-base">
                      {item.text}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Encouragements – values section with timeline feel */}
      <section className="py-24 sm:py-28 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/5 rounded-full blur-3xl" aria-hidden />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="section-label text-gold-400/90">Values</span>
            <h2 className="text-3xl sm:text-4xl font-display font-normal text-white mt-2">
              Encouragements
            </h2>
            <p className="text-slate-400 font-sans mt-4 max-w-xl mx-auto leading-relaxed">
              Our convenings are guided by a set of encouragements that invite participants to show up fully and engage deeply.
            </p>
          </div>

          <div className="relative">
            {/* Quote block – prominent */}
            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mb-16 pl-6 sm:pl-8 border-l-4 border-gold-500/80"
            >
              <Sparkles className="absolute -left-1 top-0 w-6 h-6 text-gold-500/60" aria-hidden />
              <p className="text-xl sm:text-2xl text-slate-200 font-serif italic leading-relaxed">
                &quot;We assemble as many perspectives in a system as possible so that we can put our pieces together and become greater than the sum of our parts.&quot;
              </p>
            </motion.blockquote>

            {/* Numbered list – single column, large numbers */}
            <ul className="space-y-6 sm:space-y-8">
              {encouragements.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.04 }}
                  className="flex gap-6 sm:gap-8 items-start"
                >
                  <span className="shrink-0 w-12 h-12 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-lg font-display font-semibold text-gold-400">
                    {i + 1}
                  </span>
                  <p className="text-slate-200 font-sans text-base sm:text-lg leading-relaxed pt-1">
                    {item}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Previous Convenings – event cards */}
      <section id="previous-convenings" className="scroll-mt-24 py-24 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="section-label text-gold-600">History</span>
            <h2 className="text-3xl sm:text-4xl font-display font-normal text-navy-900 mt-2">
              Our Previous Convenings
            </h2>
            <p className="text-slate-600 font-sans mt-3 max-w-2xl">
              Past convenings and resources from across the CFF network.
            </p>
            <div className="w-14 h-0.5 bg-gold-500/60 mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {previousConvenings.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md hover:border-gold-200/50 transition-all duration-300 p-8 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy-900 text-gold-400 text-lg font-display font-semibold">
                    {event.year}
                  </span>
                  <h3 className="font-display font-normal text-navy-900 text-xl">
                    {event.location}
                  </h3>
                </div>
                <p className="text-sm text-slate-500 font-sans mb-6 flex-1">
                  {event.subtitle}
                </p>
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <a href={event.briefHref} className="flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-gold-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 rounded w-fit">
                    {event.briefLabel} <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                  </a>
                  {event.videoHref && (
                    <a href={event.videoHref} className="flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-gold-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 rounded w-fit">
                      {event.videoLabel} <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                    </a>
                  )}
                  {event.impactVideoHref && (
                    <a href={event.impactVideoHref} className="flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-gold-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 rounded w-fit">
                      {event.impactVideoLabel} <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gallery */}
          <div className="mt-24 pt-16 border-t border-slate-200/80">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <span className="section-label text-gold-600 block mb-1">Gallery</span>
                <p className="text-slate-600 font-sans text-sm mt-1">
                  Moments from CFF convenings
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {galleryImages.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm aspect-[4/3] group"
                >
                  <img
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/home.png"; }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default OurEvents;
