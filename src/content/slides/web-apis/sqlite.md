---
titulo: Persistencia básica con SQLite y SQL fundamental
subtitulo: Guardar y consultar las lecturas del proyecto en una base de datos relacional
publicado: 2026-10-26
---

# Objetivo de la clase

<div class="ribbon tint-salmon">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Explicar por qué una API necesita persistencia y qué es el modelo relacional.</li>
<li>Describir las características de SQLite y cuándo es apropiada.</li>
<li>Diseñar tablas con claves primarias y foráneas para el proyecto.</li>
<li>Escribir consultas SQL para insertar, filtrar, ordenar y agregar lecturas.</li>
<li>Usar consultas parametrizadas para evitar la inyección SQL.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>Por qué persistir</li>
<li>El modelo relacional</li>
<li>SQLite y cuándo usarla</li>
<li>Diseño de tablas</li>
<li>SQL fundamental</li>
<li>SQLite desde FastAPI</li>
<li>Inyección SQL</li>
</ol>

---

# Por qué persistir

<svg class="diagram" viewBox="0 0 1150 250" style="max-height: 250px" role="img" aria-label="En memoria, las lecturas se pierden al reiniciar la API; en un archivo de base de datos se conservan">
<defs><marker id="per-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g font-size="18" font-weight="700"><text x="20" y="62">EN MEMORIA</text><text x="20" y="192">EN DISCO</text></g>
<g font-size="16"><text x="20" y="86">tema 2.3</text><text x="20" y="216">este tema</text></g>
<g stroke="#000" stroke-width="2">
<rect x="200" y="10" width="270" height="100" fill="#d77a7a"/><rect x="220" y="50" width="230" height="44" fill="#fff"/>
<rect x="760" y="10" width="270" height="100" fill="#d77a7a"/><rect x="780" y="50" width="230" height="44" fill="#fff" stroke-dasharray="8 6"/>
<rect x="200" y="140" width="270" height="100" fill="#d77a7a"/>
<rect x="760" y="140" width="270" height="100" fill="#d77a7a"/>
<path d="M530,150 h120 l20,20 v60 h-140 z" fill="#9ab6c8"/><path d="M650,150 v20 h20" fill="none"/>
</g>
<g font-size="17" font-weight="700"><text x="216" y="36">PROCESO DE LA API</text><text x="776" y="36">PROCESO DE LA API</text><text x="216" y="166">PROCESO DE LA API</text><text x="776" y="166">PROCESO DE LA API</text></g>
<g font-size="17" class="mono" font-weight="700"><text x="232" y="78">lecturas: 1532</text><text x="792" y="78">lecturas: 0</text><text x="540" y="200">invernadero</text><text x="540" y="222">.db</text></g>
<g font-size="16"><text x="216" y="206">escribe en el archivo</text><text x="776" y="206">lee el mismo archivo</text></g>
<g stroke="#000" stroke-width="4">
<line x1="480" y1="60" x2="752" y2="60" marker-end="url(#per-head)"/>
<line x1="470" y1="190" x2="522" y2="190" marker-end="url(#per-head)"/>
<line x1="676" y1="190" x2="752" y2="190" marker-end="url(#per-head)"/>
</g>
<text x="616" y="50" font-size="17" font-weight="700" text-anchor="middle">REINICIO</text>
<g font-size="18" font-weight="700"><text x="1045" y="66" fill="#e91d2a">Se pierde</text><text x="1045" y="196">Se conserva</text></g>
</svg>

Un servidor se reinicia por actualizaciones, fallas o cortes de energía. Las lecturas deben quedar en almacenamiento persistente, no en la memoria del proceso.

---

# El modelo relacional

<div class="cols-2" style="grid-template-columns: 1.3fr 1fr">
<figure>
<img src="./relational-database-terms.png" alt="Tabla con una columna resaltada como atributo, una fila como tupla y la tabla completa como relación" class="plain" style="max-height: 280px">
<figcaption>Relación, tupla y atributo. Imagen: Booyabazooka, Wikimedia Commons, dominio público.</figcaption>
</figure>
<div class="compact">

| Término formal | Término común |
|---|---|
| Relación | Tabla |
| Tupla | Fila o registro |
| Atributo | Columna |
| Clave primaria | Identifica cada fila |
| Clave foránea | Apunta a otra tabla |

</div>
</div>

