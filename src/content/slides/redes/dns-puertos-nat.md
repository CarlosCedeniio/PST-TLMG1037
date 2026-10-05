---
titulo: "Servicios de red: DNS, puertos y NAT"
subtitulo: Cómo se resuelven los nombres, cómo se identifican los servicios y por qué un dispositivo local no es accesible desde internet
publicado: 2026-10-04
---

# Objetivo de la clase

<div class="ribbon tint-periwinkle">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Explicar cómo DNS traduce un nombre de dominio a una dirección IP.</li>
<li>Identificar un servicio por su puerto y distinguir los rangos de puertos.</li>
<li>Explicar cómo funciona NAT y por qué un dispositivo en una red local no es accesible desde internet.</li>
<li>Elegir una forma adecuada de comunicarse con un dispositivo que está detrás de NAT.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>DNS: jerarquía de nombres</li>
<li>Resolución de un nombre y caché</li>
<li>Tipos de registros DNS</li>
<li>Puertos y sockets</li>
<li>NAT: traducción de direcciones</li>
<li>Consecuencias de NAT para un sistema telemático</li>
</ol>

---

<!-- .slide: class="divider" -->

# DNS

---

# Nombres y direcciones

<div class="flow">
<div class="node tint-lime"><b>Nombre</b><code>api.example.com</code><br>Fácil de recordar; no cambia</div>
<div class="arrow"></div>
<div class="node tint-sky"><b>DNS</b>Sistema de nombres de dominio</div>
<div class="arrow"></div>
<div class="node tint-periwinkle"><b>Dirección IP</b><code>203.0.113.10</code><br>La que usa la red; puede cambiar</div>
</div>

- DNS es una base de datos **distribuida y jerárquica** que traduce nombres a direcciones (RFC 1034 y RFC 1035).
- Un dispositivo debe conectarse a su servidor **por nombre**, no por IP: así el servidor puede cambiar de dirección sin reprogramar el dispositivo.

<p class="fuente">example.com y los dominios .example están reservados para documentación (RFC 2606).</p>

---

# Jerarquía de nombres

<svg class="diagram" viewBox="0 0 1150 360" style="max-height: 360px" role="img" aria-label="Árbol DNS: raíz, dominios de nivel superior, segundo y tercer nivel">
<g font-size="17" font-weight="700">
<text x="10" y="56">RAÍZ</text>
<text x="10" y="146">NIVEL SUPERIOR (TLD)</text>
<text x="10" y="236">SEGUNDO NIVEL</text>
<text x="10" y="326">TERCER NIVEL</text>
</g>
<g stroke="#000" stroke-width="2">
<line x1="700" y1="74" x2="420" y2="120"/><line x1="700" y1="74" x2="700" y2="120"/><line x1="700" y1="74" x2="980" y2="120"/>
<line x1="420" y1="164" x2="420" y2="210"/>
<line x1="700" y1="164" x2="600" y2="210"/><line x1="700" y1="164" x2="800" y2="210"/>
<line x1="600" y1="254" x2="600" y2="300"/>
</g>
<g font-size="20" font-weight="700" text-anchor="middle">
<rect x="630" y="30" width="140" height="44" fill="#000"/><text x="700" y="59" fill="#fff">. (raíz)</text>
<rect x="350" y="120" width="140" height="44" fill="#8c9ae0" stroke="#000" stroke-width="2"/><text x="420" y="149">.com</text>
<rect x="630" y="120" width="140" height="44" fill="#8c9ae0" stroke="#000" stroke-width="2"/><text x="700" y="149">.ec</text>
<rect x="910" y="120" width="140" height="44" fill="#8c9ae0" stroke="#000" stroke-width="2"/><text x="980" y="149">.org</text>
<rect x="330" y="210" width="180" height="44" fill="#9ab6c8" stroke="#000" stroke-width="2"/><text x="420" y="239">example.com</text>
<rect x="525" y="210" width="150" height="44" fill="#9ab6c8" stroke="#000" stroke-width="2"/><text x="600" y="239">edu.ec</text>
<rect x="725" y="210" width="150" height="44" fill="#9ab6c8" stroke="#000" stroke-width="2"/><text x="800" y="239">gob.ec</text>
<rect x="495" y="300" width="210" height="44" fill="#c0d4a7" stroke="#000" stroke-width="2"/><text x="600" y="329">espol.edu.ec</text>
</g>
<text x="720" y="329" font-size="18">→ incluye www.espol.edu.ec</text>
</svg>

