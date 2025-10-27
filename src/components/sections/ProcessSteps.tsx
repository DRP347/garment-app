'use client';
import { motion } from 'framer-motion';

const fadeInAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, staggerChildren: 0.2 },
  viewport: { once: true }
};

const stepItemAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true }
};


const processSteps = [
  {
    step: '01',
    title: 'Consultation & Design',
    description: 'We start by understanding your vision, brand identity, and specific requirements for the garments.',
  },
  {
    step: '02',
    title: 'Prototyping & Sampling',
    description: 'Our team creates initial samples for your approval, allowing for adjustments to perfect the fit and feel.',
  },
  {
    step: '03',
    title: 'Bulk Production',
    description: 'Once samples are approved, we move to full-scale production using our state-of-the-art manufacturing lines.',
  },
  {
    step: '04',
    title: 'Quality Assurance & Delivery',
    description: 'Every garment undergoes rigorous quality checks before being packaged and delivered to you on schedule.',
  },
];

export const ProcessSteps = () => {
  return (
    <motion.section 
      variants={fadeInAnimation}
      initial="initial"
      whileInView="whileInView"
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-brand-navy">Our Proven Process</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            From concept to delivery, our streamlined process ensures quality and efficiency every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((item) => (
            <motion.div 
              key={item.step}
              variants={stepItemAnimation}
              className="text-center p-6 border border-gray-200 rounded-lg"
            >
              <div className="text-5xl font-bold font-heading text-brand-gold">{item.step}</div>
              <h3 className="mt-4 font-heading text-xl font-semibold text-brand-navy">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};