import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { getSiteSettings } from "@/lib/repository";

export const dynamic = "force-dynamic";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0ea5e9"
};

export function generateMetadata(): Metadata {
  const settings = getSiteSettings();

  return {
    metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
    title: {
      default: settings.default_seo_title,
      template: `%s | ${settings.center_name}`
    },
    description: settings.default_seo_description,
    alternates: {
      canonical: "/",
      languages: {
        "ru-RU": "/"
      }
    },
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/apple-icon.svg"
    },
    appleWebApp: {
      capable: true,
      title: "АВТОЩИТ69",
      statusBarStyle: "default"
    },
    openGraph: {
      title: settings.default_seo_title,
      description: settings.default_seo_description,
      type: "website",
      locale: "ru_RU"
    }
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSiteSettings();
  const metrikaId = settings.metrika_id?.trim() || "";
  const metrikaCounter = metrikaId ? Number(metrikaId) : 0;

  return (
    <html lang="ru" data-metrika-id={metrikaId || undefined}>
      <head>
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>
        {metrikaId && Number.isFinite(metrikaCounter) && metrikaCounter > 0 ? (
          <>
            <Script id="yandex-metrika" strategy="afterInteractive">
              {`
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                ym(${metrikaCounter}, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
                });
              `}
            </Script>
            <noscript>
              <div>
                <img src={`https://mc.yandex.ru/watch/${metrikaId}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
              </div>
            </noscript>
          </>
        ) : null}
        <div className="bg-grid" />
        <div className="ambient-layer">
          <div className="ambient-orb orb-1" />
          <div className="ambient-orb orb-2" />
          <div className="ambient-orb orb-3" />
        </div>
        {children}
      </body>
    </html>
  );
}
