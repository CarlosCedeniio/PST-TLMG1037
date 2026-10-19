---
titulo: Diseño responsive y control móvil
subtitulo: Adaptar la interfaz al celular y controlar un actuador a distancia con información confiable
publicado: 2026-10-26
---

# Objetivo de la clase

<div class="ribbon tint-salmon">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Explicar los principios del diseño responsive.</li>
<li>Adaptar una interfaz al celular con la etiqueta viewport, Grid, Flexbox y media queries.</li>
<li>Dimensionar los controles táctiles según WCAG 2.2 y las guías de cada plataforma.</li>
<li>Diseñar el control remoto de un actuador con estado deseado, estado reportado y retroalimentación.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>Por qué diseñar para el celular</li>
<li>Diseño responsive y la etiqueta viewport</li>
<li>Grid, Flexbox y media queries</li>
<li>Controles táctiles</li>
<li>Estado deseado y estado reportado</li>
<li>El ciclo de una orden</li>
<li>Probar en el celular</li>
</ol>

---

# Por qué diseñar para el celular

<svg class="diagram" viewBox="0 0 1150 250" style="max-height: 250px" role="img" aria-label="Tráfico web por tipo de dispositivo en septiembre de 2026. Mundo: móvil 59,0 %, escritorio 39,3 %, tablet 1,8 %. Ecuador: móvil 71,9 %, escritorio 27,7 %, tablet 0,4 %">
<g font-size="17" font-weight="700">
<rect x="170" y="6" width="22" height="22" fill="#d77a7a" stroke="#000" stroke-width="2"/><text x="200" y="24">Móvil</text>
<rect x="290" y="6" width="22" height="22" fill="#8c9ae0" stroke="#000" stroke-width="2"/><text x="320" y="24">Escritorio</text>
<rect x="450" y="6" width="22" height="22" fill="#8e8a25" stroke="#000" stroke-width="2"/><text x="480" y="24">Tablet</text>
</g>
<g font-size="20" font-weight="700"><text x="0" y="92">MUNDO</text><text x="0" y="192">ECUADOR</text></g>
<g stroke="#000" stroke-width="2">
<rect x="170" y="55" width="564" height="64" fill="#d77a7a"/><rect x="738" y="55" width="373" height="64" fill="#8c9ae0"/><rect x="1115" y="55" width="15" height="64" fill="#8e8a25"/>
<rect x="170" y="155" width="688" height="64" fill="#d77a7a"/><rect x="862" y="155" width="263" height="64" fill="#8c9ae0"/><rect x="1129" y="155" width="3" height="64" fill="#8e8a25"/>
</g>
<g font-weight="700"><text x="188" y="97" font-size="30">59,0 %</text><text x="756" y="97" font-size="24">39,3 %</text>
<text x="188" y="198" font-size="34">71,9 %</text><text x="880" y="197" font-size="24">27,7 %</text></g>
<text x="0" y="246" font-size="15">Tablet: 1,8 % en el mundo y 0,4 % en Ecuador.</text>
</svg>

En Ecuador, casi tres de cada cuatro visitas web se hacen desde un celular. El dashboard del proyecto se usará, sobre todo, en una pantalla pequeña y táctil.

<p class="fuente">StatCounter Global Stats, <em>Desktop vs Mobile vs Tablet Market Share</em>, septiembre de 2026 (mundo y Ecuador). Las cifras cambian cada mes.</p>

---

# Diseño responsive

<figure>
<img src="./responsive-devices.png" alt="La misma página adaptada a monitor, portátil, tablet y teléfono, con rangos de ancho 1024+, 1023 a 768 y 767 a 320" class="plain" style="max-height: 210px">
<figcaption>Imagen: Muhammad Rafizeldi, Wikimedia Commons, CC BY-SA 3.0.</figcaption>
</figure>

<div class="cols-3">
<div class="card tint-sky"><b>Cuadrícula fluida</b><p>Anchos relativos (<code>%</code>, <code>fr</code>) en lugar de píxeles fijos.</p></div>
<div class="card tint-lime"><b>Imágenes flexibles</b><p><code>max-width: 100%</code>: nunca más anchas que su contenedor.</p></div>
<div class="card tint-peach"><b>Media queries</b><p>Reglas que se aplican según el ancho de la pantalla.</p></div>
</div>

