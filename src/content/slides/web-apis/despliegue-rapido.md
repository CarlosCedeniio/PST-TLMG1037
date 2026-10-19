---
titulo: Herramientas de despliegue rápido
subtitulo: Publicar el proyecto en internet y elegir la plataforma según el problema que resuelve
publicado: 2026-11-09
---

# Objetivo de la clase

<div class="ribbon tint-salmon">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Explicar qué es desplegar y por qué una URL pública resuelve el problema del NAT.</li>
<li>Distinguir los modelos de servicio: IaaS, PaaS, BaaS y SaaS.</li>
<li>Clasificar las plataformas de despliegue rápido según el problema que resuelven.</li>
<li>Evaluar los límites de los planes gratuitos frente a los requisitos del proyecto.</li>
<li>Elegir y justificar una plataforma para cada capa del proyecto.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>De localhost a una URL pública</li>
<li>Modelos de servicio</li>
<li>Del git push al deploy</li>
<li>Servidores que se duermen</li>
<li>Cinco categorías de plataformas</li>
<li>Cómo elegir</li>
<li>Los planes cambian</li>
</ol>

---

# De localhost a una URL pública

<svg class="diagram" viewBox="0 0 1150 300" style="max-height: 300px" role="img" aria-label="El ESP32 y el código salen de la red local hacia la plataforma pública; el celular también llega a la plataforma; las conexiones entrantes a la red local se bloquean">
<defs><marker id="dp-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<rect x="5" y="5" width="465" height="290" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="10 8"/>
<text x="20" y="284" font-size="16" font-weight="700">RED LOCAL · DETRÁS DE NAT</text>
<g stroke="#000" stroke-width="2">
<rect x="25" y="30" width="190" height="80" fill="#d77a7a"/><rect x="25" y="160" width="190" height="80" fill="#e6915d"/><rect x="300" y="95" width="150" height="100" fill="#a5b8c0"/>
<rect x="700" y="20" width="430" height="130" fill="#d77a7a" stroke-width="3"/><rect x="880" y="200" width="250" height="80" fill="#c0d4a7"/>
</g>
<g font-size="19" font-weight="700"><text x="41" y="62">PC DEL EQUIPO</text><text x="41" y="192">ESP32</text><text x="316" y="140">ROUTER</text><text x="316" y="164">NAT</text><text x="718" y="54">PLATAFORMA</text><text x="896" y="234">CELULAR (4G)</text></g>
<g font-size="16"><text x="41" y="90" class="mono">localhost:8000</text><text x="41" y="220">envía lecturas</text><text x="718" y="114">DNS, HTTPS y servidor siempre</text><text x="718" y="136">accesible desde internet</text><text x="896" y="262">abre el dashboard</text></g>
<text x="718" y="84" font-size="17" class="mono" font-weight="700">https://invernadero.onrender.com</text>
<g stroke="#000" stroke-width="4" fill="none">
<line x1="215" y1="75" x2="293" y2="125" marker-end="url(#dp-head)"/><line x1="215" y1="200" x2="293" y2="165" marker-end="url(#dp-head)"/>
<line x1="450" y1="125" x2="693" y2="70" marker-end="url(#dp-head)"/>
<line x1="1005" y1="200" x2="1005" y2="157" marker-end="url(#dp-head)"/>
</g>
<line x1="700" y1="140" x2="457" y2="180" stroke="#000" stroke-width="3" stroke-dasharray="10 6" marker-end="url(#dp-head)"/>
<g stroke="#e91d2a" stroke-width="6"><line x1="563" y1="146" x2="591" y2="174"/><line x1="591" y1="146" x2="563" y2="174"/></g>
<g font-size="15" font-weight="700"><text x="470" y="64">salen: lecturas y git push</text><text x="545" y="200">entrada no solicitada</text></g>
</svg>

**Desplegar** es llevar el código, sus dependencias y su configuración a un servidor con nombre DNS y HTTPS. El ESP32 y el celular **salen** hacia ese servidor, y las conexiones salientes atraviesan el NAT (tema 1.3).

---

# Modelos de servicio

