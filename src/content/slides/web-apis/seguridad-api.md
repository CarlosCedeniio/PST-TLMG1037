---
titulo: "Seguridad: autenticación con tokens y variables de entorno"
subtitulo: Que solo los usuarios y dispositivos autorizados usen la API, y que ninguna credencial quede en el código
publicado: 2026-11-09
---

# Objetivo de la clase

<div class="ribbon tint-salmon">
<h3>Al finalizar, el estudiante podrá</h3>
<ul>
<li>Distinguir autenticación de autorización, y los códigos 401 y 403.</li>
<li>Proteger los endpoints con tokens enviados en el encabezado <code>Authorization</code>.</li>
<li>Explicar la estructura de un JWT y qué protege su firma.</li>
<li>Guardar contraseñas y secretos de forma segura: hash y variables de entorno.</li>
<li>Identificar los riesgos de una API con el OWASP API Security Top 10.</li>
</ul>
</div>

---

# Contenido

<ol class="steps">
<li>Una API sin protección</li>
<li>Autenticación y autorización</li>
<li>Tokens para dispositivos y para personas</li>
<li>JWT</li>
<li>Contraseñas</li>
<li>Secretos fuera del código</li>
<li>OWASP API Security Top 10</li>
</ol>

---

# Una API sin protección

<svg class="diagram" viewBox="0 0 1150 260" style="max-height: 260px" role="img" aria-label="Sin autenticación, cualquiera en internet puede enviar lecturas falsas y encender el ventilador a través de la API">
<defs><marker id="sa-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker><marker id="sa-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#e91d2a"/></marker></defs>
<g stroke-width="2">
<rect x="20" y="20" width="250" height="100" fill="#fff" stroke="#e91d2a" stroke-width="3"/>
<rect x="20" y="150" width="250" height="90" fill="#e6915d" stroke="#000"/>
<rect x="460" y="60" width="240" height="140" fill="#d77a7a" stroke="#000"/>
<rect x="890" y="20" width="240" height="90" fill="#c0d4a7" stroke="#000"/>
<rect x="890" y="150" width="240" height="90" fill="#e6915d" stroke="#000"/>
</g>
<g font-size="18" font-weight="700"><text x="36" y="52" fill="#e91d2a">CUALQUIERA</text><text x="36" y="76" fill="#e91d2a">EN INTERNET</text><text x="36" y="182">ESP32 DEL EQUIPO</text><text x="476" y="96">API SIN</text><text x="476" y="120">AUTENTICACIÓN</text><text x="906" y="52">DASHBOARD</text><text x="906" y="182">VENTILADOR</text></g>
<g font-size="15"><text x="36" y="206">lecturas reales</text><text x="476" y="150">acepta todo</text><text x="906" y="78">muestra 85 °C</text><text x="906" y="206">se enciende sin</text><text x="906" y="226">que nadie lo pida</text></g>
<g stroke-width="4" fill="none"><line x1="270" y1="55" x2="453" y2="95" stroke="#e91d2a" marker-end="url(#sa-red)"/><line x1="270" y1="90" x2="453" y2="125" stroke="#e91d2a" marker-end="url(#sa-red)"/><line x1="270" y1="195" x2="453" y2="170" stroke="#000" marker-end="url(#sa-head)"/><line x1="700" y1="100" x2="883" y2="70" stroke="#000" marker-end="url(#sa-head)"/><line x1="700" y1="160" x2="883" y2="190" stroke="#000" marker-end="url(#sa-head)"/></g>
<g font-size="14" class="mono" font-weight="700" fill="#e91d2a"><text x="300" y="50">POST /lecturas 85 °C</text><text x="300" y="138">PUT /actuador "on"</text></g>
</svg>

- Una URL pública se descubre y se escanea, igual que los puertos abiertos (tema 1.5).
- Sin autenticación, cualquiera puede escribir lecturas falsas o accionar el actuador.

<div class="cta-red">El despliegue del tema 2.7 no está terminado hasta que la API exige credenciales.</div>

---

# Autenticación y autorización

