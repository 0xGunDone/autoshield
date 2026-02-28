"use client";

export function sendMetrikaGoal(goal: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") {
    return;
  }

  const ymFn = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;
  if (typeof ymFn !== "function") {
    return;
  }

  const metrikaId = document.documentElement.getAttribute("data-metrika-id") || "";
  const counterId = Number(metrikaId);
  if (!Number.isFinite(counterId) || counterId <= 0) {
    return;
  }

  ymFn(counterId, "reachGoal", goal, params || {});
}
