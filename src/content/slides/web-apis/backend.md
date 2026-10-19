---
titulo: Desarrollo de backend (FastAPI o Express)
subtitulo: Implementar la API diseñada para recibir lecturas del ESP32 y enviarle órdenes
publicado: 2026-10-19
---

# Objetivo de la clase

<div class="ribbon tint-salmon">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Explicar qué hace un framework de backend con cada petición.</li>
<li>Implementar endpoints en FastAPI con parámetros de ruta, de consulta y un cuerpo validado.</li>
<li>Probar la API con la documentación automática.</li>
<li>Recibir lecturas del ESP32 y entregarle el estado deseado del actuador.</li>
<li>Diagnosticar errores de conexión entre el ESP32 y el servidor.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>Qué hace un framework de backend</li>
<li>FastAPI y Express</li>
<li>Rutas, parámetros y validación</li>
<li>Documentación automática</li>
<li>Lecturas y órdenes</li>
<li>El ESP32 como cliente</li>
<li>Dónde escucha el servidor</li>
</ol>

---

# Qué hace un framework

<div class="flow compact">
<div class="node tint-peach"><b>Enrutar</b>Método y ruta → función</div>
<div class="arrow"></div>
<div class="node tint-salmon"><b>Validar</b>Lee el JSON y los parámetros; revisa tipos y rangos</div>
<div class="arrow"></div>
<div class="node tint-sky"><b>Lógica</b>El código del equipo</div>
<div class="arrow"></div>
<div class="node tint-lime"><b>Serializar</b>Objeto → JSON</div>
<div class="arrow"></div>
<div class="node tint-steel"><b>Responder</b>Código, encabezados y cuerpo</div>
</div>
<div class="bar">Middleware: código que se ejecuta antes y después de cada petición (registro, CORS, autenticación)</div>

- Sin framework, cada endpoint tendría que leer bytes del socket, interpretar HTTP y armar la respuesta a mano.
- El framework resuelve las tareas repetitivas; el equipo escribe la lógica del proyecto.

---

# FastAPI y Express

| | FastAPI | Express |
|---|---|---|
| Lenguaje | Python | JavaScript (Node.js) |
| Servidor | Uvicorn (ASGI) | Node.js, con su bucle de eventos |
| Validación | Automática, con modelos Pydantic | Manual o con otra biblioteca |
| Documentación | Automática en `/docs` (OpenAPI) | No incluida |
| Versión (oct. 2026) | 0.146 · Python 3.10 o superior | 5.3 · Node 18 o superior |

El curso usa FastAPI en los ejemplos y en el Laboratorio 3. Express se muestra para comparar.

<p class="fuente">fastapi.tiangolo.com; expressjs.com. Versiones consultadas en PyPI y npm el 18 de octubre de 2026.</p>

---

# Primera API

<div class="code-sm">

```python
from fastapi import FastAPI

app = FastAPI(title="API del invernadero")

@app.get("/v1/dispositivos")
def listar_dispositivos():
    return [{"id": "inv-01", "nombre": "Invernadero 1"}]
```

```bash
pip install "fastapi[standard]"
fastapi dev main.py                          # desarrollo: 127.0.0.1:8000, recarga al guardar
uvicorn main:app --host 0.0.0.0 --port 8000  # visible desde la red local
```

</div>

- El decorador asocia un método y una ruta a la función: es una *path operation*.
- Lo que la función devuelve se convierte en JSON con código 200.

---

# De la URL a la función

<svg class="diagram" viewBox="0 0 1150 210" style="max-height: 210px" role="img" aria-label="La parte inv-01 de la ruta llega al parámetro id y el valor de limite llega al parámetro limite de la función">
<g stroke="#000" stroke-width="2">
<rect x="334" y="34" width="94" height="36" fill="#e6915d"/>
<rect x="679" y="34" width="28" height="36" fill="#9ab6c8"/>
<rect x="320" y="144" width="108" height="36" fill="#e6915d"/>
<rect x="461" y="144" width="238" height="36" fill="#9ab6c8"/>
</g>
<g class="mono" font-size="24" font-weight="700">
<text x="30" y="60">GET /v1/dispositivos/</text><text x="338" y="60">inv-01</text><text x="432" y="60">/lecturas?limite=</text><text x="686" y="60">5</text>
<text x="30" y="170">def listar_lecturas(</text><text x="324" y="170">id: str</text><text x="432" y="170">,</text><text x="466" y="170">limite: int = 10</text><text x="703" y="170">):</text>
</g>
<g stroke="#000" stroke-width="3"><line x1="381" y1="70" x2="374" y2="144"/><line x1="693" y1="70" x2="580" y2="144"/></g>
<g font-size="18">
<rect x="780" y="44" width="20" height="20" fill="#e6915d" stroke="#000"/><text x="810" y="60"><tspan font-weight="700">RUTA</tspan> · id = "inv-01"</text>
<rect x="780" y="94" width="20" height="20" fill="#9ab6c8" stroke="#000"/><text x="810" y="110"><tspan font-weight="700">CONSULTA</tspan> · limite = 5, convertido a int</text>
<text x="810" y="140">Si no se envía, vale 10</text>
</g>
</svg>