<div class="cols-2">
<div class="card tint-sky"><b>Autenticación · ¿quién es?</b>
<p>La petición trae una credencial válida: un token o una sesión.</p>
<p>Si falta o no es válida: <strong>401 Unauthorized</strong>, con el encabezado <code>WWW-Authenticate</code>.</p>
</div>
<div class="card tint-peach"><b>Autorización · ¿puede hacer esto?</b>
<p>Quien pide tiene permiso sobre <em>ese</em> recurso y <em>esa</em> acción.</p>
<p>Si no lo tiene: <strong>403 Forbidden</strong>, o 404 para no revelar que el recurso existe.</p>
</div>
</div>

<div class="compact">

| Caso | Respuesta |
|---|---|
| Petición sin token, o con un token vencido o con firma inválida | 401 |
| Ana tiene un token válido y pide los datos del invernadero de Luis | 403 o 404 |
| Un ESP32 con token válido intenta cambiar el estado deseado del actuador | 403 |

</div>

<p class="fuente">RFC 9110, secciones 15.5.2 (401) y 15.5.4 (403). Desde la versión 0.122, las clases de seguridad de FastAPI responden 401 cuando falta la credencial.</p>

---

# Tokens: dispositivos y personas

<div class="cols-2">
<div class="ribbon tint-peach">
<h3>Dispositivos (ESP32)</h3>
<ol class="small">
<li>Al registrar el dispositivo se genera un token aleatorio.</li>
<li>El ESP32 lo guarda en <code>secrets.h</code>; la API guarda solo su hash.</li>
<li>Cada petición lo envía en <code>Authorization</code>.</li>
<li>Si roban el equipo, se revoca solo ese token.</li>
</ol>
</div>
<div class="ribbon tint-lime">
<h3>Personas (dashboard)</h3>
<ol class="small">
<li>Inician sesión con usuario y contraseña.</li>
<li>La API compara con el hash guardado de la contraseña.</li>
<li>Entrega un token JWT que vence, por ejemplo, en 30 minutos.</li>
<li>El dashboard lo envía en cada petición.</li>
</ol>
</div>
</div>

