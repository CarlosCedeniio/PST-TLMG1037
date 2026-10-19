---
titulo: "Frontend: HTML, CSS, JavaScript y consumo de APIs"
subtitulo: Una interfaz web que consulta la API, muestra los datos del dispositivo y envía órdenes
publicado: 2026-10-26
---

# Objetivo de la clase

<div class="ribbon tint-salmon">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Explicar la función de HTML, CSS y JavaScript en una interfaz web.</li>
<li>Describir cómo el navegador construye el DOM y cómo JavaScript lo modifica.</li>
<li>Consultar la API con <code>fetch</code> y manejar sus errores.</li>
<li>Enviar órdenes desde la interfaz y actualizar los datos periódicamente.</li>
<li>Explicar la política de mismo origen y configurar CORS.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>El dashboard de referencia</li>
<li>HTML, CSS y JavaScript</li>
<li>Del navegador a la API</li>
<li>Consultar la API con fetch</li>
<li>Enviar órdenes y actualizar</li>
<li>Gráficos con Chart.js</li>
<li>Mismo origen y CORS</li>
</ol>

---

# El dashboard de referencia

<div class="cols-2" style="grid-template-columns: 2fr 1fr; gap: 28px">
<figure>
<img src="./dashboard-escritorio.png" alt="Dashboard con tarjetas de temperatura, humedad y ventilador, un botón Encender y un gráfico de temperatura" style="max-height: 380px">
<figcaption>Dashboard de ejemplo con datos simulados. Captura: elaboración propia.</figcaption>
</figure>
<div class="small">

- **HTML:** las tarjetas, el botón y el lienzo del gráfico.
- **CSS:** colores, tamaños y la cuadrícula de tarjetas.
- **JavaScript:** pide los datos a la API, dibuja el gráfico y envía la orden al pulsar el botón.

</div>
</div>

---

# HTML, CSS y JavaScript

<div class="cols-2" style="grid-template-columns: 1fr 1.4fr">
<figure>
<img src="./mdn-cake.png" alt="Pastel de tres capas: HTML, CSS y JavaScript" class="plain" style="max-height: 300px">
<figcaption>Imagen: Mozilla Contributors, MDN Web Docs, CC BY-SA 2.5.</figcaption>
</figure>
<div>
<div class="card tint-sky"><b>HTML</b><p>Lenguaje de marcado que estructura el contenido y le da significado.</p></div>
<p></p>
<div class="card tint-peach"><b>CSS</b><p>Reglas de estilo que definen la presentación.</p></div>
<p></p>
<div class="card tint-lime"><b>JavaScript</b><p>Lenguaje que crea contenido que se actualiza y responde al usuario.</p></div>
</div>
</div>

<p class="fuente">Definiciones de MDN, <em>What is JavaScript?</em></p>

---

# Del navegador a la API