Cada nivel **delega** la administración del nivel inferior. El nombre se lee de derecha a izquierda: raíz, TLD, dominio y subdominios.

---

# Resolución de un nombre

<div class="cols-2">
<div>
<ol class="steps">
<li>El equipo consulta a su <strong>resolver</strong>, el servidor DNS que recibió por DHCP.</li>
<li>Si la respuesta no está en caché, el resolver consulta a un <strong>servidor raíz</strong>, que indica quién atiende el TLD.</li>
<li>Sigue bajando por la jerarquía hasta el <strong>servidor autoritativo</strong> del dominio.</li>
<li>El autoritativo responde con la dirección.</li>
<li>El resolver guarda la respuesta en caché y la entrega al equipo.</li>
</ol>
</div>
<div>
<figure>
<img src="./dns-iterative-resolver.svg" alt="Resolución iterativa de www.wikipedia.org: servidor raíz, servidor de .org y servidor de wikipedia.org">
<figcaption>Resolución iterativa. Imagen: Lion Kimbro, Wikimedia Commons, dominio público.</figcaption>
</figure>
</div>
</div>

---

# Caché y TTL

<div class="cols-2">
<div>

- Cada respuesta DNS incluye un **TTL** (*time to live*): los segundos durante los cuales puede guardarse en caché.
- Los resolvers, los sistemas operativos y los navegadores mantienen cachés. La mayoría de las consultas se responden sin llegar a la raíz.
- Si un dominio cambia de IP, el cambio tarda en verse hasta que vence el TTL.

</div>
<div>
<div class="card tint-sky"><b>Servidores raíz</b>
<p>Hay 13 identidades de servidores raíz (a.root-servers.net a m.root-servers.net), operadas por 12 organizaciones y replicadas en cientos de sitios en el mundo.</p>
<p class="small">Fuente: root-servers.org</p>
</div>
</div>
</div>

---

# Tipos de registros

| Tipo | Contiene | Ejemplo |
|---|---|---|
| A | Dirección IPv4 del nombre | `api.example.com` → `203.0.113.10` |
| AAAA | Dirección IPv6 del nombre | `api.example.com` → `2001:db8::10` |
| CNAME | Alias hacia otro nombre | `www.example.com` → `example.com` |
| MX | Servidor de correo del dominio | `example.com` → `mail.example.com` |
| TXT | Texto: verificaciones y políticas de correo | `"v=spf1 -all"` |
| NS | Servidores autoritativos de la zona | `example.com` → `ns1.example.com` |

<p class="fuente">DNS usa normalmente UDP en el puerto 53; usa TCP para respuestas grandes y transferencias de zona (RFC 1035, RFC 7766).</p>

---

# Consultar DNS desde la terminal

```bash
$ nslookup api.example.com
Server:     192.168.1.1
Address:    192.168.1.1#53

Non-authoritative answer:
Name:       api.example.com
Address:    203.0.113.10
```

- **Server:** el resolver que respondió; aquí, el router de la casa.
- **Non-authoritative answer:** la respuesta viene de una caché, no del servidor autoritativo.
- Otras herramientas: `dig` (Linux y macOS) y `Resolve-DnsName` (PowerShell).

<p class="fuente">Salida ilustrativa con nombres y direcciones de documentación (RFC 2606 y RFC 5737).</p>

---

<!-- .slide: class="divider" -->

# Puertos

---

# Una IP, muchos servicios

