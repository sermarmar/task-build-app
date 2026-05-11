export const DAY_NAMES = [
  {
    label: "Dom",
    value: "sunday"
  },
  {
    label: "Lun",
    value: "monday"
  },
  {
    label: "Mar",
    value: "tuesday"
  },
  {
    label: "Mié",
    value: "wednesday"
  },
  {
    label: "Jue",
    value: "thursday"
  },
  {
    label: "Vie",
    value: "friday"
  },
  {
    label: "Sáb",
    value: "saturday"
  }
];

export const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function getDays(from: Date, count = 10, offset = 0): Date[] {
  const start = new Date(from);
  start.setDate(start.getDate() - 3 + offset); // -3 para que hoy aparezca cerca del inicio
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}