<svg class="diagram" viewBox="0 0 1150 345" style="max-height: 345px" role="img" aria-label="El navegador descarga HTML, CSS y JavaScript del servidor web, construye el DOM, pide las lecturas a la API con fetch y actualiza el DOM">
<defs><marker id="fe-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g stroke="#000" stroke-width="2"><rect x="40" y="6" width="220" height="40" fill="#c0d4a7"/><rect x="465" y="6" width="220" height="40" fill="#a5b8c0"/><rect x="890" y="6" width="220" height="40" fill="#d77a7a"/></g>
<g font-size="18" font-weight="700" text-anchor="middle"><text x="150" y="32">NAVEGADOR</text><text x="575" y="32">SERVIDOR WEB</text><text x="1000" y="32">API</text></g>
<g stroke="#000" stroke-width="2" stroke-dasharray="6 6"><line x1="150" y1="46" x2="150" y2="340"/><line x1="575" y1="46" x2="575" y2="340"/><line x1="1000" y1="46" x2="1000" y2="340"/></g>
<g stroke="#000" stroke-width="3">
<line x1="150" y1="85" x2="569" y2="85" marker-end="url(#fe-head)"/><line x1="575" y1="115" x2="156" y2="115" marker-end="url(#fe-head)"/>
<line x1="150" y1="155" x2="569" y2="155" marker-end="url(#fe-head)"/><line x1="575" y1="185" x2="156" y2="185" marker-end="url(#fe-head)"/>
<line x1="150" y1="265" x2="994" y2="265" marker-end="url(#fe-head)"/><line x1="1000" y1="295" x2="156" y2="295" marker-end="url(#fe-head)"/>
</g>
<rect x="330" y="243" width="490" height="20" fill="#fff"/>
<g font-size="16" class="mono" font-weight="700" text-anchor="middle">
<text x="362" y="78">GET /index.html</text><text x="362" y="108">200 · HTML</text>
<text x="362" y="148">GET /style.css · GET /app.js</text><text x="362" y="178">200 · CSS y JavaScript</text>
<text x="575" y="258">fetch: GET /v1/dispositivos/inv-01/lecturas</text><text x="575" y="288">200 · JSON</text>
</g>
<g stroke="#000" stroke-width="2" fill="#fcc20f"><rect x="20" y="202" width="340" height="34"/><rect x="20" y="306" width="340" height="34"/></g>
<g font-size="15" font-weight="700"><text x="34" y="225">CONSTRUYE EL DOM · EJECUTA app.js</text><text x="34" y="329">JAVASCRIPT ACTUALIZA EL DOM</text></g>
</svg>

<p class="fuente">El servidor web y la API pueden ser el mismo programa o dos distintos; esa decisión importa para CORS (final de esta clase). Proceso del navegador según MDN, <em>How browsers work</em>.</p>

---

# HTML y el DOM

<div class="cols-2" style="grid-template-columns: 1.35fr 1fr">
<div class="code-sm">

```html
<header>
  <h1>Invernadero 1</h1>
  <span id="estado">En línea</span>
</header>
<main>
  <section class="tarjeta">
    <h2>Temperatura</h2>
    <div class="valor" id="temp">--</div>
  </section>
  <button id="btn">Encender</button>
  <canvas id="grafico"></canvas>
</main>
<script src="app.js"></script>
```

</div>
<figure>
<img src="./dom-model.png" alt="Árbol DOM: document, html, head, body y sus elementos y textos" class="plain" style="max-height: 290px">
<figcaption>El DOM: el documento como árbol de nodos. Imagen: Birger Eriksson, Wikimedia Commons, CC BY-SA 3.0.</figcaption>
</figure>
</div>

El navegador convierte el HTML en un árbol de objetos, el **DOM**. JavaScript modifica ese árbol, no el archivo.

---

# CSS: selectores y modelo de caja

<div class="cols-2">
<div class="code-sm">

```css
.tarjeta {                 /* clase */
  padding: 16px;
  border: 2px solid #ccc;
  margin: 8px;
  box-sizing: border-box;
}
#temp { font-size: 2.4rem; }  /* id */
button { min-height: 48px; }  /* tipo */
```

Sin `border-box`, una tarjeta con `width: 300px` ocupa 300 + 2×16 + 2×2 = **336 px**, más el margen.

</div>
<figure>
<img src="./box-model.png" alt="Modelo de caja: contenido, relleno, borde y margen" class="plain" style="max-height: 290px">
<figcaption>Modelo de caja. Imagen: Charles Calvert, Wikimedia Commons, CC BY-SA 4.0.</figcaption>
</figure>
</div>

---

# Consultar la API con fetch

<div class="code-sm">

```js
const API = "http://192.168.1.50:8000/v1/dispositivos/inv-01";

async function cargarLecturas() {
  const r = await fetch(`${API}/lecturas?limite=12`);
  const lecturas = await r.json();               // la más reciente primero
  const ultima = lecturas[0];
  document.querySelector("#temp").textContent = `${ultima.temp_c} °C`;
  document.querySelector("#hum").textContent = `${ultima.hum_pct} %`;
}

cargarLecturas();
```

</div>

- `fetch` devuelve una promesa; `await` espera la respuesta sin congelar la página.
- `textContent` inserta el dato como texto. Con `innerHTML`, un dato malicioso podría inyectar HTML.

