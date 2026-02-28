import { ShieldLogo } from "@/components/ShieldLogo";

type Props = {
  address: string;
  workHours: string;
};

export function SiteFooter({ address, workHours }: Props) {
  return (
    <footer className="px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-2xl glass px-5 py-6 text-sm text-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <ShieldLogo className="h-10 w-10 shrink-0" />
          <p className="font-semibold">АВТОЩИТ69</p>
        </div>
        <p className="mt-3">{address}</p>
        <p>{workHours}</p>
        <p className="mt-3 text-xs text-slate-400">© {new Date().getFullYear()} АВТОЩИТ69. Все права защищены.</p>
      </div>
    </footer>
  );
}
