---
titulo: "Modelo TCP/IP y direccionamiento"
subtitulo: IP, máscara, gateway y DHCP
publicado: 2026-10-04
---

# Objetivo de la clase

<div class="ribbon tint-periwinkle">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Explicar por qué las redes se organizan en capas y comparar los modelos OSI y TCP/IP.</li>
<li>Interpretar una dirección IPv4 con su máscara: red, broadcast y rango de hosts.</li>
<li>Explicar la función del gateway predeterminado y del protocolo DHCP.</li>
<li>Diagnosticar, a partir de la configuración IP, por qué un equipo no tiene conexión.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>Modelos en capas: OSI y TCP/IP</li>
<li>Encapsulación</li>
<li>Direcciones IPv4 y máscara de subred</li>
<li>Direcciones privadas y especiales</li>
<li>Gateway predeterminado</li>
<li>DHCP</li>
<li>Diagnóstico de conectividad</li>
</ol>

---

# ¿Por qué capas?

Comunicar dos equipos implica resolver varios problemas a la vez: transmitir bits por un medio, llegar al equipo correcto, entregar los datos al programa correcto y darles significado.

<div class="cols-3">
<div class="card tint-sky"><b>Modularidad</b>Cada capa resuelve un problema y usa el servicio de la capa inferior.</div>
<div class="card tint-sage"><b>Interoperabilidad</b>Equipos de fabricantes distintos se comunican si respetan los mismos protocolos.</div>
<div class="card tint-peach"><b>Diagnóstico</b>Una falla se aísla revisando capa por capa.</div>
</div>

---

# Modelo OSI y modelo TCP/IP

<div class="osi">
<div class="h" style="grid-row:1">OSI (ISO/IEC 7498-1)</div>
<div class="h" style="grid-row:1">TCP/IP (RFC 1122)</div>
<div class="h" style="grid-row:1">Protocolos de ejemplo</div>
<div class="o tint-steel" style="grid-row:2">7 · Aplicación</div>
<div class="o tint-steel" style="grid-row:3">6 · Presentación</div>
<div class="o tint-steel" style="grid-row:4">5 · Sesión</div>
<div class="o tint-steel" style="grid-row:5">4 · Transporte</div>
<div class="o tint-steel" style="grid-row:6">3 · Red</div>
<div class="o tint-steel" style="grid-row:7">2 · Enlace de datos</div>
<div class="o tint-steel" style="grid-row:8">1 · Física</div>
<div class="t tint-salmon" style="grid-column:2; grid-row:2 / 5">Aplicación</div>
<div class="t tint-peach" style="grid-column:2; grid-row:5">Transporte</div>
<div class="t tint-periwinkle" style="grid-column:2; grid-row:6">Internet</div>
<div class="t tint-sky" style="grid-column:2; grid-row:7 / 9">Enlace</div>
<div class="p" style="grid-column:3; grid-row:2 / 5">HTTP · MQTT · DNS · DHCP</div>
<div class="p" style="grid-column:3; grid-row:5">TCP · UDP</div>
<div class="p" style="grid-column:3; grid-row:6">IP · ICMP</div>
<div class="p" style="grid-column:3; grid-row:7 / 9">Ethernet · Wi-Fi (IEEE 802.11)</div>
</div>

<p class="fuente">OSI es un modelo de referencia; TCP/IP es el conjunto de protocolos que usa internet. Kurose y Ross usan una versión de cinco capas que separa la capa física del enlace.</p>

---

# Capas de TCP/IP

<div class="layers">
<div class="tint-salmon"><b>Aplicación</b><span>Formato y significado de los mensajes entre programas: HTTP, MQTT, DNS, DHCP.</span></div>
<div class="tint-peach"><b>Transporte</b><span>Comunicación entre procesos mediante puertos. TCP es confiable y ordenado; UDP es más simple y no garantiza la entrega.</span></div>
<div class="tint-periwinkle"><b>Internet</b><span>Direccionamiento y enrutamiento entre redes distintas: protocolo IP.</span></div>
<div class="tint-sky"><b>Enlace</b><span>Transmisión dentro de una misma red física (Ethernet, Wi-Fi), con direcciones MAC de 48 bits.</span></div>
</div>

---

# Hosts y routers

<div class="cols-2">
<div>

- Los **hosts** (computadoras, servidores, dispositivos IoT) implementan las cuatro capas.
- Los **routers** reenvían paquetes entre redes. Para eso procesan hasta la capa de internet.
- Entre router y router, el enlace puede ser de distinto tipo: fibra, satélite, Ethernet.

