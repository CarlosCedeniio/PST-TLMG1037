---
titulo: "Diseño de APIs REST: recursos, endpoints y respuestas"
subtitulo: Cómo definir el contrato entre el dispositivo, la interfaz y el servidor antes de programar
publicado: 2026-10-19
---

# Objetivo de la clase

<div class="ribbon tint-salmon">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Explicar qué es una API y las restricciones del estilo REST.</li>
<li>Identificar los recursos de un sistema y nombrar sus URI.</li>
<li>Asignar a cada operación el método y los códigos de estado adecuados.</li>
<li>Diseñar respuestas y mensajes de error consistentes.</li>
<li>Elegir cómo un dispositivo recibe comandos por HTTP.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>Qué es una API</li>
<li>El estilo REST</li>
<li>Recursos y URI</li>
<li>Métodos, códigos y consultas</li>
<li>Respuestas y errores</li>
<li>Comandos hacia el dispositivo</li>
<li>Documentar el contrato: OpenAPI</li>
</ol>

---

# Qué es una API

<svg class="diagram" viewBox="0 0 1150 290" style="max-height: 290px" role="img" aria-label="El ESP32, el dashboard web y una app móvil se comunican con el servidor a través del mismo contrato de API">
<defs><marker id="api-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g stroke="#000" stroke-width="2" font-weight="700">
<rect x="20" y="10" width="230" height="70" fill="#e6915d"/>
<rect x="20" y="110" width="230" height="70" fill="#c0d4a7"/>
<rect x="20" y="210" width="230" height="70" fill="#8c9ae0"/>
<rect x="420" y="30" width="330" height="230" fill="#d77a7a" stroke-width="3"/>
<rect x="900" y="90" width="230" height="110" fill="#9ab6c8"/>
</g>
<g font-weight="700" font-size="20">
<text x="135" y="52" text-anchor="middle">ESP32</text>
<text x="135" y="152" text-anchor="middle">DASHBOARD WEB</text>
<text x="135" y="252" text-anchor="middle">APP MÓVIL</text>
<text x="585" y="66" text-anchor="middle">API · CONTRATO</text>
<text x="1015" y="136" text-anchor="middle">SERVIDOR</text>
</g>
<g font-size="17" class="mono" font-weight="700">
<text x="440" y="110">GET  /v1/dispositivos</text>
<text x="440" y="140">POST /v1/…/lecturas</text>
<text x="440" y="170">PUT  /v1/…/actuador</text>
</g>
<text x="585" y="225" font-size="17" text-anchor="middle">Respuestas: código + JSON</text>
<text x="1015" y="166" font-size="17" text-anchor="middle">lógica y datos</text>
<g stroke="#000" stroke-width="4" fill="none">
<line x1="257" y1="45" x2="413" y2="100" marker-start="url(#api-head)" marker-end="url(#api-head)"/>
<line x1="257" y1="145" x2="413" y2="145" marker-start="url(#api-head)" marker-end="url(#api-head)"/>
<line x1="257" y1="245" x2="413" y2="190" marker-start="url(#api-head)" marker-end="url(#api-head)"/>
<line x1="757" y1="145" x2="893" y2="145" marker-start="url(#api-head)" marker-end="url(#api-head)"/>
</g>
</svg>

- Una **API** (interfaz de programación de aplicaciones) define qué operaciones ofrece un servidor, con qué datos se piden y qué responde.
- Es un contrato: el firmware, el dashboard y la app se programan por separado si todos respetan el mismo contrato.

---

# El estilo REST

<div class="cols-2" style="grid-template-columns: 1.75fr 1fr">
<div class="compact">

| Restricción | En el proyecto |
|---|---|
| Cliente-servidor | El ESP32 y el dashboard no tocan la base de datos: piden al servidor |
| Sin estado | Cada petición trae todo lo necesario, incluido el token |
| Caché | La respuesta indica si se puede reutilizar |
| Interfaz uniforme | Recursos con URI y métodos HTTP estándar |
| Sistema en capas | Puede haber un proxy o balanceador sin que el cliente lo note |
| Código bajo demanda | Opcional: el servidor envía código, como JavaScript |

