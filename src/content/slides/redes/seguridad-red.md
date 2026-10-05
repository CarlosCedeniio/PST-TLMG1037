---
titulo: "Seguridad: exposición de puertos y riesgos de red"
subtitulo: Qué ocurre cuando un dispositivo queda accesible desde internet y cómo evitarlo
publicado: 2026-10-04
---

# Objetivo de la clase

<div class="ribbon tint-periwinkle">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Explicar qué es la superficie de ataque de un sistema conectado.</li>
<li>Identificar los riesgos de exponer dispositivos y servicios a internet.</li>
<li>Analizar un caso real: la botnet Mirai.</li>
<li>Aplicar buenas prácticas básicas de configuración de red al proyecto del equipo.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>Superficie de ataque</li>
<li>Cómo se encuentran los dispositivos expuestos</li>
<li>Caso: Mirai (2016)</li>
<li>Riesgos frecuentes en IoT</li>
<li>Reenvío de puertos y UPnP</li>
<li>Buenas prácticas y referencias</li>
<li>Lista de verificación para el proyecto</li>
</ol>

---

# Superficie de ataque

> La **superficie de ataque** es el conjunto de puntos por los que un tercero puede intentar entrar o interactuar con un sistema: puertos abiertos, servicios, interfaces web, APIs, credenciales y el propio hardware.

<div class="cols-3">
<div class="card tint-sky"><b>Red</b>Puertos abiertos y servicios que escuchan en ellos.</div>
<div class="card tint-peach"><b>Aplicación</b>Paneles web, APIs y brokers sin autenticación o con credenciales débiles.</div>
<div class="card tint-sage"><b>Dispositivo</b>Firmware desactualizado, puertos de depuración y acceso físico.</div>
</div>

Cada servicio que se deja accesible amplía esa superficie. Reducirla es la primera medida de seguridad.

---

# Internet se escanea

<div class="cols-2">
<div>

- Hay sistemas que recorren todas las direcciones IPv4 públicas y registran qué puertos responden.
- **Shodan** y **Censys** publican esos resultados: cámaras, routers, PLC o brokers MQTT accesibles.
- Un servicio expuesto recibe intentos de conexión poco después de quedar en línea, aunque nadie haya publicado su dirección.

</div>
<div>
<div class="card tint-salmon"><b>Consecuencia</b>
<p>No basta con que la dirección sea "difícil de adivinar". Si un puerto responde desde internet, alguien lo va a encontrar.</p>
</div>
</div>
</div>

---

# Caso: Mirai (2016)

<div class="flow compact">
<div class="node tint-steel"><b>Agosto</b>Se detecta un malware que infecta cámaras IP, grabadores y routers</div>
<div class="arrow"></div>
<div class="node tint-peach"><b>20 de septiembre</b>Ataque de denegación de servicio de 620 Gbps contra KrebsOnSecurity</div>
<div class="arrow"></div>
<div class="node tint-sky"><b>30 de septiembre</b>Se publica el código fuente</div>
<div class="arrow"></div>
<div class="node tint-salmon"><b>21 de octubre</b>Ataque contra Dyn, proveedor de DNS: servicios muy usados quedan inaccesibles por horas</div>
</div>

- **Cómo se propagaba:** buscaba equipos con Telnet abierto (puertos 23 y 2323) y probaba una lista de unas 60 combinaciones de usuario y contraseña de fábrica.
- **Escala:** llegó a unos 600&nbsp;000 dispositivos infectados.
- **Relación con el tema 1.3:** al atacar un proveedor de DNS, sitios sin ningún problema propio dejaron de poder resolverse.

<p class="fuente">Antonakakis, M. et al. Understanding the Mirai Botnet. USENIX Security Symposium, 2017. Krebs, B. KrebsOnSecurity Hit With Record DDoS, 2016.</p>

---

# Riesgos frecuentes en IoT

<div class="cols-3">
<div class="card tint-salmon"><b>Credenciales de fábrica</b>Usuarios como admin/admin que nunca se cambian.</div>
<div class="card tint-peach"><b>Servicios sin autenticación</b>Brokers MQTT, bases de datos o paneles abiertos a cualquiera.</div>
<div class="card tint-sky"><b>Tráfico sin cifrar</b>HTTP, Telnet o MQTT sin TLS: credenciales y datos legibles.</div>
<div class="card tint-lime"><b>Firmware desactualizado</b>Vulnerabilidades conocidas que no se corrigen.</div>
<div class="card tint-steel"><b>Servicios innecesarios</b>Telnet, FTP o páginas de prueba que quedan activos.</div>
<div class="card tint-sage"><b>Red plana</b>Dispositivos IoT en la misma red que las computadoras con información sensible.</div>
</div>

---

# Reenvío de puertos

