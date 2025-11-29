import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientProviders from "@/components/ClientProviders";
import Script from "next/script";

export const metadata = {
  title: "The Garment Guy — Trusted Clothing Manufacturer",
  description:
    "Leading manufacturer of jeans, cargos, and custom apparel. High-quality production, reliable delivery, and competitive pricing for brands and retailers across India.",
  keywords:
    "clothing manufacturer India, jeans manufacturer, cargo pants manufacturer, custom apparel production, private label clothing, garment factory India, apparel manufacturing, denim manufacturer",
  authors: [{ name: "The Garment Guy" }],
  metadataBase: new URL("https://thegarmentguy.in"),

  openGraph: {
    title: "The Garment Guy — Trusted Clothing Manufacturer",
    description:
      "Premium manufacturer of jeans, cargos, and custom apparel for Indian retailers and brands. High-quality production and fast delivery.",
    url: "https://thegarmentguy.in",
    siteName: "The Garment Guy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Garment Guy — Trusted Clothing Manufacturer",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "The Garment Guy — Trusted Clothing Manufacturer",
    description:
      "Manufacturer of jeans, cargos, and custom clothing with quality production and reliable delivery across India.",
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
