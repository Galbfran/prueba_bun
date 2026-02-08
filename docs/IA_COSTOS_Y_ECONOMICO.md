# Cómo hacer la IA económica – Costos por proveedor y por token

Resumen de **costos por token** (o por uso) y **opciones baratas o gratis** para el chatbot de la academia y el análisis de alumnos.

---

## Regla rápida: qué es un token

- **~1 token ≈ 4 caracteres** en inglés, **~2–3 caracteres** en español.
- **~1.000 tokens ≈ 750 palabras** (unas 2–3 pantallas de chat).
- Un mensaje de usuario de 100 palabras + respuesta del bot de 150 palabras ≈ **~350 tokens** (input + output).

---

## Costos aproximados por proveedor (por millón de tokens)

Precios orientativos; revisar siempre la página oficial (cambian seguido).

### OpenAI

| Modelo | Input (por 1M tokens) | Output (por 1M tokens) | Uso típico |
|--------|------------------------|-------------------------|------------|
| **GPT-4o mini** | ~USD 0,15 | ~USD 0,60 | **Recomendado para bajo costo:** chat, tools, buen nivel. |
| **GPT-3.5 Turbo** | ~USD 0,50 | ~USD 1,50 | Más barato que GPT-4o mini en algunos planes; calidad menor. |
| **GPT-4o** | ~USD 2,50 | ~USD 10 | Cuando necesitás más calidad o razonamiento. |
| **GPT-4 Turbo** | ~USD 10 | ~USD 30 | Máxima capacidad; caro para alto volumen. |

- **Batch API:** hasta ~50 % de descuento si podés enviar trabajos en lote (ej. análisis de alumnos en background).
- **Para tu academia:** arrancar con **GPT-4o mini** suele ser lo más económico con buena calidad.

### Google Gemini

| Opción | Costo | Límites |
|--------|--------|--------|
| **Free tier** | **USD 0** | ~250 req/día, ~10 req/min; modelo Flash. |
| **Pay-as-you-go** | Variable por modelo | Límites más altos; ver [pricing](https://ai.google.dev/gemini-api/docs/pricing). |

- Muy buena opción para **empezar sin gastar**: free tier con Gemini Flash.
- Para producción con más volumen, revisar precios actuales en la consola de Google AI.

### Groq (Llama y otros)

| Modelo | Input (por 1M tokens) | Output (por 1M tokens) |
|--------|------------------------|-------------------------|
| **Llama 3.1 8B** | ~USD 0,05 | ~USD 0,08 |
| **Llama 3.3 70B** | ~USD 0,59 | ~USD 0,79 |

- **Free tier** con límites por minuto/día (consultar [Groq](https://console.groq.com)).
- Muy barato; útil si aceptás modelos Llama en lugar de GPT/Claude.

### Anthropic (Claude)

- Precios por modelo y por token en: https://docs.anthropic.com/en/docs/about-claude/pricing  
- **Batch** suele ser más barato para trabajos asíncronos (ej. análisis por lotes).

### Opción a costo cero (self‑hosted): Ollama

| Concepto | Costo |
|----------|--------|
| **Software y modelos** | **USD 0** (open source) |
| **Coste real** | Servidor (o PC) + electricidad; sin pago por token. |

- Corrés el modelo en tu máquina o en un servidor tuyo.
- Requiere **RAM/GPU** (ej. 16 GB RAM, GPU con 8–16 GB VRAM para modelos medianos).
- **Ideal para:** desarrollo, pruebas, bajo volumen o si ya tenés servidor.
- **No ideal para:** escalar mucho sin invertir en infra.

---

## Cómo hacerlo económico en la práctica

### 1. Elegir el modelo según la tarea

- **Chatbot (respuestas cortas, tools):** **GPT-4o mini** (OpenAI) o **Gemini Flash** (free tier) o **Llama en Groq**.
- **Análisis de alumnos (resúmenes, reportes):** mismo modelo barato; si hace falta más calidad, usar GPT-4o solo para ese flujo.
- **Solo pruebas / MVP:** **Gemini free tier** o **Ollama** en local.

### 2. Reducir tokens enviados (input)

- **System prompt corto:** solo instrucciones esenciales del bot (rol, reglas, formato).
- **Pocos mensajes de historial:** ej. últimas 5–10 vueltas de conversación en lugar de 50.
- **Resumir historial largo:** cada N mensajes, mandar un resumen en un solo mensaje y seguir con ese contexto.
- **No mandar datos crudos enormes:** para “analizar alumnos”, enviar agregados o muestras (ej. “100 últimos alumnos + totales”), no toda la tabla sin filtrar.

### 3. Reducir tokens generados (output)

- **max_tokens** bajo cuando la respuesta esperada es corta (ej. 150–300 para confirmaciones).
- En análisis, pedir en el prompt “respuesta breve” o “solo bullet points”.

### 4. Cache y Batch (si el proveedor lo ofrece)

- **OpenAI:** cache de prompts repetidos (descuento en input); Batch API para trabajos no urgentes (ej. análisis nocturno).
- **Gemini:** context caching; batch con descuento.
- Útil cuando repetís el mismo contexto (ej. mismo system prompt + mismos datos de clases) muchas veces.

### 5. Un solo proveedor barato para todo el flujo

- Usar **un solo modelo** (ej. GPT-4o mini) para chat y para análisis evita configurar varias APIs y suele ser más barato que mezclar GPT-4 en todo.

---

## Estimación muy orientativa (chatbot academia)

Supuesto: **1.000 conversaciones/mes**, ~**400 tokens por conversación** (input+output en promedio).

- **Tokens/mes:** 400 × 1.000 = **400.000 tokens** (~0,4M).
- **GPT-4o mini (OpenAI):**  
  - Input ~60 %, output ~40 % → ~USD 0,04 + USD 0,14 ≈ **~USD 0,20/mes**.
- **Gemini Flash (free):** si entrás en el free tier, **USD 0** hasta el límite de requests.
- **Groq Llama 3.1 8B:** del orden de **centavos de dólar** por ese volumen.

Los números son ilustrativos; los precios reales dependen del modelo exacto y de la región.

---

## Resumen de opciones por presupuesto

| Presupuesto | Opción recomendada |
|-------------|---------------------|
| **Cero** | Gemini free tier o Ollama (local). |
| **Muy bajo (pocos USD/mes)** | GPT-4o mini (OpenAI) o Groq (Llama 3.1 8B). |
| **Bajo con buena calidad** | GPT-4o mini para todo; GPT-4o solo para análisis complejos si hace falta. |
| **Sin límite de uso, tenés servidor** | Ollama en tu propio hardware. |

---

## Enlaces oficiales de precios

- **OpenAI:** https://platform.openai.com/docs/pricing  
- **Google Gemini:** https://ai.google.dev/gemini-api/docs/pricing  
- **Groq:** https://groq.com/pricing  
- **Anthropic:** https://docs.anthropic.com/en/docs/about-claude/pricing  
- **Ollama:** https://ollama.com (gratis, self-hosted)

Actualizá siempre con la página de precios de cada proveedor; los valores en este doc son de referencia.