<div class="cols-3">
<div class="card tint-peach"><b>Está en la ruta</b><p>Parámetro de ruta.</p></div>
<div class="card tint-sky"><b>Tipo simple</b><p>Parámetro de consulta.</p></div>
<div class="card tint-lime"><b>Modelo Pydantic</b><p>Cuerpo de la petición.</p></div>
</div>

<p class="fuente">Reglas de FastAPI para decidir de dónde sale cada parámetro (documentación oficial, <em>Request Body</em>).</p>

---

# Cuerpo validado con Pydantic

<div class="cols-2" style="grid-template-columns: 1.25fr 1fr">
<div class="code-sm">

```python
from typing import Literal
from pydantic import BaseModel, Field

class LecturaNueva(BaseModel):
    temp_c: float = Field(ge=-40, le=80)
    hum_pct: float = Field(ge=0, le=100)
    actuador: Literal["on", "off"]

@app.post("/v1/dispositivos/{id}/lecturas",
          status_code=201)
def crear(id: str, lectura: LecturaNueva):
    ...
```

</div>
<div class="code-sm">

Si llega `{"temp_c": "caliente", "hum_pct": 148, …}`:

```json
422 Unprocessable Entity
{"detail": [
  {"loc": ["body", "temp_c"],
   "type": "float_parsing"},
  {"loc": ["body", "hum_pct"],
   "type": "less_than_equal"}
]}
```

</div>
</div>

<p class="fuente">Los rangos corresponden al DHT22: −40 a 80 °C y 0 a 100 %. Cada error indica dónde (<code>loc</code>) y qué regla falló (<code>type</code>). FastAPI responde 422 incluso si el JSON está mal formado; Express responde 400 en ese caso.</p>

---

# Documentación automática

<div class="cols-2" style="grid-template-columns: 2.3fr 1fr; gap: 28px">
<figure>
<img src="./swagger-docs.png" alt="Swagger UI de la API del invernadero con siete endpoints" style="max-height: 420px">
<figcaption>Swagger UI generado por FastAPI para la API de referencia. Captura: elaboración propia.</figcaption>
</figure>
<div>

<div class="small">

- FastAPI publica la descripción OpenAPI en `/openapi.json`.
- La muestra en `/docs` (Swagger UI) y en `/redoc`.
- Con «Try it out» se envía cada petición y se ve la respuesta, sin escribir código.
- Es la primera prueba antes de conectar el ESP32.

</div>

</div>
</div>

---

# Recibir lecturas

<div class="code-sm">

```python
dispositivos = {"inv-01": {"deseado": "off", "reportado": "off"}}
lecturas = {"inv-01": []}               # en memoria: se pierde al reiniciar

def buscar(id: str) -> dict:
    if id not in dispositivos:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    return dispositivos[id]

@app.post("/v1/dispositivos/{id}/lecturas", status_code=201)
def crear_lectura(id: str, lectura: LecturaNueva):
    disp = buscar(id)
    lecturas[id].append(lectura)
    disp["reportado"] = lectura.actuador            # estado real del actuador
    return {"actuador_deseado": disp["deseado"]}    # orden para el ESP32
```

</div>

Los datos viven en memoria: si el servidor se reinicia, se pierden. En el tema 2.4 se guardan en SQLite.

---

# Estado deseado y reportado