<svg class="diagram" viewBox="0 0 1150 330" style="max-height: 330px" role="img" aria-label="Un servidor con una IP y varios servicios en distintos puertos; dos clientes se conectan a los puertos 443 y 1883">
<defs><marker id="pt-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g font-weight="700">
<rect x="20" y="50" width="300" height="80" fill="#c0d4a7" stroke="#000" stroke-width="2"/><text x="38" y="84" font-size="20">NAVEGADOR</text><text x="38" y="112" font-size="17" class="mono">192.168.1.20:52044</text>
<rect x="20" y="200" width="300" height="80" fill="#e6915d" stroke="#000" stroke-width="2"/><text x="38" y="234" font-size="20">ESP32</text><text x="38" y="262" font-size="17" class="mono">192.168.1.37:50001</text>
</g>
<rect x="720" y="10" width="410" height="310" fill="#fff" stroke="#000" stroke-width="2"/>
<text x="740" y="44" font-size="20" font-weight="700">SERVIDOR 203.0.113.10</text>
<g font-size="18" font-weight="700">
<rect x="740" y="62" width="370" height="42" fill="#a5b8c0" stroke="#000" stroke-width="2"/><text x="756" y="90" class="mono">22</text><text x="840" y="90">SSH</text>
<rect x="740" y="112" width="370" height="42" fill="#a5b8c0" stroke="#000" stroke-width="2"/><text x="756" y="140" class="mono">80</text><text x="840" y="140">HTTP</text>
<rect x="740" y="162" width="370" height="42" fill="#d77a7a" stroke="#000" stroke-width="3"/><text x="756" y="190" class="mono">443</text><text x="840" y="190">HTTPS (API y panel)</text>
<rect x="740" y="212" width="370" height="42" fill="#8c9ae0" stroke="#000" stroke-width="3"/><text x="756" y="240" class="mono">1883</text><text x="840" y="240">MQTT (broker)</text>
<rect x="740" y="262" width="370" height="42" fill="#a5b8c0" stroke="#000" stroke-width="2"/><text x="756" y="290" class="mono">5432</text><text x="840" y="290">PostgreSQL</text>
</g>
<g stroke="#000" stroke-width="4"><line x1="320" y1="90" x2="734" y2="183" marker-end="url(#pt-head)"/><line x1="320" y1="240" x2="734" y2="233" marker-end="url(#pt-head)"/></g>
</svg>

La IP identifica al equipo; el **puerto** (16 bits, de 0 a 65&nbsp;535) identifica al programa dentro del equipo. Una conexión queda definida por protocolo, IP y puerto de origen, e IP y puerto de destino.

---

# Rangos y puertos frecuentes

<div class="cols-2">
<div>

| Rango | Nombre (RFC 6335) |
|---|---|
| 0 a 1023 | Puertos del sistema (*well-known*) |
| 1024 a 49&nbsp;151 | Puertos registrados |
| 49&nbsp;152 a 65&nbsp;535 | Dinámicos o efímeros |

El cliente usa un puerto efímero que elige el sistema operativo; el servidor escucha en un puerto conocido.

</div>
<div>

| Puerto | Servicio |
|---|---|
| 22 / TCP | SSH |
| 53 / UDP y TCP | DNS |
| 67 y 68 / UDP | DHCP |
| 80 / TCP | HTTP |
| 443 / TCP | HTTPS |
| 1883 / TCP | MQTT |
| 8883 / TCP | MQTT sobre TLS |

</div>
</div>

<p class="fuente">Registro oficial: IANA, Service Name and Transport Protocol Port Number Registry.</p>

---

# Ver los puertos en uso

<div class="cols-2">
<div>

```bash
# Linux
ss -tuln

# macOS
lsof -i -P | grep LISTEN

# Windows
netstat -an
```

</div>
<div>

- **LISTEN**: un programa espera conexiones en ese puerto.
- **ESTABLISHED**: hay una conexión activa.
- Un puerto que escucha en `0.0.0.0` acepta conexiones desde cualquier interfaz; en `127.0.0.1`, solo desde el mismo equipo.

</div>
</div>

<p class="fuente">La diferencia entre escuchar en 0.0.0.0 y en 127.0.0.1 es la base de la exposición de servicios, que se estudia en el tema 1.5.</p>

---

<!-- .slide: class="divider" -->

# NAT

---

# Traducción de direcciones (NAT)

<div class="cols-2">
<div>