<p class="fuente">Marcotte, E. <em>Responsive Web Design</em>. A List Apart, n.º 306, 25 de mayo de 2010.</p>

---

# La etiqueta viewport

<div class="cols-3" style="grid-template-columns: 1fr 1fr 1.6fr">
<figure>
<img src="./dashboard-movil-sin-viewport.png" alt="Celular mostrando el dashboard diminuto, con el diseño de escritorio" style="max-height: 360px">
<figcaption>Sin la etiqueta</figcaption>
</figure>
<figure>
<img src="./dashboard-movil.png" alt="Celular mostrando el dashboard en una columna legible" style="max-height: 360px">
<figcaption>Con la etiqueta</figcaption>
</figure>
<div>

```html
<meta name="viewport"
      content="width=device-width">
```

<div class="small">

- Sin ella, el navegador móvil simula una pantalla de unos 980 px y reduce toda la página.
- Con ella, el ancho de la página es el del celular y las media queries funcionan.
- No use `user-scalable=no`: impide hacer zoom.

</div>
</div>
</div>

<p class="fuente">El mismo dashboard en un celular de 390 px emulado con Chromium. Capturas: elaboración propia. MDN, <em>Viewport meta tag</em>.</p>

---

# Grid y Flexbox

<svg class="diagram" viewBox="0 0 1150 270" style="max-height: 270px" role="img" aria-label="La misma cuadrícula muestra tres columnas a 1100 px, dos a 700 px y una en un celular de 390 px">
<g stroke="#000" stroke-width="2">
<rect x="10" y="10" width="500" height="220" fill="#fff"/><rect x="10" y="10" width="500" height="22" fill="#000"/>
<rect x="22" y="44" width="150" height="62" fill="#d77a7a"/><rect x="185" y="44" width="150" height="62" fill="#9ab6c8"/><rect x="348" y="44" width="150" height="62" fill="#c0d4a7"/>
<rect x="22" y="118" width="476" height="100" fill="#fff"/>
<rect x="560" y="10" width="290" height="220" fill="#fff"/><rect x="560" y="10" width="290" height="22" fill="#000"/>
<rect x="572" y="44" width="127" height="56" fill="#d77a7a"/><rect x="711" y="44" width="127" height="56" fill="#9ab6c8"/><rect x="572" y="110" width="127" height="56" fill="#c0d4a7"/>
<rect x="572" y="176" width="266" height="44" fill="#fff"/>
<rect x="900" y="0" width="150" height="240" fill="#fff"/><rect x="900" y="0" width="150" height="20" fill="#000"/>
<rect x="910" y="30" width="130" height="38" fill="#d77a7a"/><rect x="910" y="76" width="130" height="38" fill="#9ab6c8"/><rect x="910" y="122" width="130" height="38" fill="#c0d4a7"/>
<rect x="910" y="168" width="130" height="62" fill="#fff"/>
</g>
<g fill="none" stroke="#d9534f" stroke-width="3"><polyline points="34,200 120,180 210,186 300,160 390,150 486,136"/><polyline points="582,212 650,204 720,198 790,190 828,186"/><polyline points="918,218 950,206 985,204 1030,188"/></g>
<g font-size="17" font-weight="700" text-anchor="middle"><text x="260" y="262">1100 px · 3 columnas</text><text x="705" y="262">700 px · 2 columnas</text><text x="975" y="262">390 px · 1 columna</text></g>
</svg>

<div class="cols-2">
<div class="code-sm">

```css
.tarjetas {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    repeat(auto-fit, minmax(16rem, 1fr));
}
```

</div>
<div class="small">

- **Grid** organiza en dos dimensiones: entran tantas columnas de al menos 16 rem como quepan.
- **Flexbox** organiza en una dimensión, por ejemplo la barra superior con `flex-wrap: wrap`.
- Unidades relativas: `rem` (tamaño de letra base), `%`, `fr` (fracción del espacio libre).

</div>
</div>

---

# Media queries y móvil primero

