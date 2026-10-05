---
titulo: Sistemas telemáticos y arquitectura end-to-end
subtitulo: Qué es un sistema telemático, de qué capas se compone y cómo viaja un dato de extremo a extremo
publicado: 2026-10-04
---

# Objetivo de la clase

<div class="ribbon tint-periwinkle">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Definir qué es un sistema telemático y reconocerlo en aplicaciones reales.</li>
<li>Describir las cinco capas de una arquitectura end-to-end y la función de cada una.</li>
<li>Seguir el recorrido de una lectura desde el sensor hasta la aplicación, y el de un comando en sentido contrario.</li>
<li>Plantear el problema real que resolverá el proyecto de su equipo.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>Qué es un sistema telemático</li>
<li>Ejemplos de aplicación</li>
<li>Arquitectura end-to-end en cinco capas</li>
<li>Recorrido de un dato y de un comando</li>
<li>Modelo de referencia ITU-T Y.2060</li>
<li>Criterios de diseño</li>
<li>Proyecto del curso: definición del problema</li>
</ol>

---

# Telemática

<div class="flow">
<div class="node tint-sky"><b>Telecomunicaciones</b>Transmitir información a distancia</div>
<div class="op">+</div>
<div class="node tint-lime"><b>Informática</b>Procesar y almacenar información</div>
<div class="op">=</div>
<div class="node tint-peach"><b>Telemática</b>Servicios que combinan ambas</div>
</div>

El término proviene del francés *télématique*. Lo propusieron Simon Nora y Alain Minc en el informe *L'informatisation de la société* (1978), dirigido al gobierno de Francia.

---

# Sistema telemático

> Un sistema telemático **adquiere datos** de un proceso físico, los **transmite** por una red, los **almacena y procesa** en un servidor, y permite **supervisar o actuar** sobre ese proceso a distancia.

En Mecatrónica, el proceso físico suele ser una máquina, un robot, una línea de producción, un vehículo o una instalación en campo.

Note:
Pedir a los estudiantes que identifiquen los cuatro verbos de la definición en un sistema que conozcan.

---

# Ejemplos de aplicación

<div class="cols-3">
<div class="card tint-sky"><b>Flotas de vehículos</b>Posición GPS, velocidad y estado del motor enviados por red celular.</div>
<div class="card tint-salmon"><b>Mantenimiento predictivo</b>Vibración y temperatura de motores para anticipar fallas.</div>
<div class="card tint-sage"><b>Agricultura</b>Humedad del suelo y control de riego en el campo.</div>
<div class="card tint-peach"><b>Medición de servicios</b>Medidores de agua o energía que reportan el consumo sin lectura manual.</div>
<div class="card tint-lime"><b>Edificios</b>Climatización, accesos y consumo energético supervisados desde un panel.</div>
<div class="card tint-periwinkle"><b>Supervisión industrial</b>Sistemas SCADA: telemetría de plantas, tuberías y subestaciones.</div>
</div>

Note:
Preguntar qué variables se miden y qué se controla en cada caso. Pedir un ejemplo adicional del entorno de los estudiantes.

---

# Arquitectura end-to-end

<div class="flow">
<div class="node tint-peach"><b>Dispositivo</b>Mide y actúa</div>
<div class="arrow both"></div>
<div class="node tint-periwinkle"><b>Red</b>Transporta</div>
<div class="arrow both"></div>
<div class="node tint-salmon"><b>Servidor</b>Recibe, valida y decide</div>
<div class="arrow both"></div>
<div class="node tint-sky"><b>Datos</b>Guarda el historial</div>
<div class="arrow both"></div>
<div class="node tint-lime"><b>Aplicación</b>Muestra y permite actuar</div>
</div>
<div class="bar">Seguridad: se aplica en cada una de las capas</div>

*End-to-end* significa que el sistema se diseña y se prueba completo, desde el sensor hasta la pantalla del usuario. Si una capa falla, el sistema completo deja de funcionar.

