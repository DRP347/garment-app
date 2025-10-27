export function makeWhatsAppCheckoutLink({
  phoneE164,      // e.g. "919876543210" without +, or "1xxxx"
  items,
  totals,
  buyer,
}: {
  phoneE164: string;
  items: { name: string; qty: number; price: number }[];
  totals: { subtotal: number; shipping?: number; grandTotal: number };
  buyer?: { name?: string; phone?: string };
}) {
  const lines = [
    `*New Order Request*`,
    buyer?.name ? `Buyer: ${buyer.name}` : undefined,
    buyer?.phone ? `Phone: ${buyer.phone}` : undefined,
    "",
    "*Items:*",
    ...items.map(
      (it) => `• ${it.name} x${it.qty} — ₹${(it.qty * it.price).toLocaleString("en-IN")}`
    ),
    "",
    `Subtotal: ₹${totals.subtotal.toLocaleString("en-IN")}`,
    totals.shipping != null ? `Shipping: ₹${totals.shipping.toLocaleString("en-IN")}` : undefined,
    `Total: *₹${totals.grandTotal.toLocaleString("en-IN")}*`,
    "",
    "Please confirm availability and next steps.",
  ].filter(Boolean) as string[];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${phoneE164}?text=${text}`;
}
