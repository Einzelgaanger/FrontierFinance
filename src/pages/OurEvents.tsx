import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Twitter, Linkedin, Database, ExternalLink, Shield, Info, Network, BookOpen, Calendar, Handshake, Rocket, Users, CheckCircle2 } from "lucide-react";

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
    { title: "A collective journey.", text: "We're a small group in a shared experience from start to finish. Not a small fish in an ocean of attendees popping in and out of simultaneous sessions and tracks." },
    { title: "It's participatory.", text: "Rather than being in the stands, talked to from a sage on stage, your engagement is essential. Sessions are curated for active sharing and discussions that draw in multiple perspectives." },
    { title: "Flexible spaces.", text: "No amphitheatres or classrooms here. We bring people together in a variety of ways through the day, often in circles, rarely around tables. We shapeshift to shape new ideas." },
    { title: "Intentional design.", text: "Sessions are crafted to weave experiences and learning over the course of multiple days. What happens at the beginning sets the stage for the fruits that emerge at the end and beyond." },
    { title: "Relationships + Content.", text: "Convenings are about connecting people in ways that make more possible. Activities invite play to spark creativity and learning." },
    { title: "Holistic + Diverse.", text: "Convenings mix it up to avoid echo chambers and groupthink. We assemble as many perspectives in a system as possible so that we can put our pieces together and become greater than the sum of our parts." },
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

  const previousConvenings = [
    { year: "2025", location: "Naivasha, Kenya", links: [{ label: "2025 Annual Convening Brief", href: "#" }] },
    { year: "2023", location: "Capetown, South Africa", links: [{ label: "2023 Annual Convening Brief", href: "#" }, { label: "2023 Annual Convening Video", href: "#" }, { label: "Impact of the ESCP Network Video", href: "#" }] },
    { year: "2022", location: "Dar es Salaam, Tanzania", links: [{ label: "2022 Annual Convening Brief", href: "#" }] },
  ];

  const galleryImages = ["/CFF2025(Day2)-87+(1).webp", "/home.png", "/eeee.png", "/12.png"];

  return (
    <div className="min-h-screen bg-white scrollbar-hide overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/CFF2025(Day2)-87+(1).webp)' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <Link to="/">
            <img src="/CFF%20LOGO.png" alt="CFF Logo" className="h-12 sm:h-16 md:h-20 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </Link>
        </div>
        <nav className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-wrap items-center justify-end gap-1 sm:gap-1.5">
          <Link to="/about" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Info className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>About</span></div>
            </Button>
          </Link>
          <Link to="/escp-network" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Network className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>Network</span></div>
            </Button>
          </Link>
          <Link to="/learning-hub" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>Learning Hub</span></div>
            </Button>
          </Link>
          <Link to="/our-events" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>Our Events</span></div>
            </Button>
          </Link>
          <Link to="/escp-network" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>ESCP Network</span></div>
            </Button>
          </Link>
          <Link to="/partnership" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Handshake className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>Partnership</span></div>
            </Button>
          </Link>
          <Link to="/launch-plus-intro" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Rocket className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>Explore LAUNCH+</span></div>
            </Button>
          </Link>
        </nav>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">5th Annual Convening</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Our Events</h1>
          <p className="text-lg sm:text-xl text-white/95 max-w-3xl">
            February 28 – March 4, 2025 · Sawela Lodge, Lake Naivasha, Kenya
          </p>
        </div>
      </section>

      {/* About the Event */}
      <section className="py-16 sm:py-24 bg-amber-50 rounded-t-[2rem] -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">2025 Convening</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            About the Event
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-8"></div>
          <p className="text-gray-700 leading-relaxed mb-8 max-w-4xl">
            The Collaborative for Frontier Finance (CFF) hosted its <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">5th Annual Convening</span> from February 28 to March 4, 2025; an in-person multi-day event at Sawela Lodge, Lake Naivasha, Kenya. The CFF Annual Convening is the only event explicitly focused on ESCPs who address the &quot;missing middle&quot; financing gap in emerging markets.
          </p>
          <p className="text-gray-800 font-semibold mb-4">The event aimed to:</p>
          <ul className="space-y-4 mb-10">
            {eventAims.map((aim, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                <span className="text-gray-700 leading-relaxed">{aim}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4">
            <a href="#">
              <Button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-full font-semibold shadow-xl">
                <span className="flex items-center gap-2">Explore the learning brief <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              </Button>
            </a>
            <a href="#">
              <Button variant="outline" className="border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold">
                <span className="flex items-center gap-2">View Agenda <ExternalLink className="w-4 h-4" /></span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* How is a Convening different from a Conference? */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">Convening vs Conference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            How is a Convening different from a Conference?
          </h2>
          <p className="text-sm text-gray-500 italic mb-8">Answered by Circle Generation</p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conveningDiffers.map((item, i) => (
              <div key={i} className="bg-amber-50/80 rounded-2xl p-6 border border-amber-100 hover:shadow-lg transition-all">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Encouragements */}
      <section className="py-16 sm:py-24 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">Guiding Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8">
            Encouragements
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {encouragements.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">{i + 1}</span>
                <p className="text-sm text-gray-700 leading-relaxed pt-1">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Previous Convenings */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">Past Events</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8">
            Our Previous Convenings
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-10"></div>
          <div className="space-y-8">
            {previousConvenings.map((conv, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 bg-amber-50/80 rounded-2xl border border-amber-100">
                <div className="shrink-0">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{conv.year}</span>
                  <p className="text-gray-600 text-sm mt-1">Annual Convening · {conv.location}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {conv.links.map((l, j) => (
                    <a key={j} href={l.href} className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-blue-200 text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors">
                      {l.label} <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 sm:py-24 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">Photos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-10">
            Gallery
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-10"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((src, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] group hover:shadow-xl transition-all">
                <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black via-blue-950 to-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <Link to="/"><img src="/CFF%20LOGO.png" alt="CFF Logo" className="h-16 w-auto object-contain mb-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /></Link>
              <p className="text-gray-300 mb-6 text-base leading-relaxed max-w-md">A multi-stakeholder initiative increasing access to capital for small and growing businesses in emerging markets.</p>
              <a href="mailto:info@frontierfinance.org" className="flex items-center space-x-3 text-blue-300 hover:text-blue-200 transition-colors group">
                <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/30 transition-colors"><Mail className="w-4 h-4" /></div>
                <span className="text-sm font-medium">info@frontierfinance.org</span>
              </a>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-base flex items-center"><Database className="w-4 h-4 mr-2" />Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-blue-300 hover:text-blue-200 transition-colors">About</Link></li>
                <li><Link to="/escp-network" className="text-blue-300 hover:text-blue-200 transition-colors">Network</Link></li>
                <li><Link to="/learning-hub" className="text-blue-300 hover:text-blue-200 transition-colors">Learning Hub</Link></li>
                <li><Link to="/our-events" className="text-blue-300 hover:text-blue-200 transition-colors">Our Events</Link></li>
                <li><Link to="/escp-network" className="text-blue-300 hover:text-blue-200 transition-colors">ESCP Network</Link></li>
                <li><Link to="/partnership" className="text-blue-300 hover:text-blue-200 transition-colors">Partnership</Link></li>
                <li><Link to="/auth" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group"><ExternalLink className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />Login / Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-base flex items-center"><Shield className="w-4 h-4 mr-2" />Connect With Us</h3>
              <p className="text-gray-400 text-sm mb-4">Follow us for updates on small business finance and network news</p>
              <div className="flex space-x-3">
                <a href="https://twitter.com/CollabFFinance" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"><Twitter className="w-5 h-5 text-white" /></a>
                <a href="https://www.linkedin.com/company/collaborative-for-frontier-finance/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"><Linkedin className="w-5 h-5 text-white" /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-sm mb-2 md:mb-0">© 2025 Collaborative for Frontier Finance. All rights reserved.</p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Privacy Policy</a>
              <span className="text-blue-600">•</span>
              <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OurEvents;