Edgar F. Codd (IBM) propuso en 1970 organizar los datos en tablas relacionadas, independientes de cómo se guardan en el disco. Es la base de SQLite, PostgreSQL y MySQL.

---

# SQLite frente a cliente-servidor

<svg class="diagram" viewBox="0 0 1150 230" style="max-height: 230px" role="img" aria-label="Una base cliente-servidor es otro proceso al que se llega por red; SQLite es una biblioteca dentro del proceso de la API que escribe en un archivo">
<defs><marker id="sq-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g font-size="17" font-weight="700"><text x="10" y="22">CLIENTE-SERVIDOR · PostgreSQL (Unidad 4)</text><text x="610" y="22">EMBEBIDA · SQLite</text></g>
<line x1="575" y1="0" x2="575" y2="225" stroke="#000" stroke-width="1"/>
<g stroke="#000" stroke-width="2">
<rect x="10" y="50" width="180" height="150" fill="#d77a7a"/>
<rect x="340" y="50" width="200" height="150" fill="#9ab6c8"/>
<rect x="610" y="50" width="300" height="150" fill="#d77a7a"/><rect x="630" y="120" width="260" height="60" fill="#fff"/>
<path d="M990,85 h110 l20,20 v60 h-130 z" fill="#9ab6c8"/>
</g>
<g font-size="17" font-weight="700"><text x="26" y="80">PROCESO</text><text x="26" y="102">DE LA API</text><text x="356" y="80">SERVIDOR</text><text x="356" y="102">DE BASE DE DATOS</text><text x="626" y="80">PROCESO DE LA API</text><text x="646" y="157">biblioteca SQLite</text></g>
<g font-size="15"><text x="356" y="180">otro proceso, con usuarios</text><text x="26" y="180">cliente</text></g>
<g font-size="16" class="mono" font-weight="700"><text x="1000" y="130">invernadero</text><text x="1000" y="152">.db</text></g>
<g stroke="#000" stroke-width="4"><line x1="197" y1="125" x2="333" y2="125" marker-start="url(#sq-head)" marker-end="url(#sq-head)"/><line x1="890" y1="150" x2="983" y2="130" marker-end="url(#sq-head)"/></g>
<text x="265" y="112" font-size="15" text-anchor="middle">red · TCP 5432</text>
</svg>

<div class="cols-3">
<div class="card tint-sky"><b>Un archivo</b><p>Tablas, índices y datos en un solo archivo multiplataforma.</p></div>
<div class="card tint-lime"><b>Sin servidor</b><p>No se instala, no se inicia ni se configura.</p></div>
<div class="card tint-peach"><b>Dominio público</b><p>Más de 10<sup>12</sup> bases en uso, según sqlite.org.</p></div>
</div>

---

# Cuándo usar SQLite

> «SQLite no compite con las bases cliente-servidor. SQLite compite con `fopen()`». sqlite.org, *Appropriate Uses For SQLite*.

<div class="flow compact">
<div class="node tint-steel"><b>1</b>¿Hay una red entre los datos y la aplicación?</div>
<div class="arrow"></div>
<div class="node tint-steel"><b>2</b>¿Muchos programas escriben al mismo tiempo?</div>
<div class="arrow"></div>
<div class="node tint-steel"><b>3</b>¿Los datos son enormes (terabytes)?</div>
<div class="arrow"></div>
<div class="node tint-lime"><b>Todo «no»</b>SQLite es adecuada</div>
</div>

<div class="cols-2">
<div class="card tint-sky"><b>Concurrencia</b><p>Admite lectores ilimitados y un solo escritor a la vez. Con el modo WAL, leer no bloquea la escritura.</p></div>
<div class="card tint-peach"><b>En el proyecto</b><p>FastAPI y el archivo en la misma máquina, con pocos dispositivos escribiendo: SQLite es apropiada.</p></div>
</div>

---

# Diseño de tablas del proyecto