<svg class="diagram" viewBox="0 0 1150 345" style="max-height: 345px" role="img" aria-label="Qué capas administra el equipo y cuáles el proveedor en servidor propio, IaaS, PaaS, BaaS y SaaS">
<g font-size="17" font-weight="700" text-anchor="middle"><text x="328" y="22">SERVIDOR PROPIO</text><text x="510" y="22">IaaS</text><text x="692" y="22">PaaS</text><text x="874" y="22">BaaS</text><text x="1056" y="22">SaaS</text></g>
<g font-size="13" text-anchor="middle"><text x="328" y="44">Docker (Unidad 4)</text><text x="510" y="44">máquina virtual</text><text x="692" y="44">Render, Railway, Fly.io</text><text x="874" y="44">Supabase, Firebase</text><text x="1056" y="44">Adafruit IO, Blynk</text></g>
<g font-size="16" font-weight="700"><text x="0" y="98">Lógica de la app</text><text x="0" y="148">Datos y usuarios</text><text x="0" y="198">Entorno de ejecución</text><text x="0" y="248">Sistema operativo</text><text x="0" y="298">Servidores y red</text></g>
<g stroke="#000" stroke-width="2">
<rect x="240" y="70" width="176" height="44" fill="#d77a7a"/><rect x="422" y="70" width="176" height="44" fill="#d77a7a"/><rect x="604" y="70" width="176" height="44" fill="#d77a7a"/><rect x="786" y="70" width="176" height="44" fill="#d77a7a"/><rect x="968" y="70" width="176" height="44" fill="#a5b8c0"/>
<rect x="240" y="120" width="176" height="44" fill="#d77a7a"/><rect x="422" y="120" width="176" height="44" fill="#d77a7a"/><rect x="604" y="120" width="176" height="44" fill="#d77a7a"/><rect x="786" y="120" width="176" height="44" fill="#a5b8c0"/><rect x="968" y="120" width="176" height="44" fill="#a5b8c0"/>
<rect x="240" y="170" width="176" height="44" fill="#d77a7a"/><rect x="422" y="170" width="176" height="44" fill="#d77a7a"/><rect x="604" y="170" width="176" height="44" fill="#a5b8c0"/><rect x="786" y="170" width="176" height="44" fill="#a5b8c0"/><rect x="968" y="170" width="176" height="44" fill="#a5b8c0"/>
<rect x="240" y="220" width="176" height="44" fill="#d77a7a"/><rect x="422" y="220" width="176" height="44" fill="#d77a7a"/><rect x="604" y="220" width="176" height="44" fill="#a5b8c0"/><rect x="786" y="220" width="176" height="44" fill="#a5b8c0"/><rect x="968" y="220" width="176" height="44" fill="#a5b8c0"/>
<rect x="240" y="270" width="176" height="44" fill="#d77a7a"/><rect x="422" y="270" width="176" height="44" fill="#a5b8c0"/><rect x="604" y="270" width="176" height="44" fill="#a5b8c0"/><rect x="786" y="270" width="176" height="44" fill="#a5b8c0"/><rect x="968" y="270" width="176" height="44" fill="#a5b8c0"/>
</g>
<g font-size="15" text-anchor="middle">
<text x="328" y="97">equipo</text><text x="510" y="97">equipo</text><text x="692" y="97">equipo</text><text x="874" y="97">equipo</text><text x="1056" y="97">solo configura</text>
<text x="328" y="147">equipo</text><text x="510" y="147">equipo</text><text x="692" y="147">equipo</text><text x="874" y="147">proveedor</text><text x="1056" y="147">proveedor</text>
<text x="328" y="197">equipo</text><text x="510" y="197">equipo</text><text x="692" y="197">proveedor</text><text x="874" y="197">proveedor</text><text x="1056" y="197">proveedor</text>
<text x="328" y="247">equipo</text><text x="510" y="247">equipo</text><text x="692" y="247">proveedor</text><text x="874" y="247">proveedor</text><text x="1056" y="247">proveedor</text>
<text x="328" y="297">equipo</text><text x="510" y="297">proveedor</text><text x="692" y="297">proveedor</text><text x="874" y="297">proveedor</text><text x="1056" y="297">proveedor</text>
</g>
<g font-size="15"><rect x="240" y="325" width="18" height="18" fill="#d77a7a" stroke="#000"/><text x="266" y="339">Lo administra el equipo</text><rect x="500" y="325" width="18" height="18" fill="#a5b8c0" stroke="#000"/><text x="526" y="339">Lo administra el proveedor</text></g>
</svg>

