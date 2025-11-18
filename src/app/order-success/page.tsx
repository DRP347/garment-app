export default function OrderSuccessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[#0A3D79]">Order Placed Successfully</h1>

      <p className="mt-4 text-gray-700 text-lg">
        Thank you for your order. Our team will contact you shortly.
      </p>

      <a
        href="/orders"
        className="inline-block mt-8 px-6 py-3 rounded-lg bg-[#0A3D79] text-white font-semibold hover:bg-[#124E9C]"
      >
        View My Orders
      </a>
    </div>
  );
}
