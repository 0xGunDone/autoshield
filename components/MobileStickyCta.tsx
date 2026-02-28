"use client";

import Link from "next/link";
import { sendMetrikaGoal } from "@/lib/metrika-client";

type Props = {
  phone: string;
};

export function MobileStickyCta({ phone }: Props) {
  return (
    <div className="mobile-sticky-cta-wrap md:hidden">
      <div className="mobile-sticky-cta-grid">
        <a
          href={`tel:${phone}`}
          className="mobile-sticky-call"
          aria-label="Позвонить"
          onClick={() => {
            sendMetrikaGoal("mobile_sticky_call");
          }}
        >
          Позвонить
        </a>
        <Link
          href="/quiz"
          className="mobile-sticky-book"
          aria-label="Записаться"
          onClick={() => {
            sendMetrikaGoal("mobile_sticky_book");
          }}
        >
          Записаться
        </Link>
      </div>
    </div>
  );
}
