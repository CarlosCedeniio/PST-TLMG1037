# PST · Programación de Sistemas Telemáticos (TLMG1037) · ESPOL

Sitio web del curso: planificación, cronograma, diapositivas, evaluaciones y recursos.
Construido con [Astro](https://astro.build) y [reveal.js](https://revealjs.com), con la estética de [`DESIGN.md`](DESIGN.md) (Dell 1996).

```bash
npm install
npm run dev      # http://localhost:4321/PST-TLMG1037/
npm run build    # valida los datos y genera dist/
```

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Datos del curso, inicio del PAO y semanas | `src/data/curso.yaml` |
| Unidades, temas y semana de cada tema | `src/data/unidades.yaml` |
| Feriados, exámenes, eventos | `src/data/calendario.yaml` |
| Enlaces y recursos | `src/data/recursos.yaml` |
| Diapositivas de un tema | `src/content/slides/<unidad>/<tema>.md` |
| Imágenes de las diapositivas | `public/slides/<unidad>/<tema>/` (se enlazan como `./imagen.png`) |
| Evaluaciones | `src/content/evaluaciones/<id>.md` |

Las fechas se escriben como `AAAA-MM-DD`. Si algo está mal escrito (un color, una fecha, un id), `npm run build` falla con el error exacto.
Cuando la planificación sea definitiva, cambia `provisional: false` en `curso.yaml`.

## Diapositivas

Markdown con las diapositivas separadas por `---`, igual que en Marp. La guía completa, con ejemplos de cada componente, está en
[`src/content/slides/guia/plantilla.md`](src/content/slides/guia/plantilla.md) y se ve en `/slides/guia/plantilla`.

- **S**: vista del presentador (notas después de `Note:`)
- **F**: pantalla completa · **Esc**: vista general
- Agrega `?print-pdf` a la URL para exportar a PDF (se abre el diálogo de impresión → "Guardar como PDF")
- `draft: true` en el frontmatter oculta el tema en el sitio publicado (sigue visible en `npm run dev`)

## Publicación

Cada push a la rama `2026/pao2` se publica en GitHub Pages (`.github/workflows/deploy.yml`) y el sitio se reconstruye a diario para actualizar los sellos "¡Nuevo!" y "Tema dictado".
Configuración, una sola vez: **Settings → Pages → Source: GitHub Actions**.

## Material anterior

`legacy/` guarda las clases Marp de periodos anteriores. Solo sirven de referencia y no se publican.