<svg class="diagram" viewBox="0 0 1150 120" style="max-height: 120px" role="img" aria-label="Regla de anchos con los puntos de corte de Bootstrap: 576, 768, 992, 1200 y 1400 píxeles">
<g stroke="#000" stroke-width="2">
<rect x="10" y="30" width="461" height="40" fill="#d77a7a"/><rect x="471" y="30" width="153" height="40" fill="#e6915d"/><rect x="624" y="30" width="180" height="40" fill="#9ab6c8"/><rect x="804" y="30" width="166" height="40" fill="#c0d4a7"/><rect x="970" y="30" width="160" height="40" fill="#8c9ae0"/>
</g>
<g font-size="16" font-weight="700"><text x="20" y="56">celular (base)</text><text x="634" y="56">tablet</text><text x="814" y="56">portátil</text><text x="980" y="56">escritorio</text></g>
<g font-size="15" class="mono" font-weight="700" text-anchor="middle"><text x="471" y="20">576</text><text x="624" y="20">768</text><text x="804" y="20">992</text><text x="970" y="20">1200</text><text x="1130" y="20" text-anchor="end">1400 px</text></g>
<text x="10" y="100" font-size="15">Escala: 0 a 1400 px. Puntos de corte de Bootstrap 5.3, como referencia; no hay un estándar.</text>
</svg>

<div class="cols-2">
<div class="code-sm">

```css
/* Base: celular, una columna */
.layout { display: grid; gap: 1rem; }

/* Desde 48rem (768 px): dos columnas */
@media (min-width: 48rem) {
  .layout {
    grid-template-columns: 2fr 1fr;
  }
}
```

</div>
<div class="small">

- **Móvil primero:** se escribe la versión para pantalla pequeña y se agregan reglas con `min-width` a medida que hay espacio.
- La versión móvil es la base, no un caso especial que se corrige al final.
- Los puntos de corte se eligen donde el diseño se rompe, no por modelo de teléfono.

</div>
</div>

---

# Controles táctiles

<svg class="diagram" viewBox="0 0 1150 250" style="max-height: 250px" role="img" aria-label="Cuadrados a escala tres a uno de 20, 24, 44 y 48 píxeles: 20 no cumple, 24 es el mínimo de WCAG 2.2 AA, 44 el de WCAG AAA y Apple, 48 el de Android">
<g stroke="#000" stroke-width="2">
<rect x="40" y="114" width="60" height="60" fill="#fff" stroke="#e91d2a" stroke-dasharray="8 6" stroke-width="3"/>
<rect x="230" y="102" width="72" height="72" fill="#e6915d"/>
<rect x="450" y="42" width="132" height="132" fill="#c0d4a7"/>
<rect x="760" y="30" width="144" height="144" fill="#9ab6c8"/>
</g>
<g font-size="22" font-weight="700" text-anchor="middle"><text x="70" y="210">20 px</text><text x="266" y="210">24 px</text><text x="516" y="210">44 px</text><text x="832" y="210">48 dp</text></g>
<g font-size="16" text-anchor="middle"><text x="70" y="236" fill="#e91d2a" font-weight="700">No cumple</text><text x="266" y="236">WCAG 2.2 AA (2.5.8)</text><text x="516" y="236">WCAG AAA (2.5.5) · Apple</text><text x="832" y="236">Android · Material</text></g>
<text x="1140" y="236" font-size="15" text-anchor="end">Escala 3:1</text>
</svg>

<div class="small">

- 1 pt de Apple y 1 dp de Android equivalen, aproximadamente, a 1 px de CSS en el navegador del celular.
- Android recomienda además 8 dp de separación entre controles; 48 dp son unos 9 mm, el ancho de una yema.
- El botón del dashboard de referencia mide 48 px de alto y ocupa todo el ancho de la tarjeta.

</div>

<p class="fuente">W3C, WCAG 2.2, criterios 2.5.8 y 2.5.5; Apple, <em>Human Interface Guidelines: Accessibility</em>; Android Developers, <em>Make apps more accessible</em>.</p>

---

# Deseado y reportado