<p class="fuente">IaaS, PaaS y SaaS según NIST SP 800-145, <em>The NIST Definition of Cloud Computing</em> (2011). BaaS (backend como servicio) es un término de la industria, no de NIST. Diagrama: elaboración propia.</p>

---

# Del git push al deploy

<div class="flow compact">
<div class="node tint-sky"><b>git push</b>El código llega a GitHub</div>
<div class="arrow"></div>
<div class="node tint-peach"><b>Build</b>Instala las dependencias</div>
<div class="arrow"></div>
<div class="node tint-salmon"><b>Start</b>Arranca el servidor</div>
<div class="arrow"></div>
<div class="node tint-lime"><b>URL pública</b>Con DNS y HTTPS</div>
</div>

<div class="cols-2">
<div class="code-sm">

```bash
# Build command
pip install -r requirements.txt

# Start command (la plataforma fija PORT)
uvicorn main:app --host 0.0.0.0 --port $PORT
```

</div>
<div class="small">

- Cada `git push` a la rama configurada vuelve a construir y publicar el servicio.
- Las credenciales no van en el repositorio: se cargan como variables de entorno en el panel de la plataforma (tema 2.8).
- `--host 0.0.0.0`, igual que en la red local (tema 2.3).

</div>
</div>

<p class="fuente">Render Docs, <em>Deploys</em> y <em>Environment variables</em>.</p>

--

## Entrega continua

<figure>
<img src="./continuous-delivery.png" alt="Diagrama de secuencia de entrega continua: control de versiones, compilación y pruebas, pruebas de aceptación y publicación" class="plain" style="max-height: 400px">
<figcaption>Proceso de entrega continua: cada cambio pasa por pruebas automáticas antes de publicarse. Imagen: Grégoire Détrez, a partir de Jez Humble, Wikimedia Commons, CC BY-SA 4.0.</figcaption>
</figure>

---

# Servidores que se duermen

<svg class="diagram" viewBox="0 0 1150 230" style="max-height: 230px" role="img" aria-label="Tiempo hasta la primera respuesta: siempre encendido, décimas de segundo; serverless en frío, hasta más de un segundo; servicio en reposo, cerca de un minuto, mucho más que los 5 segundos que espera el ESP32">
<g font-size="17" font-weight="700"><text x="0" y="42">Siempre encendido</text><text x="0" y="112">Serverless, en frío</text><text x="0" y="182">En reposo (Render gratis)</text></g>
<g stroke="#000" stroke-width="2"><rect x="260" y="20" width="8" height="34" fill="#c0d4a7"/><rect x="260" y="90" width="16" height="34" fill="#e6915d"/><rect x="260" y="160" width="870" height="34" fill="#d77a7a"/></g>
<g font-size="16"><text x="345" y="43">décimas de segundo</text><text x="345" y="113">de 0,1 s a más de 1 s</text><text x="740" y="183" font-weight="700">cerca de 1 minuto para despertar</text></g>
<line x1="332" y1="8" x2="332" y2="206" stroke="#e91d2a" stroke-width="3" stroke-dasharray="8 6"/>
<text x="342" y="224" font-size="16" font-weight="700" fill="#e91d2a">5 s: el ESP32 deja de esperar (error −11)</text>
<text x="1130" y="224" font-size="14" text-anchor="end">escala: 0 a 60 s</text>
</svg>

<div class="cols-2">
<div class="small">

- **Serverless:** la plataforma crea instancias cuando llegan peticiones; la primera espera el arranque (*cold start*).
- **En reposo:** Render apaga el servicio gratuito tras 15 minutos sin tráfico.

