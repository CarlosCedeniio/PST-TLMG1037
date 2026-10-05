---
titulo: "Protocolo HTTP: métodos, códigos de estado y JSON"
subtitulo: Estructura de peticiones y respuestas, y el formato con el que se intercambian los datos
publicado: 2026-10-04
---

# Objetivo de la clase

<div class="ribbon tint-periwinkle">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Describir la estructura de una petición y de una respuesta HTTP.</li>
<li>Elegir el método HTTP adecuado para cada operación.</li>
<li>Interpretar los códigos de estado más comunes.</li>
<li>Leer y escribir datos en formato JSON válido.</li>
<li>Explicar la diferencia entre HTTP y HTTPS.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>Modelo petición–respuesta</li>
<li>Anatomía de una URL</li>
<li>Petición y respuesta</li>
<li>Métodos</li>
<li>Códigos de estado y encabezados</li>
<li>JSON</li>
<li>HTTPS y versiones de HTTP</li>
</ol>

---

# Petición y respuesta

<svg class="diagram" viewBox="0 0 1150 250" style="max-height: 250px" role="img" aria-label="El cliente envía una petición HTTP al servidor y recibe una respuesta">
<defs><marker id="http-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g font-weight="700">
<rect x="20" y="40" width="260" height="170" fill="#e6915d" stroke="#000" stroke-width="2"/>
<text x="150" y="110" font-size="22" text-anchor="middle">CLIENTE</text><text x="150" y="142" font-size="17" text-anchor="middle">ESP32, navegador,</text><text x="150" y="166" font-size="17" text-anchor="middle">aplicación móvil</text>
<rect x="870" y="40" width="260" height="170" fill="#d77a7a" stroke="#000" stroke-width="2"/>
<text x="1000" y="110" font-size="22" text-anchor="middle">SERVIDOR</text><text x="1000" y="142" font-size="17" text-anchor="middle">API en el puerto</text><text x="1000" y="166" font-size="17" text-anchor="middle">80 (HTTP) o 443 (HTTPS)</text>
</g>
<g stroke="#000" stroke-width="5"><line x1="285" y1="90" x2="862" y2="90" marker-end="url(#http-head)"/><line x1="865" y1="165" x2="290" y2="165" marker-end="url(#http-head)"/></g>
<g font-size="20" font-weight="700" text-anchor="middle"><text x="575" y="74">PETICIÓN · método, ruta, encabezados, cuerpo</text><text x="575" y="200">RESPUESTA · código de estado, encabezados, cuerpo</text></g>
</svg>

- El **cliente** siempre inicia; el **servidor** responde. Cada petición recibe una respuesta.
- HTTP pertenece a la capa de aplicación. HTTP/1.1, la versión que se usa en el curso, es texto y viaja sobre TCP (RFC 9112).

---

# Anatomía de una URL

<div class="url"><span class="tint-salmon">https</span>://<span class="tint-sky">api.example.com</span>:<span class="tint-peach">443</span><span class="tint-lime">/v1/lecturas</span>?<span class="tint-periwinkle">dispositivo=inv-01&amp;limite=10</span></div>

<div class="url-parts">
<span class="legend"><i class="tint-salmon"></i> Esquema</span>
<span class="legend"><i class="tint-sky"></i> Host (se resuelve por DNS)</span>
<span class="legend"><i class="tint-peach"></i> Puerto (opcional)</span>
<span class="legend"><i class="tint-lime"></i> Ruta: el recurso</span>
<span class="legend"><i class="tint-periwinkle"></i> Consulta: parámetros</span>
</div>

Si el puerto no se escribe, se usa el predeterminado del esquema: 80 para `http` y 443 para `https`.

---

# Estructura de una petición

<div class="layers">
<div class="tint-salmon"><b>Línea de petición</b><span><code class="raw">POST /v1/lecturas HTTP/1.1</code></span></div>
<div class="tint-sky"><b>Encabezados</b><span><code class="raw">Host: api.example.com
Content-Type: application/json
Content-Length: 51</code></span></div>
<div><b>Línea en blanco</b><span>Separa los encabezados del cuerpo.</span></div>
<div class="tint-lime"><b>Cuerpo (opcional)</b><span><code class="raw">{"dispositivo":"inv-01","temp_c":31.2,"hum_pct":48}</code></span></div>
</div>

La línea de petición indica el **método**, la **ruta** y la **versión**. `Content-Length` indica el tamaño del cuerpo en bytes.

---

# Estructura de una respuesta

