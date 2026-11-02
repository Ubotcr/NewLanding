// Utilidades para el blog. Sin dependencias externas.

// Formatea una fecha ISO al formato español (Costa Rica).
// Usa UTC para que la fecha mostrada coincida con la del contenido
// independientemente de la zona horaria del servidor o del visitante.
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
};

// Devuelve la parte de fecha (YYYY-MM-DD) para el atributo `datetime`.
export const isoDate = (date: string | Date): string => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

// Estima el tiempo de lectura a partir del contenido en texto/markdown.
export const readingTime = (content: string): string => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de lectura`;
};

// Ordena entradas por fecha descendente (espera frontmatter.date).
export const sortByDate = <T extends { frontmatter?: { date?: string | Date } }>(
  arr: T[],
): T[] =>
  [...arr].sort(
    (a, b) =>
      new Date(b.frontmatter?.date || 0).getTime() -
      new Date(a.frontmatter?.date || 0).getTime(),
  );