<svg class="diagram" viewBox="0 0 1150 270" style="max-height: 270px" role="img" aria-label="Tabla dispositivos con clave primaria id, relacionada uno a muchos con la tabla lecturas por la clave foránea dispositivo_id">
<g stroke="#000" stroke-width="2">
<rect x="60" y="20" width="340" height="40" fill="#000"/><rect x="60" y="60" width="340" height="120" fill="#fff"/>
<line x1="60" y1="100" x2="400" y2="100"/><line x1="60" y1="140" x2="400" y2="140"/>
<rect x="700" y="20" width="390" height="40" fill="#000"/><rect x="700" y="60" width="390" height="200" fill="#fff"/>
<line x1="700" y1="100" x2="1090" y2="100"/><line x1="700" y1="140" x2="1090" y2="140"/><line x1="700" y1="180" x2="1090" y2="180"/><line x1="700" y1="220" x2="1090" y2="220"/>
<rect x="61" y="61" width="338" height="38" fill="#e6915d" stroke="none"/><rect x="701" y="61" width="388" height="38" fill="#e6915d" stroke="none"/><rect x="701" y="101" width="388" height="38" fill="#9ab6c8" stroke="none"/>
</g>
<g font-size="19" font-weight="700" fill="#fff"><text x="76" y="47">DISPOSITIVOS</text><text x="716" y="47">LECTURAS</text></g>
<g font-size="15" font-weight="700"><text x="76" y="86">PK</text><text x="716" y="86">PK</text><text x="716" y="126">FK</text></g>
<g font-size="18" class="mono" font-weight="700">
<text x="112" y="87">id</text><text x="112" y="127">nombre</text><text x="112" y="167">ubicacion</text>
<text x="752" y="87">id</text><text x="752" y="127">dispositivo_id</text><text x="752" y="167">temp_c</text><text x="752" y="207">hum_pct</text><text x="752" y="247">ts</text>
</g>
<g font-size="16" class="mono"><text x="390" y="87" text-anchor="end">TEXT</text><text x="390" y="127" text-anchor="end">TEXT</text><text x="390" y="167" text-anchor="end">TEXT</text>
<text x="1080" y="87" text-anchor="end">INTEGER</text><text x="1080" y="127" text-anchor="end">TEXT</text><text x="1080" y="167" text-anchor="end">REAL</text><text x="1080" y="207" text-anchor="end">REAL</text><text x="1080" y="247" text-anchor="end">INTEGER</text></g>
<g stroke="#000" stroke-width="3" fill="none"><path d="M400,80 H550 V120 H700"/><path d="M680,120 L700,108 M680,120 L700,132"/><path d="M418,70 V90"/></g>
<g font-size="20" font-weight="700"><text x="424" y="72">1</text><text x="664" y="112">N</text></g>
<text x="550" y="160" font-size="16" text-anchor="middle">un dispositivo tiene</text><text x="550" y="181" font-size="16" text-anchor="middle">muchas lecturas</text>
</svg>

- **Clave primaria (PK):** identifica cada fila; no se repite.
- **Clave foránea (FK):** `lecturas.dispositivo_id` debe existir en `dispositivos.id`.
- `ts`: segundos desde 1970 en UTC (tiempo Unix). Ecuador continental está en UTC−5.

---

# Crear las tablas

<div class="code-sm">

```sql
PRAGMA foreign_keys = ON;                -- se activa en cada conexión

CREATE TABLE dispositivos (
  id        TEXT PRIMARY KEY,
  nombre    TEXT NOT NULL,
  ubicacion TEXT
) STRICT;

CREATE TABLE lecturas (
  id             INTEGER PRIMARY KEY,    -- se numera solo
  dispositivo_id TEXT NOT NULL REFERENCES dispositivos(id),
  temp_c         REAL NOT NULL,
  hum_pct        REAL CHECK (hum_pct BETWEEN 0 AND 100),
  ts             INTEGER NOT NULL DEFAULT (unixepoch())
) STRICT;

CREATE INDEX idx_lecturas_disp_ts ON lecturas(dispositivo_id, ts);
```

</div>

<p class="fuente"><code>STRICT</code> (SQLite 3.37+) rechaza valores del tipo equivocado; sin él, SQLite acepta casi cualquier valor. Las claves foráneas vienen desactivadas por defecto. El índice acelera «las últimas lecturas de un dispositivo». Probado con SQLite 3.51.</p>

---

# Las cuatro operaciones

<div class="cols-2" style="grid-template-columns: 1.2fr 1fr">
<div class="code-sm">

```sql
INSERT INTO lecturas (dispositivo_id, temp_c, hum_pct)
VALUES ('inv-01', 31.4, 47);

SELECT temp_c, hum_pct FROM lecturas
WHERE dispositivo_id = 'inv-01';

UPDATE dispositivos SET ubicacion = 'Bloque C'
WHERE id = 'inv-02';

DELETE FROM lecturas
WHERE ts < unixepoch('now', '-90 days');
```