</div>
<div>
<figure>
<img src="./roy-fielding.jpg" alt="Roy Fielding hablando en una conferencia" style="max-height: 200px">
<figcaption>Roy Fielding en OSCON 2008. Foto: Phil Whitehouse, Wikimedia Commons, CC BY 2.0.</figcaption>
</figure>

**REST** (*Representational State Transfer*) es el estilo que Fielding describió en su tesis doctoral (UC Irvine, 2000) a partir del diseño de HTTP.

</div>
</div>

--

## Modelo de madurez de Richardson

<svg class="diagram" viewBox="0 0 1150 330" style="max-height: 330px" role="img" aria-label="Escalera de cuatro niveles: un solo endpoint, recursos, métodos y códigos HTTP, hipermedia">
<g stroke="#000" stroke-width="2">
<rect x="20" y="230" width="270" height="90" fill="#a5b8c0"/>
<rect x="300" y="165" width="270" height="155" fill="#9ab6c8"/>
<rect x="580" y="100" width="270" height="220" fill="#d77a7a" stroke-width="4"/>
<rect x="860" y="35" width="270" height="285" fill="#c0d4a7"/>
</g>
<g font-size="20" font-weight="700">
<text x="36" y="260">NIVEL 0</text><text x="316" y="195">NIVEL 1</text><text x="596" y="130">NIVEL 2</text><text x="876" y="65">NIVEL 3</text>
</g>
<g font-size="17">
<text x="36" y="285" font-weight="700">Un solo endpoint</text><text x="36" y="308">acción en el cuerpo</text>
<text x="316" y="220" font-weight="700">Recursos</text><text x="316" y="243" class="mono">/dispositivos/inv-01</text>
<text x="596" y="155" font-weight="700">Métodos y códigos</text><text x="596" y="178">GET, POST, PUT, DELETE</text><text x="596" y="201">201, 404, 422</text>
<text x="876" y="90" font-weight="700">Hipermedia</text><text x="876" y="113">la respuesta incluye</text><text x="876" y="136">enlaces a lo posible</text>
</g>
<rect x="600" y="240" width="230" height="40" fill="#fcc20f" stroke="#000" stroke-width="2"/>
<text x="715" y="267" font-size="17" font-weight="700" text-anchor="middle">OBJETIVO DEL CURSO</text>
</svg>

<p class="fuente">Fowler, M. <em>Richardson Maturity Model</em>, 2010, a partir de una charla de Leonard Richardson (QCon 2008). Diagrama: elaboración propia.</p>

---

# Recursos

> «Cualquier información que se pueda nombrar puede ser un recurso». Fielding, 2000, §5.2.1.1.

<svg class="diagram" viewBox="0 0 1150 320" style="max-height: 320px" role="img" aria-label="Árbol de URI: /v1, la colección dispositivos, el ítem por id, la colección anidada de lecturas y el subrecurso actuador">
<g stroke="#000" stroke-width="2" fill="none">
<path d="M40,54 V97 H80"/><path d="M100,119 V162 H140"/><path d="M160,184 V227 H200"/><path d="M160,227 V292 H200"/>
</g>
<g stroke="#000" stroke-width="2">
<rect x="20" y="10" width="80" height="44" fill="#000"/>
<rect x="80" y="75" width="230" height="44" fill="#9ab6c8"/>
<rect x="140" y="140" width="120" height="44" fill="#8c9ae0"/>
<rect x="200" y="205" width="170" height="44" fill="#9ab6c8"/>
<rect x="200" y="270" width="170" height="44" fill="#c0d4a7"/>
</g>
<g font-size="20" font-weight="700" class="mono">
<text x="38" y="39" fill="#fff">/v1</text>
<text x="94" y="104">/dispositivos</text>
<text x="154" y="169">/{id}</text>
<text x="214" y="234">/lecturas</text>
<text x="214" y="299">/actuador</text>
</g>
<g stroke="#000" stroke-width="2" stroke-dasharray="6 6">
<line x1="316" y1="97" x2="455" y2="97"/><line x1="266" y1="162" x2="455" y2="162"/><line x1="376" y1="227" x2="455" y2="227"/><line x1="376" y1="292" x2="455" y2="292"/>
</g>
<g font-size="18">
<text x="470" y="104"><tspan font-weight="700">COLECCIÓN</tspan> · todos los dispositivos · GET lista, POST registra</text>
<text x="470" y="169"><tspan font-weight="700">ÍTEM</tspan> · un dispositivo, por ejemplo inv-01 · GET, PUT, DELETE</text>
<text x="470" y="234"><tspan font-weight="700">COLECCIÓN ANIDADA</tspan> · lecturas de ese dispositivo · GET, POST</text>
<text x="470" y="299"><tspan font-weight="700">SUBRECURSO</tspan> · estado del actuador, uno por dispositivo · GET, PUT</text>
</g>
</svg>

