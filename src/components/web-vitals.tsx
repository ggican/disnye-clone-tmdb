"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals(): any {
  useReportWebVitals((metric) => {
    return metric;
  });
}