<div class="layers">
<div class="tint-salmon"><b>Línea de estado</b><span><code class="raw">HTTP/1.1 201 Created</code></span></div>
<div class="tint-sky"><b>Encabezados</b><span><code class="raw">Content-Type: application/json
Location: /v1/lecturas/1532
Content-Length: 50</code></span></div>
<div><b>Línea en blanco</b><span>Separa los encabezados del cuerpo.</span></div>
<div class="tint-lime"><b>Cuerpo</b><span><code class="raw">{"id":1532,"recibido":"2026-10-12T09:15:02-05:00"}</code></span></div>
</div>

El **código de estado** (201) resume el resultado; el cuerpo trae los datos.

---

# Un mensaje HTTP real

<div class="cols-2">
<div>

- Petición escrita a mano con `telnet` hacia el puerto 80 de un servidor web.
- En rojo, la petición: `GET`, la ruta y el encabezado `Host`.
- En azul, la línea de estado y los encabezados de la respuesta.
- En verde, el cuerpo: el HTML de la página.

</div>
<div>
<figure>
<img src="./http-request-telnet.png" alt="Sesión de telnet con una petición GET a en.wikipedia.org y su respuesta HTTP" style="max-height: 400px">
<figcaption>Imagen: TheJosh, Wikimedia Commons, dominio público (2008).</figcaption>
</figure>
</div>
</div>

---

# Métodos

| Método | Uso | Seguro | Idempotente | Ejemplo |
|---|---|---|---|---|
| GET | Leer un recurso | Sí | Sí | `GET /v1/lecturas?limite=10` |
| POST | Crear un recurso o enviar datos | No | No | `POST /v1/lecturas` |
| PUT | Reemplazar un recurso completo | No | Sí | `PUT /v1/dispositivos/inv-01` |
| PATCH | Modificar parte de un recurso | No | No | `PATCH /v1/dispositivos/inv-01` |
| DELETE | Eliminar un recurso | No | Sí | `DELETE /v1/lecturas/1532` |

<p class="fuente">Métodos y propiedades según RFC 9110; PATCH se define en RFC 5789.</p>

---

# Seguro e idempotente

<div class="cols-2">
<div class="card tint-sky"><b>Seguro</b>
<p>No modifica nada en el servidor: solo lee.</p>
<p>Un GET se puede repetir, guardar en caché o precargar sin efectos.</p>
</div>
<div class="card tint-peach"><b>Idempotente</b>
<p>Repetir la petición deja el servidor en el mismo estado que enviarla una vez.</p>
<p>Fijar la válvula en "abierta" con PUT dos veces da el mismo resultado. Enviar dos veces un POST de una lectura crea dos registros.</p>
</div>
</div>

En redes inestables, un dispositivo puede reenviar una petición sin saber si la primera llegó. Por eso importa la idempotencia.

---

# Códigos de estado

<div class="flow gap">
<div class="node tint-steel"><span class="big">1xx</span><b>Informativo</b>La petición continúa</div>
<div class="node tint-lime"><span class="big">2xx</span><b>Éxito</b>Se procesó</div>
<div class="node tint-sky"><span class="big">3xx</span><b>Redirección</b>El recurso está en otro lugar</div>
<div class="node tint-peach"><span class="big">4xx</span><b>Error del cliente</b>La petición tiene un problema</div>
<div class="node tint-salmon"><span class="big">5xx</span><b>Error del servidor</b>El servidor falló</div>
</div>

El primer dígito indica la clase. Ante un **4xx** hay que corregir la petición; ante un **5xx**, el problema está en el servidor y se puede reintentar más tarde.

---

# Códigos frecuentes

<div class="cols-2 compact">
<div>

| Código | Significado |
|---|---|
| 200 OK | Éxito, con datos en el cuerpo |
| 201 Created | Se creó el recurso |
| 204 No Content | Éxito, sin cuerpo |
| 301 Moved Permanently | El recurso cambió de URL |
| 304 Not Modified | La copia en caché sigue vigente |

</div>
<div>

| Código | Significado |
|---|---|
| 400 Bad Request | Petición mal formada |
| 401 Unauthorized | Falta autenticación o no es válida |
| 403 Forbidden | Autenticado, pero sin permiso |
| 404 Not Found | El recurso no existe |
| 429 Too Many Requests | Demasiadas peticiones |
| 500 Internal Server Error | Error en el servidor |
| 503 Service Unavailable | Servidor no disponible |

</div>
</div>

<p class="fuente">RFC 9110; el código 429 se define en RFC 6585.</p>

---

# Encabezados comunes