<svg class="diagram" viewBox="0 0 1150 320" style="max-height: 320px" role="img" aria-label="Un escáner en internet accede al panel del ESP32 a través de una regla de reenvío de puertos en el router">
<defs><marker id="pf-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g font-weight="700">
<rect x="20" y="110" width="240" height="100" fill="#a5b8c0" stroke="#000" stroke-width="2"/><text x="38" y="148" font-size="20">CUALQUIER EQUIPO</text><text x="38" y="176" font-size="20">EN INTERNET</text>
<rect x="420" y="80" width="300" height="160" fill="#d77a7a" stroke="#000" stroke-width="2"/><text x="440" y="116" font-size="20">ROUTER</text><text x="440" y="144" font-size="16" class="mono">198.51.100.7</text>
<rect x="440" y="160" width="260" height="62" fill="#fff" stroke="#000" stroke-width="2"/><text x="452" y="186" font-size="15">REGLA DE REENVÍO</text><text x="452" y="210" font-size="15" class="mono">:8080 → 192.168.1.37:80</text>
<rect x="880" y="110" width="250" height="100" fill="#e6915d" stroke="#000" stroke-width="2"/><text x="898" y="148" font-size="20">ESP32</text><text x="898" y="176" font-size="16">panel web en el puerto 80</text>
</g>
<g stroke="#000" stroke-width="4"><line x1="260" y1="160" x2="414" y2="160" marker-end="url(#pf-head)"/><line x1="720" y1="160" x2="874" y2="160" marker-end="url(#pf-head)"/></g>
<text x="264" y="142" font-size="13" class="mono">198.51.100.7:8080</text>
<rect x="420" y="268" width="560" height="40" fill="#000"/><text x="436" y="295" font-size="18" font-weight="700" fill="#fff">EL DISPOSITIVO QUEDA EXPUESTO A TODO INTERNET</text>
</svg>

El reenvío de puertos (*port forwarding*) anula la protección que daba NAT. Todo lo que llega a ese puerto público se entrega al dispositivo, venga de quien venga.

---

# UPnP y apertura automática de puertos

<div class="cols-2">
<div>

- **UPnP IGD** permite que un equipo de la red local le pida al router que abra un puerto, sin intervención del usuario.
- Muchos dispositivos lo usan para ser accesibles desde fuera sin configuración.
- El resultado puede ser un puerto abierto que nadie sabe que existe.

</div>
<div>
<div class="card tint-peach"><b>Recomendación</b>
<p>Desactivar UPnP en el router, salvo que haya una razón concreta.</p>
<p>Revisar periódicamente la lista de reenvíos activos en el panel del router.</p>
</div>
</div>
</div>

---

# Dos arquitecturas

<span class="sticker">Expuesta</span>
<div class="flow compact">
<div class="node"><b>Usuario</b>en internet</div>
<div class="arrow"></div>
<div class="node tint-salmon"><b>Router</b>reenvío :8080</div>
<div class="arrow"></div>
<div class="node tint-peach"><b>ESP32</b>panel HTTP, admin/admin</div>
</div>

<span class="sticker">Recomendada</span>
<div class="flow compact">
<div class="node tint-peach"><b>ESP32</b>inicia la conexión</div>
<div class="arrow"></div>
<div class="node tint-sky"><b>Servidor</b>HTTPS o MQTT con TLS; autenticación</div>
<div class="arrow both"></div>
<div class="node tint-lime"><b>Usuario</b>panel con usuario y contraseña</div>
</div>

En la arquitectura recomendada, el router no tiene puertos abiertos hacia el dispositivo. Toda la exposición se concentra en un servidor que se puede proteger y actualizar.

---

# Buenas prácticas de red

<div class="cols-2">
<div>
<ol class="steps">
<li><strong>Cambiar credenciales de fábrica</strong> en dispositivos, routers y servicios.</li>
<li><strong>Cerrar lo que no se usa:</strong> desactivar Telnet, FTP y servicios de prueba.</li>
<li><strong>No reenviar puertos</strong> hacia dispositivos; desactivar UPnP.</li>
<li><strong>Escuchar solo donde hace falta:</strong> 127.0.0.1 para servicios internos.</li>
</ol>
</div>
<div>
<ol class="steps" style="counter-reset: paso 4">
<li><strong>Segmentar la red:</strong> red separada o VLAN para los dispositivos IoT.</li>
<li><strong>Cifrar:</strong> HTTPS y MQTT sobre TLS (temas 2.8 y 3.9).</li>
<li><strong>Actualizar</strong> el firmware y las bibliotecas.</li>
<li><strong>Mínimo privilegio:</strong> cada usuario y dispositivo, solo con los permisos que necesita.</li>
</ol>
</div>
</div>

---

# OWASP IoT Top 10 (2018)

<div class="cols-2">
<div>

| # | Riesgo |
|---|---|
| I1 | Weak, Guessable, or Hardcoded Passwords |
| I2 | Insecure Network Services |
| I3 | Insecure Ecosystem Interfaces |
| I4 | Lack of Secure Update Mechanism |
| I5 | Use of Insecure or Outdated Components |

</div>
<div>

| # | Riesgo |
|---|---|
| I6 | Insufficient Privacy Protection |
| I7 | Insecure Data Transfer and Storage |
| I8 | Lack of Device Management |
| I9 | Insecure Default Settings |
| I10 | Lack of Physical Hardening |

