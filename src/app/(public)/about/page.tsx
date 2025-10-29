"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-[#F9FAFB] text-[#0A3D79]">
      {/* HERO */}
      <section className="relative h-[75vh] flex items-center justify-center text-center text-white">
        <Image
          src="/image/garment-factory-bg.jpg"
          alt="About The Garment Guy"
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-[#0A3D79]/60" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 px-4 max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Our Story & Mission
          </h1>
          <p className="text-lg md:text-xl text-gray-100">
            Connecting creativity, craftsmanship & ethical manufacturing for modern brands.
          </p>
        </motion.div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="w-16 h-[3px] bg-[#124E9C] rounded-md" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D79]">
              Who We Are
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Garment Guy helps brands bring their designs to life — from
              sustainable fabric sourcing to expert craftsmanship.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We merge traditional tailoring excellence with modern production
              technology to meet global standards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-80 md:h-[450px]"
          >
            <Image
              src="/image/about-team.webp"
              alt="Our Team at Work"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 px-6 md:px-16 bg-[#0A3D79] text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1"
          >
            <div className="w-16 h-[3px] bg-white/70 rounded-md mb-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-white/90 leading-relaxed">
              We empower brands with sustainable, transparent, and scalable garment
              manufacturing — where creativity meets consistency.
            </p>
            <ul className="mt-6 space-y-2 text-white/80">
              <li>✓ Ethical & sustainable production</li>
              <li>✓ Consistent quality control</li>
              <li>✓ Tailored solutions for every brand</li>
            </ul>
            <p className="mt-6">
              Chat with us on {" "}
              <a
                href="https://wa.me/917861988279"
                target="_blank"
                className="text-white underline font-semibold"
              >
                WhatsApp +91 78619 88279
              </a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-1 md:order-2"
          >
            <Image
              src="/image/team.webp"
              alt="Our Dedicated Team"
              width={600}
              height={400}
              className="rounded-lg shadow-xl object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 px-6 md:px-16 bg-[#F9FAFB] text-center">
        <div className="max-w-6xl mx-auto">
          <div className="w-16 h-[3px] bg-[#124E9C] mx-auto mb-6 rounded-md" />
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              ["Integrity", "We maintain transparency, trust, and fairness."],
              ["Innovation", "We refine designs and processes to stay ahead."],
              ["Sustainability", "We prioritize eco-friendly and ethical practices."],
            ].map(([title, desc], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-8 bg-white rounded-xl shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#124E9C]">
                  {title}
                </h3>
                <p className="text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A3D79] text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Let’s Build Together</h2>
        <p className="max-w-2xl mx-auto text-white/90 mb-10">
          Join hundreds of brands trusting The Garment Guy for ethical, scalable, and
          high-quality production.
        </p>
        <a
          href="https://wa.me/917861988279"
          target="_blank"
          className="bg-white text-[#0A3D79] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
        >
          Chat on WhatsApp
        </a>
      </section>
    </main>
  );
}