---

# fetch no falla con un 404

<svg class="diagram" viewBox="0 0 1150 170" style="max-height: 170px" role="img" aria-label="Si no llega respuesta HTTP la promesa se rechaza; si llega cualquier respuesta, incluso 404 o 500, la promesa se cumple y hay que revisar r.ok">
<defs><marker id="fx-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g stroke="#000" stroke-width="2"><rect x="10" y="55" width="200" height="60" fill="#c0d4a7"/><polygon points="420,20 560,85 420,150 280,85" fill="#fcc20f"/><rect x="680" y="10" width="460" height="64" fill="#d77a7a"/><rect x="680" y="96" width="460" height="64" fill="#9ab6c8"/></g>
<g font-size="17" font-weight="700"><text x="110" y="92" text-anchor="middle" class="mono">fetch(url)</text><text x="420" y="80" text-anchor="middle">¿LLEGÓ UNA</text><text x="420" y="102" text-anchor="middle">RESPUESTA?</text>
<text x="696" y="36">NO: la promesa se rechaza → catch</text><text x="696" y="122">SÍ: la promesa se cumple, incluso con 404 o 500</text></g>
<g font-size="15"><text x="696" y="60">sin red, DNS, CORS bloqueado, tiempo agotado</text><text x="696" y="146">hay que revisar r.ok (verdadero solo para 200 a 299)</text></g>
<g stroke="#000" stroke-width="4" fill="none"><line x1="210" y1="85" x2="273" y2="85" marker-end="url(#fx-head)"/><polyline points="560,85 620,85 620,42 673,42" marker-end="url(#fx-head)"/><polyline points="620,85 620,128 673,128" marker-end="url(#fx-head)"/></g>
</svg>

<div class="code-sm">

```js
try {
  const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  mostrar(await r.json());
} catch (e) {
  document.querySelector("#estado").textContent = "Sin conexión con el servidor";
}
```

</div>

<p class="fuente">MDN, <em>Using the Fetch API</em> y <em>Response.ok</em>.</p>

---

# Enviar una orden

<div class="code-sm">

```js
const boton = document.querySelector("#btn");
const nota = document.querySelector("#nota");

boton.addEventListener("click", async () => {
  boton.disabled = true;                          // evita dobles pulsaciones
  const r = await fetch(`${API}/actuador`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: "on" }),
  });
  if (r.status === 202) nota.textContent = "Orden enviada; esperando al ESP32";
  boton.disabled = false;
});
```

</div>

La API responde 202: la orden quedó registrada, pero el actuador cambia después (tema 2.6).

---

# Actualizar cada N segundos

<div class="cols-2" style="grid-template-columns: 1.3fr 1fr">
<div class="code-sm">

```js
setInterval(() => {
  // no consultar si la pestaña está oculta
  if (document.visibilityState === "visible") {
    cargarLecturas();
  }
}, 5000);
```

</div>
<div class="card tint-peach"><b>El costo del polling</b>
<p>Cada 5 s son 720 peticiones por hora por pestaña abierta.</p>
<p>Con 10 personas mirando: 7200 por hora, aunque los datos no cambien.</p>
</div>
</div>

> «Un dashboard no necesita consultar al servidor cuando la página no está visible». MDN, *Page Visibility API*.

En la Unidad 3, el modelo publicador/suscriptor (tema 3.6) evita estas consultas repetidas.

---

# Gráficos con Chart.js

<div class="cols-2" style="grid-template-columns: 1.15fr 1fr">
<div class="code-sm">

```js
const grafico = new Chart("grafico", {
  type: "line",
  data: { labels: [],
          datasets: [{ data: [] }] },
});

function actualizarGrafico(lecturas) {
  const orden = lecturas.toReversed();
  grafico.data.labels = orden.map((l) =>
    new Date(l.ts * 1000)
      .toLocaleTimeString("es-EC")
      .slice(0, 5));
  grafico.data.datasets[0].data =
    orden.map((l) => l.temp_c);
  grafico.update();
}
```

