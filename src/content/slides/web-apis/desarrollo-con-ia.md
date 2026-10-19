---
titulo: "Desarrollo asistido por IA: flujo de trabajo y reglas de uso"
subtitulo: Cómo usar un asistente para generar, revisar y depurar código sin perder el control de lo que se entrega
publicado: 2026-10-19
---

# Objetivo de la clase

<div class="ribbon tint-salmon">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Distinguir los tipos de asistentes de IA para programar y lo que cada uno puede ver y hacer.</li>
<li>Aplicar un flujo de trabajo: especificar, pedir una pieza pequeña, leer, probar y registrar.</li>
<li>Escribir prompts con contexto para generar, depurar y explicar código.</li>
<li>Reconocer los riesgos documentados del código generado.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>La Unidad 2 en un diagrama</li>
<li>Cómo genera código un modelo</li>
<li>Tipos de herramientas</li>
<li>Flujo de trabajo</li>
<li>Prompts para generar, depurar y explicar</li>
<li>Riesgos documentados</li>
</ol>

---

# La Unidad 2 en un diagrama

<div class="flow">
<div class="node tint-peach"><b>Dispositivo</b>ESP32 con sensor y actuador</div>
<div class="arrow both"></div>
<div class="node tint-salmon"><b>API</b>2.2 Diseño<br>2.3 Backend</div>
<div class="arrow both"></div>
<div class="node tint-sky"><b>Datos</b>2.4 SQLite</div>
<div class="arrow both"></div>
<div class="node tint-lime"><b>Aplicación</b>2.5 Frontend<br>2.6 Control móvil</div>
</div>
<div class="bar">2.7 Despliegue en internet · 2.8 Autenticación y secretos</div>

La unidad construye la capa de aplicación del proyecto y cierra con un prototipo publicado en internet. La IA (2.1) se usa como herramienta en todas las piezas.

---

# Cómo genera código un modelo

<div class="flow">
<div class="node tint-peach"><b>Prompt y contexto</b>Lo que se escribe, se pega o la herramienta abre</div>
<div class="arrow"></div>
<div class="node tint-salmon"><b>Modelo de lenguaje</b>Predice el texto más probable, fragmento a fragmento</div>
<div class="arrow"></div>
<div class="node tint-sky"><b>Propuesta</b>Código que parece correcto</div>
<div class="arrow"></div>
<div class="node tint-lime"><b>Persona</b>Lee, ejecuta y prueba</div>
</div>

- El modelo aprendió patrones de grandes volúmenes de código y texto. No ejecuta lo que propone ni sabe si funciona en su ESP32.
- Del proyecto solo conoce lo que está en el contexto. Si falta un dato (versión de una biblioteca, pines, URL), lo completa con lo más probable.
- Por eso puede inventar funciones, parámetros o bibliotecas con nombres verosímiles.

---

# Tipos de herramientas

<div class="cols-3">
<div class="card tint-sky"><b>Chat</b>
<p><strong>Ve:</strong> lo que se pega en la conversación.</p>
<p><strong>Hace:</strong> responde con explicaciones y código que la persona copia y adapta.</p>
<p class="muted">ChatGPT, Claude, Gemini</p>
</div>
<div class="card tint-lime"><b>Completado en el editor</b>
<p><strong>Ve:</strong> el archivo abierto y archivos cercanos.</p>
<p><strong>Hace:</strong> sugiere la línea o el bloque siguiente mientras se escribe.</p>
<p class="muted">GitHub Copilot, Cursor</p>
</div>
<div class="card tint-peach"><b>Agente</b>
<p><strong>Ve:</strong> el repositorio completo.</p>
<p><strong>Hace:</strong> edita varios archivos y ejecuta comandos; la persona revisa y aprueba.</p>
<p class="muted">Claude Code, modo agente de Copilot</p>
</div>
</div>
<div class="bar">Más autonomía significa más código que revisar antes de entregar</div>

<p class="fuente">GitHub agrupa sus funciones en asistivas y agénticas; en ambas, la persona revisa y aprueba lo generado (GitHub Docs, <em>GitHub Copilot features</em>).</p>

---

# Flujo de trabajo