</div>
<div class="card tint-lime"><b>Qué hacer en el ESP32</b>
<p>Reintentar con esperas crecientes, guardar las lecturas y reenviarlas, o usar un plan que no se duerma.</p>
</div>
</div>

<p class="fuente">AWS Lambda, <em>Cold starts and latency</em>; Render Docs, <em>Deploy for Free</em>; tiempo de espera de 5000 ms en <code>HTTPClient.h</code> (arduino-esp32).</p>

---

# Cinco categorías

<svg class="diagram" viewBox="0 0 1150 320" style="max-height: 320px" role="img" aria-label="Qué capas cubre cada categoría: hosting de frontend la aplicación; hosting de backend la API; BaaS la API y los datos; plataformas IoT API, datos y aplicación; constructores con IA generan código para la aplicación y la API">
<g stroke="#000" stroke-width="2"><rect x="230" y="0" width="210" height="40" fill="#e6915d"/><rect x="450" y="0" width="210" height="40" fill="#d77a7a"/><rect x="670" y="0" width="210" height="40" fill="#9ab6c8"/><rect x="890" y="0" width="240" height="40" fill="#c0d4a7"/></g>
<g font-size="17" font-weight="700" text-anchor="middle"><text x="335" y="26">DISPOSITIVO</text><text x="555" y="26">API</text><text x="775" y="26">DATOS</text><text x="1010" y="26">APLICACIÓN</text></g>
<g font-size="17" font-weight="700"><text x="0" y="82">Hosting de frontend</text><text x="0" y="134">Hosting de backend</text><text x="0" y="186">Backend como servicio</text><text x="0" y="238">Plataformas IoT</text><text x="0" y="290">Constructores con IA</text></g>
<g stroke="#000" stroke-width="2" fill="#fff">
<rect x="890" y="56" width="240" height="40"/>
<rect x="450" y="108" width="210" height="40"/>
<rect x="450" y="160" width="430" height="40"/>
<rect x="450" y="212" width="680" height="40"/>
<rect x="450" y="264" width="680" height="40" stroke-dasharray="8 6"/>
</g>
<g font-size="15"><text x="904" y="81">Vercel, Netlify, Cloudflare</text><text x="464" y="133">Render, Railway, Fly.io</text><text x="464" y="185">Firebase, Supabase, Appwrite · API, datos y usuarios</text><text x="464" y="237">Adafruit IO, ThingSpeak, Blynk: todo listo, con sus límites</text><text x="464" y="289">Lovable, Bolt, Replit: generan el código de estas capas</text></g>
<text x="335" y="160" font-size="15" text-anchor="middle">el firmware</text><text x="335" y="180" font-size="15" text-anchor="middle">sigue siendo</text><text x="335" y="200" font-size="15" text-anchor="middle">del equipo</text>
</svg>

<p class="fuente">Categorías del sílabo del curso (tema 2.7). Las siguientes diapositivas resumen cada plataforma; planes verificados en sus páginas oficiales el 18 de octubre de 2026.</p>

---

# Hosting de frontend

<div class="cols-3">
<div class="card tint-sky"><b>Vercel</b>
<p>Sitios y funciones desde Git.</p>
<p><strong>Gratis:</strong> 100 GB de transferencia y 1 M de invocaciones al mes.</p>
<p><strong>Ojo:</strong> el plan Hobby es solo para uso personal no comercial.</p>
</div>
<div class="card tint-lime"><b>Netlify</b>
<p>Sitios desde Git.</p>
<p><strong>Gratis:</strong> 300 créditos al mes; cada deploy a producción gasta 15.</p>
<p><strong>Ojo:</strong> al agotar los créditos, todos los sitios de la cuenta muestran «Site not available».</p>
</div>
<div class="card tint-peach"><b>Cloudflare</b>
<p>Pages o Workers con archivos estáticos.</p>
<p><strong>Gratis:</strong> archivos estáticos sin límite de peticiones; 100 000 peticiones al día a código.</p>
<p><strong>Ojo:</strong> recomienda empezar los proyectos nuevos en Workers.</p>
</div>
</div>