</div>
<div>
<figure>
<img src="./grafico-chartjs.png" alt="Gráfico de líneas de temperatura entre 13:05 y 14:00" style="max-height: 230px">
<figcaption>Chart.js 4.5 con datos simulados. Captura: elaboración propia.</figcaption>
</figure>

<div class="small">

- `ts` está en segundos UTC; `Date` usa milisegundos y la zona horaria del navegador.
- `update()` vuelve a dibujar con los datos nuevos.

</div>
</div>
</div>

---

# Mismo origen

Página abierta en `http://127.0.0.1:5500/index.html` (por ejemplo, con Live Server):

<div class="compact">

| URL que pide `fetch` | ¿Mismo origen? | Motivo |
|---|---|---|
| `http://127.0.0.1:5500/datos.json` | Sí | Mismo esquema, host y puerto |
| `http://127.0.0.1:8000/v1/dispositivos` | No | Puerto distinto |
| `http://localhost:5500/datos.json` | No | Host distinto, aunque sea la misma máquina |
| `https://127.0.0.1:5500/datos.json` | No | Esquema distinto |

</div>

**Origen** = esquema + host + puerto. Por seguridad, el navegador no deja que JavaScript lea una respuesta de otro origen, salvo que el servidor lo permita con **CORS**.

<p class="fuente">MDN, <em>Same-origin policy</em> y <em>Cross-Origin Resource Sharing (CORS)</em>.</p>

---

# CORS y la verificación previa

<div class="cols-2">
<svg class="diagram" viewBox="0 0 560 320" role="img" aria-label="El navegador envía OPTIONS, la API responde con los encabezados Access-Control, y después el navegador envía el PUT">
<defs><marker id="co-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<rect x="0" y="56" width="560" height="134" fill="#a5b8c0" opacity="0.45"/>
<text x="10" y="76" font-size="15" font-weight="700">VERIFICACIÓN PREVIA (PREFLIGHT)</text>
<g stroke="#000" stroke-width="2"><rect x="10" y="6" width="170" height="40" fill="#c0d4a7"/><rect x="380" y="6" width="170" height="40" fill="#d77a7a"/></g>
<g font-size="16" font-weight="700" text-anchor="middle"><text x="95" y="32">PÁGINA · :5500</text><text x="465" y="32">API · :8000</text></g>
<g stroke="#000" stroke-width="2" stroke-dasharray="6 6"><line x1="95" y1="46" x2="95" y2="318"/><line x1="465" y1="46" x2="465" y2="318"/></g>
<g stroke="#000" stroke-width="3"><line x1="95" y1="108" x2="459" y2="108" marker-end="url(#co-head)"/><line x1="465" y1="164" x2="101" y2="164" marker-end="url(#co-head)"/><line x1="95" y1="232" x2="459" y2="232" marker-end="url(#co-head)"/><line x1="465" y1="290" x2="101" y2="290" marker-end="url(#co-head)"/></g>
<g font-size="17" class="mono" font-weight="700" text-anchor="middle"><text x="280" y="100">OPTIONS /v1/…/actuador</text><text x="280" y="156">200 OK</text><text x="280" y="224">PUT /v1/…/actuador</text><text x="280" y="282">202 Accepted</text></g>
<g font-size="15" class="mono" text-anchor="middle"><text x="280" y="128">Access-Control-Request-Method: PUT</text><text x="280" y="184">Access-Control-Allow-Origin: …:5500</text><text x="280" y="252">Origin: http://127.0.0.1:5500</text><text x="280" y="310">Access-Control-Allow-Origin: …:5500</text></g>
</svg>
<div class="code-sm">

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["GET", "PUT"],
    allow_headers=["Content-Type"],
)
```

<div class="small">

- Un PUT con JSON desde otro origen provoca un `OPTIONS` previo.
- Alternativa: servir el dashboard desde la misma FastAPI; mismo origen, sin CORS.
- CORS lo aplica el navegador; curl y el ESP32 lo ignoran. No es autenticación (tema 2.8).

</div>
</div>
</div>

--

## Cuándo hay verificación previa

<figure>
<img src="./cors-preflight-flowchart.png" alt="Diagrama de flujo: según el método, el tipo de contenido y los encabezados, la petición es simple o necesita OPTIONS" class="plain" style="max-height: 400px">
<figcaption>Petición simple o con verificación previa. Imagen: Bluesmoon, Wikimedia Commons, CC BY-SA 4.0. El diagrama dice XHR; la lógica es la misma con <code>fetch</code>.</figcaption>
</figure>

---

# Ejercicio · Errores en fetch

<div class="code-sm">

```js
async function cargar() {
  const r = fetch(`${API}/lecturas`);                            // 1
  const datos = r.json();                                         // 2
  document.querySelector("#temp").innerHTML = datos[0].temp_c;    // 3
}
setInterval(cargar(), 5000);                                      // 4
```

</div>

El dashboard está en `http://127.0.0.1:5500` y la API en `http://127.0.0.1:8000`, sin CORS configurado. Encuentre los cuatro errores del código y explique qué pasará aunque se corrijan.

