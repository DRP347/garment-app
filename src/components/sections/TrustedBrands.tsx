'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const logos = [
  { name: 'Tuple', src: '/images/logos/tuple.svg' },
  { name: 'Mirage', src: '/images/logos/mirage.svg' },
  { name: 'StaticKit', src: '/images/logos/statickit.svg' },
  { name: 'Transistor', src: '/images/logos/transistor.svg' },
  { name: 'Workcation', src: '/images/logos/workcation.svg' },
];

const fadeInAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true }
};

export const TrustedBrands = () => {
  return (
    <motion.section 
      {...fadeInAnimation}
      className="py-16 bg-white"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-center text-sm font-bold uppercase text-gray-500 tracking-widest">
          Trusted by the world's best companies
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-5 items-center">
          {logos.map((logo) => (
            <div key={logo.name} className="flex justify-center">
              <Image
                src={logo.src}
                alt={logo.name}
                width={140}
                height={50}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};