<svg class="diagram" viewBox="0 0 1150 380" style="max-height: 380px" role="img" aria-label="Ciclo de trabajo con IA: especificar, pedir una pieza pequeña, leer y entender, probar y registrar. Si la prueba falla se vuelve a pedir con el error">
<defs><marker id="ia-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g stroke="#000" stroke-width="2">
<rect x="20" y="20" width="300" height="110" fill="#e6915d"/>
<rect x="425" y="20" width="300" height="110" fill="#d77a7a"/>
<rect x="830" y="20" width="300" height="110" fill="#9ab6c8"/>
<rect x="830" y="200" width="300" height="110" fill="#c0d4a7"/>
<rect x="20" y="200" width="300" height="110" fill="#b3bd95"/>
<rect x="425" y="200" width="300" height="110" fill="#fff" stroke-dasharray="10 6"/>
</g>
<g font-size="20" font-weight="700">
<text x="38" y="56">1 · ESPECIFICAR</text>
<text x="443" y="56">2 · PEDIR UNA PIEZA</text>
<text x="848" y="56">3 · LEER Y ENTENDER</text>
<text x="848" y="236">4 · PROBAR</text>
<text x="38" y="236">5 · REGISTRAR</text>
<text x="443" y="236">SI LA PRUEBA FALLA</text>
</g>
<g font-size="17">
<text x="38" y="86">Qué debe hacer, entradas,</text><text x="38" y="110">salidas y cómo se prueba</text>
<text x="443" y="86">Una función o un endpoint,</text><text x="443" y="110">no el proyecto completo</text>
<text x="848" y="86">Cada línea; preguntar</text><text x="848" y="110">lo que no se entiende</text>
<text x="848" y="266">Ejecutar, casos límite,</text><text x="848" y="290">/docs, curl, monitor serial</text>
<text x="38" y="266">Un commit pequeño</text><text x="38" y="290">con un mensaje claro</text>
<text x="443" y="266">Volver al paso 2 con el</text><text x="443" y="290">error completo</text>
</g>
<g stroke="#000" stroke-width="4" fill="none">
<line x1="320" y1="75" x2="418" y2="75" marker-end="url(#ia-head)"/>
<line x1="725" y1="75" x2="823" y2="75" marker-end="url(#ia-head)"/>
<line x1="980" y1="130" x2="980" y2="193" marker-end="url(#ia-head)"/>
<line x1="830" y1="255" x2="732" y2="255" marker-end="url(#ia-head)"/>
<line x1="575" y1="200" x2="575" y2="137" marker-end="url(#ia-head)"/>
<polyline points="980,310 980,358 170,358 170,317" marker-end="url(#ia-head)"/>
<line x1="170" y1="200" x2="170" y2="137" marker-end="url(#ia-head)"/>
</g>
<g font-size="16" font-weight="700">
<text x="752" y="246">FALLA</text>
<text x="575" y="348" text-anchor="middle">PASA</text>
<text x="184" y="174">SIGUIENTE PIEZA</text>
</g>
</svg>

Cada vuelta del ciclo produce una pieza que funciona, que se entiende y que queda registrada.

---

# Anatomía de un prompt

<div class="layers">
<div class="tint-peach"><b>Objetivo</b><span>Escribe una función que envíe una lectura del DHT22 a la API por HTTP POST.</span></div>
<div class="tint-salmon"><b>Contexto</b><span>ESP32 con Arduino-ESP32 3.x, bibliotecas HTTPClient y ArduinoJson 7. Endpoint: <code>POST /v1/dispositivos/inv-01/lecturas</code>.</span></div>
<div class="tint-sky"><b>Restricciones</b><span>Sin bibliotecas nuevas. Si la lectura es NaN, no enviar. Informar los códigos de error negativos.</span></div>
<div class="tint-lime"><b>Formato</b><span>Solo la función, con comentarios breves, y una lista de lo que debo probar.</span></div>
<div class="tint-steel"><b>Ejemplo</b><span>31.2 °C y 48 % → cuerpo <code>{"temp_c":31.2,"hum_pct":48}</code></span></div>
</div>

Un prompt como «haz que el ESP32 mande datos al servidor» obliga al modelo a adivinar la biblioteca, la URL, el formato y qué hacer ante un error.

<p class="fuente">Basado en GitHub Docs, <em>Prompt engineering for GitHub Copilot Chat</em>: dar ejemplos, dividir tareas, evitar ambigüedad e indicar el código relevante.</p>

---

# Depurar y pedir explicaciones