</div>
<div>
<figure>
<img src="./ip-stack-connections.svg" alt="Flujo de datos entre dos hosts a través de routers según el modelo TCP/IP" style="max-height: 420px">
<figcaption>Imagen: Kbrose, Wikimedia Commons, CC BY-SA 3.0.</figcaption>
</figure>
</div>
</div>

---

# Encapsulación

<div class="cols-2">
<div>

Al bajar por las capas, cada una agrega su propio **encabezado** a los datos que recibe. El equipo receptor los retira en orden inverso.

| Capa | Unidad de datos |
|---|---|
| Aplicación | Mensaje |
| Transporte | Segmento (TCP) o datagrama (UDP) |
| Internet | Paquete |
| Enlace | Trama |

</div>
<div>
<figure>
<img src="./udp-encapsulation.svg" alt="Encapsulación de datos de aplicación en UDP, IP y trama de enlace">
<figcaption>Imagen: Cburnett, colorización de Kbrose, Wikimedia Commons, CC BY-SA 3.0.</figcaption>
</figure>
</div>
</div>

---

<!-- .slide: class="divider" -->

# Direccionamiento IPv4

---

# Dirección IPv4

<div class="cols-2">
<div>

- Número de **32 bits** que identifica una interfaz de red (RFC 791).
- Se escribe en **notación decimal con puntos**: cuatro octetos de 0 a 255.
- Total de combinaciones: 2<sup>32</sup> = 4&nbsp;294&nbsp;967&nbsp;296.

</div>
<div>
<figure>
<img src="./ipv4-address.svg" alt="Dirección IPv4 172.16.254.1 en decimal y en binario">
<figcaption>Imagen: Indeterminate, Wikimedia Commons, dominio público.</figcaption>
</figure>
</div>
</div>

---

# Parte de red y parte de host

La **máscara de subred** indica qué bits de la dirección identifican la red y cuáles identifican al equipo dentro de esa red.

| | Decimal | Binario |
|---|---|---|
| Dirección | 192.168.1.37 | <code class="bits"><span class="net">11000000.10101000.00000001</span>.<span class="host">00100101</span></code> |
| Máscara | 255.255.255.0 | <code class="bits"><span class="net">11111111.11111111.11111111</span>.<span class="host">00000000</span></code> |

<span class="legend"><i class="tint-periwinkle"></i> Red: 192.168.1</span><span class="legend"><i class="tint-peach"></i> Host: 37</span>

Notación **CIDR**: la máscara se escribe como la cantidad de bits en 1. Por ejemplo, 192.168.1.37<strong>/24</strong> (RFC 4632).

---

# Máscaras frecuentes

<div class="cols-2">
<div>

| CIDR | Máscara | Hosts útiles |
|---|---|---|
| /8 | 255.0.0.0 | 16&nbsp;777&nbsp;214 |
| /16 | 255.255.0.0 | 65&nbsp;534 |
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /30 | 255.255.255.252 | 2 |

</div>
<div>
<div class="card tint-lime"><b>Hosts útiles</b>
<p class="lead">2<sup>(32 − n)</sup> − 2</p>
<p>Se restan dos direcciones de cada red: la <strong>dirección de red</strong> (todos los bits de host en 0) y la de <strong>broadcast</strong> (todos en 1).</p>
</div>
</div>
</div>

---

# Cálculo paso a paso: 192.168.1.37/26

<div class="cols-2">
<div>
<ol class="steps">
<li>/26 equivale a la máscara 255.255.255.192.</li>
<li>Tamaño de bloque en el último octeto: 256 − 192 = 64.</li>
<li>Las redes empiezan en .0, .64, .128 y .192.</li>
<li>El .37 cae en el bloque que va de .0 a .63.</li>
</ol>
</div>
<div>

| Resultado | Valor |
|---|---|
| Red | 192.168.1.0 |
| Broadcast | 192.168.1.63 |
| Primer host | 192.168.1.1 |
| Último host | 192.168.1.62 |
| Hosts útiles | 62 |

</div>
</div>

---

# Direcciones privadas y especiales

| Rango | Uso | Referencia |
|---|---|---|
| 10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16 | Privadas: redes locales; no se enrutan en internet | RFC 1918 |
| 127.0.0.0/8 | Loopback: el propio equipo (127.0.0.1) | RFC 1122 |
| 169.254.0.0/16 | Enlace local: el equipo se asigna una dirección cuando no obtiene respuesta de DHCP | RFC 3927 |
| 255.255.255.255 | Broadcast limitado: todos los equipos de la red local | RFC 919 |