<div class="code-sm">

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"   # token aleatorio de 32 bytes
```

</div>

---

# El token viaja en un encabezado

<div class="layers">
<div class="tint-salmon"><b>Línea de petición</b><span><code class="raw">POST /v1/dispositivos/inv-01/lecturas HTTP/1.1</code></span></div>
<div class="tint-sky"><b>Encabezados</b><span><code class="raw">Host: invernadero.onrender.com
<strong>Authorization: Bearer q3L9vXa1…</strong>
Content-Type: application/json</code></span></div>
<div class="tint-lime"><b>Cuerpo</b><span><code class="raw">{"temp_c":31.2,"hum_pct":48,"actuador":"off"}</code></span></div>
</div>

<div class="cols-2">
<div class="card tint-peach"><b>Bearer: portador</b><p>Quien tiene el token puede usarlo. Por eso solo viaja por HTTPS.</p></div>
<div class="card tint-salmon"><b>Nunca en la URL</b><p><code>?token=…</code> queda en el historial del navegador y en los registros de los servidores.</p></div>
</div>

<p class="fuente">RFC 6750, <em>Bearer Token Usage</em>: sección 2.1 (encabezado) y sección 5.3 (no pasar tokens en URL; TLS obligatorio).</p>

---

# Inicio de sesión con token

<svg class="diagram" viewBox="0 0 1150 340" style="max-height: 340px" role="img" aria-label="El dashboard envía usuario y contraseña, la API compara con el hash de la base, entrega un JWT y luego acepta peticiones con ese token hasta que vence">
<defs><marker id="li-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
<g stroke="#000" stroke-width="2"><rect x="40" y="6" width="220" height="40" fill="#c0d4a7"/><rect x="465" y="6" width="220" height="40" fill="#d77a7a"/><rect x="890" y="6" width="220" height="40" fill="#9ab6c8"/></g>
<g font-size="18" font-weight="700" text-anchor="middle"><text x="150" y="32">DASHBOARD</text><text x="575" y="32">API</text><text x="1000" y="32">BASE DE DATOS</text></g>
<g stroke="#000" stroke-width="2" stroke-dasharray="6 6"><line x1="150" y1="46" x2="150" y2="335"/><line x1="575" y1="46" x2="575" y2="335"/><line x1="1000" y1="46" x2="1000" y2="335"/></g>
<rect x="445" y="160" width="260" height="32" fill="#fcc20f" stroke="#000" stroke-width="2"/><text x="575" y="182" font-size="15" font-weight="700" text-anchor="middle">VERIFICA LA CONTRASEÑA</text>
<g stroke="#000" stroke-width="3">
<line x1="150" y1="80" x2="569" y2="80" marker-end="url(#li-head)"/>
<line x1="575" y1="112" x2="994" y2="112" marker-end="url(#li-head)"/><line x1="1000" y1="142" x2="581" y2="142" marker-end="url(#li-head)"/>
<line x1="575" y1="222" x2="156" y2="222" marker-end="url(#li-head)"/>
<line x1="150" y1="262" x2="569" y2="262" marker-end="url(#li-head)"/><line x1="575" y1="292" x2="156" y2="292" marker-end="url(#li-head)"/>
<line x1="575" y1="326" x2="156" y2="326" marker-end="url(#li-head)" stroke-dasharray="10 6"/>
</g>
<g font-size="15" class="mono" font-weight="700" text-anchor="middle">
<text x="362" y="72">POST /v1/sesiones {usuario, contraseña}</text>
<text x="787" y="104">hash de la contraseña de «ana»</text><text x="787" y="134">$argon2id$v=19$m=65536…</text>
<text x="362" y="214">200 {token: JWT, vence en 30 min}</text>
<text x="362" y="254">GET /v1/dispositivos · Bearer &lt;JWT&gt;</text><text x="362" y="284">200 · datos</text>
<text x="362" y="318">30 min después: 401 → iniciar sesión</text>
</g>
</svg>

<p class="fuente">La API nunca guarda ni compara la contraseña en texto: compara hashes. Flujo basado en el tutorial <em>OAuth2 with Password and JWT</em> de FastAPI.</p>

---

# JWT: un token que se puede leer

<p class="mono" style="font-family: var(--font-mono); font-size: 15px; font-weight: 700; word-break: break-all; line-height: 1.6"><span class="tint-salmon" style="padding: 2px 4px; border: 2px solid #000">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>.<span class="tint-sky" style="padding: 2px 4px; border: 2px solid #000">eyJzdWIiOiJhbmEiLCJleHAiOjE3OTMwMjY4MDB9</span>.<span class="tint-lime" style="padding: 2px 4px; border: 2px solid #000">RUU1YQcY1ZWuY6NzsX7HLQfLbnVR3dQphGMzmREQo_A</span></p>

<div class="layers">
<div class="tint-salmon"><b>Encabezado</b><span><code class="raw">{"alg": "HS256", "typ": "JWT"}</code></span></div>
<div class="tint-sky"><b>Contenido (claims)</b><span><code class="raw">{"sub": "ana", "exp": 1793026800}    ← vence el 26 oct 2026, 15:00 UTC</code></span></div>
<div class="tint-lime"><b>Firma</b><span><code class="raw">HMAC-SHA256(encabezado.contenido, SECRET_KEY)</code></span></div>
</div>

<div class="cols-2">
<div class="card tint-peach"><b>Se lee sin la clave</b><p>Las dos primeras partes son base64url, no cifrado. No incluya datos sensibles.</p></div>
<div class="card tint-lime"><b>No se puede modificar</b><p>Si alguien cambia <code>sub</code> o <code>exp</code>, la firma deja de coincidir y la API lo rechaza.</p></div>
</div>

<p class="fuente">RFC 7519. Token generado con PyJWT; <code>SECRET_KEY</code> de al menos 32 bytes (<code>openssl rand -hex 32</code>): PyJWT advierte si es más corta.</p>

---

# Contraseñas: hash, no cifrado

<div class="cols-2" style="grid-template-columns: 1fr 1.2fr">
<figure>
<img src="./cryptographic-hash.png" alt="Textos casi iguales producen resúmenes completamente distintos al pasar por una función hash" class="plain" style="max-height: 300px">
<figcaption>Un cambio mínimo en la entrada cambia todo el resumen. Imagen: Jorge Stolfi, Wikimedia Commons, dominio público.</figcaption>
</figure>
<div>

<div class="small">

- El hash es de un solo sentido: al iniciar sesión se calcula el hash de lo escrito y se compara.
- Un hash rápido (SHA-1, SHA-256) permite probar muchísimas contraseñas por segundo. Se usan funciones lentas a propósito.
- OWASP: **Argon2id** (mínimo 19 MiB, t=2, p=1) o **bcrypt** (factor ≥ 10), con sal única por usuario.

</div>

<div class="code-sm">

```python
from pwdlib import PasswordHash
ph = PasswordHash.recommended()     # Argon2id
h = ph.hash("invernadero-2026")
# $argon2id$v=19$m=65536,t=3,p=4$…
ph.verify("invernadero-2026", h)    # True
```

</div>
</div>
</div>

<p class="fuente">OWASP, <em>Password Storage Cheat Sheet</em>. pwdlib usa por defecto 64 MiB, t=3 y p=4, por encima del mínimo; es la biblioteca que recomienda la documentación de FastAPI.</p>

---

# Proteger un endpoint en FastAPI

<div class="code-sm">

```python
import hashlib, hmac
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

