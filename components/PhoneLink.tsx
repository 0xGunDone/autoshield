"use client";

import { sendMetrikaGoal } from "@/lib/metrika-client";

type Props = {
  phone: string;
  className?: string;
  children: React.ReactNode;
  source?: string;
};

export function PhoneLink({ phone, className, children, source = "phone_link" }: Props) {
  return (
    <a
      href={`tel:${phone}`}
      className={className}
      onClick={() => {
        sendMetrikaGoal("phone_click", { source });
      }}
    >
      {children}
    </a>
  );
}
