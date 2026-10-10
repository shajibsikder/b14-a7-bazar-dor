const banglaDigits: { [key: string]: string } = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

export function toBengaliNumber(value: number | string): string {
  if (value === null || value === undefined) return "";
  const str = value.toString();
  return str.replace(/[0-9]/g, (match) => banglaDigits[match] || match);
}

export function toBengaliDate(date: Date = new Date()): string {
  const days = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];
  const months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  const dayName = days[date.getDay()];
  const day = toBengaliNumber(date.getDate());
  const monthName = months[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());

  return `${dayName}, ${day} ${monthName} ${year}`;
}

export function formatUnit(unit: string): string {
  if (!unit) return "কেজি";
  const lower = unit.toLowerCase();
  if (lower === "kg" || lower === "কেজি") return "প্রতি কেজি";
  if (lower === "liter" || lower === "লিটার") return "প্রতি লিটার";
  if (lower === "dozen" || lower === "ডজন") return "প্রতি ডজন";
  if (lower === "piece" || lower === "পিস") return "প্রতি পিস";
  if (lower === "hali" || lower === "হালি") return "প্রতি হালি";
  return `প্রতি ${unit}`;
}
