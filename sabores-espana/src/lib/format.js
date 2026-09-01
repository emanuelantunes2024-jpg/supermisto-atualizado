export function formatearMinutos(min) {
  if (!min || min <= 0) return '—';
  if (min < 60) return `${min} min`;
  const horas = Math.floor(min / 60);
  const resto = min % 60;
  return resto ? `${horas} h ${resto} min` : `${horas} h`;
}

export function colorDificultad(dificultad) {
  switch (dificultad) {
    case 'Fácil':
      return 'text-emerald-700 bg-emerald-50 ring-emerald-200';
    case 'Media':
      return 'text-amber-700 bg-amber-50 ring-amber-200';
    case 'Difícil':
      return 'text-wine-600 bg-wine-50 ring-wine-200';
    default:
      return 'text-ink/60 bg-ink/5 ring-ink/10';
  }
}