<p class="fuente">El registro completo de rangos de uso especial está en RFC 6890 (IANA). La traducción entre direcciones privadas y públicas (NAT) se estudia en el tema 1.3.</p>

---

# Gateway predeterminado

<svg class="diagram" viewBox="0 0 1150 400" style="max-height: 330px" role="img" aria-label="Red local con tres equipos conectados a un router que actúa como gateway hacia internet">
<defs>
<marker id="gw-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker>
</defs>
<rect x="6" y="6" width="700" height="388" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="10 8"/>
<text x="24" y="384" font-size="18" font-weight="700">RED LOCAL 192.168.1.0/24</text>
<g font-weight="700">
<rect x="30" y="30" width="250" height="76" fill="#c0d4a7" stroke="#000" stroke-width="2"/><text x="48" y="62" font-size="20">LAPTOP</text><text x="48" y="90" font-size="18" class="mono">192.168.1.20</text>
<rect x="30" y="150" width="250" height="76" fill="#e6915d" stroke="#000" stroke-width="2"/><text x="48" y="182" font-size="20">ESP32</text><text x="48" y="210" font-size="18" class="mono">192.168.1.37</text>
<rect x="30" y="270" width="250" height="76" fill="#9ab6c8" stroke="#000" stroke-width="2"/><text x="48" y="302" font-size="20">CELULAR</text><text x="48" y="330" font-size="18" class="mono">192.168.1.50</text>
</g>
<g stroke="#000" stroke-width="3">
<line x1="280" y1="68" x2="420" y2="188"/><line x1="280" y1="188" x2="420" y2="188"/><line x1="280" y1="308" x2="420" y2="188"/>
</g>
<rect x="420" y="128" width="260" height="120" fill="#d77a7a" stroke="#000" stroke-width="2"/>
<g font-weight="700"><text x="440" y="162" font-size="20">ROUTER (GATEWAY)</text><text x="440" y="196" font-size="18" class="mono">LAN 192.168.1.1</text><text x="440" y="226" font-size="18" class="mono">WAN 198.51.100.7</text></g>
<line x1="680" y1="188" x2="790" y2="188" stroke="#000" stroke-width="4" marker-end="url(#gw-head)"/>
<ellipse cx="880" cy="188" rx="86" ry="56" fill="#fff" stroke="#000" stroke-width="2"/>
<text x="880" y="195" font-size="20" font-weight="700" text-anchor="middle">INTERNET</text>
<line x1="966" y1="188" x2="990" y2="188" stroke="#000" stroke-width="4" marker-end="url(#gw-head)"/>
<rect x="992" y="140" width="156" height="96" fill="#8c9ae0" stroke="#000" stroke-width="2"/>
<g font-weight="700"><text x="1006" y="178" font-size="20">SERVIDOR</text><text x="1006" y="210" font-size="16" class="mono">203.0.113.10</text></g>
</svg>

El **gateway** es el router de la red local. Un equipo le envía todo paquete cuyo destino está fuera de su red.

<p class="fuente">Las direcciones 198.51.100.0/24 y 203.0.113.0/24 están reservadas para documentación (RFC 5737).</p>

---

# ¿Entrega directa o al gateway?

El equipo aplica la máscara (operación AND) a su propia dirección y a la de destino, y compara el resultado.

| Origen (ESP32) | Destino | Red del destino | Decisión |
|---|---|---|---|
| 192.168.1.37/24 | 192.168.1.20 | 192.168.1.0 | Misma red: entrega directa |
| 192.168.1.37/24 | 203.0.113.10 | 203.0.113.0 | Otra red: envía al gateway 192.168.1.1 |

En los dos casos, el protocolo **ARP** (RFC 826) obtiene la dirección MAC del siguiente salto: el destino o el gateway.

---

# Configuración estática o automática

<div class="cols-2">
<div class="card tint-steel"><b>Estática</b>
<p>IP, máscara, gateway y DNS se escriben a mano en cada equipo.</p>
<p>Se usa en servidores, impresoras y equipos que otros deben encontrar siempre en la misma dirección.</p>
<p>Riesgo: errores de digitación y direcciones duplicadas.</p>
</div>
<div class="card tint-sage"><b>Automática (DHCP)</b>
<p>El equipo recibe su configuración de un servidor DHCP al conectarse.</p>
<p>Es el método habitual en redes domésticas, de oficina y de laboratorio.</p>
<p>Una <strong>reserva DHCP</strong> asigna siempre la misma IP a una dirección MAC: es la opción usual para dispositivos IoT que deben ser localizables.</p>
</div>
</div>

