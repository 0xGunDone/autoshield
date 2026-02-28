"use client";

import { useEffect, useMemo, useState } from "react";
import { sendMetrikaGoal } from "@/lib/metrika-client";

type Feature = "autostart" | "remote" | "phone" | "gsm" | "gps" | "unsure";
type StartType = "button" | "key";
type YesNo = "yes" | "no";
type SelectionStage = "chosen" | "consultation";
type DesiredSlot = "today" | "tomorrow" | "week" | "call";

type FormState = {
  car_brand: string;
  car_model: string;
  car_year: string;
  start_type: StartType;
  is_under_warranty: YesNo;
  features: Feature[];
  needs_old_demount: YesNo;
  selection_stage: SelectionStage;
  desired_slot: DesiredSlot;
  name: string;
  phone: string;
  consent: boolean;
  honeypot: string;
};

const totalSteps = 7;

const initialState: FormState = {
  car_brand: "",
  car_model: "",
  car_year: "",
  start_type: "button",
  is_under_warranty: "no",
  features: [],
  needs_old_demount: "no",
  selection_stage: "consultation",
  desired_slot: "call",
  name: "",
  phone: "",
  consent: false,
  honeypot: ""
};

const featureOptions: Array<{ value: Feature; label: string }> = [
  { value: "autostart", label: "Автозапуск" },
  { value: "remote", label: "Управление с пульта" },
  { value: "phone", label: "Управление с телефона" },
  { value: "gsm", label: "GSM" },
  { value: "gps", label: "GPS" },
  { value: "unsure", label: "Затрудняюсь" }
];

const QUIZ_STORAGE_KEY = "autoshield69_quiz_v1";