Sirve para el dashboard (HTML, CSS y JavaScript). La API va en otra plataforma, así que se necesita CORS (tema 2.5).

<p class="fuente">vercel.com/pricing · docs.netlify.com (créditos) · developers.cloudflare.com/pages. Consultado el 18 de octubre de 2026.</p>

---

# Hosting de backend

<div class="cols-3">
<div class="card tint-salmon"><b>Render</b>
<p>Servicio web desde Git, ideal para FastAPI.</p>
<p><strong>Gratis:</strong> 750 horas al mes.</p>
<p><strong>Ojo:</strong> se duerme tras 15 min sin tráfico; el disco local no es persistente; Postgres gratis vence a los 30 días.</p>
</div>
<div class="card tint-sky"><b>Railway</b>
<p>Contenedores siempre encendidos y bases de datos con un clic.</p>
<p><strong>Prueba:</strong> USD 5 por 30 días; después, USD 1 de crédito al mes.</p>
<p><strong>Hobby:</strong> USD 5 al mes.</p>
</div>
<div class="card tint-steel"><b>Fly.io</b>
<p>Máquinas ligeras en regiones cercanas al usuario.</p>
<p><strong>Sin plan gratuito</strong> para cuentas nuevas: prueba de 2 horas de máquina o 7 días.</p>
<p>Desde unos USD 2 al mes la máquina más pequeña.</p>
</div>
</div>

Con FastAPI se puede servir el dashboard desde la misma API: un solo servicio, mismo origen y sin CORS.

<p class="fuente">render.com/docs/free · railway.com/pricing · docs.fly.io/about/pricing. Consultado el 18 de octubre de 2026.</p>

---

# Backend como servicio (BaaS)

<div class="cols-3">
<div class="card tint-peach"><b>Firebase (Google)</b>
<p>Firestore (documentos), autenticación y hosting.</p>
<p><strong>Gratis (Spark):</strong> 1 GiB, 50 000 lecturas y 20 000 escrituras al día.</p>
<p><strong>Ojo:</strong> desde febrero de 2026, Cloud Storage exige el plan de pago Blaze.</p>
</div>
<div class="card tint-lime"><b>Supabase</b>
<p>PostgreSQL con API automática, autenticación y tiempo real.</p>
<p><strong>Gratis:</strong> 2 proyectos y 500 MB de base de datos.</p>
<p><strong>Ojo:</strong> el proyecto se pausa tras una semana de poca actividad.</p>
</div>
<div class="card tint-sky"><b>Appwrite</b>
<p>BaaS de código abierto; también se instala en un servidor propio.</p>
<p><strong>Gratis:</strong> 2 proyectos.</p>
<p><strong>Ojo:</strong> se pausa tras 7 días sin actividad en la consola y se borra a los 90 días de pausa.</p>
</div>
</div>

El equipo escribe menos backend, pero la lógica y los datos quedan en el formato del proveedor. Supabase usa PostgreSQL estándar, que se puede exportar.

<p class="fuente">firebase.google.com/pricing · supabase.com/pricing · appwrite.io/changelog. Consultado el 18 de octubre de 2026.</p>

---

# Plataformas IoT listas

<div class="cols-3">
<div class="card tint-salmon"><b>Adafruit IO</b>
<p>Feeds, dashboards y acciones por HTTP y MQTT.</p>
<p><strong>Gratis:</strong> 30 datos por minuto en total, 10 feeds y 30 días de historial.</p>
<p><strong>Ojo:</strong> si se supera la tasa, responde 429.</p>
</div>
<div class="card tint-sky"><b>ThingSpeak (MathWorks)</b>
<p>Canales con gráficas y análisis en MATLAB.</p>
<p><strong>Gratis:</strong> 3 millones de mensajes al año, uno cada 15 s como mínimo, 4 canales.</p>
<p><strong>Ojo:</strong> solo para uso no comercial.</p>
</div>
<div class="card tint-lime"><b>Blynk</b>
<p>App móvil y web lista para monitorear y controlar.</p>
<p><strong>Gratis:</strong> 5 dispositivos, 100 000 mensajes al mes y una semana de historial.</p>
<p><strong>Ojo:</strong> el uso comercial requiere el plan Production.</p>
</div>
</div>