<svg class="diagram" viewBox="0 0 1150 250" style="max-height: 250px" role="img" aria-label="El dashboard escribe el estado deseado, el ESP32 escribe el estado reportado, y la diferencia entre ambos es la orden pendiente">
<defs><marker id="sh-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g stroke="#000" stroke-width="2">
<rect x="20" y="70" width="230" height="100" fill="#c0d4a7"/><rect x="900" y="70" width="230" height="100" fill="#e6915d"/>
<rect x="400" y="10" width="350" height="230" fill="#fff" stroke-width="3"/>
<rect x="420" y="60" width="310" height="44" fill="#c0d4a7"/><rect x="420" y="116" width="310" height="44" fill="#e6915d"/><rect x="420" y="172" width="310" height="52" fill="#fcc20f"/>
</g>
<g font-size="19" font-weight="700"><text x="135" y="110" text-anchor="middle">DASHBOARD</text><text x="1015" y="110" text-anchor="middle">ESP32</text><text x="575" y="42" text-anchor="middle">ESTADO EN LA API</text></g>
<g font-size="16"><text x="135" y="138" text-anchor="middle">escribe lo deseado</text><text x="1015" y="138" text-anchor="middle">escribe lo reportado</text><text x="1015" y="158" text-anchor="middle">y recibe el delta</text></g>
<g font-size="18" class="mono" font-weight="700"><text x="436" y="89">deseado:   "on"</text><text x="436" y="145">reportado: "off"</text><text x="436" y="196">delta:     "on"</text></g>
<text x="436" y="216" font-size="15">diferencia = orden pendiente</text>
<g stroke="#000" stroke-width="4"><line x1="250" y1="90" x2="413" y2="82" marker-end="url(#sh-head)"/><line x1="900" y1="120" x2="737" y2="138" marker-end="url(#sh-head)"/><line x1="737" y1="198" x2="893" y2="155" marker-end="url(#sh-head)"/></g>
</svg>

- La interfaz muestra el estado **reportado**: es lo que el actuador hace en realidad.
- Mientras haya delta, la orden se muestra como pendiente.
- Es el mismo patrón de los temas 2.2 y 2.3: `PUT /actuador` fija lo deseado; cada lectura del ESP32 trae lo reportado.

<p class="fuente">Patrón usado por AWS IoT Device Shadow: secciones <em>desired</em>, <em>reported</em> y <em>delta</em>.</p>

---

# El ciclo de una orden

<svg class="diagram" viewBox="0 0 1150 300" style="max-height: 300px" role="img" aria-label="Estados del botón: inactivo, enviando, pendiente, confirmado; con salidas a error y tiempo agotado">
<defs><marker id="st-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g stroke="#000" stroke-width="2">
<rect x="10" y="110" width="200" height="70" fill="#a5b8c0"/><rect x="310" y="110" width="200" height="70" fill="#9ab6c8"/><rect x="610" y="110" width="200" height="70" fill="#fcc20f"/>
<rect x="930" y="20" width="210" height="70" fill="#c0d4a7"/><rect x="930" y="200" width="210" height="70" fill="#d77a7a"/><rect x="310" y="225" width="200" height="70" fill="#d77a7a"/>
</g>
<g font-size="18" font-weight="700"><text x="26" y="140">INACTIVO</text><text x="326" y="140">ENVIANDO</text><text x="626" y="140">PENDIENTE</text><text x="946" y="50">CONFIRMADO</text><text x="946" y="230">TIEMPO AGOTADO</text><text x="326" y="255">ERROR</text></g>
<g font-size="15"><text x="26" y="164">botón habilitado</text><text x="326" y="164">botón deshabilitado</text><text x="626" y="164">esperando al ESP32</text><text x="946" y="74">reportado = deseado</text><text x="946" y="254">reintentar o avisar</text><text x="326" y="279">mostrar el motivo</text></g>
<g stroke="#000" stroke-width="3" fill="none">
<line x1="210" y1="145" x2="303" y2="145" marker-end="url(#st-head)"/>
<line x1="510" y1="145" x2="603" y2="145" marker-end="url(#st-head)"/>
<polyline points="810,130 870,130 870,55 923,55" marker-end="url(#st-head)"/>
<polyline points="810,160 870,160 870,235 923,235" marker-end="url(#st-head)"/>
<line x1="410" y1="180" x2="410" y2="218" marker-end="url(#st-head)"/>
<polyline points="1035,20 1035,8 110,8 110,103" marker-end="url(#st-head)"/>
</g>
<g font-size="15" font-weight="700"><text x="216" y="136">toque</text><text x="522" y="136" class="mono">202</text><text x="880" y="122">ESP32</text><text x="880" y="196">pasan 3T s</text><text x="420" y="206">sin red · 4xx · 5xx</text><text x="560" y="26">vuelve a inactivo</text></g>
</svg>

