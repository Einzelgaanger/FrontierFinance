/**
 * CFF team / staff emails. These users are admins and must NOT appear
 * in the public member directory (they are not fund managers).
 */
export const STAFF_EMAILS = [
  'lisa@frontierfinance.org',
  'alfred@frontierfinance.org',
  'arnold@frontierfinance.org',
  'drew@frontierfinance.org',
  'gila@frontierfinance.org',
  'alexandra@frontierfinance.org',
] as const;

const STAFF_EMAILS_SET = new Set(STAFF_EMAILS.map((e) => e.toLowerCase()));

export function isStaffEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return STAFF_EMAILS_SET.has(email.toLowerCase());
}