Útiles para validar el sensor en minutos. El equipo no controla la API, los datos ni los límites.

<p class="fuente">io.adafruit.com/api/docs · thingspeak.mathworks.com/prices · blynk.io/pricing. Consultado el 18 de octubre de 2026.</p>

---

# Constructores de apps con IA

<div class="cols-3">
<div class="card tint-periwinkle"><b>Lovable</b>
<p>Genera una app web completa a partir de un prompt.</p>
<p><strong>Gratis:</strong> 5 créditos al día (hasta 30 al mes); publica en un subdominio de lovable.app.</p>
</div>
<div class="card tint-peach"><b>Bolt</b>
<p>Genera y ejecuta apps en el navegador (bolt.new).</p>
<p><strong>Gratis:</strong> 1 millón de tokens al mes, con tope diario; hosting con marca Bolt.</p>
</div>
<div class="card tint-sky"><b>Replit</b>
<p>Entorno de desarrollo en la nube con un agente de IA.</p>
<p><strong>Gratis:</strong> créditos diarios; una app publicada que se cae a los 30 días.</p>
</div>
</div>
<div class="bar">Las reglas del tema 2.1 aplican: el equipo explica cada línea, registra el uso en IA.md y exporta el código a GitHub</div>

Antes de publicar, revisar que el código generado no contenga claves ni tokens a la vista (tema 2.8).

<p class="fuente">docs.lovable.dev · bolt.new/pricing · docs.replit.com. Consultado el 18 de octubre de 2026.</p>

---

# Cómo elegir

<svg class="diagram" viewBox="0 0 1150 330" style="max-height: 330px" role="img" aria-label="Árbol de decisión de cuatro preguntas que lleva a plataforma IoT, hosting de backend, backend como servicio o hosting de frontend">
<defs><marker id="dec-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g stroke="#000" stroke-width="2">
<rect x="0" y="0" width="610" height="56" fill="#fcc20f"/><rect x="0" y="86" width="610" height="56" fill="#fcc20f"/><rect x="0" y="172" width="610" height="56" fill="#fcc20f"/><rect x="0" y="258" width="610" height="56" fill="#fcc20f"/>
<rect x="720" y="0" width="420" height="56" fill="#c0d4a7"/><rect x="720" y="86" width="420" height="56" fill="#d77a7a" stroke-width="4"/><rect x="720" y="172" width="420" height="56" fill="#9ab6c8"/><rect x="720" y="258" width="420" height="56" fill="#e6915d"/>
</g>
<g font-size="17" font-weight="700"><text x="16" y="34">¿Solo ver el sensor y accionar, sin programar backend?</text><text x="16" y="120">¿Necesita su propia API con lógica (FastAPI)?</text><text x="16" y="206">¿Necesita base de datos y usuarios sin escribir backend?</text><text x="16" y="292">¿Solo una página estática?</text></g>
<g font-size="17" font-weight="700"><text x="736" y="26">Plataforma IoT</text><text x="736" y="112">Hosting de backend</text><text x="736" y="198">Backend como servicio</text><text x="736" y="284">Hosting de frontend</text></g>
<g font-size="14"><text x="736" y="46">Adafruit IO, ThingSpeak, Blynk</text><text x="736" y="132">Render, Railway, Fly.io · dashboard incluido</text><text x="736" y="218">Supabase, Firebase, Appwrite</text><text x="736" y="304">Cloudflare, Vercel, Netlify</text></g>
<g stroke="#000" stroke-width="3"><line x1="610" y1="28" x2="713" y2="28" marker-end="url(#dec-head)"/><line x1="610" y1="114" x2="713" y2="114" marker-end="url(#dec-head)"/><line x1="610" y1="200" x2="713" y2="200" marker-end="url(#dec-head)"/><line x1="610" y1="286" x2="713" y2="286" marker-end="url(#dec-head)"/>
<line x1="80" y1="56" x2="80" y2="80" marker-end="url(#dec-head)"/><line x1="80" y1="142" x2="80" y2="166" marker-end="url(#dec-head)"/><line x1="80" y1="228" x2="80" y2="252" marker-end="url(#dec-head)"/></g>
<g font-size="15" font-weight="700"><text x="645" y="22">sí</text><text x="645" y="108">sí</text><text x="645" y="194">sí</text><text x="645" y="280">sí</text><text x="90" y="75">no</text><text x="90" y="161">no</text><text x="90" y="247">no</text></g>
<rect x="990" y="147" width="150" height="22" fill="#fff" stroke="#000"/><text x="1065" y="163" font-size="13" font-weight="700" text-anchor="middle">PROYECTO DEL CURSO</text>
</svg>