---

# Capa 1 · Dispositivo

<div class="cols-2">
<div>

- **Función:** medir variables físicas y ejecutar acciones.
- **Sensores:** temperatura, humedad, corriente, vibración, posición.
- **Actuadores:** relés, motores, válvulas.
- **Controlador:** un microcontrolador con conectividad, por ejemplo el ESP32, que integra Wi-Fi y Bluetooth.

</div>
<div>
<figure>
<img src="./esp32-devkit.jpg" alt="Placa de desarrollo ESP32 DevKit">
<figcaption>Placa ESP32 DevKit (ESP-WROOM-32). Foto: Ubahnverleih, Wikimedia Commons, CC0.</figcaption>
</figure>
</div>
</div>

---

# Capa 2 · Red

<div class="cols-2">
<div>

- **Función:** llevar las lecturas al servidor y los comandos de vuelta al dispositivo.
- **Tramo local:** Wi-Fi, Ethernet, Bluetooth LE, LoRa.
- **Tramo de internet:** router, proveedor de internet (ISP) y centros de datos.
- **Protocolos:** TCP/IP como base; HTTP y MQTT para los mensajes.

</div>
<div>
<div class="card tint-periwinkle"><b>En el curso</b>
<p>Unidad 1: redes TCP/IP, servicios de red y HTTP.</p>
<p>Unidad 3: conectividad inalámbrica y MQTT.</p>
</div>
</div>
</div>

---

# Capa 3 · Servidor

<div class="cols-2">
<div>

- **Función:** recibir lecturas, validarlas, aplicar reglas y enviar comandos.
- Expone una **API HTTP** o un **broker de mensajes** (MQTT) al que se conectan los dispositivos.
- Puede ser un servicio en la nube o un equipo propio administrado por el equipo de desarrollo.

</div>
<div>
<div class="card tint-salmon"><b>En el curso</b>
<p>Unidad 2: APIs REST y backend.</p>
<p>Unidad 3: broker MQTT.</p>
<p>Unidad 4: despliegue con Docker.</p>
</div>
</div>
</div>

---

# Capa 4 · Datos

- **Función:** conservar el historial para consultarlo y analizarlo.
- Cada lectura se guarda con el dispositivo, la variable, el valor y la marca de tiempo.

| dispositivo | variable | valor | fecha_hora |
|---|---|---|---|
| inv-01 | temp_c | 31.2 | 2026-10-05 09:15:00 |
| inv-01 | hum_pct | 48 | 2026-10-05 09:15:00 |
| inv-02 | temp_c | 28.7 | 2026-10-05 09:15:05 |

<p class="fuente">En el curso: Unidad 2 (SQLite) y Unidad 4 (relacionales, documentales, clave-valor, grafos y series de tiempo).</p>

---

# Capa 5 · Aplicación

<div class="cols-2">
<div>

- **Función:** presentar la información y permitir acciones del usuario.
- Paneles (*dashboards*) web, aplicaciones móviles, alertas por correo o mensajería.
- **Control remoto:** botones o reglas automáticas que generan comandos hacia el dispositivo.

</div>
<div>
<div class="card tint-lime"><b>En el curso</b>
<p>Unidad 2: frontend, consumo de APIs, diseño responsive y control desde el celular.</p>
</div>
</div>
</div>

---

# Dos sentidos de comunicación

