# Google Gemini API – Restricciones del tier gratuito

Resumen de los **límites y restricciones** del plan **Free** de la API de Gemini (Google AI). Los números pueden variar por modelo y región; conviene revisar en [AI Studio](https://aistudio.google.com/usage) los límites activos de tu proyecto.

---

## Límites por dimensión

Google aplica **varios límites a la vez**. Si superás **cualquiera** de ellos, la API puede devolver **HTTP 429** (rate limit).

| Dimensión | Descripción | Free tier (orientativo) |
|-----------|-------------|-------------------------|
| **RPM** | Requests por minuto | Varía por modelo (ej. 5–15 RPM) |
| **TPM** | Tokens por minuto (input) | ~250.000 TPM (compartido entre modelos) |
| **RPD** | Requests por día | Varía por modelo (ej. 100–1.000 RPD) |

- Los límites son **por proyecto** (no por API key). Todas las API keys del mismo proyecto comparten la cuota.
- **RPD** se reinicia a **medianoche, hora del Pacífico (PT)**.

---

## Límites por modelo (Free tier – referencia)

Los valores exactos pueden cambiar; esta tabla es orientativa según documentación y reportes recientes:

| Modelo | RPM (aprox.) | RPD (aprox.) | Notas |
|--------|----------------|--------------|--------|
| **Gemini 2.5 Pro** | ~5 | ~100 | Menos requests, más capacidad. |
| **Gemini 2.5 Flash** | ~10 | ~250 | Balance velocidad / capacidad. |
| **Gemini 2.5 Flash-Lite** | ~15 | ~1.000 | Más requests/día, modelo más liviano. |

- **TPM:** en Free suele haber un tope global por minuto (ej. 250.000 TPM) que comparten los modelos; si lo superás, también podés recibir 429.

---

## Otras restricciones del tier Free

| Aspecto | Restricción |
|---------|-------------|
| **Facturación** | No se requiere tarjeta; no hay cobro por uso dentro del Free tier. |
| **Región** | Solo en [países elegibles](https://ai.google.dev/gemini-api/docs/available-regions). |
| **Modelos** | Solo los que Google habilita en Free (ej. 2.5 Flash, 2.5 Flash-Lite, 2.5 Pro con límites más bajos). Modelos “preview” o más nuevos pueden tener límites más estrictos. |
| **Contexto** | Ventana de contexto grande (ej. 1M tokens) según modelo; el límite práctico lo da TPM/RPM/RPD. |
| **Batch API** | Límites de Batch suelen ser distintos y a veces solo en planes de pago; revisar en la doc. |
| **Uso de datos** | En Free, Google puede usar ciertos datos (ej. inputs/salidas) para mejorar productos; en planes de pago suele no usarse. Revisar [Terms of Service](https://ai.google.dev/gemini-api/terms). |

---

## Cómo ver tus límites actuales

- **Google AI Studio → Usage / Rate limits:**  
  [https://aistudio.google.com/usage](https://aistudio.google.com/usage) (elegir proyecto y pestaña de rate limits).  
  Ahí ves los **límites activos** de tu proyecto según tu tier y modelo.

---

## Cómo reducir 429 (rate limit)

1. **Respetar RPM:** no mandar muchos requests en el mismo minuto; espaciar llamadas (ej. cola o backoff).
2. **Respetar RPD:** si alcanzás el límite diario, esperar al reinicio (medianoche PT) o pasar a un tier de pago.
3. **Bajar tokens por request:** prompts más cortos, menos historial de chat, `maxOutputTokens` moderado.
4. **Elegir modelo:** Flash-Lite suele tener más RPD que Pro en Free; usar Pro solo cuando necesites más capacidad.
5. **Reintentos con backoff:** ante 429, esperar (ej. 60 s) y reintentar; no hacer retry inmediato en loop.

---

## Resumen

| Pregunta | Respuesta |
|----------|-----------|
| **¿Qué te limita?** | RPM, TPM y RPD según modelo y proyecto. |
| **¿Cuántos requests/día?** | Depende del modelo (ej. ~100–1.000 RPD en Free). |
| **¿Cuántos por minuto?** | Ej. 5–15 RPM según modelo. |
| **¿Se puede usar sin tarjeta?** | Sí en el Free tier. |
| **¿Dónde ver mis límites?** | [AI Studio → Usage](https://aistudio.google.com/usage). |

Para números exactos de tu proyecto, usar siempre **AI Studio → Usage** y la documentación oficial: [Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [Billing](https://ai.google.dev/gemini-api/docs/billing).
