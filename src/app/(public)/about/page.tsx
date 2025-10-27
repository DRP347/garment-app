"use client";

import { motion } from "framer-motion";
import Image from "next/image";
//import Footer from "@/components/sections/Footer";

export default function AboutPage() {
  return (
    <main className="bg-[#F9FAFB] text-[#111827] overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[75vh] flex items-center justify-center text-center text-white">
        <Image
          src="/image/garment-factory-bg.jpg"
          alt="About Hero"
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-[#0A3D79]/50"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 px-4 max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-oswald font-bold mb-4 leading-tight">
            Our Story & Mission
          </h1>
          <p className="text-lg md:text-xl text-gray-100">
            Delivering excellence in garment manufacturing with craftsmanship,
            ethics, and innovation.
          </p>
        </motion.div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="py-24 px-6 md:px-16 bg-[#F3F6FB]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="w-16 h-[3px] bg-[#124E9C] rounded-md"></div>
            <h2 className="text-3xl md:text-4xl font-oswald font-bold text-[#0A3D79]">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The Garment Guy is a full-service apparel manufacturing partner
              helping brands bring their creative vision to life. From sourcing
              premium fabrics to precision stitching, we deliver excellence in
              every piece.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With years of experience, we blend traditional craftsmanship with
              modern production techniques to meet global standards of quality
              and sustainability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-80 md:h-[450px]"
          >
            <Image
              src="/image/about-factory.jpg"
              alt="Our Factory"
              fill
              className="object-cover rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= MISSION SECTION ================= */}
      <section className="py-24 px-6 md:px-16 bg-[#0A3D79] text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/image/team.webp"
              alt="Our Team"
              width={600}
              height={400}
              className="rounded-lg shadow-xl object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-16 h-[3px] bg-white/70 rounded-md mb-4"></div>
            <h2 className="text-3xl md:text-4xl font-oswald font-bold mb-4">
              Our Mission
            </h2>
            <p className="text-gray-200 leading-relaxed">
              To empower fashion brands through sustainable, reliable, and
              high-quality garment production. We bridge creativity and
              craftsmanship, ensuring every collection exceeds expectations.
            </p>
            <ul className="mt-6 space-y-2 text-gray-300">
              <li>✓ Ethical & sustainable manufacturing</li>
              <li>✓ Strict quality control systems</li>
              <li>✓ Tailored production for every brand</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <section className="py-24 px-6 md:px-16 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-16 h-[3px] bg-[#124E9C] mx-auto mb-6 rounded-md"></div>
          <h2 className="text-3xl md:text-4xl font-oswald font-bold text-[#0A3D79] mb-12">
            Our Core Values
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Integrity",
                desc: "We maintain transparency, trust, and fairness in all our relationships.",
              },
              {
                title: "Innovation",
                desc: "We continuously refine our designs, technology, and processes to stay ahead.",
              },
              {
                title: "Sustainability",
                desc: "We care for our planet and prioritize eco-friendly manufacturing.",
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-8 bg-white rounded-lg shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-[#124E9C] mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
    </main>
  );
}