- Las direcciones privadas (RFC 1918) no se enrutan en internet.
- El router reemplaza la **IP y el puerto de origen** privados por su IP pública y un puerto propio, y anota la traducción en una tabla.
- Cuando llega la respuesta, consulta la tabla y la devuelve al equipo interno.
- Una sola IP pública sirve a toda la red local (RFC 3022).

</div>
<div>
<figure>
<img src="./nat-translation-table.jpg" alt="Tabla de traducción NAT: un equipo con IP privada accede a un servidor web a través del router">
<figcaption>Imagen: Yangliy, Wikimedia Commons (Wikibooks), dominio público.</figcaption>
</figure>
</div>
</div>

---

# La tabla NAT en nuestro ejemplo

| Equipo interno | Traducido a (IP pública del router) | Destino |
|---|---|---|
| ESP32 `192.168.1.37:50001` | `198.51.100.7:40001` | `203.0.113.10:443` |
| Laptop `192.168.1.20:52044` | `198.51.100.7:40002` | `203.0.113.10:443` |

<ol class="steps">
<li>El servidor ve las dos conexiones como si vinieran de 198.51.100.7.</li>
<li>Responde a <code>198.51.100.7:40002</code>.</li>
<li>El router busca 40002 en la tabla y entrega la respuesta a la laptop.</li>
</ol>

---

# Lo que permite NAT y lo que no

<svg class="diagram" viewBox="0 0 1150 330" style="max-height: 330px" role="img" aria-label="Una conexión saliente crea una entrada en la tabla NAT; una conexión entrante no solicitada se descarta">
<defs><marker id="nat-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<rect x="6" y="6" width="470" height="318" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="10 8"/>
<text x="24" y="312" font-size="17" font-weight="700">RED LOCAL</text>
<g font-weight="700">
<rect x="30" y="120" width="190" height="80" fill="#e6915d" stroke="#000" stroke-width="2"/><text x="48" y="154" font-size="20">ESP32</text><text x="48" y="182" font-size="16" class="mono">192.168.1.37</text>
<rect x="300" y="100" width="200" height="120" fill="#d77a7a" stroke="#000" stroke-width="2"/><text x="318" y="140" font-size="20">ROUTER NAT</text><text x="318" y="170" font-size="16" class="mono">198.51.100.7</text>
<rect x="900" y="30" width="230" height="80" fill="#8c9ae0" stroke="#000" stroke-width="2"/><text x="918" y="64" font-size="20">SERVIDOR</text><text x="918" y="92" font-size="16" class="mono">203.0.113.10</text>
<rect x="900" y="220" width="230" height="80" fill="#9ab6c8" stroke="#000" stroke-width="2"/><text x="918" y="254" font-size="20">CELULAR (4G)</text><text x="918" y="282" font-size="16">otra red</text>
</g>
<g stroke="#000" stroke-width="4">
<line x1="220" y1="145" x2="294" y2="145" marker-end="url(#nat-head)"/>
<polyline points="500,130 700,70 892,70" fill="none" marker-end="url(#nat-head)"/>
<polyline points="900,260 700,260 508,190" fill="none" stroke-dasharray="12 8" marker-end="url(#nat-head)"/>
</g>
<g font-size="18" font-weight="700">
<text x="530" y="52" font-size="16">SALIENTE: se registra en la tabla</text>
<rect x="520" y="282" width="360" height="34" fill="#000"/><text x="534" y="305" fill="#fff" font-size="16">ENTRANTE NO SOLICITADA: SE DESCARTA</text>
</g>
</svg>

Las conexiones que **inicia** el dispositivo funcionan. Una conexión que llega desde internet sin una entrada previa en la tabla no tiene a quién entregarse.

---

# ¿Cómo se llega a un dispositivo detrás de NAT?