Con consultas cada T segundos, la orden tarda en promedio T/2 en llegar al ESP32, y como máximo T, más el tiempo de red.

---

# Retroalimentación

<div class="cols-2" style="grid-template-columns: 1fr 2fr">
<figure>
<img src="./dashboard-movil.png" alt="Dashboard móvil con estado de conexión, temperatura, humedad y tarjeta del ventilador con botón" style="max-height: 400px">
<figcaption>Captura: elaboración propia.</figcaption>
</figure>
<div class="small">

<ol class="steps">
<li><strong>Conexión:</strong> «En línea · hace 4 s». Se calcula con la hora de la última lectura; si pasan unas 3 veces el intervalo de envío, se muestra «Sin conexión».</li>
<li><strong>Estado real:</strong> «Apagado» es lo que reporta el ESP32, no lo que se pidió.</li>
<li><strong>Botón:</strong> 48 px de alto; se deshabilita mientras la orden está en curso.</li>
<li><strong>Aviso accesible:</strong> el texto bajo el botón usa <code>aria-live="polite"</code> para que un lector de pantalla anuncie los cambios.</li>
</ol>

</div>
</div>

<p class="fuente">MDN: elemento <code>&lt;button&gt;</code> (atributo <code>disabled</code>) y atributo <code>aria-live</code>.</p>

---

# Probar en el celular

<div class="cols-2">
<div>

<ol class="steps">
<li>En el navegador del PC: herramientas de desarrollo, modo dispositivo. Es una aproximación, no un celular real.</li>
<li>Servidor con <code>--host 0.0.0.0</code> y el celular en la misma red Wi-Fi.</li>
<li>En el celular: <code>http://192.168.1.50:8000</code>, la IP del PC (tema 2.3).</li>
<li>Probar con el pulgar: tamaños, desplazamiento y lectura bajo el sol.</li>
</ol>

</div>
<div class="card tint-peach"><b>Instalar como aplicación</b>
<p>Una aplicación web progresiva (PWA) se agrega a la pantalla de inicio con un archivo <code>manifest.json</code>.</p>
<p>Para instalarse debe servirse por HTTPS (o desde <code>localhost</code>): desde <code>http://192.168.1.50</code> no se puede. En el tema 2.7 el proyecto se publica con HTTPS.</p>
</div>
</div>

<p class="fuente">Chrome DevTools, <em>Device mode</em>; MDN, <em>Making PWAs installable</em>.</p>

---

# Ejercicio · Revisar una pantalla

<div class="cols-2" style="grid-template-columns: 1fr 1.4fr">
<svg class="diagram" viewBox="0 0 400 420" style="max-height: 420px" role="img" aria-label="Maqueta de un dashboard móvil con problemas de diseño">
<rect x="5" y="5" width="390" height="410" fill="#fff" stroke="#000" stroke-width="3"/>
<rect x="5" y="5" width="390" height="44" fill="#1d2327"/>
<text x="20" y="34" font-size="18" font-weight="700" fill="#fff">INVERNADERO</text>
<rect x="20" y="66" width="360" height="80" fill="#eef1f3" stroke="#000"/>
<text x="36" y="116" font-size="28" font-weight="700">Temp: 31.4</text>
<rect x="20" y="162" width="360" height="130" fill="#eef1f3" stroke="#000"/>
<text x="36" y="200" font-size="15" font-weight="700">VENTILADOR</text>
<text x="36" y="238" font-size="28" font-weight="700" fill="#2e7d32">ENCENDIDO</text>
<rect x="36" y="254" width="66" height="22" fill="#0b6bcb"/>
<text x="69" y="270" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">Alternar</text>
<g font-size="22" font-weight="700" fill="#e91d2a"><text x="352" y="118">1</text><text x="352" y="240">2</text><text x="116" y="274">3</text></g>
</svg>
<div>