---

# Cómo nombrar las URI

<div class="compact">

| Evitar | Preferir | Regla |
|---|---|---|
| `GET /getLecturas` | `GET /v1/dispositivos/inv-01/lecturas` | Sustantivos; el método indica la acción |
| `POST /borrarDispositivo?id=3` | `DELETE /v1/dispositivos/3` | El método HTTP expresa la operación |
| `/dispositivo/inv-01` | `/dispositivos/inv-01` | Colecciones en plural |
| `/lecturasRecientes` | `/lecturas?limite=10` | Los filtros van en la consulta |
| `/Dispositivos/Inv01` | `/dispositivos/inv-01` | Minúsculas y guiones (*kebab-case*) |
| `/edificios/1/pisos/2/salas/3/dispositivos/7` | `/dispositivos/7` | Como máximo colección/ítem/colección |

</div>

El prefijo `/v1` permite publicar una versión 2 sin romper los dispositivos ya instalados. Las guías no coinciden en dónde versionar; el curso usa la ruta por simplicidad.

<p class="fuente">Microsoft Azure Architecture Center, <em>Web API design best practices</em>; Zalando, <em>RESTful API Guidelines</em> (reglas 129 y 134).</p>

---

# Métodos y códigos por operación

<div class="compact">

| Operación | Petición | Éxito | Errores típicos |
|---|---|---|---|
| Listar | `GET /v1/dispositivos` | 200 OK | — |
| Ver uno | `GET /v1/dispositivos/inv-01` | 200 OK | 404 |
| Crear | `POST /v1/dispositivos` | 201 Created + `Location` | 409 ya existe · 422 datos inválidos |
| Reemplazar | `PUT /v1/dispositivos/inv-01` | 200 OK o 204 | 404 · 422 |
| Eliminar | `DELETE /v1/dispositivos/inv-01` | 204 No Content | 404 |
| Orden al actuador | `PUT /v1/dispositivos/inv-01/actuador` | 202 Accepted | 404 · 422 |

</div>

<div class="cols-2">
<div class="card tint-peach"><b>422 Unprocessable Content</b>
<p>El JSON es válido, pero los datos no: por ejemplo, una humedad de 148 %.</p>
</div>
<div class="card tint-sky"><b>202 Accepted</b>
<p>El servidor aceptó la orden, pero el dispositivo todavía no la ejecuta.</p>
</div>
</div>

<p class="fuente">RFC 9110, secciones 9 y 15.</p>

---

# Filtros y paginación

<div class="url"><span class="tint-lime">/v1/dispositivos/inv-01/lecturas</span>?<span class="tint-sky">desde=2026-10-19</span>&amp;<span class="tint-periwinkle">limite=50</span></div>

<div class="url-parts">
<span class="legend"><i class="tint-lime"></i> Recurso</span>
<span class="legend"><i class="tint-sky"></i> Filtro</span>
<span class="legend"><i class="tint-periwinkle"></i> Tamaño de la página</span>
</div>

<div class="cols-2">
<div class="card tint-peach"><b>Valores por defecto y máximos</b>
<p>Sin <code>limite</code>, la API devuelve una cantidad razonable (por ejemplo, 50) y nunca más de un máximo (por ejemplo, 500), para que una sola petición no agote el servidor.</p>
</div>
<div class="card tint-sky"><b>Paginación</b>
<p>Por desplazamiento (<code>?limite=50&amp;offset=100</code>) o por cursor (<code>?despues=1532</code>). El cursor no salta ni repite lecturas cuando llegan datos nuevos.</p>
</div>
</div>

