export const siteConfig = {
  whatsappNumber: "917861988279",
  whatsappDisplay: "78619 88279",
};

export function makeWhatsAppUrl(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

