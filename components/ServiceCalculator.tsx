"use client";

import { useMemo, useState } from "react";

type Option = {
  id: string;
  label: string;
  amount: number;
};

type Props = {
  priceFrom: string;
};

const options: Option[] = [
  { id: "can", label: "Интеграция CAN/LIN", amount: 2500 },
  { id: "gsm", label: "GSM-модуль", amount: 4000 },
  { id: "gps", label: "GPS-модуль", amount: 3500 },
  { id: "hidden", label: "Скрытая установка", amount: 2200 },
  { id: "engine", label: "Расширенный автозапуск", amount: 2800 }
];

function parsePriceFrom(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) {
    return 0;
  }
  return Number(digits);
}

function formatRub(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

export function ServiceCalculator({ priceFrom }: Props) {
  const base = useMemo(() => parsePriceFrom(priceFrom), [priceFrom]);
  const [enabledOptions, setEnabledOptions] = useState<string[]>([]);

  function toggleOption(id: string) {
    setEnabledOptions((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  const optionsSum = enabledOptions.reduce((total, id) => {
    const option = options.find((item) => item.id === id);
    return total + (option?.amount || 0);
  }, 0);

  const total = base + optionsSum;

  return (
    <section className="glass glow rounded-2xl p-5">
      <h2 className="text-2xl font-bold">Калькулятор стоимости</h2>
      <p className="mt-2 text-sm text-slate-300">Базовая цена + выбранные опции установки</p>

      <div className="mt-4 rounded-xl border border-sky-700/20 bg-white/75 p-4">
        <p className="text-sm text-slate-300">Базовая цена</p>
        <p className="text-xl font-bold text-sky-800">{base > 0 ? `от ${formatRub(base)}` : priceFrom}</p>
      </div>

      <div className="mt-4 space-y-2">
        {options.map((option) => (
          <label key={option.id} className="flex items-center justify-between rounded-xl border border-slate-300/60 bg-white/70 p-3 text-sm">
            <span className="font-medium text-slate-800">{option.label}</span>
            <span className="flex items-center gap-2">
              <span className="text-slate-500">+{formatRub(option.amount)}</span>
              <input
                type="checkbox"
                className="!w-auto"
                checked={enabledOptions.includes(option.id)}
                onChange={() => toggleOption(option.id)}
              />
            </span>
          </label>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-sky-700/30 bg-sky-50 p-4">
        <p className="text-sm text-slate-600">Итого ориентировочно</p>
        <p className="text-2xl font-extrabold text-sky-900">{formatRub(total)}</p>
      </div>

      <p className="mt-3 text-xs text-slate-400">Точный расчет зависит от марки, модели и комплектации автомобиля.</p>
    </section>
  );
}