<svg class="diagram" viewBox="0 0 1150 300" role="img" aria-label="Telemetría del dispositivo a la aplicación y comandos de la aplicación al dispositivo">
<defs>
<marker id="e2e-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker>
</defs>
<text x="40" y="44" font-size="20" font-weight="700">TELEMETRÍA · el dispositivo informa</text>
<line x1="40" y1="70" x2="1100" y2="70" stroke="#000" stroke-width="5" marker-end="url(#e2e-head)"/>
<g font-size="20" font-weight="700" text-anchor="middle">
<rect x="10" y="105" width="190" height="90" fill="#e6915d" stroke="#000" stroke-width="2"/><text x="105" y="157">DISPOSITIVO</text>
<rect x="245" y="105" width="190" height="90" fill="#8c9ae0" stroke="#000" stroke-width="2"/><text x="340" y="157">RED</text>
<rect x="480" y="105" width="190" height="90" fill="#d77a7a" stroke="#000" stroke-width="2"/><text x="575" y="157">SERVIDOR</text>
<rect x="715" y="105" width="190" height="90" fill="#9ab6c8" stroke="#000" stroke-width="2"/><text x="810" y="157">DATOS</text>
<rect x="950" y="105" width="190" height="90" fill="#c0d4a7" stroke="#000" stroke-width="2"/><text x="1045" y="157">APLICACIÓN</text>
</g>
<line x1="1100" y1="230" x2="40" y2="230" stroke="#000" stroke-width="5" marker-end="url(#e2e-head)"/>
<text x="1110" y="272" font-size="20" font-weight="700" text-anchor="end">COMANDOS · la aplicación ordena</text>
</svg>

- **Telemetría:** lecturas periódicas o eventos (una alarma, un cambio de estado).
- **Comandos:** órdenes al actuador, enviadas por un usuario o por una regla automática.

---

# Recorrido de un dato

<div class="cols-2">
<div>
<ol class="steps">
<li>El sensor de un invernadero mide 31,2 °C y 48 % de humedad.</li>
<li>El ESP32 arma un mensaje en formato JSON.</li>
<li>Lo envía por Wi-Fi al router, que lo reenvía por internet.</li>
<li>El servidor recibe la lectura, la valida y la guarda con fecha y hora.</li>
<li>El panel muestra el valor y su tendencia.</li>
</ol>
</div>
<div>

```json
{
  "dispositivo": "inv-01",
  "temp_c": 31.2,
  "hum_pct": 48,
  "ts": "2026-10-05T09:15:00-05:00"
}
```

<p class="fuente">El formato JSON y el protocolo HTTP se estudian en el tema 1.4.</p>
</div>
</div>

---

# Recorrido de un comando

<div class="cols-2">
<div>
<ol class="steps" start="6" style="counter-reset: paso 5">
<li>Una regla en el servidor detecta que la temperatura supera 30 °C durante 10 minutos.</li>
<li>El servidor envía un comando al dispositivo.</li>
<li>El ESP32 activa el relé del ventilador.</li>
<li>El dispositivo confirma el nuevo estado y el panel lo muestra.</li>
</ol>
</div>
<div>

```json
{
  "dispositivo": "inv-01",
  "accion": "ventilador",
  "estado": "on"
}
```

<div class="card tint-lime"><b>Pregunta abierta</b>¿Cómo llega el comando a un dispositivo que está detrás de un router doméstico? Se responde en los temas 1.3 (NAT) y 3.6 (publicador/suscriptor).</div>
</div>
</div>

---

# Modelo de referencia ITU-T Y.2060

<div class="ref-model">
<div class="layers">
<div class="tint-lime"><b>Aplicación</b><span>Aplicaciones IoT para el usuario final</span></div>
<div class="tint-sky"><b>Soporte de servicios y aplicaciones</b><span>Procesamiento y almacenamiento de datos comunes a varias aplicaciones</span></div>
<div class="tint-periwinkle"><b>Red</b><span>Conectividad y transporte de los datos</span></div>
<div class="tint-peach"><b>Dispositivo</b><span>Dispositivos y gateways que se comunican con la red</span></div>
</div>
<div class="vbar tint-steel">Gestión</div>
<div class="vbar tint-salmon">Seguridad</div>
</div>

Las cinco capas del curso son una versión práctica de este modelo: el servidor y los datos corresponden a la capa de soporte.

<p class="fuente">Adaptado de ITU-T Y.2060 (06/2012), Overview of the Internet of things, modelo de referencia de IoT.</p>