| Encabezado | Dirección | Función |
|---|---|---|
| `Host` | Petición | Nombre del servidor; es obligatorio en HTTP/1.1 |
| `Content-Type` | Ambas | Formato del cuerpo, por ejemplo `application/json` |
| `Content-Length` | Ambas | Tamaño del cuerpo en bytes |
| `Accept` | Petición | Formatos que el cliente acepta en la respuesta |
| `Authorization` | Petición | Credenciales o token (tema 2.8) |
| `User-Agent` | Petición | Programa que hace la petición |
| `Location` | Respuesta | URL del recurso creado o de la redirección |

---

# HTTP no guarda estado

<div class="cols-2">
<div>

- Cada petición es **independiente**: el servidor no recuerda las peticiones anteriores del mismo cliente (*stateless*).
- Si el servidor necesita saber quién envía, la petición debe incluirlo cada vez, por ejemplo con un token en `Authorization`.
- Esta propiedad facilita tener varios servidores atendiendo la misma API.

</div>
<div>
<div class="card tint-lime"><b>En el curso</b>
<p>Tema 2.2: diseño de APIs REST sobre HTTP.</p>
<p>Tema 2.8: autenticación con tokens.</p>
</div>
</div>
</div>

---

<!-- .slide: class="divider" -->

# JSON

---

# JSON: tipos de datos

<div class="cols-2">
<div>

```json
{
  "dispositivo": "inv-01",
  "activo": true,
  "temp_c": 31.2,
  "umbral_c": null,
  "sensores": ["dht22", "relé"],
  "ubicacion": { "lat": -2.146, "lon": -79.967 }
}
```

</div>
<div>

| Tipo | Ejemplo |
|---|---|
| Objeto | `{ "clave": valor }` |
| Arreglo | `[1, 2, 3]` |
| Cadena | `"inv-01"` |
| Número | `31.2`, `-79.967` |
| Booleano | `true`, `false` |
| Nulo | `null` |

</div>
</div>

<p class="fuente">JavaScript Object Notation, RFC 8259. Es texto UTF-8 y lo leen prácticamente todos los lenguajes.</p>

---

# JSON válido e inválido

<div class="cols-2">
<div>

**Válido**

```json
{
  "dispositivo": "inv-01",
  "temp_c": 31.2
}
```

</div>
<div>

**Inválido**

```text
{
  dispositivo: 'inv-01',
  "temp_c": 31.2,
}
```

</div>
</div>

- Las claves y las cadenas van entre **comillas dobles**: `dispositivo` y `'inv-01'` no son válidos.
- No se permiten comentarios ni comas después del último elemento, como la que sigue a `31.2`.
- Un JSON mal formado suele producir un **400 Bad Request** en la API.

---

# Tamaño del mensaje

<div class="cols-2">
<div>

- JSON es legible, pero repite los nombres de los campos en cada mensaje.
- La lectura del ejemplo ocupa 51 bytes. Los mismos datos codificados en binario caben en 4 bytes.
- En Wi-Fi o celular la diferencia no suele importar; en redes de largo alcance y bajo consumo sí.

</div>
<div>
<div class="card tint-sage"><b>En el curso</b>
<p>Tema 3.3: en LPWAN, como LoRa, los mensajes son de pocos bytes y conviene codificarlos de forma compacta.</p>
</div>
</div>
</div>

Note:
4 bytes: identificador del dispositivo (1 byte), temperatura en décimas de grado como entero con signo (2 bytes: 312) y humedad en porcentaje (1 byte: 48). Es una codificación posible, no un estándar.

---

<!-- .slide: class="divider" -->

# HTTPS

---

# HTTP y HTTPS

<div class="flow">
<div class="node tint-peach"><b>ESP32</b></div>
<div class="arrow"></div>
<div class="node"><b>HTTP · puerto 80</b><code>{"temp_c":31.2}</code><br><code>Authorization: Bearer abc123</code><br>Cualquiera en el camino puede leerlo</div>
<div class="arrow"></div>
<div class="node tint-salmon"><b>Servidor</b></div>
</div>
<div class="flow">
<div class="node tint-peach"><b>ESP32</b></div>
<div class="arrow"></div>
<div class="node tint-lime"><b>HTTPS · puerto 443</b><code>17 03 03 00 4a 9f e2 …</code><br>Cifrado con TLS</div>
<div class="arrow"></div>
<div class="node tint-salmon"><b>Servidor</b></div>
</div>

HTTPS es HTTP dentro de una conexión **TLS**: cifra el contenido y permite verificar la identidad del servidor con un certificado. Los métodos y códigos son los mismos.