<svg class="diagram" viewBox="0 0 1150 400" style="max-height: 400px" role="img" aria-label="El dashboard fija el estado deseado; el ESP32 lo recibe en la respuesta a su lectura, enciende el relé y reporta el nuevo estado">
<defs><marker id="be-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g stroke="#000" stroke-width="2" font-weight="700">
<rect x="40" y="8" width="220" height="40" fill="#c0d4a7"/><rect x="465" y="8" width="220" height="40" fill="#d77a7a"/><rect x="890" y="8" width="220" height="40" fill="#e6915d"/>
</g>
<g font-size="18" font-weight="700" text-anchor="middle"><text x="150" y="34">DASHBOARD</text><text x="575" y="34">API</text><text x="1000" y="34">ESP32</text></g>
<g stroke="#000" stroke-width="2" stroke-dasharray="6 6"><line x1="150" y1="48" x2="150" y2="395"/><line x1="575" y1="48" x2="575" y2="395"/><line x1="1000" y1="48" x2="1000" y2="395"/></g>
<rect x="900" y="228" width="200" height="38" fill="#fcc20f" stroke="#000" stroke-width="2"/>
<text x="1000" y="253" font-size="17" font-weight="700" text-anchor="middle">ENCIENDE EL RELÉ</text>
<g stroke="#000" stroke-width="3">
<line x1="150" y1="90" x2="569" y2="90" marker-end="url(#be-head)"/>
<line x1="575" y1="125" x2="156" y2="125" marker-end="url(#be-head)"/>
<line x1="1000" y1="170" x2="581" y2="170" marker-end="url(#be-head)"/>
<line x1="575" y1="205" x2="994" y2="205" marker-end="url(#be-head)"/>
<line x1="1000" y1="300" x2="581" y2="300" marker-end="url(#be-head)"/>
<line x1="150" y1="345" x2="569" y2="345" marker-end="url(#be-head)"/>
<line x1="575" y1="380" x2="156" y2="380" marker-end="url(#be-head)"/>
</g>
<g font-size="16" class="mono" font-weight="700" text-anchor="middle">
<text x="362" y="82">PUT /actuador {"estado":"on"}</text>
<text x="362" y="117">202 {deseado:"on", reportado:"off"}</text>
<text x="787" y="162">POST /lecturas {…, actuador:"off"}</text>
<text x="787" y="197">201 {actuador_deseado:"on"}</text>
<text x="787" y="292">POST /lecturas {…, actuador:"on"}</text>
<text x="362" y="337">GET /actuador</text>
<text x="362" y="372">200 {deseado:"on", reportado:"on"}</text>
</g>
</svg>

--

## El endpoint del actuador

<div class="code-sm">

```python
class Orden(BaseModel):
    estado: Literal["on", "off"]

@app.put("/v1/dispositivos/{id}/actuador", status_code=202)
def fijar_actuador(id: str, orden: Orden):
    disp = buscar(id)
    disp["deseado"] = orden.estado                  # PUT: repetirlo no cambia nada
    return {"deseado": disp["deseado"], "reportado": disp["reportado"]}
```

</div>

- **202 Accepted:** la orden quedó registrada, pero el actuador cambia cuando el ESP32 envíe su próxima lectura.
- El dashboard muestra el estado **reportado**, no el deseado (tema 2.6).

---

# El ESP32 como cliente

<div class="code-sm">

```cpp
void enviarLectura(float t, float h) {
  JsonDocument doc;                               // ArduinoJson 7
  doc["temp_c"] = t;  doc["hum_pct"] = h;
  doc["actuador"] = releEncendido ? "on" : "off";
  String cuerpo;  serializeJson(doc, cuerpo);

  HTTPClient http;
  http.begin("http://192.168.1.50:8000/v1/dispositivos/inv-01/lecturas");
  http.addHeader("Content-Type", "application/json");
  int codigo = http.POST(cuerpo);                 // negativo: no hubo respuesta HTTP
  if (codigo == 201) {
    JsonDocument resp;
    deserializeJson(resp, http.getString());
    releEncendido = resp["actuador_deseado"] == "on";
  }
  http.end();
}
```

</div>

<p class="fuente"><code>192.168.1.50</code> es la IP del PC en la red local. HTTPClient (arduino-esp32 3.3) y ArduinoJson 7.4.</p>

---

# El mismo endpoint en Express

<div class="cols-2">
<div class="code-sm">

**FastAPI**

```python
@app.post("/v1/dispositivos/{id}/lecturas",
          status_code=201)
def crear(id: str, lectura: LecturaNueva):
    disp = buscar(id)
    lecturas[id].append(lectura)
    disp["reportado"] = lectura.actuador
    return {"actuador_deseado":
            disp["deseado"]}
```