<div class="cols-2">
<div class="small">

En cualquier rama: ¿debe estar siempre encendido? ¿Es uso comercial? ¿La frecuencia de envío cabe en el límite? ¿Qué pasa al agotar la cuota: pausa, bloqueo o cobro?

</div>
<div class="small">

Para un prototipo visual rápido, un constructor con IA, con las reglas del tema 2.1.

</div>
</div>

---

# Los planes cambian

<svg class="diagram" viewBox="0 0 1150 250" style="max-height: 250px" role="img" aria-label="Línea de tiempo de cambios en planes gratuitos entre octubre de 2024 y octubre de 2026">
<line x1="40" y1="125" x2="1110" y2="125" stroke="#000" stroke-width="4"/>
<g fill="#000"><circle cx="100" cy="125" r="8"/><circle cx="420" cy="125" r="8"/><circle cx="700" cy="125" r="8"/><circle cx="880" cy="125" r="8"/></g>
<rect x="1070" y="113" width="60" height="24" fill="#fcc20f" stroke="#000" stroke-width="2"/><text x="1100" y="130" font-size="14" font-weight="700" text-anchor="middle">HOY</text>
<g font-size="15" font-weight="700"><text x="112" y="152">oct 2024</text><text x="432" y="152">sep 2025</text><text x="712" y="152">feb 2026</text><text x="892" y="152">jun 2026</text></g>
<g stroke="#000" stroke-width="2">
<rect x="10" y="10" width="250" height="74" fill="#a5b8c0"/><rect x="300" y="168" width="250" height="74" fill="#c0d4a7"/>
<rect x="560" y="10" width="270" height="74" fill="#e6915d"/><rect x="580" y="168" width="270" height="74" fill="#9ab6c8"/><rect x="860" y="10" width="270" height="74" fill="#d77a7a"/>
</g>
<g stroke="#000" stroke-width="2"><line x1="100" y1="84" x2="100" y2="117"/><line x1="420" y1="133" x2="420" y2="168"/><line x1="700" y1="84" x2="700" y2="117"/><line x1="700" y1="133" x2="700" y2="168"/><line x1="880" y1="84" x2="880" y2="117"/></g>
<g font-size="15"><text x="22" y="38" font-weight="700">Fly.io</text><text x="22" y="62">sin plan gratuito para</text><text x="22" y="78">cuentas nuevas</text>
<text x="312" y="196" font-weight="700">Netlify</text><text x="312" y="220">las cuentas nuevas</text><text x="312" y="236">pasan a créditos</text>
<text x="572" y="38" font-weight="700">Firebase</text><text x="572" y="62">Cloud Storage exige</text><text x="572" y="78">el plan de pago Blaze</text>
<text x="592" y="196" font-weight="700">Appwrite</text><text x="592" y="220">pausa proyectos tras</text><text x="592" y="236">7 días sin actividad</text>
<text x="872" y="38" font-weight="700">Appwrite</text><text x="872" y="62">borra los proyectos pausados</text><text x="872" y="78">a los 90 días</text></g>
</svg>

<div class="cols-2">
<div class="card tint-sky"><b>Dependencia del proveedor</b><p>Cuanto más se usan funciones propias de una plataforma, más cuesta mudarse.</p></div>
<div class="card tint-lime"><b>Diseñar para poder mudarse</b><p>Código en GitHub, configuración en variables de entorno y datos en formatos exportables.</p></div>
</div>