---

# Criterios de diseño

| Criterio | Pregunta guía |
|---|---|
| Frecuencia | ¿Cada cuánto se envía una lectura? |
| Tamaño | ¿Cuántos bytes tiene cada mensaje? |
| Latencia | ¿Cuánto puede tardar un dato o un comando en llegar? |
| Energía | ¿El dispositivo tiene red eléctrica o funciona con batería? |
| Cobertura | ¿Hay Wi-Fi o señal celular donde se instala? |
| Costo | ¿Cuánto cuesta cada dispositivo y su conectividad mensual? |
| Seguridad | ¿Qué ocurre si un tercero lee o modifica los datos? |

<p class="fuente">Estos criterios se usan en la Unidad 3 para elegir la tecnología de conectividad (tema 3.1).</p>

---

# Mismo modelo, diseños distintos

<div class="cols-2">
<div class="card tint-sky"><b>Medidor de agua en un edificio</b>
<p>Una lectura por hora, pocos bytes.</p>
<p>Un retraso de minutos es aceptable.</p>
<p>Funciona con batería durante años, en un sótano sin Wi-Fi.</p>
<p><strong>Red adecuada:</strong> largo alcance y bajo consumo (LPWAN).</p>
</div>
<div class="card tint-salmon"><b>Celda robótica en una planta</b>
<p>Varias lecturas por segundo.</p>
<p>Los comandos deben llegar casi de inmediato.</p>
<p>Tiene alimentación eléctrica y está dentro de la planta.</p>
<p><strong>Red adecuada:</strong> red local cableada o Wi-Fi industrial.</p>
</div>
</div>

Los requisitos del problema determinan la tecnología, y no al revés.

---

# Proyecto del curso: el problema

Cada equipo responde estas preguntas para su proyecto:

<div class="cols-2">
<ol class="steps">
<li><strong>Problema:</strong> qué situación real se quiere resolver y para quién.</li>
<li><strong>Variables:</strong> qué se mide y con qué frecuencia.</li>
<li><strong>Acciones:</strong> qué se controla a distancia.</li>
</ol>
<ol class="steps" style="counter-reset: paso 3">
<li><strong>Ubicación:</strong> dónde se instala el dispositivo y qué conectividad hay.</li>
<li><strong>Usuarios:</strong> quién usa la información y qué decide con ella.</li>
<li><strong>Éxito:</strong> cómo se comprueba que el sistema funciona.</li>
</ol>
</div>

Note:
Actividad en equipos. Las respuestas se revisan y ajustan en cada unidad, a medida que se incorporan nuevas tecnologías.

---

# Ideas clave

- Un sistema telemático integra medición, comunicación, almacenamiento y control a distancia.
- La arquitectura end-to-end tiene cinco capas: dispositivo, red, servidor, datos y aplicación.
- Las lecturas viajan como telemetría hacia la aplicación y las órdenes como comandos hacia el dispositivo.

<div class="cta-red">Los requisitos del problema (frecuencia, energía, cobertura y costo) determinan qué tecnología usar en cada capa.</div>

---

# Referencias

- Kurose, J., Ross, K. *Computer Networking: A Top-Down Approach* (8.ª ed.). Pearson, 2021. Capítulo 1.
- Hanes, D. et al. *IoT Fundamentals: Networking Technologies, Protocols, and Use Cases for the Internet of Things*. Cisco Press, 2017. Capítulo 2.
- ITU-T. *Recommendation Y.2060: Overview of the Internet of things*. 2012. [itu.int/rec/T-REC-Y.2060](https://www.itu.int/rec/T-REC-Y.2060-201206-I)
- Nora, S., Minc, A. *L'informatisation de la société*. La Documentation française, 1978.

<p class="fuente">Imagen: ESP32 DevKit, Ubahnverleih, Wikimedia Commons, CC0. Diagramas: elaboración propia.</p>
