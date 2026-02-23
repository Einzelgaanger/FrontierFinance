import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/home/NewsletterSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, CheckCircle2, Sparkles, Image as ImageIcon, ArrowUpRight, ExternalLink } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const OurEvents = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

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
    { title: "A collective journey", text: "We're a small group in a shared experience from start to finish. Not a small fish in an ocean of attendees popping in and out of simultaneous sessions and tracks." },
    { title: "It's participatory", text: "Rather than being in the stands, talked to from a sage on stage, your engagement is essential. Sessions are curated for active sharing and discussions that draw in multiple perspectives." },
    { title: "Flexible spaces", text: "No amphitheatres or classrooms here. We bring people together in a variety of ways through the day, often in circles, rarely around tables. We shapeshift to shape new ideas." },
    { title: "Intentional design", text: "Sessions are crafted to weave experiences and learning over the course of multiple days. What happens at the beginning sets the stage for the fruits that emerge at the end and beyond." },
    { title: "Relationships + Content", text: "Convenings are about connecting people in ways that make more possible. Activities invite play to spark creativity and learning." },
    { title: "Holistic + Diverse", text: "Convenings mix it up to avoid echo chambers and groupthink. We assemble as many perspectives in a system as possible so that we can put our pieces together and become greater than the sum of our parts." },
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

  type ConveningItem = {
    year: string;
    location: string;
    subtitle: string;
    briefHref: string;
    briefLabel: string;
    videoHref?: string;
    videoLabel?: string;
    impactVideoHref?: string;
    impactVideoLabel?: string;
  };
  const previousConvenings: ConveningItem[] = [
    { year: "2025", location: "Naivasha, Kenya", subtitle: "Annual Convening held in Naivasha, Kenya", briefHref: "#", briefLabel: "2025 Annual Convening Brief" },
    { year: "2023", location: "Cape Town, South Africa", subtitle: "Annual Convening held in Cape Town, South Africa", briefHref: "#", briefLabel: "2023 Annual Convening Brief", videoHref: "#", videoLabel: "2023 Annual Convening Video", impactVideoHref: "#", impactVideoLabel: "Impact of the ESCP Network Video" },
    { year: "2022", location: "Dar es Salaam, Tanzania", subtitle: "Annual Convening held in Dar es Salaam, Tanzania", briefHref: "#", briefLabel: "2022 Annual Convening Brief" },
  ];

  const galleryImages = ["/dYua4R2w.jpg", "/CFF2025(Day2)-87+(1).webp"];

  return (
    <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30 overflow-x-hidden" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[65vh] lg:h-[75vh] min-h-[480px] sm:min-h-[560px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: 'url(/CFF2025(Day2)-87+(1).webp)' }}
          />
          <div className="absolute inset-0 bg-navy-950/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/40 to-transparent"></div>
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 bg-white/10 border border-white/20 rounded-full text-gold-400 text-xs sm:text-sm font-semibold mb-4 sm:mb-8 uppercase tracking-widest backdrop-blur-md shadow-2xl">
              <Calendar className="w-4 h-4 shrink-0" /> 5th Annual Convening
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-4 sm:mb-8 drop-shadow-xl">
              Our Events
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8 text-white/90 text-sm sm:text-lg mb-6 sm:mb-8 font-light tracking-wide">
              <span className="flex items-center gap-2 bg-navy-900/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm"><Calendar className="w-5 h-5 text-gold-500" /> Feb 28 – March 4, 2025</span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></span>
              <span className="flex items-center gap-2 bg-navy-900/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm"><MapPin className="w-5 h-5 text-gold-500" /> Sawela Lodge, Kenya</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold-400/50"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gold-400 to-transparent" />
        </motion.div>
      </section>

      {/* Video Section */}
      <section className="relative z-20 -mt-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-navy-950">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/vQmrvp8R2fc?rel=0&modestbranding=1"
                title="CFF Annual Convening"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* About the Event – protrudes into hero with rounded top */}
      <section className="py-16 sm:py-24 bg-white relative z-20 rounded-t-[2.5rem] sm:rounded-t-[3rem] overflow-hidden -mt-8 sm:-mt-12 shadow-[0_-20px_50px_rgba(0,0,0,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
            <div>
              <span className="section-label text-gold-600">Overview</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-normal text-navy-900 mt-2 mb-4 sm:mb-8">About the Event</h2>
              <p className="text-slate-700 font-sans text-base sm:text-lg leading-relaxed mb-4 sm:mb-8">
                The Collaborative for Frontier Finance (CFF) hosted its <strong className="text-navy-900">5th Annual Convening</strong> from February 28 to March 4, 2025; an in-person multi-day event at <strong className="text-navy-900">Sawela Lodge, Lake Naivasha, Kenya</strong>. The CFF Annual Convening is the only event explicitly focused on ESCPs who address the &quot;missing middle&quot; financing gap in emerging markets.
              </p>
              <p className="text-slate-700 font-sans font-medium mb-4">The event aimed to:</p>

              <div className="space-y-4 mb-10">
                {eventAims.map((aim, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-300">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center mt-0.5 border border-gold-200">
                      <CheckCircle2 className="w-5 h-5 text-gold-600" />
                    </div>
                    <p className="text-slate-700 text-base leading-relaxed font-sans">{aim}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Button asChild className="w-full sm:w-auto min-h-[48px] bg-navy-900 text-white hover:bg-navy-800 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-finance-lg">
                  <a href="#" target="_blank" rel="noopener noreferrer">Explore the learning brief</a>
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto min-h-[48px] border-navy-200 text-navy-800 hover:bg-navy-50 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg">
                  <a href="#">Click here to view Agenda</a>
                </Button>
              </div>
            </div>

            {/* Bento Grid Gallery */}
            <div className="relative">
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl" aria-hidden>
                <div className="absolute -top-4 -right-4 w-32 h-32 rounded-2xl border-2 border-gold-300/30 rotate-6" />
                <div className="absolute bottom-8 -left-4 w-24 h-24 rounded-full bg-gold-500/10 blur-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4 h-full relative z-10">
                <motion.div whileHover={{ scale: 1.02 }} className="col-span-2 h-64 rounded-3xl overflow-hidden shadow-lg relative group ring-2 ring-white/50">
                  <div className="absolute -z-10 -inset-2 rounded-3xl bg-gold-500/10 border border-gold-200/40" aria-hidden />
                  <img src="/home.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Event 1" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-medium flex items-center gap-2"><ImageIcon className="w-4 h-4 text-gold-500" /> Networking Session</span>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} className="h-48 rounded-3xl overflow-hidden shadow-lg relative group">
                  <div className="absolute -z-10 top-2 right-2 w-full h-full rounded-3xl border-2 border-navy-200/60 -rotate-3" aria-hidden />
                  <img src="/eeee.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Event 2" />
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} className="h-48 rounded-3xl overflow-hidden shadow-lg relative group">
                  <div className="absolute -z-10 bottom-2 left-2 w-full h-full rounded-3xl bg-gold-500/10" aria-hidden />
                  <img src="/12.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Event 3" />
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="col-span-2 h-56 rounded-3xl overflow-hidden shadow-lg relative group ring-2 ring-white/50">
                  <div className="absolute -z-10 -inset-2 rounded-3xl border-2 border-gold-200/50 rotate-1" aria-hidden />
                  <img src="/CFF2025(Day2)-87+(1).webp" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Event 4" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-medium flex items-center gap-2"><ImageIcon className="w-4 h-4 text-gold-500" /> Keynote Speech</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Difference Section - Glass Cards */}
      <section className="py-16 sm:py-24 lg:py-32 bg-navy-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 sm:mb-20">
            <span className="section-label text-gold-600">Experience</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-normal text-navy-900 mt-3 px-2">How is a Convening different from a Conference?</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-base font-sans italic">
              Answered by Circle Generation
            </p>
            <div className="w-14 h-0.5 bg-gold-500/60 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {conveningDiffers.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-finance border border-slate-100 hover:shadow-card-hover hover:border-gold-500/20 transition-all duration-300 group"
              >
                <div className="w-10 h-1 rounded-full bg-gold-200 mb-6 group-hover:bg-gold-500 transition-colors" />
                <h3 className="text-xl font-display font-normal text-navy-900 mb-4">{item.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed font-sans group-hover:text-navy-700 transition-colors">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles - Gradient Background */}
      <section className="py-32 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-black"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-navy-800/20 skew-x-12 transform translate-x-32 backdrop-blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold-600/10 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-20">
            <div className="md:w-1/3">
              <span className="section-label text-gold-400/90">Values</span>
              <h2 className="text-4xl font-display font-normal text-white mt-3 mb-8">Encouragements</h2>
              <p className="text-navy-100/80 leading-relaxed mb-10 text-lg font-sans font-light">
                Our convenings are guided by a set of encouragements that invite participants to show up fully and engage deeply.
              </p>
              <div className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold-500/30 transition-colors"></div>
                <Sparkles className="w-10 h-10 text-gold-500 mb-6" />
                <p className="text-lg text-white/90 italic font-serif leading-relaxed">
                  "We assemble as many perspectives in a system as possible so that we can put our pieces together and become greater than the sum of our parts."
                </p>
              </div>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {encouragements.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-5 p-6 bg-navy-800/30 backdrop-blur-sm rounded-2xl border border-navy-700/50 hover:bg-navy-800/80 hover:border-gold-500/30 transition-all duration-300"
                >
                  <span className="shrink-0 w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-sm font-bold text-gold-500 border border-navy-700 shadow-inner">
                    {i + 1}
                  </span>
                  <span className="text-lg text-gray-200 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Previous Convenings */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="section-label text-gold-600">History</span>
            <h2 className="text-4xl font-display font-normal text-navy-900 mt-2">Our Previous Convenings</h2>
            <div className="w-14 h-0.5 bg-gold-500/60 mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {previousConvenings.map((event, i) => (
              <div key={i} className="group flex flex-col p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-navy-900 hover:border-navy-900 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-navy-900 font-bold text-lg group-hover:bg-gold-500 group-hover:border-gold-500 group-hover:text-navy-950 transition-colors">
                    {event.year}
                  </span>
                </div>
                <h4 className="font-display font-normal text-navy-900 text-xl mb-2 group-hover:text-white transition-colors">{event.location}</h4>
                <p className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors mb-6 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {event.subtitle}
                </p>
                <div className="mt-auto space-y-2">
                  <a href={event.briefHref} className="flex items-center gap-2 text-sm font-semibold text-navy-700 group-hover:text-gold-400 transition-colors">
                    {event.briefLabel} <ExternalLink className="w-3 h-3" />
                  </a>
                  {event.videoHref && (
                    <a href={event.videoHref} className="flex items-center gap-2 text-sm font-semibold text-navy-700 group-hover:text-gold-400 transition-colors">
                      {event.videoLabel} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {event.impactVideoHref && (
                    <a href={event.impactVideoHref} className="flex items-center gap-2 text-sm font-semibold text-navy-700 group-hover:text-gold-400 transition-colors">
                      {event.impactVideoLabel} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Gallery */}
          <div className="mt-24">
            <h3 className="text-2xl font-display font-normal text-navy-900 mb-8 tracking-widest uppercase">Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {galleryImages.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl overflow-hidden shadow-finance border border-slate-100 aspect-[4/3]"
                >
                  <img
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
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