<div class="cols-3">
<div class="card tint-lime"><b>1 · El dispositivo inicia</b>El dispositivo abre una conexión hacia un servidor público y la mantiene. Los comandos llegan por esa conexión. Es el patrón habitual en IoT (MQTT, temas 3.6 y 3.7).</div>
<div class="card tint-salmon"><b>2 · Reenvío de puertos</b>El router envía al dispositivo todo lo que llega a un puerto público. Deja el dispositivo expuesto a internet (riesgos en el tema 1.5).</div>
<div class="card tint-sky"><b>3 · Túnel o proxy inverso</b>Un servicio externo mantiene una conexión saliente con el dispositivo y publica una dirección. También requiere autenticación.</div>
</div>

Esto responde la pregunta abierta del tema 1.1: el comando llega porque el dispositivo ya mantiene una conexión abierta con el servidor.

---

# NAT del proveedor (CGNAT)

<div class="cols-2">
<div>

- Muchos proveedores, sobre todo en redes móviles, aplican un **segundo NAT** antes de salir a internet.
- La IP "pública" del router no es pública: suele estar en el rango compartido `100.64.0.0/10` (RFC 6598).
- Con CGNAT, el reenvío de puertos en el router **no funciona**: la conexión entrante se descarta antes de llegar.

</div>
<div>
<div class="card tint-peach"><b>Cómo comprobarlo</b>
<p>Comparar la IP WAN que muestra el router con la IP pública que ve un servicio externo de consulta de IP.</p>
<p>Si son distintas, o si la WAN está en 100.64.0.0/10, hay CGNAT.</p>
</div>
</div>
</div>

---

# Ejercicio

<div class="cols-3">
<div class="card tint-sky"><b>a)</b>Desde un celular con datos móviles se escribe <code>http://192.168.1.37</code> para abrir el panel del ESP32 de la casa. ¿Por qué no carga?</div>
<div class="card tint-lime"><b>b)</b>El router de un equipo muestra la IP WAN <code>100.72.15.3</code>. Quieren hacer reenvío de puertos. ¿Qué ocurrirá?</div>
<div class="card tint-peach"><b>c)</b>¿Qué servicio se espera en cada puerto? <code>443</code>, <code>1883</code>, <code>53</code>, <code>22</code></div>
</div>

--

## Solución

- **a)** 192.168.1.37 es una dirección privada: solo existe dentro de la red local de la casa. Desde la red móvil esa dirección no es alcanzable y, además, el router NAT descartaría una conexión entrante no solicitada.
- **b)** 100.72.15.3 pertenece a 100.64.0.0/10: hay CGNAT. El reenvío de puertos no tendrá efecto, porque la conexión se descarta en la red del proveedor. La alternativa es que el dispositivo inicie la conexión hacia un servidor público.
- **c)** 443: HTTPS · 1883: MQTT · 53: DNS · 22: SSH.

---

# Ideas clave

- DNS traduce nombres a direcciones mediante una jerarquía distribuida; las respuestas se guardan en caché durante su TTL.
- La IP identifica al equipo y el puerto identifica al servicio dentro del equipo.
- NAT permite que muchos equipos compartan una IP pública y bloquea las conexiones entrantes no solicitadas.

<div class="cta-red">En un sistema telemático, el dispositivo debe iniciar la conexión hacia el servidor. No conviene depender de que alguien en internet pueda conectarse al dispositivo.</div>

---

# Referencias

- Kurose, J., Ross, K. *Computer Networking: A Top-Down Approach* (8.ª ed.). Pearson, 2021. Capítulos 2 (DNS), 3 (puertos) y 4 (NAT).
- IETF: RFC 1034 y RFC 1035 (DNS), RFC 7766 (DNS sobre TCP), RFC 2606 (dominios de documentación), RFC 3022 (NAT), RFC 6335 (puertos), RFC 6598 (espacio compartido para CGNAT), RFC 5737. [rfc-editor.org](https://www.rfc-editor.org/)
- IANA. *Service Name and Transport Protocol Port Number Registry*. [iana.org/assignments/service-names-port-numbers](https://www.iana.org/assignments/service-names-port-numbers/)
- Root Server Technical Operations Association. [root-servers.org](https://root-servers.org/)

<p class="fuente">Imágenes de Wikimedia Commons: resolución iterativa de DNS (Lion Kimbro, dominio público); tabla de traducción NAT (Yangliy, dominio público). Diagramas restantes: elaboración propia.</p>