<div class="cols-2">
<div>

**Para depurar, pegue**

<ol class="steps">
<li>El mensaje de error completo.</li>
<li>El fragmento mínimo que lo produce.</li>
<li>Qué esperaba y qué obtuvo.</li>
<li>Qué ya intentó.</li>
</ol>

Pida primero las causas posibles y después la corrección.

</div>
<div>
<figure>
<img src="./rubber-duck-debugging.jpg" alt="Pato de goma junto a una computadora portátil con código en pantalla" style="max-height: 210px">
<figcaption>Explicar el problema en voz alta, aunque sea a un pato de goma, ayuda a depurar. Foto: Tom Morris, Wikimedia Commons, CC BY-SA 3.0.</figcaption>
</figure>
<div class="card tint-sky"><b>Para aprender</b>
<p>«Explica este código línea por línea.»</p>
<p>«¿Qué pasa si el servidor no responde?»</p>
</div>
</div>
</div>

<p class="fuente">Con estudiantes novatos, la IA ayudó a quienes ya tenían un plan y dio una «ilusión de competencia» al resto (Prather et al., ICER 2024).</p>

---

# Lo que dicen los estudios

<div class="flow gap">
<div class="node tint-salmon"><span class="big">40 %</span><b>Vulnerables</b>de 1689 programas generados en 89 escenarios de riesgo<br><small>Pearce et al., IEEE S&amp;P 2022</small></div>
<div class="node tint-peach"><span class="big">21 %</span><b>Soluciones seguras</b>con asistente, frente a 43 % sin asistente, en una tarea de cifrado<br><small>Perry et al., ACM CCS 2023</small></div>
<div class="node tint-sky"><span class="big">+19 %</span><b>Más tiempo</b>con IA en desarrolladores expertos, que creían ir 20 % más rápido<br><small>METR, 2025</small></div>
<div class="node tint-lime"><span class="big">66 %</span><b>«Casi correctas»</b>la frustración más citada sobre las respuestas de IA<br><small>Stack Overflow, encuesta 2025</small></div>
</div>

- En el estudio de Perry, quienes usaron el asistente creían con más frecuencia que su código era seguro.
- Los estudios evalúan herramientas de su momento. Los modelos mejoran, pero la verificación sigue siendo de quien entrega.

---

# Paquetes inventados

<div class="flow compact">
<div class="node tint-sky"><b>1 · La IA sugiere</b>un paquete con nombre verosímil que no existe</div>
<div class="arrow"></div>
<div class="node tint-peach"><b>2 · Un atacante</b>publica un paquete con ese nombre en PyPI o npm</div>
<div class="arrow"></div>
<div class="node tint-salmon"><b>3 · Alguien</b>copia el comando y lo instala</div>
<div class="arrow"></div>
<div class="node"><b>4 · Resultado</b>se ejecuta código del atacante en su equipo</div>
</div>

<div class="cols-2">
<div>

- El 19,7 % de los paquetes sugeridos por 16 modelos no existía (576 000 muestras).
- El 43 % de los nombres inventados se repitió en las 10 repeticiones del mismo prompt: son predecibles.

</div>
<div class="card tint-lime"><b>Antes de instalar</b>
<p>Buscar el nombre en pypi.org o npmjs.com y revisar autor, fecha, descargas y repositorio. Ejemplo: <code>dht22-esp32-cloud</code> no existe en ninguno de los dos.</p>
</div>
</div>

<p class="fuente">Spracklen et al., <em>We Have a Package for You!</em>, USENIX Security 2025. El ataque se conoce como <em>slopsquatting</em>.</p>

---

# Qué no se pega en un asistente

<div class="cols-2">
<div>

- Contraseña del Wi-Fi o del router.
- Tokens, claves de API y archivos `.env`.
- Datos personales de usuarios.
- Código de terceros con acuerdo de confidencialidad.

Antes de pegar, reemplace los valores reales:

```cpp
const char* WIFI_PASS = "<SECRETO>";
```

</div>
<div>
<div class="card tint-salmon"><b>Caso Samsung (2023)</b>
<p>Personal de la empresa subió código interno a ChatGPT. En mayo de 2023, Samsung prohibió estas herramientas en sus equipos.</p>
</div>
<p></p>
<div class="card tint-steel"><b>OWASP LLM02:2025</b>
<p>La divulgación de información sensible es uno de los diez riesgos principales de las aplicaciones con modelos de lenguaje.</p>
</div>
</div>
</div>