bearer = HTTPBearer()                     # sin encabezado Authorization → 401

def dispositivo_autenticado(id: str,
        cred: HTTPAuthorizationCredentials = Depends(bearer)):
    recibido = hashlib.sha256(cred.credentials.encode()).hexdigest()
    if not hmac.compare_digest(recibido, hash_del_token(id)):
        raise HTTPException(401, "Token inválido", headers={"WWW-Authenticate": "Bearer"})

@app.post("/v1/dispositivos/{id}/lecturas", status_code=201,
          dependencies=[Depends(dispositivo_autenticado)])
def crear_lectura(id: str, lectura: LecturaNueva): ...
```

</div>

<div class="small">

- Probado: sin token, 401; con el token de `inv-02` en `inv-01`, 401; con el correcto, 201.
- Para un token aleatorio y largo basta SHA-256; `compare_digest` compara en tiempo constante.

</div>

---

# Secretos fuera del código

<svg class="diagram" viewBox="0 0 1150 210" style="max-height: 210px" role="img" aria-label="El repositorio contiene el código y una plantilla sin valores; el archivo .env con los valores reales queda en el PC y no se sube; en producción los valores se cargan en el panel de la plataforma">
<g stroke="#000" stroke-width="2"><rect x="10" y="10" width="370" height="190" fill="#fff"/><rect x="400" y="10" width="350" height="190" fill="#fff"/><rect x="770" y="10" width="370" height="190" fill="#fff"/>
<rect x="10" y="10" width="370" height="40" fill="#a5b8c0"/><rect x="400" y="10" width="350" height="40" fill="#c0d4a7"/><rect x="770" y="10" width="370" height="40" fill="#d77a7a"/></g>
<g font-size="17" font-weight="700"><text x="24" y="37">REPOSITORIO (PÚBLICO)</text><text x="414" y="37">PC DEL EQUIPO</text><text x="784" y="37">PLATAFORMA (PRODUCCIÓN)</text></g>
<g font-size="15" class="mono" font-weight="700">
<text x="24" y="80">main.py</text><text x="24" y="122">.env.example</text><text x="24" y="164">.gitignore</text>
<text x="414" y="80">.env</text>
<text x="784" y="80">Panel «Environment»</text>
</g>
<g font-size="14" class="mono">
<text x="24" y="100">os.environ["SECRET_KEY"]</text><text x="24" y="142">SECRET_KEY=</text><text x="24" y="184">.env</text>
<text x="414" y="100">SECRET_KEY=7c1e9a4f0b2d…</text><text x="414" y="120">TOKEN_ADMIN=…</text>
<text x="784" y="100">SECRET_KEY = ••••••••</text>
</g>
<g font-size="15"><text x="414" y="170" font-weight="700" fill="#e91d2a">No se sube a GitHub</text><text x="784" y="140">Mismos nombres, otros valores.</text><text x="784" y="162">Cambiarlos no exige</text><text x="784" y="182">tocar el código.</text></g>
</svg>

<div class="cols-2">
<div class="code-sm">

```python
import os
from dotenv import load_dotenv