</div>
</div>

Este tema cubre principalmente I1, I2, I7 e I9. Los demás se retoman en las unidades 2 a 4.

<p class="fuente">OWASP Internet of Things Project. owasp.org/www-project-internet-of-things</p>

---

# NIST IR 8259A: capacidades mínimas

| Capacidad | Qué significa para el proyecto |
|---|---|
| Identificación del dispositivo | Cada dispositivo tiene un identificador único |
| Configuración | Se puede cambiar su configuración, solo por quien está autorizado |
| Protección de datos | Los datos almacenados y transmitidos se protegen, por ejemplo con cifrado |
| Acceso lógico a interfaces | Las interfaces locales y de red se pueden restringir o desactivar |
| Actualización de software | El firmware se puede actualizar de forma segura |
| Conciencia del estado de seguridad | El dispositivo informa de su estado, por ejemplo, intentos de acceso |

<p class="fuente">NIST. IoT Device Cybersecurity Capability Core Baseline (NISTIR 8259A), 2020.</p>

---

# Revisar solo lo propio

<div class="cols-2">
<div>

- Herramientas como `nmap` muestran qué puertos responde un equipo.
- Se usan para **auditar los equipos propios** o aquellos sobre los que se tiene autorización por escrito.
- El router suele mostrar en su panel los reenvíos y las reglas activas.

</div>
<div>
<div class="card tint-salmon"><b>Marco legal</b>
<p>En Ecuador, el acceso no consentido a un sistema informático, telemático o de telecomunicaciones está tipificado como delito en el Código Orgánico Integral Penal (COIP, art. 234).</p>
</div>
</div>
</div>

---

# Ejercicio · Analizar una configuración

Un equipo publica así el panel de su proyecto:

<div class="cols-2">
<ol class="steps">
<li>Regla en el router: <code>:8080 → 192.168.1.37:80</code></li>
<li>Panel por HTTP con usuario <code>admin</code> y contraseña <code>admin</code></li>
<li>El ESP32 está en la misma red Wi-Fi que las computadoras de la casa</li>
</ol>
<ol class="steps" style="counter-reset: paso 3">
<li>UPnP activado en el router</li>
<li>Firmware compilado hace dos años, sin actualizar</li>
<li>El broker MQTT de pruebas escucha en <code>0.0.0.0:1883</code> sin contraseña</li>
</ol>
</div>

Identifique el riesgo de cada punto y proponga una corrección.

--

## Solución

| # | Riesgo | Corrección |
|---|---|---|
| 1 | El panel queda expuesto a internet | Eliminar el reenvío; el dispositivo se conecta a un servidor |
| 2 | Credenciales de fábrica y tráfico legible | Credenciales propias; HTTPS en el servidor |
| 3 | Un dispositivo comprometido alcanza las computadoras | Red separada o VLAN para IoT |
| 4 | Puertos abiertos sin que nadie lo sepa | Desactivar UPnP |
| 5 | Vulnerabilidades conocidas sin corregir | Actualizar firmware y bibliotecas |
| 6 | Cualquiera publica o lee mensajes | Usuario y contraseña en el broker; TLS (tema 3.9) |

---

# Lista de verificación del proyecto

<div class="ribbon tint-lime">
<h3>Antes de cada entrega, el equipo comprueba que</h3>
<ul>
<li>No hay reenvío de puertos hacia ningún dispositivo del proyecto.</li>
<li>Ninguna credencial de fábrica ni contraseña está escrita en el código del repositorio.</li>
<li>Cada servicio que escucha en la red tiene autenticación.</li>
<li>Los datos viajan cifrados entre el dispositivo, el servidor y el usuario.</li>
<li>Se puede explicar qué puertos abre cada componente y por qué.</li>
</ul>
</div>

---

# Ideas clave

- Todo puerto que responde desde internet forma parte de la superficie de ataque y será encontrado.
- Mirai mostró el efecto de cientos de miles de dispositivos con credenciales de fábrica y servicios expuestos.
- El reenvío de puertos y UPnP anulan la protección que da NAT.

<div class="cta-red">El dispositivo no debe ser accesible desde internet: se conecta hacia un servidor protegido, con autenticación y cifrado.</div>

---

# Referencias

- Antonakakis, M. et al. *Understanding the Mirai Botnet*. 26th USENIX Security Symposium, 2017. [usenix.org](https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/antonakakis)
- OWASP. *Internet of Things Top 10*, 2018. [owasp.org/www-project-internet-of-things](https://owasp.org/www-project-internet-of-things/)
- NIST. *IoT Device Cybersecurity Capability Core Baseline* (NISTIR 8259A), 2020. [doi.org/10.6028/NIST.IR.8259A](https://doi.org/10.6028/NIST.IR.8259A)
- Kurose, J., Ross, K. *Computer Networking: A Top-Down Approach* (8.ª ed.). Pearson, 2021. Capítulo 8.
- Código Orgánico Integral Penal (Ecuador), art. 234.

<p class="fuente">Diagramas: elaboración propia.</p>