</div>
<div class="code-sm">

**Express 5**

```js
app.use(express.json());

app.post("/v1/dispositivos/:id/lecturas",
  (req, res) => {
    const disp = dispositivos[req.params.id];
    if (!disp) return res.status(404).end();
    const l = req.body ?? {};
    if (typeof l.temp_c !== "number")
      return res.status(422).json(
        { title: "temp_c inválido" });
    // ...validar hum_pct y actuador
    lecturas[req.params.id].push(l);
    disp.reportado = l.actuador;
    res.status(201).json(
      { actuador_deseado: disp.deseado });
  });
```

</div>
</div>

---

# Dónde escucha el servidor

<svg class="diagram" viewBox="0 0 1150 250" style="max-height: 250px" role="img" aria-label="Con el host por defecto el servidor solo escucha en 127.0.0.1 y el ESP32 recibe -1; con --host 0.0.0.0 escucha también en la IP de la red local y el ESP32 recibe 201">
<defs><marker id="host-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g font-size="18"><text x="20" y="22" class="mono" font-weight="700">uvicorn main:app</text><text x="230" y="22">(por defecto, 127.0.0.1)</text>
<text x="20" y="152" class="mono" font-weight="700">uvicorn main:app --host 0.0.0.0</text></g>
<g stroke="#000" stroke-width="2">
<rect x="20" y="38" width="150" height="66" fill="#e6915d"/><rect x="20" y="168" width="150" height="66" fill="#e6915d"/>
<rect x="400" y="38" width="280" height="66" fill="#fff" stroke-dasharray="8 6"/><rect x="680" y="38" width="280" height="66" fill="#c0d4a7"/>
<rect x="400" y="168" width="280" height="66" fill="#c0d4a7"/><rect x="680" y="168" width="280" height="66" fill="#c0d4a7"/>
</g>
<g font-size="18" font-weight="700"><text x="38" y="66">ESP32</text><text x="38" y="196">ESP32</text></g>
<g font-size="15" class="mono"><text x="38" y="92">192.168.1.37</text><text x="38" y="222">192.168.1.37</text></g>
<g font-size="17">
<text x="416" y="66" class="mono">192.168.1.50 · Wi-Fi</text><text x="416" y="92" font-weight="700">NO ESCUCHA</text>
<text x="696" y="66" class="mono">127.0.0.1 · local</text><text x="696" y="92" font-weight="700">ESCUCHA</text>
<text x="416" y="196" class="mono">192.168.1.50 · Wi-Fi</text><text x="416" y="222" font-weight="700">ESCUCHA</text>
<text x="696" y="196" class="mono">127.0.0.1 · local</text><text x="696" y="222" font-weight="700">ESCUCHA</text>
</g>
<g stroke="#000" stroke-width="4"><line x1="170" y1="71" x2="393" y2="71" marker-end="url(#host-head)"/><line x1="170" y1="201" x2="393" y2="201" marker-end="url(#host-head)"/></g>
<g stroke="#e91d2a" stroke-width="6"><line x1="268" y1="55" x2="300" y2="87"/><line x1="300" y1="55" x2="268" y2="87"/></g>
<g font-weight="700"><text x="985" y="70" font-size="26">−1</text><text x="985" y="200" font-size="26">201</text></g>
<g font-size="16"><text x="985" y="94">conexión rechazada</text><text x="985" y="224">Created</text></g>
</svg>

- `127.0.0.1` solo acepta conexiones del propio PC; `0.0.0.0` significa «todas las interfaces».
- En el ESP32 se escribe la IP del PC en la red local. `localhost` en el ESP32 es el propio ESP32.

<p class="fuente"><code>fastapi dev</code> escucha en 127.0.0.1 y <code>fastapi run</code> en 0.0.0.0 (FastAPI CLI). Express escucha en todas las interfaces por defecto.</p>

--

## Errores frecuentes

<div class="compact">

| Síntoma en el ESP32 | Causa probable | Qué revisar |
|---|---|---|
| `-1` *connection refused* | No se pudo abrir la conexión: servidor en 127.0.0.1, firewall del PC, IP equivocada o el ESP32 en otra red | `--host 0.0.0.0`, firewall, IP y subred (tema 1.2) |
| `-11` *read timeout* | Se conectó, pero el servidor no respondió a tiempo (5 s por defecto) | Que el endpoint no se bloquee; `http.setTimeout()` |
| 404 | Ruta o id incorrectos | Comparar con `/docs` |
| 422 | El cuerpo no coincide con el modelo | El campo `loc` de la respuesta |
| Funciona con curl, falla desde el dashboard | CORS | Tema 2.5 |

