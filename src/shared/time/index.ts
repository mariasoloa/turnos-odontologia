/**
 * Conversión entre la hora local de un consultorio y UTC (RN-GL-01).
 * Las fechas se guardan en UTC; la hora local se expresa como `YYYY-MM-DDTHH:mm`.
 */

const FORMATO_LOCAL = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const MS_POR_HORA = 3_600_000;

interface PartesLocales {
  anio: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;
}

function partesEnZona(instante: Date, zona: string): PartesLocales {
  const formato = new Intl.DateTimeFormat('en-US', {
    timeZone: zona,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const valor = (tipo: Intl.DateTimeFormatPartTypes): number =>
    Number(formato.formatToParts(instante).find((p) => p.type === tipo)?.value);
  return { anio: valor('year'), mes: valor('month'), dia: valor('day'), hora: valor('hour'), minuto: valor('minute') };
}

function comoUtc(p: PartesLocales): number {
  return Date.UTC(p.anio, p.mes - 1, p.dia, p.hora, p.minuto);
}

/** Diferencia (en ms) entre la hora local de la zona y UTC en un instante dado. */
function desfaseMs(instante: Date, zona: string): number {
  return comoUtc(partesEnZona(instante, zona)) - Math.floor(instante.getTime() / 60_000) * 60_000;
}

/** Convierte `YYYY-MM-DDTHH:mm` en la zona indicada al instante UTC correspondiente. */
export function localAUtc(fechaHoraLocal: string, zona: string): Date {
  const m = FORMATO_LOCAL.exec(fechaHoraLocal);
  if (!m) {
    throw new Error(`Fecha y hora local inválida: ${fechaHoraLocal}`);
  }
  const partes: PartesLocales = {
    anio: Number(m[1]),
    mes: Number(m[2]),
    dia: Number(m[3]),
    hora: Number(m[4]),
    minuto: Number(m[5]),
  };
  const comoSiFueraUtc = comoUtc(partes);
  const control = new Date(comoSiFueraUtc);
  if (
    control.getUTCFullYear() !== partes.anio ||
    control.getUTCMonth() + 1 !== partes.mes ||
    control.getUTCDate() !== partes.dia ||
    control.getUTCHours() !== partes.hora ||
    control.getUTCMinutes() !== partes.minuto
  ) {
    throw new Error(`Fecha y hora local inválida: ${fechaHoraLocal}`);
  }

  // Primera aproximación con el desfase del instante "como si fuera UTC"; se corrige
  // una vez por si el desfase cambia entre ambos instantes (horario de verano).
  const aproximado = comoSiFueraUtc - desfaseMs(new Date(comoSiFueraUtc), zona);
  return new Date(comoSiFueraUtc - desfaseMs(new Date(aproximado), zona));
}

/** Expresa un instante como `YYYY-MM-DDTHH:mm` en la zona indicada. */
export function utcALocal(instante: Date, zona: string): string {
  const p = partesEnZona(instante, zona);
  const dos = (n: number): string => String(n).padStart(2, '0');
  return `${p.anio}-${dos(p.mes)}-${dos(p.dia)}T${dos(p.hora)}:${dos(p.minuto)}`;
}

/** Horas (con decimales) desde `desde` hasta `hasta`; negativo si `hasta` es anterior. */
export function horasEntre(desde: Date, hasta: Date): number {
  return (hasta.getTime() - desde.getTime()) / MS_POR_HORA;
}