<p class="fuente">Bloomberg, 2 de mayo de 2023. Tema 2.8: cómo mantener los secretos fuera del código.</p>

---

# Ejercicio · Código generado

La IA entregó esta función para el ESP32. Encuentre cinco problemas.

<div class="code-sm">

```cpp
#include <EspSensorCloud.h>   // biblioteca sugerida por la IA

const char* WIFI_PASS = "invernadero2026";
const char* TOKEN = "sk_live_4f9a2b7c1d";

void enviar(float t, float h) {
  HTTPClient http;
  http.begin("http://api.example.com/v1/dispositivos/inv-01/lecturas?token="
             + String(TOKEN));
  http.addHeader("Content-Type", "application/json");
  http.POST("{\"temp_c\":" + String(t) + ",\"hum_pct\":" + String(h) + "}");
}
```

</div>

--

## Solución

| # | Problema | Corrección |
|---|---|---|
| 1 | Contraseña y token escritos en el código | Moverlos a `secrets.h`, fuera del repositorio (tema 2.8) |
| 2 | URL con `http://`: todo viaja legible | Usar HTTPS (tema 1.4) |
| 3 | Token en la URL: queda en registros e historiales | Enviarlo en el encabezado `Authorization` (tema 2.8) |
| 4 | Biblioteca desconocida | Verificar que existe y quién la publica, o quitarla si no se usa |
| 5 | No revisa NaN, ni el código de respuesta, ni llama a `http.end()` | Validar la lectura, revisar el código devuelto y liberar la conexión |

---

# Desafío del proyecto

<div class="cols-2">
<div class="ribbon tint-lime">
<h3>Para la próxima clase</h3>
<ol>
<li>Reescribir el prompt «hazme el backend del proyecto» con sus cinco partes: objetivo, contexto, restricciones, formato y ejemplo.</li>
<li>Usar ese prompt para pedir una sola pieza y probarla.</li>
<li>Explicar esa pieza línea por línea al resto del equipo.</li>
</ol>
</div>
<div class="card tint-sky"><b>Preguntas para discutir</b>
<p>¿Qué parte del proyecto no delegarían a la IA y por qué?</p>
<p>¿Cómo demostrarían que entienden un fragmento generado?</p>
<p>¿Qué harían si la IA sugiere una biblioteca que nadie del equipo conoce?</p>
</div>
</div>

---

# Ideas clave

- Un asistente produce código plausible; leerlo, ejecutarlo y probarlo es trabajo de quien lo entrega.
- Piezas pequeñas, contexto claro y una prueba después de cada cambio.
- Los riesgos están medidos: vulnerabilidades, paquetes inventados y fuga de secretos.

<div class="cta-red">Si no puede explicarlo, no lo entregue.</div>

---

# Referencias

<div class="small">

- Pearce, H. et al. *Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions*. IEEE S&amp;P, 2022. [arxiv.org/abs/2108.09293](https://arxiv.org/abs/2108.09293)
- Perry, N. et al. *Do Users Write More Insecure Code with AI Assistants?* ACM CCS, 2023. [arxiv.org/abs/2211.03622](https://arxiv.org/abs/2211.03622)
- Spracklen, J. et al. *We Have a Package for You!* USENIX Security, 2025. [usenix.org](https://www.usenix.org/conference/usenixsecurity25/presentation/spracklen)
- METR. *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*, 2025. [metr.org](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- Prather, J. et al. *The Widening Gap: The Benefits and Harms of Generative AI for Novice Programmers*. ICER, 2024. [arxiv.org/abs/2405.17739](https://arxiv.org/abs/2405.17739)
- Stack Overflow. *Developer Survey 2025: AI*. [survey.stackoverflow.co/2025/ai](https://survey.stackoverflow.co/2025/ai)
- GitHub Docs. *Prompt engineering for GitHub Copilot Chat*. [docs.github.com](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- OWASP. *Top 10 for LLM Applications 2025: LLM02 Sensitive Information Disclosure*. [genai.owasp.org](https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/)

</div>

<p class="fuente">Imagen: pato de goma, Tom Morris, Wikimedia Commons, CC BY-SA 3.0. Diagramas: elaboración propia.</p>
