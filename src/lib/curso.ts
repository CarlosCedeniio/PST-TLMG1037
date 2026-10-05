import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Unidad = CollectionEntry<'unidades'>['data'] & { id: string };
export type Tema = Unidad['temas'][number] & {
  numero: string;
  unidad: Unidad;
  semanaInfo: Semana | undefined;
  slides: CollectionEntry<'slides'> | undefined;
};
export type Semana = {
  numero: number;
  inicio: Date;
  fin: Date;
  etiqueta?: string;
};

const DIA = 24 * 60 * 60 * 1000;
const DIAS_NUEVO = 7;

/** Ruta interna respetando el `base` del sitio. */
export const url = (ruta = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${ruta.replace(/^\//, '')}`;

/** Las fechas de YAML llegan como medianoche UTC; se formatean en UTC para no correr un día. */
export const fecha = (d: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
  d.toLocaleDateString('es-EC', { timeZone: 'UTC', ...opts });

export const iso = (d: Date) => d.toISOString().slice(0, 10);

export const esNuevo = (publicado?: Date, hoy = new Date()) =>
  !!publicado && hoy.getTime() - publicado.getTime() >= 0 && hoy.getTime() - publicado.getTime() < DIAS_NUEVO * DIA;

export async function getCurso() {
  const entry = await getEntry('curso', 'info');
  if (!entry) throw new Error('Falta el registro "info" en src/data/curso.yaml');
  return entry.data;
}

export async function getSemanas(): Promise<Semana[]> {
  const curso = await getCurso();
  return Array.from({ length: curso.semanas }, (_, i) => {
    const inicio = new Date(curso.inicio.getTime() + i * 7 * DIA);
    return {
      numero: i + 1,
      inicio,
      fin: new Date(inicio.getTime() + 6 * DIA),
      etiqueta: curso.semanas_especiales[String(i + 1)],
    };
  });
}

export async function getUnidades(): Promise<Unidad[]> {
  const unidades = await getCollection('unidades');
  return unidades.map((m) => ({ ...m.data, id: m.id })).sort((a, b) => a.numero - b.numero);
}

export async function getTemas(): Promise<Tema[]> {
  const [unidades, semanas, slides] = await Promise.all([
    getUnidades(),
    getSemanas(),
    getCollection('slides', (s) => import.meta.env.DEV || !s.data.draft),
  ]);
  return unidades.flatMap((unidad) =>
    unidad.temas.map((t, i) => ({
      ...t,
      numero: `${unidad.numero}.${i + 1}`,
      unidad,
      semanaInfo: semanas.find((s) => s.numero === t.semana),
      slides: slides.find((s) => s.id === `${unidad.id}/${t.id}`),
    })),
  );
}

/** Fechas de la semana en texto: "5 – 11 oct." */
export const rangoSemana = (s: Semana) => `${fecha(s.inicio, { day: 'numeric' })} – ${fecha(s.fin)}`;

export const dentroDe = (d: Date, s: Semana) => d.getTime() >= s.inicio.getTime() && d.getTime() <= s.fin.getTime();

export async function getEvaluaciones() {
  const evaluaciones = await getCollection('evaluaciones', (e) => import.meta.env.DEV || !e.data.draft);
  return evaluaciones.sort((a, b) => a.data.entrega.getTime() - b.data.entrega.getTime());
}

export async function getCalendario() {
  const eventos = await getCollection('calendario');
  return eventos.map((e) => e.data).sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
}

/** ¿El tema ya se dictó? (su semana terminó antes de hoy) */
export const dictado = (t: Tema, hoy = new Date()) => !!t.semanaInfo && t.semanaInfo.fin.getTime() + DIA <= hoy.getTime();

export const rutaTema = (t: Pick<Tema, 'id'> & { unidad: { id: string } }) => url(`unidades/${t.unidad.id}/${t.id}`);
export const rutaSlides = (t: Pick<Tema, 'id'> & { unidad: { id: string } }) => url(`slides/${t.unidad.id}/${t.id}`);
