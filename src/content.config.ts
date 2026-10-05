import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const TINTES = ['olive', 'sage', 'salmon', 'peach', 'lime', 'sky', 'steel', 'periwinkle'] as const;
const slug = z.string().regex(/^[a-z0-9-]+$/, 'usa solo minúsculas, números y guiones');

const curso = defineCollection({
  loader: file('src/data/curso.yaml'),
  schema: z.object({
    nombre: z.string(),
    sigla: z.string(),
    codigo: z.string(),
    institucion: z.string(),
    carrera: z.string().optional(),
    periodo: z.string(),
    provisional: z.boolean().default(false),
    inicio: z.coerce.date(),
    semanas: z.number().int().positive(),
    semanas_especiales: z.record(z.string(), z.string()).default({}),
    docente: z.object({
      nombre: z.string(),
      correo: z.string().optional(),
      oficina: z.string().optional(),
      atencion: z.string().optional(),
    }),
    horario: z.array(z.object({ dia: z.string(), hora: z.string(), aula: z.string().optional() })).default([]),
    /** Frase corta para la portada. */
    resumen: z.string().optional(),
    descripcion: z.string(),
    objetivos: z.array(z.string()).default([]),
    resultados: z.array(z.string()).default([]),
    ejes: z.array(z.object({ titulo: z.string(), texto: z.string() })).default([]),
    horas_evaluacion: z.number().default(0),
    metodos_evaluacion: z.array(z.string()).default([]),
    /** Pesos de cada componente de la evaluación. */
    ponderaciones: z.array(z.object({ componente: z.string(), peso: z.number() })).default([]),
    politicas: z.array(z.string()).default([]),
    bibliografia: z
      .object({ obligatoria: z.array(z.string()).default([]), adicional: z.array(z.string()).default([]) })
      .default({ obligatoria: [], adicional: [] }),
  }),
});

const unidades = defineCollection({
  loader: file('src/data/unidades.yaml'),
  schema: z.object({
    numero: z.number().int(),
    titulo: z.string(),
    color: z.enum(TINTES),
    horas: z.number().optional(),
    descripcion: z.string().default(''),
    temas: z.array(
      z.object({
        id: slug,
        titulo: z.string(),
        semana: z.number().int().positive(),
        resumen: z.string().default(''),
        contenidos: z.array(z.string()).default([]),
        objetivos: z.array(z.string()).default([]),
      }),
    ),
  }),
});

const calendario = defineCollection({
  loader: file('src/data/calendario.yaml'),
  schema: z.object({
    fecha: z.coerce.date(),
    tipo: z.enum(['feriado', 'examen', 'entrega', 'evento']),
    titulo: z.string(),
  }),
});

const recursos = defineCollection({
  loader: file('src/data/recursos.yaml'),
  schema: z.object({
    titulo: z.string(),
    url: z.url(),
    tipo: z.enum(['lectura', 'video', 'herramienta', 'repositorio', 'documentacion']),
    unidad: slug.optional(),
    tema: slug.optional(),
    descripcion: z.string().optional(),
  }),
});

const slides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/slides' }),
  schema: z.object({
    titulo: z.string(),
    subtitulo: z.string().optional(),
    publicado: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

const evaluaciones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/evaluaciones' }),
  schema: z.object({
    titulo: z.string(),
    tipo: z.enum(['proyecto', 'taller', 'deber', 'quiz', 'examen']),
    entrega: z.coerce.date(),
    publicado: z.coerce.date().optional(),
    unidad: slug.optional(),
    peso: z.string().optional(),
    enlace: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { curso, unidades, calendario, recursos, slides, evaluaciones };