<p class="fuente">Azure, <em>Web API design</em>; Google AIP-158 (paginación); Zalando, regla 160.</p>

---

# Respuestas y errores

<div class="cols-2" style="grid-template-columns: 1fr 1.25fr">
<div>

- El mismo formato en todas las respuestas.
- Unidades en el nombre del campo: `temp_c`, `hum_pct`.
- Fechas en ISO 8601 con zona horaria: `2026-10-19T14:05:00Z`.
- Errores con *Problem Details* (RFC 9457), tipo `application/problem+json`.

</div>
<div class="code-sm">

```json
{
  "type": "about:blank",
  "title": "Datos inválidos",
  "status": 422,
  "detail": "hum_pct debe estar entre 0 y 100",
  "instance": "/v1/dispositivos/inv-01/lecturas"
}
```

</div>
</div>

<p class="fuente">RFC 9457 (2023) reemplaza al RFC 7807. FastAPI usa por defecto otro formato (<code>{"detail": …}</code>), que se ve en el tema 2.3.</p>

---

# Comandos hacia el dispositivo

El servidor no puede abrir una conexión hacia el ESP32, que está detrás de NAT (tema 1.3). El dispositivo debe preguntar.

<svg class="diagram" viewBox="0 0 1150 310" style="max-height: 310px" role="img" aria-label="Tres patrones para que el ESP32 reciba comandos: consulta periódica, comando en la respuesta del POST y long polling">
<defs><marker id="cmd-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g stroke="#000" stroke-width="1"><line x1="377" y1="0" x2="377" y2="305"/><line x1="772" y1="0" x2="772" y2="305"/></g>
<g font-size="18" font-weight="700">
<text x="0" y="22">A · CONSULTA PERIÓDICA</text>
<text x="395" y="22">B · EN LA RESPUESTA DEL POST</text>
<text x="790" y="22">C · LONG POLLING</text>
</g>
<g stroke="#000" stroke-width="2" font-size="17" font-weight="700">
<rect x="10" y="36" width="100" height="34" fill="#e6915d"/><rect x="250" y="36" width="100" height="34" fill="#d77a7a"/>
<rect x="405" y="36" width="100" height="34" fill="#e6915d"/><rect x="645" y="36" width="100" height="34" fill="#d77a7a"/>
<rect x="800" y="36" width="100" height="34" fill="#e6915d"/><rect x="1040" y="36" width="100" height="34" fill="#d77a7a"/>
</g>
<g font-size="17" font-weight="700" text-anchor="middle">
<text x="60" y="59">ESP32</text><text x="300" y="59">API</text>
<text x="455" y="59">ESP32</text><text x="695" y="59">API</text>
<text x="850" y="59">ESP32</text><text x="1090" y="59">API</text>
</g>
<g stroke="#000" stroke-width="2" stroke-dasharray="6 6">
<line x1="60" y1="70" x2="60" y2="240"/><line x1="300" y1="70" x2="300" y2="240"/>
<line x1="455" y1="70" x2="455" y2="240"/><line x1="695" y1="70" x2="695" y2="240"/>
<line x1="850" y1="70" x2="850" y2="240"/><line x1="1090" y1="70" x2="1090" y2="240"/>
</g>
<rect x="1083" y="108" width="14" height="96" fill="#a5b8c0" stroke="#000" stroke-width="2"/>
<g stroke="#000" stroke-width="3">
<line x1="60" y1="100" x2="294" y2="100" marker-end="url(#cmd-head)"/><line x1="300" y1="135" x2="66" y2="135" marker-end="url(#cmd-head)"/>
<line x1="60" y1="190" x2="294" y2="190" marker-end="url(#cmd-head)"/><line x1="300" y1="225" x2="66" y2="225" marker-end="url(#cmd-head)"/>
<line x1="455" y1="100" x2="689" y2="100" marker-end="url(#cmd-head)"/><line x1="695" y1="135" x2="461" y2="135" marker-end="url(#cmd-head)"/>
<line x1="455" y1="190" x2="689" y2="190" marker-end="url(#cmd-head)"/><line x1="695" y1="225" x2="461" y2="225" marker-end="url(#cmd-head)"/>
<line x1="850" y1="105" x2="1077" y2="105" marker-end="url(#cmd-head)"/><line x1="1083" y1="215" x2="856" y2="215" marker-end="url(#cmd-head)"/>
</g>
<g font-size="15" class="mono" font-weight="700" text-anchor="middle">
<text x="180" y="93">GET /actuador</text><text x="180" y="128">200 {deseado}</text>
<text x="180" y="183">GET /actuador</text><text x="180" y="218">200 {deseado}</text>
<text x="575" y="93">POST /lecturas</text><text x="575" y="128">201 {actuador_deseado}</text>
<text x="575" y="183">POST /lecturas</text><text x="575" y="218">201 {actuador_deseado}</text>
<text x="965" y="98">GET /actuador?esperar=30</text><text x="965" y="208">200 {deseado: "on"}</text>
</g>
<g font-size="15" font-style="italic" text-anchor="middle">
<text x="180" y="162">… T segundos después …</text>
<text x="575" y="162">… próximo envío …</text>
<text x="965" y="160">el servidor espera un cambio</text>
</g>
<g font-size="16">
<text x="0" y="272" font-weight="700">Latencia: hasta T s</text><text x="0" y="296">1 petición extra cada T s</text>
<text x="395" y="272" font-weight="700">Latencia: hasta el próximo envío</text><text x="395" y="296">Sin peticiones extra</text>
<text x="790" y="272" font-weight="700">Latencia: casi inmediata</text><text x="790" y="296">Una conexión abierta por dispositivo</text>
</g>
</svg>