load_dotenv()          # lee .env si existe
SECRET_KEY = os.environ["SECRET_KEY"]
```

</div>
<div>

> Prueba propuesta por The Twelve-Factor App (*III. Config*): el código debería poder publicarse en cualquier momento sin comprometer ninguna credencial.

</div>
</div>

---

# Cuando un secreto se filtra

<div class="flow gap">
<div class="node tint-salmon"><span class="big">28,6 M</span><b>Secretos nuevos</b>en commits públicos de GitHub durante 2025, un 34 % más que el año anterior</div>
<div class="node tint-peach"><span class="big">64 %</span><b>Siguen activos</b>de los secretos válidos detectados en 2022, en enero de 2026</div>
</div>

<div class="cols-2">
<div class="small">

<ol class="steps">
<li>Revocar o rotar la credencial de inmediato.</li>
<li>Revisar si alguien la usó.</li>
<li>Quitarla del historial con <code>git-filter-repo</code>. Borrarla en un commit nuevo no basta.</li>
</ol>

</div>
<div class="card tint-sky"><b>GitHub</b>
<p><em>Push protection</em> viene activada por defecto para las cuentas personales y bloquea los pushes con secretos reconocidos hacia repositorios públicos. <em>Secret scanning</em> avisa de los que ya están publicados.</p>
</div>
</div>

<p class="fuente">GitGuardian, <em>The State of Secrets Sprawl 2026</em>; GitHub Docs, <em>About push protection</em> y <em>Removing sensitive data from a repository</em>.</p>

---

# Seguridad en el ESP32

<div class="code-sm">

```cpp
#include "secrets.h"   // WIFI_PASS, TOKEN_DISPOSITIVO, CA_RAIZ; está en .gitignore

NetworkClientSecure cliente;   // WiFiClientSecure es el nombre anterior
cliente.setCACert(CA_RAIZ);    // valida el certificado del servidor

HTTPClient http;
http.begin(cliente, "https://invernadero.onrender.com/v1/dispositivos/inv-01/lecturas");
http.addHeader("Authorization", String("Bearer ") + TOKEN_DISPOSITIVO);
```

</div>

<div class="cols-2">
<div class="card tint-lime"><b>secrets.example.h</b><p>Se versiona una plantilla con los mismos nombres y valores vacíos; cada integrante crea su <code>secrets.h</code>.</p></div>
<div class="card tint-salmon"><b>setInsecure()</b><p>Cifra, pero no verifica con quién habla: un intermediario puede hacerse pasar por el servidor. El ejemplo oficial lo llama «a very INSECURE approach».</p></div>
</div>

<p class="fuente">arduino-esp32, biblioteca NetworkClientSecure: README y ejemplo <em>WiFiClientInsecure</em>.</p>

---

# OWASP API Security Top 10 (2023)

<div class="cols-2" style="grid-template-columns: 1fr 1.25fr">
<div class="small">

1. **Broken Object Level Authorization**
2. **Broken Authentication**
3. Broken Object Property Level Authorization
4. **Unrestricted Resource Consumption**
5. Broken Function Level Authorization
6. Unrestricted Access to Sensitive Business Flows
7. Server Side Request Forgery
8. Security Misconfiguration
9. Improper Inventory Management
10. Unsafe Consumption of APIs

</div>
<div>
<div class="card tint-salmon"><b>API1 · En el proyecto</b><p>El token de <code>inv-02</code> escribe en <code>inv-01</code>, o Ana lee los datos de Luis. Verificar que el recurso pertenezca a quien lo pide.</p></div>
<p></p>
<div class="card tint-peach"><b>API2 · En el proyecto</b><p>Tokens en el código, contraseñas sin hash o JWT que nunca vencen.</p></div>
<p></p>
<div class="card tint-sky"><b>API4 · En el proyecto</b><p>Sin límite de peticiones ni de tamaño. Limitar y responder 429 con <code>Retry-After</code> (RFC 6585).</p></div>
</div>
</div>

<p class="fuente">OWASP API Security Project, edición 2023. CORS no es autenticación: curl y el ESP32 lo ignoran (tema 2.5).</p>

---

# Ejercicio · Encontrar las fallas

<div class="code-sm">

```python
SECRET_KEY = "clave123"                                       # 1