</div>
<div>
<div class="card tint-salmon"><b>Cuidado</b>
<p>Un <code>UPDATE</code> o un <code>DELETE</code> sin <code>WHERE</code> afecta a todas las filas de la tabla.</p>
</div>
<p></p>
<div class="card tint-sky"><b>Para probar</b>
<p>DB Browser for SQLite (visual), la consola <code>sqlite3</code> o el módulo <code>sqlite3</code> de Python.</p>
</div>
</div>
</div>

--

## Partes de una sentencia SQL

<figure>
<img src="./sql-anatomy.png" alt="Anatomía de una sentencia UPDATE con sus cláusulas, expresiones y predicado" class="plain" style="max-height: 330px">
<figcaption>Cláusulas (UPDATE, SET, WHERE), expresiones y predicado de una sentencia. Imagen: SqlPac y Ferdna, Wikimedia Commons, CC BY-SA 3.0.</figcaption>
</figure>

Cada cláusula empieza con una palabra clave. El **predicado** de `WHERE` decide a qué filas se aplica la sentencia.

---

# Anatomía de una consulta

<div class="layers">
<div class="tint-salmon"><b>SELECT · columnas</b><span><code class="raw">datetime(ts, 'unixepoch') AS hora_utc, temp_c, hum_pct</code></span></div>
<div class="tint-peach"><b>FROM · tabla</b><span><code class="raw">lecturas</code></span></div>
<div class="tint-sky"><b>WHERE · filas</b><span><code class="raw">dispositivo_id = 'inv-01'</code></span></div>
<div class="tint-lime"><b>ORDER BY · orden</b><span><code class="raw">ts DESC</code></span></div>
<div class="tint-steel"><b>LIMIT · cantidad</b><span><code class="raw">3</code></span></div>
</div>

<div class="compact">

| hora_utc | temp_c | hum_pct |
|---|---|---|
| 2026-10-26 14:30:00 | 31.9 | 46.0 |
| 2026-10-26 14:00:00 | 31.4 | 47.0 |
| 2026-10-26 13:35:00 | 30.4 | 50.0 |

</div>

---

# Agregaciones

<div class="cols-2">
<div class="code-sm">

```sql
SELECT strftime('%H:00', ts, 'unixepoch')
         AS hora,
       COUNT(*)             AS n,
       ROUND(AVG(temp_c), 1) AS t_prom,
       MAX(temp_c)          AS t_max
FROM lecturas
WHERE dispositivo_id = 'inv-01'
GROUP BY hora
ORDER BY hora;
```

</div>
<div>
<div class="compact">

| hora | n | t_prom | t_max |
|---|---|---|---|
| 13:00 | 2 | 30.1 | 30.4 |
| 14:00 | 2 | 31.6 | 31.9 |

</div>

- `GROUP BY` junta las filas con el mismo valor y calcula una fila por grupo.
- Funciones: `COUNT`, `AVG`, `MIN`, `MAX`, `SUM`.
- Así se arma el gráfico del dashboard sin enviar todas las lecturas.

</div>
</div>

---

# SQLite desde FastAPI

<div class="code-sm">

```python
import sqlite3

def conectar():
    con = sqlite3.connect("invernadero.db")
    con.row_factory = sqlite3.Row              # filas accesibles por nombre
    con.execute("PRAGMA foreign_keys = ON")
    return con

@app.post("/v1/dispositivos/{id}/lecturas", status_code=201)
def crear_lectura(id: str, lectura: LecturaNueva):
    con = conectar()
    with con:                                  # commit al salir; rollback si hay error
        con.execute(
            "INSERT INTO lecturas (dispositivo_id, temp_c, hum_pct) VALUES (?, ?, ?)",
            (id, lectura.temp_c, lectura.hum_pct))
    con.close()
```

</div>

<p class="fuente">Una conexión por petición: FastAPI atiende las peticiones en varios hilos y, por defecto, una conexión de <code>sqlite3</code> solo se usa en el hilo que la creó. Los <code>?</code> son parámetros: el valor nunca se mezcla con el texto SQL.</p>

---

# Inyección SQL

<figure>
<img src="./xkcd-327-exploits-of-a-mom.png" alt="Tira cómica de xkcd sobre un estudiante llamado Robert'); DROP TABLE Students;--" class="plain" style="max-height: 180px">
<figcaption>«Exploits of a Mom». Randall Munroe, xkcd 327, CC BY-NC 2.5.</figcaption>
</figure>