<p class="fuente">Long polling: RFC 6202. Azure IoT Hub: «HTTPS no tiene una forma eficiente de enviar mensajes desde el servidor; los dispositivos consultan». En la Unidad 3, MQTT resuelve este problema.</p>

---

# Documentar el contrato: OpenAPI

<div class="cols-2">
<div class="code-sm">

```yaml
openapi: 3.1.0
info:
  title: API del invernadero
  version: "1.0"
paths:
  /v1/dispositivos/{id}/lecturas:
    post:
      summary: Registrar una lectura
      responses:
        "201":
          description: Lectura creada
        "422":
          description: Datos inválidos
```

</div>
<div>

- **OpenAPI** describe una API en un archivo YAML o JSON: rutas, métodos, cuerpos y respuestas.
- A partir de ese archivo se genera documentación interactiva, pruebas y clientes.
- **Diseño primero** (*API first*): se acuerda el contrato y después se programa; el firmware y el dashboard avanzan en paralelo.

</div>
</div>

<p class="fuente">OpenAPI Specification 3.2.0 (2025) es la versión vigente; FastAPI genera 3.1 automáticamente (tema 2.3). Zalando, regla 100: <em>API first</em>.</p>

---

# API de referencia

<div class="compact">

| Método | URI | Quién la usa | Cuerpo | Respuesta |
|---|---|---|---|---|
| GET | `/v1/dispositivos` | Dashboard | — | 200 lista |
| POST | `/v1/dispositivos` | Dashboard | `{id, nombre}` | 201 + `Location` · 409 |
| GET | `/v1/dispositivos/{id}` | Dashboard | — | 200 · 404 |
| POST | `/v1/dispositivos/{id}/lecturas` | ESP32 | `{temp_c, hum_pct, actuador}` | 201 `{actuador_deseado}` · 422 |
| GET | `/v1/dispositivos/{id}/lecturas?limite=` | Dashboard | — | 200 lista |
| PUT | `/v1/dispositivos/{id}/actuador` | Dashboard | `{estado}` | 202 `{deseado, reportado}` |
| GET | `/v1/dispositivos/{id}/actuador` | Dashboard | — | 200 `{deseado, reportado}` |

</div>

El ESP32 envía el estado real del actuador con cada lectura y recibe el deseado en la respuesta (patrón B). Se implementa en el tema 2.3.

---

