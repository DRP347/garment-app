"use client";
import { motion } from "framer-motion";

export default function OverviewCard({
  title,
  value,
  icon,
  change,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${color}`} />
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <div className="p-2 bg-[#F0F4FF] rounded-lg text-[#0A3D79]">
            {icon}
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-[#0A3D79]">{value}</h2>
        <p className="text-sm text-green-600 font-medium">{change}</p>
      </div>
    </motion.div>
  );
}