<div class="cols-2">
<div class="code-sm">

**Vulnerable:** con `id = "x' OR '1'='1"` devuelve todo.

```python
con.execute(f"SELECT * FROM lecturas "
            f"WHERE dispositivo_id = '{id}'")
```

</div>
<div class="code-sm">

**Correcto:** el valor viaja aparte del SQL.

```python
con.execute("SELECT * FROM lecturas "
            "WHERE dispositivo_id = ?", (id,))
```

</div>
</div>

<p class="fuente">OWASP, <em>SQL Injection Prevention Cheat Sheet</em>: la defensa principal son las consultas parametrizadas; escapar el texto a mano se desaconseja.</p>

---

# Ejercicio · Consultas

Con las tablas del proyecto, escriba:

<ol class="steps">
<li>Las 10 lecturas más recientes de <code>inv-02</code>.</li>
<li>La temperatura máxima y mínima de cada dispositivo.</li>
<li>El promedio de humedad de <code>inv-01</code> en las últimas 24 horas.</li>
<li>¿Qué responde la API si llega una lectura para <code>inv-09</code>, que no existe? ¿Qué debería responder?</li>
</ol>

--

## Solución

<div class="code-sm">

```sql
-- 1
SELECT * FROM lecturas WHERE dispositivo_id = 'inv-02' ORDER BY ts DESC LIMIT 10;
-- 2
SELECT dispositivo_id, MAX(temp_c) AS t_max, MIN(temp_c) AS t_min
FROM lecturas GROUP BY dispositivo_id;
-- 3
SELECT ROUND(AVG(hum_pct), 1) FROM lecturas
WHERE dispositivo_id = 'inv-01' AND ts >= unixepoch('now', '-1 day');
```

</div>

4\. La clave foránea rechaza la fila, la excepción no se maneja y la API responde **500**. Debería comprobar que el dispositivo existe y responder **404**.

---

# Desafío del proyecto

<div class="cols-2">
<div class="ribbon tint-lime">
<h3>Para la próxima clase</h3>
<ol>
<li>Diseñar el esquema del proyecto: tablas, columnas, tipos, claves primarias y foráneas.</li>
<li>Decidir dónde se guardan el estado deseado y el reportado del actuador.</li>
<li>Escribir las tres consultas que el dashboard hará con más frecuencia.</li>
</ol>
</div>
<div class="card tint-sky"><b>Preguntas para discutir</b>
<p>Con una lectura cada 10 s, ¿cuántas filas genera un dispositivo en un día? ¿Y en un año?</p>
<p>¿Qué índice necesitan sus consultas más frecuentes?</p>
<p>¿En qué momento dejaría de bastar SQLite para su proyecto?</p>
</div>
</div>

---

# Ideas clave

- Una base relacional organiza los datos en tablas unidas por claves primarias y foráneas.
- SQLite es una biblioteca dentro del proceso que guarda todo en un archivo: adecuada para un prototipo con pocos escritores.
- `SELECT … WHERE … ORDER BY … LIMIT` y `GROUP BY` cubren la mayoría de consultas del dashboard.

<div class="cta-red">Nunca arme SQL concatenando texto: use parámetros (?).</div>

---

# Referencias

<div class="small">

- Codd, E. F. *A Relational Model of Data for Large Shared Data Banks*. Communications of the ACM 13(6), 1970. [doi.org/10.1145/362384.362685](https://doi.org/10.1145/362384.362685)
- SQLite. *About SQLite*, *Appropriate Uses For SQLite*, *Datatypes*, *STRICT Tables*, *Foreign Key Support*, *Write-Ahead Logging*, *Date And Time Functions*. [sqlite.org/docs.html](https://www.sqlite.org/docs.html)
- Python. *sqlite3 — DB-API 2.0 interface for SQLite databases*. [docs.python.org](https://docs.python.org/3/library/sqlite3.html)
- OWASP. *SQL Injection Prevention Cheat Sheet*. [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- Munroe, R. *Exploits of a Mom*, xkcd 327. [xkcd.com/327](https://xkcd.com/327/)

</div>

<p class="fuente">Imágenes: <em>Relational database terms</em>, Booyabazooka, Wikimedia Commons, dominio público; <em>SQL anatomy</em>, SqlPac y Ferdna, Wikimedia Commons, CC BY-SA 3.0; xkcd 327, Randall Munroe, CC BY-NC 2.5. Diagramas: elaboración propia.</p>
