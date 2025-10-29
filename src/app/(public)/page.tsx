"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Factory, ShieldCheck, Leaf, Quote, Phone, Mail } from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-[#F9FAFB] text-[#0A3D79]">
      {/* HERO */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <Image
          src="/image/hero.webp"
          alt="Garment Manufacturing"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0A3D79]/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Crafting Excellence in Every Stitch
            </h1>
            <p className="text-white/90 text-lg mb-10">
              Premium Garment Manufacturing for Modern Brands.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/register"
                className="bg-white text-[#0A3D79] px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Start a Brand
              </Link>
              <Link
                href="/products"
                className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-[#0A3D79] transition"
              >
                Explore Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-6xl mx-auto py-20 px-6 text-center" id="why">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-12">
          We combine craftsmanship, innovation, and ethical manufacturing to help brands
          produce with confidence.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Factory size={36} />,
              title: "End-to-End Production",
              desc: "Design, sourcing, stitching, and shipping — everything under one roof.",
            },
            {
              icon: <ShieldCheck size={36} />,
              title: "Quality & Reliability",
              desc: "Multi-stage inspections ensure flawless output every time.",
            },
            {
              icon: <Leaf size={36} />,
              title: "Sustainability",
              desc: "Eco-friendly materials and ethical labor practices.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition"
            >
              <div className="mb-4 flex justify-center text-[#0A3D79]">
                {item.icon}
              </div>
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-[#0A3D79]/5 py-20" id="about">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <Image
            src="/image/about-team.webp"
            alt="About The Garment Guy"
            width={600}
            height={420}
            className="rounded-xl shadow-lg object-cover w-full h-auto"
          />
          <div>
            <h2 className="text-3xl font-bold mb-6">About The Garment Guy</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The Garment Guy is a full-service apparel manufacturer bridging global
              brands with world-class garment production in India. We transform design
              concepts into production-ready collections.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We focus on craftsmanship, reliability, and ethical operations — every
              garment produced reflects precision and passion.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We empower startups and established labels to scale seamlessly with
              transparency, trust, and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-12">
          Our Manufacturing Process
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto px-6">
          {[
            ["Design & Sampling", "Collaborate to finalize your vision."],
            ["Fabric Sourcing", "We source high-grade, sustainable fabrics."],
            ["Cutting & Stitching", "Skilled artisans ensure precision."],
            ["Quality Check", "Each piece undergoes strict inspection."],
            ["Packaging & Delivery", "We pack with care and ship globally."],
          ].map(([title, desc], i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="text-blue-800 text-2xl font-bold mb-2">
                {i + 1}
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-12">
          What Our Clients Say
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {[
            {
              name: "Alex R.",
              role: "Brand Founder – UK",
              quote:
                "Exceeded expectations — unmatched quality and clear communication.",
            },
            {
              name: "Priya S.",
              role: "Label Owner – India",
              quote:
                "A reliable partner who helped us scale while maintaining quality.",
            },
            {
              name: "Marco L.",
              role: "Creative Director – Italy",
              quote:
                "Their transparency and efficiency expanded our fashion line confidently.",
            },
          ].map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-50 p-8 rounded-lg shadow hover:shadow-md transition text-left"
            >
              <Quote size={28} className="text-[#0A3D79] mb-4" />
              <p className="text-gray-700 italic mb-4">“{t.quote}”</p>
              <h4 className="font-semibold text-blue-900">{t.name}</h4>
              <p className="text-sm text-gray-600">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A3D79] text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Build Your Brand?</h2>
        <p className="max-w-2xl mx-auto text-white/90 mb-10">
          From design to dispatch — The Garment Guy ensures excellence at every step.
        </p>
        <Link
          href="/register"
          className="bg-white text-[#0A3D79] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
        >
          Get Started Today
        </Link>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <form className="bg-[#F9FAFB] text-[#0A3D79] rounded-2xl p-8 shadow-lg space-y-5">
            <input type="text" placeholder="Your Name" className="w-full border rounded-md p-3 focus:ring-2 focus:ring-[#0A3D79]" />
            <input type="email" placeholder="Your Email" className="w-full border rounded-md p-3 focus:ring-2 focus:ring-[#0A3D79]" />
            <input type="tel" placeholder="Your Phone Number" className="w-full border rounded-md p-3 focus:ring-2 focus:ring-[#0A3D79]" />
            <textarea placeholder="Your Message" rows={4} className="w-full border rounded-md p-3 focus:ring-2 focus:ring-[#0A3D79]" />
            <button type="submit" className="w-full bg-[#0A3D79] text-white py-3 rounded-md font-semibold hover:bg-[#124E9C] transition">
              Send Message
            </button>
            <p className="text-sm text-gray-600 mt-3">
              Or reach us on {" "}
              <a
                href="https://wa.me/917861988279"
                target="_blank"
                className="text-[#0A3D79] font-semibold hover:underline"
              >
                WhatsApp +91 78619 88279
              </a>
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A3D79] text-white py-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-semibold text-lg mb-3">The Garment Guy</h3>
            <p className="text-white/80 text-sm">
              Premium Garment Manufacturing for Modern Brands.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/products" className="hover:text-white">Products</Link></li>
              <li><a href="/#about" className="hover:text-white">About</a></li>
              <li><a href="/#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-white/80 text-sm">
              Daman, India <br />
              <Phone size={14} className="inline mx-1" />{" "}
              <a href="https://wa.me/917861988279" target="_blank" className="hover:underline">
                +91 78619 88279
              </a>
              <br />
              <Mail size={14} className="inline mx-1" /> contact@thegarmentguy.com
            </p>
          </div>
        </div>
        <p className="text-center text-white/60 text-sm mt-6">
          © {new Date().getFullYear()} The Garment Guy. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
