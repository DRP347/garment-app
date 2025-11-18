import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientProviders from "@/components/ClientProviders";
import Script from "next/script";

export const metadata = {
  title: "The Garment Guy — Premium Wholesale Denim",
  description:
    "Buy premium jeans, cargos, and denims directly from The Garment Guy. India's trusted B2B clothing supplier with fast dispatch and quality guaranteed.",
  keywords:
    "wholesale jeans, garment supplier, denim manufacturer India, cargo pants wholesale, The Garment Guy, B2B clothing, fashion manufacturing, jeans bulk order",
  authors: [{ name: "The Garment Guy" }],
  metadataBase: new URL("https://thegarmentguy.in"),
  openGraph: {
    title: "The Garment Guy — Wholesale Denim & Garments",
    description:
      "Premium denim and cargo manufacturer for Indian retailers. Trusted quality, quick delivery, and best wholesale prices.",
    url: "https://thegarmentguy.in",
    siteName: "The Garment Guy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Garment Guy — Premium Wholesale Denim",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Garment Guy — India's Trusted Garment Supplier",
    description:
      "B2B wholesale jeans and cargo supplier. Premium denim at the best price, shipped across India.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* GOOGLE SITE VERIFICATION */}
        <meta
          name="google-site-verification"
          content="PASTE_YOUR_VERIFICATION_CODE"
        />

        {/* GOOGLE ANALYTICS */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `}
        </Script>

        {/* META PIXEL */}
        <Script id="fbq-setup" strategy="afterInteractive">
          {`
            // fbq global shim
            window.fbq = window.fbq || function() {
              if (fbq.callMethod) {
                fbq.callMethod.apply(fbq, arguments);
              } else {
                fbq.queue.push(arguments);
              }
            };
            window._fbq = window._fbq || fbq;
            fbq.push = fbq;
            fbq.loaded = true;
            fbq.version = '2.0';
            fbq.queue = [];

            (function(f,b,e,v,n,t,s){
              if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1167525748315546');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1167525748315546&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>

      <body suppressHydrationWarning className="bg-white text-[#0A3D79]">
        <ClientProviders>
          <Navbar />
          <main className="pt-[56px] md:pt-[64px]">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