Datos del caso:

- El usuario pulsó «Alternar» hace 2 s.
- El ESP32 consulta la API cada 10 s y todavía no recibe la orden.
- La API dejó de recibir lecturas hace 5 minutos.

Encuentre al menos cinco problemas de diseño. Los números marcan algunas zonas, no todos los problemas.

</div>
</div>

--

## Solución

<div class="compact">

| Problema | Corrección |
|---|---|
| «31.4» sin unidad ni hora de la lectura | «31.4 °C · 14:02» |
| «ENCENDIDO» muestra lo pedido, no lo que hizo el ESP32 | Mostrar el estado reportado y «Pendiente» mientras haya delta |
| Botón de 22 px de alto | Al menos 44 px (24 px como mínimo absoluto) |
| «Alternar»: un doble toque cambia el estado dos veces | Botones con el estado explícito (`PUT {"estado": "on"}`) |
| El botón sigue activo mientras la orden viaja | Deshabilitarlo y mostrar «Enviando…» |
| No avisa que no hay lecturas desde hace 5 minutos | Indicador «Sin conexión · última lectura 13:57» |

</div>

---

# Desafío del proyecto

<div class="cols-2">
<div class="ribbon tint-lime">
<h3>Para la próxima clase</h3>
<ol>
<li>Dibujar el wireframe móvil del proyecto (en papel o en una herramienta de diseño).</li>
<li>Incluir el estado reportado, la última conexión y controles de al menos 44 px.</li>
<li>Dibujar los estados del botón: enviando, pendiente, confirmado y error.</li>
</ol>
</div>
<div class="card tint-sky"><b>Preguntas para discutir</b>
<p>¿Qué ve el usuario si el ESP32 está desconectado?</p>
<p>¿Qué latencia es aceptable para el actuador del proyecto?</p>
<p>¿Qué acción debería pedir confirmación antes de enviarse?</p>
</div>
</div>

---

# Ideas clave

- Diseño responsive: cuadrícula fluida, imágenes flexibles y media queries; sin la etiqueta viewport no funciona en el celular.
- Controles táctiles de al menos 44 px; 24 px es el mínimo absoluto de WCAG 2.2.
- La pantalla muestra el estado reportado por el dispositivo; la diferencia con el deseado es una orden pendiente.

<div class="cta-red">El botón expresa lo que el usuario pidió; la pantalla debe mostrar lo que el dispositivo hizo.</div>

---

# Referencias

<div class="small">

- Marcotte, E. *Responsive Web Design*. A List Apart, n.º 306, 2010. [alistapart.com](https://alistapart.com/article/responsive-web-design/)
- MDN Web Docs. *Viewport meta tag*, *Using media queries*, *Grids*, *Flexbox*, *aria-live*. [developer.mozilla.org](https://developer.mozilla.org/)
- W3C. *Understanding SC 2.5.8 Target Size (Minimum)* y *2.5.5 Target Size (Enhanced)*, WCAG 2.2. [w3.org/WAI](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Apple. *Human Interface Guidelines: Accessibility*. Android Developers. *Make apps more accessible*.
- AWS. *IoT Device Shadow service documents*. [docs.aws.amazon.com](https://docs.aws.amazon.com/iot/latest/developerguide/device-shadow-document.html)
- StatCounter Global Stats. *Desktop vs Mobile vs Tablet Market Share*, septiembre de 2026. [gs.statcounter.com](https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/ecuador)
- Bootstrap 5.3. *Breakpoints*. [getbootstrap.com](https://getbootstrap.com/docs/5.3/layout/breakpoints/)

</div>

<p class="fuente">Imagen: <em>Responsive Web Design</em>, Muhammad Rafizeldi, Wikimedia Commons, CC BY-SA 3.0. Capturas y diagramas: elaboración propia.</p>