export function ContactForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [stepError, setStepError] = useState<string>("");

  const progress = useMemo(() => Math.round((step / totalSteps) * 100), [step]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as { step?: number; form?: Partial<FormState> };
      if (parsed.form && typeof parsed.form === "object") {
        setForm((current) => ({
          ...current,
          ...parsed.form,
          honeypot: ""
        }));
      }
      if (parsed.step && Number.isInteger(parsed.step) && parsed.step >= 1 && parsed.step <= totalSteps) {
        setStep(parsed.step);
      }
    } catch {
      window.localStorage.removeItem(QUIZ_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const payload = {
      step,
      form: {
        ...form,
        honeypot: ""
      }
    };

    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(payload));
  }, [form, step]);

  function validateCurrentStep(): string | null {
    if (step === 1) {
      if (!form.car_brand.trim() || !form.car_model.trim() || !form.car_year.trim()) {
        return "Заполните марку, модель и год.";
      }

      const year = Number(form.car_year);
      if (!Number.isInteger(year) || year < 1980 || year > new Date().getFullYear() + 1) {
        return "Укажите корректный год автомобиля.";
      }
    }

    if (step === 4 && form.features.length === 0) {
      return "Выберите хотя бы одну нужную функцию.";
    }

    if (step === 7) {
      if (!form.name.trim() || !form.phone.trim()) {
        return "Укажите имя и телефон.";
      }
      if (!form.consent) {
        return "Нужно согласие на обработку персональных данных.";
      }
    }

    return null;
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleFeature(feature: Feature) {
    setForm((current) => {
      const has = current.features.includes(feature);

      if (feature === "unsure") {
        return {
          ...current,
          features: has ? current.features.filter((item) => item !== feature) : ["unsure"]
        };
      }

      const nextFeatures = has ? current.features.filter((item) => item !== feature) : [...current.features.filter((item) => item !== "unsure"), feature];
      return { ...current, features: nextFeatures };
    });
  }

  function handleNext() {
    const error = validateCurrentStep();
    if (error) {
      setStepError(error);
      return;
    }

    setStepError("");
    const nextStep = Math.min(totalSteps, step + 1);
    setStep(nextStep);
    sendMetrikaGoal("quiz_step_next", { from_step: step, to_step: nextStep });
  }

  function handleBack() {
    setStepError("");
    setStep((current) => Math.max(1, current - 1));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    const error = validateCurrentStep();
    if (error) {
      setStepError(error);
      return;
    }

    setStepError("");
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          car_brand: form.car_brand.trim(),
          car_model: form.car_model.trim(),
          car_year: Number(form.car_year),
          start_type: form.start_type,
          is_under_warranty: form.is_under_warranty,
          features: form.features,
          needs_old_demount: form.needs_old_demount,
          selection_stage: form.selection_stage,
          desired_slot: form.desired_slot,
          consent: form.consent,
          honeypot: form.honeypot
        })
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus(data.message || "Ошибка отправки анкеты.");
        sendMetrikaGoal("quiz_submit_error");
      } else {
        setForm(initialState);
        setStep(1);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(QUIZ_STORAGE_KEY);
        }
        setStatus("Анкета отправлена. Мы свяжемся с вами для подбора сигнализации.");
        sendMetrikaGoal("quiz_submit_success");
      }
    } catch {
      setStatus("Не удалось отправить анкету. Повторите попытку позже.");
      sendMetrikaGoal("quiz_submit_error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="glass glow rounded-2xl p-5 space-y-5" onSubmit={handleSubmit}>
      <div>
        <p className="hero-kicker">Подбор сигнализации</p>
        <h3 className="mt-3 text-xl font-bold">Для подбора сигнализации пройдите небольшой опрос</h3>
        <p className="mt-2 text-sm text-slate-300">Шаг {step} из {totalSteps}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80">
          <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {step === 1 ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm">Марка</label>
            <input value={form.car_brand} onChange={(e) => setField("car_brand", e.target.value)} placeholder="Toyota" required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Модель</label>
            <input value={form.car_model} onChange={(e) => setField("car_model", e.target.value)} placeholder="Camry" required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Год</label>
            <input
              type="number"
              min={1980}
              max={new Date().getFullYear() + 1}
              value={form.car_year}
              onChange={(e) => setField("car_year", e.target.value)}
              placeholder="2020"
              required
            />
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <p className="mb-2 text-sm font-semibold">Завод с кнопки или с ключа?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="glass rounded-xl p-3 text-sm">
              <input
                type="radio"
                className="!w-auto"
                checked={form.start_type === "button"}
                onChange={() => setField("start_type", "button")}
              />
              <span className="ml-2">С кнопки</span>
            </label>
            <label className="glass rounded-xl p-3 text-sm">
              <input
                type="radio"
                className="!w-auto"
                checked={form.start_type === "key"}
                onChange={() => setField("start_type", "key")}
              />
              <span className="ml-2">С ключа</span>
            </label>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div>
          <p className="mb-2 text-sm font-semibold">На гарантии ли автомобиль?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="glass rounded-xl p-3 text-sm">
              <input
                type="radio"
                className="!w-auto"
                checked={form.is_under_warranty === "yes"}
                onChange={() => setField("is_under_warranty", "yes")}
              />
              <span className="ml-2">Да</span>
            </label>
            <label className="glass rounded-xl p-3 text-sm">
              <input
                type="radio"
                className="!w-auto"
                checked={form.is_under_warranty === "no"}
                onChange={() => setField("is_under_warranty", "no")}
              />
              <span className="ml-2">Нет</span>
            </label>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div>
          <p className="mb-2 text-sm font-semibold">Какие функции нужны в сигналке?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {featureOptions.map((item) => (
              <label key={item.value} className="glass rounded-xl p-3 text-sm">
                <input
                  type="checkbox"
                  className="!w-auto"
                  checked={form.features.includes(item.value)}
                  onChange={() => toggleFeature(item.value)}
                />
                <span className="ml-2">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {step === 5 ? (
        <div>
          <p className="mb-2 text-sm font-semibold">Нужен ли демонтаж старой системы?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="glass rounded-xl p-3 text-sm">
              <input
                type="radio"
                className="!w-auto"
                checked={form.needs_old_demount === "yes"}
                onChange={() => setField("needs_old_demount", "yes")}
              />
              <span className="ml-2">Да, нужен демонтаж</span>
            </label>
            <label className="glass rounded-xl p-3 text-sm">
              <input
                type="radio"
                className="!w-auto"
                checked={form.needs_old_demount === "no"}
                onChange={() => setField("needs_old_demount", "no")}
              />
              <span className="ml-2">Нет</span>
            </label>
          </div>
        </div>
      ) : null}

      {step === 6 ? (
        <div>
          <p className="mb-2 text-sm font-semibold">Уже выбрали систему или нужна консультация?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="glass rounded-xl p-3 text-sm">
              <input
                type="radio"
                className="!w-auto"
                checked={form.selection_stage === "chosen"}
                onChange={() => setField("selection_stage", "chosen")}
              />
              <span className="ml-2">Уже выбрал</span>
            </label>
            <label className="glass rounded-xl p-3 text-sm">
              <input
                type="radio"
                className="!w-auto"
                checked={form.selection_stage === "consultation"}
                onChange={() => setField("selection_stage", "consultation")}
              />
              <span className="ml-2">Нужна консультация</span>
            </label>
          </div>
        </div>
      ) : null}

      {step === 7 ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm">Имя</label>
              <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Иван" required />
            </div>
            <div>
              <label className="mb-1 block text-sm">Телефон</label>
              <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+7 (900) 000-00-00" required />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">Когда удобно связаться?</label>
            <select value={form.desired_slot} onChange={(e) => setField("desired_slot", e.target.value as DesiredSlot)}>
              <option value="today">Сегодня</option>
              <option value="tomorrow">Завтра</option>
              <option value="week">На этой неделе</option>
              <option value="call">Уточнить по звонку</option>
            </select>
          </div>

          <label className="inline-flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="!w-auto"
              checked={form.consent}
              onChange={(e) => setField("consent", e.target.checked)}
              required
            />
            <span>Согласен на обработку персональных данных</span>
          </label>
        </div>
      ) : null}

      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        value={form.honeypot}
        onChange={(e) => setField("honeypot", e.target.value)}
      />

      {stepError ? <p className="text-sm text-rose-300">{stepError}</p> : null}

      <div className="flex flex-wrap gap-3">
        {step > 1 ? (
          <button type="button" className="ghost-btn" onClick={handleBack}>
            Назад
          </button>
        ) : null}

        {step < totalSteps ? (
          <button type="button" className="primary-btn font-semibold" onClick={handleNext}>
            Далее
          </button>
        ) : (
          <button type="submit" className="primary-btn font-semibold" disabled={loading}>
            {loading ? "Отправка..." : "Отправить анкету"}
          </button>
        )}
      </div>

      {status ? <p className="text-sm text-slate-200">{status}</p> : null}
    </form>
  );
}
