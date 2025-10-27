'use client';
import { motion } from 'framer-motion';

const fadeInAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true }
};

export const CTASection = () => {
  return (
    <motion.section 
      {...fadeInAnimation}
      className="bg-brand-navy"
    >
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="font-heading text-4xl font-bold text-white">
          Ready to Bring Your Vision to Life?
        </h2>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Let's create something exceptional together. Partner with us to access premium manufacturing and a team dedicated to your success.
        </p>
        <div className="mt-8">
          <button className="bg-brand-gold text-brand-navy font-bold py-4 px-10 rounded-full uppercase tracking-wider hover:bg-yellow-400 transition-colors text-lg">
            Become a Partner
          </button>
        </div>
      </div>
    </motion.section>
  );
};