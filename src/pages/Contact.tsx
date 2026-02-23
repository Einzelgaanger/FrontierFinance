import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/home/NewsletterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gold-500/30">
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-20 bg-navy-950">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 to-navy-950" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-normal text-white mb-4 sm:mb-6">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-3 sm:mb-4 px-1">
              The Collaborative for Frontier Finance is eager to hear from investors, partners, and funders interested in joining us in the effort to support small and growing businesses.
            </p>
            <p className="text-slate-300 font-sans">
              You can contact us or sign up for our newsletter using the forms below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form – protrudes into hero with rounded top */}
      <section className="py-12 sm:py-20 bg-slate-50 rounded-t-[2.5rem] sm:rounded-t-[3rem] overflow-hidden -mt-8 sm:-mt-12 z-10 relative">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-finance border border-slate-100 p-6 sm:p-8 md:p-10"
          >
            {submitted ? (
              <div className="text-center py-8">
                <p className="text-lg text-slate-700 font-sans">
                  Thank you. We have received your message and will be in touch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-sans font-medium">
                      First Name <span className="text-gold-600">(required)</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="rounded-lg border-slate-200 bg-slate-50/80 font-sans"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700 font-sans font-medium">
                      Last Name <span className="text-gold-600">(required)</span>
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="rounded-lg border-slate-200 bg-slate-50/80 font-sans"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-sans font-medium">
                    Email Address <span className="text-gold-600">(required)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg border-slate-200 bg-slate-50/80 font-sans"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-700 font-sans font-medium">
                    Message <span className="text-gold-600">(required)</span>
                  </Label>
                  <Textarea
                    id="message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    rows={5}
                    className="rounded-lg border-slate-200 bg-slate-50/80 font-sans resize-y min-h-[120px]"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto min-h-[48px] bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-full px-8 py-6 shadow-finance-lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Contact;
