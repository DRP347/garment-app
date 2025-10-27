'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeIn = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

export const Specialization = () => {
  return (
    <motion.section {...fadeIn} className="py-20 bg-gray-50 text-center">
      <div className="container mx-auto px-6">
        <h2 className="font-heading text-4xl font-bold mb-6 text-brand-navy">Our Specialization</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          We focus on premium denim and cargo production — combining craftsmanship, durability, and design precision.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {[
            { title: "Denim Perfection", img: "/image/denim.webp" },
            { title: "Cargo Mastery", img: "/image/cargos.webp" },
            { title: "Tailored Precision", img: "/image/team.webp" },
          ].map(({ title, img }) => (
            <motion.div
              key={title}
              whileHover={{ y: -5, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <Image src={img} alt={title} width={400} height={300} className="w-full object-cover" />
              <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
