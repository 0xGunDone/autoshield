import { MobileStickyCta } from "@/components/MobileStickyCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteSettings } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSiteSettings();

  return (
    <>
      <SiteHeader phone={settings.phone} />
      <main className="pb-24 md:pb-0">{children}</main>
      <MobileStickyCta phone={settings.phone} />
      <SiteFooter address={settings.address} workHours={settings.work_hours} />
    </>
  );
}