--

## Solución

| # | Error | Corrección |
|---|---|---|
| 1 | Falta `await`: `r` es una promesa | `const r = await fetch(…)`, y revisar `r.ok` |
| 2 | Falta `await` en `r.json()` | `const datos = await r.json()` |
| 3 | `innerHTML` con un dato externo | `textContent` |
| 4 | Pasa el resultado de `cargar()`, no la función | `setInterval(cargar, 5000)` |

Aunque se corrijan, el navegador bloquea la respuesta: el origen es distinto (otro puerto) y la API no envía `Access-Control-Allow-Origin`.

---

# Desafío del proyecto

<div class="cols-2">
<div class="ribbon tint-lime">
<h3>Para la próxima clase</h3>
<ol>
<li>Bocetar el dashboard del proyecto: qué datos muestra y qué controles tiene.</li>
<li>Anotar qué endpoint de la API alimenta cada elemento.</li>
<li>Decidir cada cuánto se actualiza y justificarlo.</li>
</ol>
</div>
<div class="card tint-sky"><b>Preguntas para discutir</b>
<p>Si el ESP32 envía cada 10 s, ¿tiene sentido actualizar el dashboard cada segundo?</p>
<p>¿Qué debe mostrar el dashboard si la API no responde?</p>
<p>¿El dashboard estará en el mismo origen que la API o necesitará CORS?</p>
</div>
</div>

---

# Ideas clave

- HTML estructura, CSS presenta y JavaScript actúa: pide datos a la API y actualiza el DOM.
- `fetch` solo falla por errores de red; un 404 o un 500 llegan como respuesta.
- Origen = esquema + host + puerto. Si el dashboard está en otro origen, la API debe permitirlo con CORS.

<div class="cta-red">Revise siempre r.ok antes de usar los datos de una respuesta.</div>

---

# Referencias

<div class="small">

- MDN Web Docs. *What is JavaScript?*, *Document Object Model*, *The box model*, *How browsers work*. [developer.mozilla.org](https://developer.mozilla.org/)
- MDN Web Docs. *Using the Fetch API*, *Response.ok*, *Page Visibility API*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- MDN Web Docs. *Same-origin policy* y *Cross-Origin Resource Sharing (CORS)*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- Chart.js. *Documentación 4.x*. [chartjs.org/docs](https://www.chartjs.org/docs/latest/)
- FastAPI. *CORS (Cross-Origin Resource Sharing)*. [fastapi.tiangolo.com](https://fastapi.tiangolo.com/tutorial/cors/)

</div>

<p class="fuente">Imágenes: pastel HTML/CSS/JS, Mozilla Contributors, CC BY-SA 2.5; <em>DOM-model</em>, Birger Eriksson, CC BY-SA 3.0; <em>Box-model</em>, Charles Calvert, CC BY-SA 4.0; diagrama de CORS, Bluesmoon, CC BY-SA 4.0 (Wikimedia Commons). Capturas y diagramas: elaboración propia.</p>
