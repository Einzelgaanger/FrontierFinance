import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const NEWSLETTER_FORM_URL = 'https://fvco2.share-eu1.hsforms.com/2GephDJrwRPay5zTsxJoG2A';

export default function NewsletterSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 mb-3 font-sans">
            Newsletter
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-normal text-navy-900 mb-3 leading-tight">
            Stay updated
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-sans leading-relaxed mb-8 max-w-xl mx-auto">
            Receive occasional news and updates from the Collaborative for Frontier Finance.
          </p>
          <a
            href={NEWSLETTER_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium text-sm font-sans transition-colors"
          >
            Sign up for updates
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