</div>

<p class="fuente">Códigos de error y tiempo de espera definidos en <code>HTTPClient.h</code> (arduino-esp32).</p>

---

# Ejercicio · Predecir la respuesta

Estado inicial: `inv-01` existe con el actuador deseado en `off`; `inv-07` no existe. ¿Qué código y qué cuerpo devuelve la API en cada caso?

<div class="code-sm">

```text
1  GET  /v1/dispositivos/inv-01/lecturas?limite=5
2  GET  /v1/dispositivos/inv-07/lecturas
3  POST /v1/dispositivos/inv-01/lecturas  {"temp_c": 30.5, "hum_pct": 55, "actuador": "off"}
4  POST /v1/dispositivos/inv-01/lecturas  {"temp_c": 30.5, "hum_pct": 155, "actuador": "off"}
5  PUT  /v1/dispositivos/inv-01/actuador   {"estado": "on"}
6  GET  /v1/dispositivos/inv-01/lecturas?limite=cinco
7  Se repite la petición 3
```

</div>

--

## Solución

<div class="compact">

| # | Código | Cuerpo |
|---|---|---|
| 1 | 200 OK | Lista con hasta 5 lecturas |
| 2 | 404 Not Found | `{"detail": "Dispositivo no encontrado"}` |
| 3 | 201 Created | `{"actuador_deseado": "off"}` |
| 4 | 422 | `loc: ["body", "hum_pct"]`, `type: "less_than_equal"` |
| 5 | 202 Accepted | `{"deseado": "on", "reportado": "off"}` |
| 6 | 422 | `loc: ["query", "limite"]`, `type: "int_parsing"` |
| 7 | 201 Created | `{"actuador_deseado": "on"}`: el ESP32 recibe la orden |

</div>

---

# Desafío del proyecto

<div class="cols-2">
<div class="ribbon tint-lime">
<h3>Para la próxima clase</h3>
<ol>
<li>Implementar en FastAPI la tabla de endpoints diseñada en el tema 2.2, con datos en memoria.</li>
<li>Probar cada endpoint en <code>/docs</code> y guardar capturas de un 201, un 404 y un 422.</li>
<li>Registrar en <code>IA.md</code> cualquier uso de IA.</li>
</ol>
</div>
<div class="card tint-sky"><b>Preguntas para discutir</b>
<p>¿Qué pasa con las lecturas si el servidor se reinicia?</p>
<p>¿Qué pasa si dos ESP32 envían una lectura al mismo tiempo?</p>
<p>¿Por qué fijar el estado con PUT es más seguro que un endpoint que alterna el relé?</p>
</div>
</div>

---

# Ideas clave

- El framework enruta, valida y serializa; el equipo escribe la lógica.
- En FastAPI, los tipos de los parámetros y los modelos Pydantic definen la validación y la documentación.
- El ESP32 envía el estado real y recibe el estado deseado en la misma respuesta.

<div class="cta-red">Para que el ESP32 llegue al servidor en la red local: --host 0.0.0.0 y la IP del PC, nunca localhost.</div>

---

# Referencias

<div class="small">

- FastAPI. Documentación oficial: *First Steps*, *Request Body*, *Handling Errors*, *FastAPI CLI*. [fastapi.tiangolo.com](https://fastapi.tiangolo.com/)
- Express. *Guía y API de Express 5*. [expressjs.com](https://expressjs.com/)
- Uvicorn. *Settings*. [uvicorn.dev/settings](https://uvicorn.dev/settings/)
- Espressif. *arduino-esp32*, biblioteca HTTPClient: código fuente y ejemplos. [github.com/espressif/arduino-esp32](https://github.com/espressif/arduino-esp32/tree/master/libraries/HTTPClient)
- Blanchon, B. *ArduinoJson 7*. [arduinojson.org](https://arduinojson.org/)
- ASGI. *ASGI Documentation*. [asgi.readthedocs.io](https://asgi.readthedocs.io/)

</div>

<p class="fuente">Captura de Swagger UI y diagramas: elaboración propia.</p>