<p class="fuente">Documentación y registros de cambios de Fly.io, Netlify, Firebase y Appwrite, consultados el 18 de octubre de 2026.</p>

---

# Ejercicio · Límites reales

<ol class="steps">
<li>ThingSpeak: dos ESP32 envían una lectura cada 15 s. ¿Caben en el plan gratuito durante un año?</li>
<li>Adafruit IO: el ESP32 envía temperatura y humedad cada 2 s. ¿Qué responde el servidor?</li>
<li>Netlify: si los créditos solo se gastan en deploys, ¿cuántos deploys a producción caben en un mes?</li>
<li>Render gratis: el primer POST del día devuelve −11. ¿Por qué? Proponga dos soluciones.</li>
<li>La API con SQLite en Render gratis pierde las lecturas después de cada deploy. ¿Por qué?</li>
</ol>

--

## Solución

<div class="compact">

| # | Respuesta |
|---|---|
| 1 | No. Cada ESP32 envía 86 400 / 15 × 365 = 2 102 400 mensajes al año; los dos suman 4,2 millones, más que los 3 millones del plan |
| 2 | 2 datos cada 2 s son 60 por minuto, el doble del límite: responde 429. Enviar cada 4 s o más |
| 3 | 300 / 15 = 20 deploys al mes |
| 4 | El servicio estaba dormido y tarda cerca de 1 minuto en despertar; el ESP32 espera 5 s. Reintentos con espera creciente, guardar y reenviar las lecturas, o un plan sin reposo |
| 5 | El disco local del plan gratuito no es persistente: el archivo `.db` se pierde. Usar un disco persistente (de pago) o una base de datos gestionada |

</div>

---

# Desafío del proyecto

<div class="cols-2">
<div class="ribbon tint-lime">
<h3>Para la próxima clase</h3>
<ol>
<li>Completar una tabla por capa: plataforma elegida, por qué, límite que más preocupa y plan B.</li>
<li>Justificar la elección con el árbol de decisión.</li>
<li>Calcular si la frecuencia de envío del ESP32 cabe en el plan elegido.</li>
</ol>
</div>
<div class="card tint-sky"><b>Preguntas para discutir</b>
<p>¿Qué pasa con sus datos si la plataforma cambia sus condiciones?</p>
<p>¿Qué parte del sistema necesita estar siempre encendida?</p>
<p>¿Su proyecto podría considerarse uso comercial?</p>
</div>
</div>

---

# Ideas clave

- Desplegar es pasar de localhost a una URL pública con HTTPS; los dispositivos salen hacia ella a través del NAT.
- Cada categoría resuelve un problema distinto: frontend, backend, BaaS, plataforma IoT o generación de código.
- Los planes gratuitos tienen límites (reposo, cuotas, uso comercial) y cambian con el tiempo.

<div class="cta-red">Elija la plataforma por el problema del proyecto y verifique sus límites el día que la elige.</div>

---

# Referencias

<div class="small">

- Mell, P., Grance, T. *The NIST Definition of Cloud Computing* (SP 800-145). NIST, 2011. [doi.org/10.6028/NIST.SP.800-145](https://doi.org/10.6028/NIST.SP.800-145)
- Render Docs. *Deploy for Free*, *Deploys*, *Environment variables*. [render.com/docs](https://render.com/docs/free)
- AWS. *Lambda execution environment: cold starts and latency*. [docs.aws.amazon.com](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)
- Precios y límites oficiales: Vercel, Netlify, Cloudflare, Railway, Fly.io, Firebase, Supabase, Appwrite, Adafruit IO, ThingSpeak, Blynk, Lovable, Bolt y Replit (enlaces en la página Recursos del curso).

</div>

<p class="fuente">Imagen: <em>Continuous Delivery process diagram</em>, Grégoire Détrez a partir de Jez Humble, Wikimedia Commons, CC BY-SA 4.0. Diagramas: elaboración propia.</p>
