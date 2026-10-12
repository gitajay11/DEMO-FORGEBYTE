'use client';

import { track as vercelTrack } from '@vercel/analytics';

// Cookieless analytics events. Names are fixed so dashboards stay stable:
// cta_click, form_start, form_submit, booking_click, case_study_depth.
type EventName = 'cta_click' | 'form_start' | 'form_submit' | 'booking_click' | 'case_study_depth';

export function track(name: EventName, props?: Record<string, string | number | boolean>) {
  try {
    vercelTrack(name, props);
  } catch {
    // analytics must never break the page
  }
}
