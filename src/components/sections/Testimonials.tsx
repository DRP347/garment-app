'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeInAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, staggerChildren: 0.2 },
  viewport: { once: true }
};

const itemAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true }
};

const testimonials = [
  {
    quote: "The quality and attention to detail from The Garment Guy is unmatched. They delivered our order ahead of schedule and exceeded all expectations.",
    name: 'Sarah Johnson',
    title: 'Founder, Urban Threads',
    avatar: '/images/avatars/avatar1.webp', // Add placeholder avatar images
  },
  {
    quote: "Partnering with them was the best decision for our brand. Their team is professional, responsive, and truly understands the craft of garment making.",
    name: 'David Chen',
    title: 'CEO, Denim Co.',
    avatar: '/images/avatars/avatar2.webp',
  },
  {
    quote: "From prototyping to final production, the process was seamless. We couldn't be happier with the final product and the collaborative experience.",
    name: 'Maria Garcia',
    title: 'Lead Designer, Modern Wear',
    avatar: '/images/avatars/avatar3.webp',
  },
];

export const Testimonials = () => {
  return (
    <motion.section
      variants={fadeInAnimation}
      initial="initial"
      whileInView="whileInView"
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-brand-navy">What Our Partners Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We're proud to have built lasting relationships with our clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <motion.div
              key={item.name}
              variants={itemAnimation}
              className="bg-gray-50 p-8 rounded-lg border border-gray-200"
            >
              <p className="text-gray-700 italic">"{item.quote}"</p>
              <div className="flex items-center mt-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={item.avatar}
                    alt={`Avatar of ${item.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-brand-navy">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};