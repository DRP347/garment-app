"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Factory, ShieldCheck, Leaf, Quote, Phone, Mail } from "lucide-react";

export default function HomePage() {
  const processSteps = [
    { title: "Design & Sampling", desc: "Collaborate with our creative team to prototype your ideas." },
    { title: "Fabric Sourcing", desc: "Premium material selection tailored to your specifications." },
    { title: "Cutting & Stitching", desc: "Precision craftsmanship from skilled professionals." },
    { title: "Quality Check", desc: "Each piece is inspected for finish, fit, and durability." },
    { title: "Packaging & Delivery", desc: "Ready-to-ship excellence delivered to your doorsteps." },
  ];

  const testimonials = [
    { name: "Ananya Sharma", role: "Founder, Urban Threads", quote: "Scaled from 50 to 500 orders per month. Great quality.", image: "/image/client1.webp" },
    { name: "Rahul Mehta", role: "Director, BlueTag", quote: "Professional and precise. Effortless for startups.", image: "/image/client2.webp" },
    { name: "Sarah Khan", role: "Designer, Label SK", quote: "Flawless execution. Ethical and modern.", image: "/image/client3.webp" },
  ];

  return (
    <main className="bg-[#F9FAFB] text-[#0A3D79]">
      {/* HERO (no gap with navbar) */}
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Crafting Excellence in Every Stitch
            </h1>
            <p className="text-white/90 text-lg mb-10">Premium Garment Manufacturing for Modern Brands.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/register" className="bg-white text-[#0A3D79] px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
                Start a Brand
              </Link>
              <Link href="/products" className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-[#0A3D79] transition">
                Explore Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BRANDS */}
      <section className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-10">Trusted by Global Brands</h2>
        <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-8 px-6">
          {["brand1.webp", "brand2.webp", "brand3.webp", "brand4.webp"].map((b, i) => (
            <div key={i} className="relative h-16">
              <Image src={`/image/${b}`} alt={`Brand ${i + 1}`} fill sizes="(max-width:768px) 50vw, 25vw" className="object-contain grayscale hover:grayscale-0 transition" />
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-6xl mx-auto py-20 px-6 text-center" id="why">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-12">
          We blend creativity, technology, and craftsmanship to deliver the best for your brand.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Factory size={36} />, title: "End-to-End Manufacturing", desc: "From design to delivery — all under one roof." },
            { icon: <ShieldCheck size={36} />, title: "Quality & Reliability", desc: "Every stitch undergoes strict quality checks." },
            { icon: <Leaf size={36} />, title: "Sustainability", desc: "Eco-friendly materials and ethical production." },
          ].map((item) => (
            <motion.div key={item.title} whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition">
              <div className="text-[#0A3D79] mb-4 flex justify-center">{item.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-[#0A3D79]/5 py-20" id="about">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <Image src="/image/about-factory.webp" alt="About Us" width={600} height={420} className="rounded-xl shadow-lg object-cover w-full h-auto" />
          <div>
            <h2 className="text-3xl font-bold mb-6">About The Garment Guy</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We’re a full-service manufacturer connecting global brands with premium garment production in India.
            </p>
            <p className="text-gray-600">
              Our mission is to empower fashion labels through reliable, ethical, and innovative solutions.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="max-w-6xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Manufacturing Process</h2>
        <div className="grid md:grid-cols-5 gap-8">
          {[
            "Design & Sampling",
            "Fabric Sourcing",
            "Cutting & Stitching",
            "Quality Check",
            "Packaging & Delivery",
          ].map((title, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-[#0A3D79] font-bold text-xl mb-3">{i + 1}</div>
              <h4 className="font-semibold">{title}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#0A3D79]/10 py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">What Our Clients Say</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {[1, 2, 3].map((i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-white p-8 rounded-xl shadow-md text-left">
              <Quote size={28} className="text-[#0A3D79] mb-4" />
              <p className="text-gray-700 italic mb-4">
                “Outstanding communication and quality. Helped us scale fast.”
              </p>
              <div className="flex items-center gap-3">
                <Image src={`/image/client${i}.webp`} alt={`Client ${i}`} width={50} height={50} className="rounded-full object-cover w-[50px] h-[50px]" />
                <div>
                  <h4 className="font-semibold">Client {i}</h4>
                  <p className="text-sm text-gray-600">Brand Owner</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A3D79] text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Build Your Brand?</h2>
        <p className="max-w-2xl mx-auto text-white/90 mb-10">
          From design to dispatch, we’ve got you covered.
        </p>
        <Link href="/register" className="bg-white text-[#0A3D79] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
          Get Started Today
        </Link>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <form className="bg-[#F9FAFB] text-[#0A3D79] rounded-2xl p-8 shadow-lg space-y-5">
            <input type="text" placeholder="Your Name" className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0A3D79]" />
            <input type="email" placeholder="Your Email" className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0A3D79]" />
            <input type="tel" placeholder="Your Phone Number" className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0A3D79]" />
            <textarea placeholder="Your Message" rows={4} className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0A3D79]" />
            <button type="submit" className="w-full bg-[#0A3D79] text-white py-3 rounded-md font-semibold hover:bg-[#124E9C] transition">
              Send Message
            </button>
            <p className="text-sm text-gray-600 mt-3">
              Or reach us at{" "}
              <a href="tel:+917202809157" className="text-[#0A3D79] font-semibold hover:underline">
                +91 72028 09157
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
            <p className="text-white/80 text-sm">Premium Garment Manufacturing for Modern Brands.</p>
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
              <Phone size={14} className="inline mx-1" /> +91 72028 09157
              <br />
              <Mail size={14} className="inline mx-1" /> contact@thegarmentguy.com
            </p>
          </div>
        </div>
        <p className="text-center text-white/60 text-sm mt-6">© {new Date().getFullYear()} The Garment Guy. All rights reserved.</p>
      </footer>
    </main>
  );
}
