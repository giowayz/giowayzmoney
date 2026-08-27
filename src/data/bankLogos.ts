export const BANK_LOGOS: Record<string, string> = {
  "alfa-bank": "/logos/alfa-bank.png",
  "tochka-bank": "/logos/tochka-bank.png",
  "sdm-bank": "/logos/sdm-bank.png",
  "ubrir-bank": "/logos/ubrir-bank.png",
  psb: "/logos/psb.png",
  vtb: "/logos/vtb.png",
  sovcombank: "/logos/sovcombank.png",
  "kontur-bank": "/logos/kontur-bank.png",
  rshb: "/logos/rshb.png",
  ozon: "/logos/ozon.png",
  zaymer: "/logos/zaymer.png",
  "uralsib-bank": "/logos/uralsib-bank.png",
  "t-bank": "/logos/t-bank.png",
  "otp-bank": "/logos/otp-bank.png",
  "ak-bars-bank": "/logos/ak-bars-bank.png",
  "mts-bank": "/logos/mts-bank.png",
};

export function getBankLogo(bankKey: string): string | undefined {
  return BANK_LOGOS[bankKey];
}