# Ejercicio · Corregir el diseño

Un equipo propone estos endpoints para su sistema de riego. Indique qué cambiaría en cada uno.

<ol class="steps">
<li><code>GET /obtenerTodasLasLecturas</code></li>
<li><code>POST /dispositivo/inv-01/borrar</code></li>
<li><code>GET /dispositivos/inv-01/encenderBomba</code></li>
<li><code>POST /lecturas</code> responde <code>200 OK</code> con <code>{"ok": true}</code></li>
<li><code>GET /lecturas?limite=1000000</code> devuelve todo lo pedido</li>
<li>Un dispositivo inexistente responde <code>200 OK</code> con <code>{"error": "no existe"}</code></li>
</ol>

--

## Solución

<div class="compact">

| # | Corrección | Motivo |
|---|---|---|
| 1 | `GET /v1/dispositivos/{id}/lecturas` | Sustantivos; el método ya dice «obtener» |
| 2 | `DELETE /v1/dispositivos/inv-01` → 204 | El método expresa la operación; colección en plural |
| 3 | `PUT /v1/dispositivos/inv-01/bomba` con `{"estado":"on"}` → 202 | GET debe ser seguro: navegadores y proxies pueden repetirlo o precargarlo |
| 4 | 201 Created con `Location` y la lectura creada | El código debe decir qué ocurrió |
| 5 | Límite máximo y paginación | Una petición no debe poder agotar el servidor |
| 6 | 404 Not Found con *Problem Details* | El cliente decide por el código, no por el texto |

</div>

---

# Desafío del proyecto

<div class="cols-2">
<div class="ribbon tint-lime">
<h3>Antes de programar</h3>
<ol>
<li>Identificar los recursos del proyecto del equipo.</li>
<li>Escribir la tabla de endpoints: método, URI, quién la usa, cuerpo, respuesta y códigos de error.</li>
<li>Marcar qué operaciones son idempotentes.</li>
<li>Elegir el patrón de comandos (A, B o C) y justificarlo.</li>
</ol>
</div>
<div class="card tint-sky"><b>Preguntas para discutir</b>
<p>¿Cuánto puede tardar una orden en llegar al actuador sin que el sistema falle?</p>
<p>¿Qué pasa si el ESP32 envía dos veces la misma lectura?</p>
<p>¿Qué datos de su API no deberían ser públicos?</p>
</div>
</div>

---

# Ideas clave

- Una API es un contrato: recursos con URI, métodos estándar y respuestas predecibles.
- Sustantivos en las rutas; el método expresa la acción y el código resume el resultado.
- Un dispositivo detrás de NAT recibe comandos preguntando al servidor.

<div class="cta-red">Diseñe la API antes de programarla: el firmware y el dashboard dependen de ese contrato.</div>

---

# Referencias

<div class="small">

- Fielding, R. T. *Architectural Styles and the Design of Network-based Software Architectures*, cap. 5. Tesis doctoral, UC Irvine, 2000. [ics.uci.edu/~fielding](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- IETF: RFC 9110 (semántica HTTP), RFC 9457 (*Problem Details*), RFC 6202 (long polling). [rfc-editor.org](https://www.rfc-editor.org/)
- Microsoft. *Web API design best practices*. Azure Architecture Center. [learn.microsoft.com](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- Zalando. *RESTful API Guidelines*. [opensource.zalando.com](https://opensource.zalando.com/restful-api-guidelines/) · Google. *AIP-158: Pagination*. [google.aip.dev/158](https://google.aip.dev/158)
- Fowler, M. *Richardson Maturity Model*, 2010. [martinfowler.com](https://martinfowler.com/articles/richardsonMaturityModel.html)
- OpenAPI Initiative. *OpenAPI Specification 3.2.0*, 2025. [spec.openapis.org](https://spec.openapis.org/oas/v3.2.0.html)
- Microsoft. *Azure IoT Hub: choose a communication protocol*. [learn.microsoft.com](https://learn.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-protocols)

</div>

<p class="fuente">Foto: Roy Fielding, Phil Whitehouse, Wikimedia Commons, CC BY 2.0 (2008). Diagramas: elaboración propia.</p>