@app.get("/v1/dispositivos/{id}/lecturas")
def listar(id: str, token: str):                              # 2  (?token=...)
    usuario = validar_jwt(token, SECRET_KEY)
    if usuario is None:
        raise HTTPException(status_code=403)                  # 3
    return leer_lecturas(id)                                  # 4
```

```cpp
cliente.setInsecure();                                        // 5
```

```bash
git add . && git commit -m "deploy"     # el repositorio no tiene .gitignore   # 6
```

</div>

--

## Solución

<div class="compact">

| # | Falla | Corrección |
|---|---|---|
| 1 | Clave en el código, corta y fácil de adivinar | Variable de entorno con 32 bytes aleatorios |
| 2 | El token viaja en la URL | Encabezado `Authorization: Bearer` |
| 3 | 403 cuando falta o no vale el token | 401 con `WWW-Authenticate` |
| 4 | No verifica que el dispositivo sea del usuario (API1) | Comprobar el dueño; si no lo es, 403 o 404 |
| 5 | El ESP32 no valida el certificado | `setCACert()` con la autoridad raíz |
| 6 | `.env` y `secrets.h` terminan en GitHub | `.gitignore` y rotar todo lo que se publicó |

</div>

---

# Desafío del proyecto

<div class="cols-2">
<div class="ribbon tint-lime">
<h3>Lista de verificación de la API</h3>
<ul class="small">
<li>Todo endpoint que escribe o acciona exige un token válido.</li>
<li>Cada ESP32 tiene su propio token, revocable.</li>
<li>Las contraseñas se guardan con Argon2id o bcrypt.</li>
<li>Ningún secreto está en el código ni en el historial de Git.</li>
<li>Todo viaja por HTTPS y el ESP32 valida el certificado.</li>
<li>Cada endpoint verifica que el recurso pertenezca a quien lo pide.</li>
</ul>
</div>
<div class="card tint-sky"><b>Preguntas para discutir</b>
<p>¿Qué hacen si roban un ESP32 del invernadero?</p>
<p>¿Cuánto debe durar el token de un usuario del dashboard?</p>
<p>¿Quién puede accionar el actuador y quién solo puede ver los datos?</p>
</div>
</div>

---

# Ideas clave

- Autenticación responde «¿quién es?» (401); autorización, «¿puede hacer esto?» (403).
- El token viaja en `Authorization: Bearer`, siempre por HTTPS; un JWT se lee sin la clave, pero no se puede modificar.
- Las contraseñas se guardan con un hash lento; los secretos, en variables de entorno.

<div class="cta-red">Ningún secreto en el código. Si se filtra, se rota primero y se limpia el historial después.</div>

---

# Referencias

<div class="small">

- IETF: RFC 9110 (401 y 403), RFC 6750 (*Bearer Token Usage*), RFC 7519 (JWT), RFC 6585 (429). [rfc-editor.org](https://www.rfc-editor.org/)
- OWASP. *API Security Top 10 2023* y *Password Storage Cheat Sheet*. [owasp.org](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- FastAPI. *Security* y *OAuth2 with Password (and hashing), Bearer with JWT tokens*. [fastapi.tiangolo.com](https://fastapi.tiangolo.com/tutorial/security/)
- The Twelve-Factor App. *III. Config*. [12factor.net/config](https://12factor.net/config)
- GitGuardian. *The State of Secrets Sprawl 2026*. [gitguardian.com](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026)
- GitHub Docs. *About push protection*, *Removing sensitive data from a repository*. [docs.github.com](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection)
- Espressif. *arduino-esp32: NetworkClientSecure*. [github.com/espressif/arduino-esp32](https://github.com/espressif/arduino-esp32/blob/master/libraries/NetworkClientSecure/README.md)

</div>

<p class="fuente">Imagen: <em>Cryptographic Hash Function</em>, Jorge Stolfi, Wikimedia Commons, dominio público. Diagramas: elaboración propia.</p>