---

# Versiones de HTTP

| Versión | Año | Transporte | Característica |
|---|---|---|---|
| HTTP/1.1 | 1997 | TCP | Texto; una petición a la vez por conexión |
| HTTP/2 | 2015 | TCP | Binario; varias peticiones simultáneas en una conexión |
| HTTP/3 | 2022 | QUIC sobre UDP | Menor latencia de conexión y mejor tolerancia a pérdidas |

<p class="fuente">La semántica (métodos, códigos y encabezados) es común a todas: RFC 9110. Versiones: RFC 9112 (HTTP/1.1), RFC 9113 (HTTP/2) y RFC 9114 (HTTP/3).</p>

Los ejemplos del curso usan HTTP/1.1, que es lo que implementan las bibliotecas del ESP32 y es el formato más fácil de leer.

---

# Probar una API con curl

```bash
# GET: leer las últimas 10 lecturas (-i muestra los encabezados de la respuesta)
curl -i "https://api.example.com/v1/lecturas?dispositivo=inv-01&limite=10"

# POST: enviar una lectura en JSON
curl -i -X POST "https://api.example.com/v1/lecturas" \
  -H "Content-Type: application/json" \
  -d '{"dispositivo":"inv-01","temp_c":31.2,"hum_pct":48}'
```

- En el navegador, la pestaña **Red** (*Network*) de las herramientas de desarrollo muestra cada petición con sus encabezados y su respuesta.
- Clientes gráficos como Postman o Bruno permiten guardar colecciones de peticiones.

---

# Ejercicio 1 · Método y código

¿Qué método usaría cada petición y qué código de estado esperaría?

<ol class="steps">
<li>El ESP32 envía una lectura nueva.</li>
<li>El panel pide las últimas 10 lecturas.</li>
<li>Una petición llega sin token de autenticación.</li>
<li>Se pide <code>/v1/lecturas/99999</code>, que no existe.</li>
<li>El cuerpo enviado no es JSON válido.</li>
<li>La base de datos del servidor no responde.</li>
</ol>

--

## Solución · Ejercicio 1

| # | Método | Código |
|---|---|---|
| 1 | POST | 201 Created |
| 2 | GET | 200 OK |
| 3 | cualquiera | 401 Unauthorized |
| 4 | GET | 404 Not Found |
| 5 | POST | 400 Bad Request |
| 6 | cualquiera | 500 Internal Server Error o 503 Service Unavailable |

---

# Ejercicio 2 · Encontrar los errores

```text
{
  'dispositivo': "inv-02",
  "temp_c": 29,5,
  "alarma": True,
  "sensores": ["dht22", "ldr",],
}
```

¿Cuántos errores tiene este JSON y cómo se corrigen?

--

## Solución · Ejercicio 2

<div class="cols-2">
<div>

1. `'dispositivo'`: la clave va con comillas dobles.
2. `29,5`: el decimal se escribe con punto, `29.5`.
3. `True`: el booleano va en minúsculas, `true`.
4. `"ldr",]`: sobra la coma antes de `]`.
5. `],` al final: sobra la coma antes de `}`.

</div>
<div>

```json
{
  "dispositivo": "inv-02",
  "temp_c": 29.5,
  "alarma": true,
  "sensores": ["dht22", "ldr"]
}
```

</div>
</div>

---

# Ideas clave

- HTTP sigue un modelo petición–respuesta: el cliente pide y el servidor responde con un código de estado.
- El método expresa la intención (leer, crear, reemplazar, modificar, eliminar) y el código resume el resultado.
- JSON es el formato habitual para el cuerpo de los mensajes; sus reglas son estrictas.

<div class="cta-red">Todo lo que viaja por HTTP sin TLS se puede leer en el camino. Las APIs del proyecto deben usar HTTPS.</div>

---

# Referencias

- Kurose, J., Ross, K. *Computer Networking: A Top-Down Approach* (8.ª ed.). Pearson, 2021. Capítulo 2.
- IETF: RFC 9110 (semántica HTTP), RFC 9112 (HTTP/1.1), RFC 9113 (HTTP/2), RFC 9114 (HTTP/3), RFC 5789 (PATCH), RFC 6585 (código 429), RFC 8259 (JSON). [rfc-editor.org](https://www.rfc-editor.org/)
- MDN Web Docs. *Una descripción general de HTTP*. [developer.mozilla.org/es/docs/Web/HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Overview)

<p class="fuente">Imagen: sesión HTTP por telnet, TheJosh, Wikimedia Commons, dominio público. Diagramas: elaboración propia.</p>
