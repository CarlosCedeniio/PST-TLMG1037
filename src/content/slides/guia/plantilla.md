---
titulo: Plantilla de diapositivas
subtitulo: Todo lo que puedes usar al escribir una clase en Markdown
---

# Cómo se escribe una clase

- Cada archivo vive en `src/content/slides/<unidad>/<tema>.md`
- Las diapositivas se separan con una línea `---` (igual que en Marp)
- `--` crea una diapositiva **vertical** debajo de la actual
- La portada se genera sola con el título del tema y el color de la unidad

Note:
Estas son notas del presentador. Presiona **S** para abrir la vista de presentador.

---

# Texto y listas

Los párrafos usan *Source Serif 4* y los títulos **Archivo Black**.

1. Listas numeradas
2. Con sub-niveles
   - Viñetas cuadradas
   - Más pequeñas en el segundo nivel

> Una cita o idea clave queda en un bloque con el color de la unidad.

---

# Código

```js [1|3-5]
import express from 'express';

const app = express();
app.get('/api/temperatura', (req, res) => res.json({ celsius: 24.5 }));
app.listen(3000);
```

Los números entre corchetes resaltan líneas paso a paso: `[1|3-5]`.

---

# Componentes Dell

<div class="cols-2">
<div>

<div class="ribbon tint-salmon">
<h3>Ribbon card</h3>
<p>Título blanco y cuerpo con un color del catálogo.</p>
</div>

<span class="sticker">¡Nuevo!</span>

</div>
<div>

<div class="cta-red">
Un bloque rojo por clase como máximo: para la idea más importante.
</div>

</div>
</div>

---

# Tablas

| Protocolo | Capa | Puerto |
|---|---|---|
| HTTP | Aplicación | 80 |
| MQTT | Aplicación | 1883 |
| DNS | Aplicación | 53 |

---

<!-- .slide: class="divider" -->

# Separador de sección

Agrega `<!-- .slide: class="divider" -->` al inicio de la diapositiva.

---

# Imágenes y fragmentos

Las imágenes se guardan en `public/slides/<unidad>/<tema>/` y se enlazan con ruta relativa: `./imagen.png`.

- Este punto aparece primero <!-- .element: class="fragment" -->
- Y este después <!-- .element: class="fragment" -->

--

## Diapositiva vertical

Útil para ejercicios o detalles opcionales.