---

# DHCP: intercambio DORA

<svg class="diagram" viewBox="0 0 1150 440" role="img" aria-label="Secuencia DHCP: Discover, Offer, Request y Ack entre cliente y servidor">
<defs>
<marker id="dora-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker>
</defs>
<rect x="40" y="6" width="280" height="56" fill="#e6915d" stroke="#000" stroke-width="2"/>
<text x="180" y="42" font-size="20" font-weight="700" text-anchor="middle">CLIENTE (ESP32)</text>
<rect x="830" y="6" width="280" height="56" fill="#d77a7a" stroke="#000" stroke-width="2"/>
<text x="970" y="42" font-size="20" font-weight="700" text-anchor="middle">SERVIDOR DHCP (ROUTER)</text>
<g stroke="#000" stroke-width="2" stroke-dasharray="8 8"><line x1="180" y1="62" x2="180" y2="430"/><line x1="970" y1="62" x2="970" y2="430"/></g>
<g stroke="#000" stroke-width="4">
<line x1="184" y1="130" x2="962" y2="130" marker-end="url(#dora-head)"/>
<line x1="966" y1="220" x2="188" y2="220" marker-end="url(#dora-head)"/>
<line x1="184" y1="310" x2="962" y2="310" marker-end="url(#dora-head)"/>
<line x1="966" y1="400" x2="188" y2="400" marker-end="url(#dora-head)"/>
</g>
<g font-size="20" font-weight="700" text-anchor="middle">
<text x="575" y="116">1 · DHCPDISCOVER: ¿hay un servidor DHCP?</text>
<text x="575" y="206">2 · DHCPOFFER: ofrece 192.168.1.37</text>
<text x="575" y="296">3 · DHCPREQUEST: solicita 192.168.1.37</text>
<text x="575" y="386">4 · DHCPACK: confirma la configuración</text>
</g>
<g font-size="16" text-anchor="middle" class="mono">
<text x="575" y="156">0.0.0.0:68 → 255.255.255.255:67 (broadcast)</text>
<text x="575" y="336">el cliente todavía no tiene IP: vuelve a usar broadcast</text>
<text x="575" y="426">IP, máscara, gateway, DNS y tiempo de concesión</text>
</g>
</svg>

<p class="fuente">DHCP usa UDP: el servidor escucha en el puerto 67 y el cliente en el 68 (RFC 2131).</p>

---

# Qué entrega DHCP

| Parámetro | Ejemplo | Campo u opción (RFC 2132) |
|---|---|---|
| Dirección IP | 192.168.1.37 | campo *yiaddr* |
| Máscara de subred | 255.255.255.0 | opción 1 |
| Gateway (router) | 192.168.1.1 | opción 3 |
| Servidor DNS | 192.168.1.1 | opción 6 |
| Tiempo de concesión | 86&nbsp;400 s (24 h) | opción 51 |

La dirección se **presta** por un tiempo. Por defecto, el cliente intenta renovarla cuando transcurre el 50 % de la concesión (RFC 2131).

---

# IPv6 en una diapositiva

<div class="cols-2">
<div>

- Direcciones de **128 bits**, escritas en ocho grupos hexadecimales de 16 bits (RFC 8200).
- Ejemplo: `2001:db8::1`. Los ceros consecutivos se abrevian con `::` (RFC 5952).
- IANA entregó los últimos bloques libres de IPv4 a los registros regionales en febrero de 2011.

</div>
<div>
<div class="card tint-sky"><b>En este curso</b>
<p>Hoy IPv4 e IPv6 conviven. Los ejemplos y laboratorios del curso usan IPv4, que sigue siendo lo habitual en redes locales y en dispositivos como el ESP32.</p>
</div>
</div>
</div>

<p class="fuente">El prefijo 2001:db8::/32 está reservado para documentación (RFC 3849).</p>

---

# Diagnóstico por pasos

<ol class="steps">
<li>¿Tiene dirección IP? <code>ipconfig</code> (Windows) · <code>ip addr</code> (Linux) · <code>ifconfig</code> (macOS)</li>
<li>¿La IP, la máscara y el gateway son coherentes? El gateway debe estar en la misma red.</li>
<li>¿Responde el gateway? <code>ping 192.168.1.1</code></li>
<li>¿Responde un equipo en internet? <code>ping 8.8.8.8</code></li>
<li>¿Se resuelven los nombres? <code>ping www.espol.edu.ec</code> (DNS, tema 1.3)</li>
</ol>

Cada paso descarta una capa. El primero que falla indica dónde está el problema.

