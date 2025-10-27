'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeInAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true }
};

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-gold">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Unmatched Quality',
    description: 'We use only premium materials and enforce strict quality control to ensure every garment meets the highest standards.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-gold">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'On-Time Delivery',
    description: 'Our efficient production pipeline and logistics management guarantee that your orders are delivered on schedule.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-gold">
         <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    title: 'Scalable Production',
    description: 'Whether you\'re a startup or an established brand, our facilities can scale to meet your production needs.',
  },
];


export const WhyPartner = () => {
  return (
    <motion.section 
      {...fadeInAnimation}
      className="py-20 bg-gray-50"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden">
             <Image
                src="/image/team.webp"
                alt="The Garment Guy team collaborating"
                fill
                className="object-cover"
              />
          </div>
          <div>
            <h2 className="font-heading text-4xl font-bold text-brand-navy">Why Partner With The Garment Guy?</h2>
            <p className="mt-4 text-lg text-gray-600">
              We're more than just a manufacturer; we're a dedicated partner invested in your brand's success.
            </p>
            <div className="mt-8 space-y-6">
              {benefits.map((item) => (
                <div key={item.title} className="flex items-start">
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-brand-navy">{item.title}</h3>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};