---

# Síntomas frecuentes

| Lo que se observa | Causa probable |
|---|---|
| Sin dirección IPv4, o una 169.254.x.x | No hubo respuesta de un servidor DHCP |
| El gateway está fuera de la red del equipo | Configuración estática incorrecta |
| Responde el gateway, pero no 8.8.8.8 | Falla entre el router y el proveedor de internet |
| Responde 8.8.8.8, pero no los nombres | Falla de DNS |
| Conexión intermitente en dos equipos | Dirección IP duplicada |

---

# Ejercicio 1 · Cálculo

Para cada dirección, determine la máscara en decimal, la dirección de red, la de broadcast, el rango de hosts y la cantidad de hosts útiles.

<div class="cols-2">
<div class="card tint-periwinkle"><b>a)</b><p class="lead"><code>10.20.5.130/25</code></p></div>
<div class="card tint-peach"><b>b)</b><p class="lead"><code>172.16.40.10/20</code></p></div>
</div>

Note:
Dar 8 a 10 minutos. La solución está en la diapositiva inferior (flecha hacia abajo).

--

## Solución · Ejercicio 1

| | a) 10.20.5.130/25 | b) 172.16.40.10/20 |
|---|---|---|
| Máscara | 255.255.255.128 | 255.255.240.0 |
| Red | 10.20.5.128 | 172.16.32.0 |
| Broadcast | 10.20.5.255 | 172.16.47.255 |
| Rango de hosts | 10.20.5.129 a 10.20.5.254 | 172.16.32.1 a 172.16.47.254 |
| Hosts útiles | 126 | 4094 |

<p class="fuente">En b), el bloque está en el tercer octeto: 256 − 240 = 16. Las redes empiezan en 32, 48, 64…, y el 40 cae en el bloque de 32 a 47.</p>

---

# Ejercicio 2 · Diagnóstico

¿Por qué no tiene conexión cada equipo?

<div class="cols-3">
<div class="card tint-sky"><b>Laptop A</b><p>IP 169.254.12.7<br>Máscara 255.255.0.0<br>Sin gateway</p></div>
<div class="card tint-lime"><b>Laptop B</b><p>IP 192.168.0.15/24<br>Gateway 192.168.1.1</p></div>
<div class="card tint-salmon"><b>PC C</b><p>IP 192.168.1.40/24<br>Gateway 192.168.1.1<br><code>ping 8.8.8.8</code> responde<br>No abre www.espol.edu.ec</p></div>
</div>

--

## Solución · Ejercicio 2

- **Laptop A:** no recibió respuesta de DHCP y se asignó una dirección de enlace local (169.254.0.0/16). Hay que revisar la conexión a la red y el servidor DHCP.
- **Laptop B:** el gateway 192.168.1.1 no pertenece a su red (192.168.0.0/24). Hay que corregir la configuración estática o usar DHCP.
- **PC C:** llega a internet por IP, pero no resuelve nombres. La falla está en DNS (tema 1.3).

---

# Ideas clave

- TCP/IP organiza la comunicación en cuatro capas: aplicación, transporte, internet y enlace.
- La máscara separa la parte de red de la parte de host de una dirección IPv4.
- Un equipo entrega directamente dentro de su red y envía al gateway todo lo demás.
- DHCP asigna automáticamente la IP, la máscara, el gateway y el DNS.

<div class="cta-red">Para diagnosticar una conexión, revise primero la configuración IP: dirección, máscara y gateway deben ser coherentes entre sí.</div>

---

# Referencias

- Kurose, J., Ross, K. *Computer Networking: A Top-Down Approach* (8.ª ed.). Pearson, 2021. Capítulos 1 y 4.
- ISO/IEC 7498-1:1994. *Open Systems Interconnection: Basic Reference Model*.
- IETF: RFC 791 (IPv4), RFC 826 (ARP), RFC 919 (broadcast), RFC 1122 (requisitos de hosts), RFC 1918 (direcciones privadas), RFC 2131 (DHCP), RFC 2132 (opciones DHCP), RFC 3927 (enlace local), RFC 4632 (CIDR), RFC 5737, RFC 6890, RFC 8200 (IPv6). Disponibles en [rfc-editor.org](https://www.rfc-editor.org/).

<p class="fuente">Imágenes de Wikimedia Commons: IP stack connections (Kbrose, CC BY-SA 3.0); UDP encapsulation (Cburnett y Kbrose, CC BY-SA 3.0); IPv4 address (Indeterminate, dominio público). Diagramas restantes: elaboración propia.</p>
