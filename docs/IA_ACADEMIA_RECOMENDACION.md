# Integrar IA en NestJS – Academia (chatbot + análisis de alumnos)

Recomendación de librería y curso de acción para:
- **Fase 1:** Chatbot que muestre clases, agende entrevistas y envíe links de pago/suscripción.
- **Fase 2:** Recorrer y analizar la base de datos (ej. análisis de alumnos).

---

## Librería recomendada

### Opción principal: **OpenAI SDK** (`openai`)

- **Paquete:** `openai` (oficial, npm).
- **Por qué:**
  - Muy documentado y estable.
  - **Function calling (tools):** el modelo puede “decidir” llamar a tus funciones (clases disponibles, agendar entrevista, link de pago) y tú ejecutas la lógica en NestJS.
  - Un solo cliente para chat y, más adelante, embeddings (para análisis/RAG).
  - Se integra directo en un servicio NestJS sin capas extra.

```bash
bun add openai
```

Para el chatbot con “acciones” (clases, entrevistas, pagos), el flujo es: **usuario escribe → OpenAI con tools → tu backend ejecuta la función que el modelo elige → devuelves el resultado al modelo → el modelo responde al usuario**. No necesitás LangChain para ese primer paso.

### Opción alternativa / evolución: **LangChain.js**

- **Paquetes:** `@langchain/core`, `@langchain/openai`, etc.
- **Cuándo tiene sentido:** Si más adelante querés agentes más complejos, cadenas reutilizables, memoria de conversación estructurada o RAG con documentos externos. Podés sumarlo en Fase 2 o 3.

**Recomendación:** Empezar con **OpenAI SDK** en NestJS; si el producto crece y necesitás más orquestación (agentes, RAG avanzado), incorporar LangChain encima.

---

## Curso de acción (por fases)

### Fase 1 – Chatbot de la academia (MVP)

Objetivo: un bot que responda en lenguaje natural y pueda **listar clases**, **agendar entrevistas** y **enviar links de pago/suscripción**.

1. **Modelo y API**
   - Crear proyecto/API key en [OpenAI](https://platform.openai.com).
   - En NestJS: variable de entorno `OPENAI_API_KEY` y un módulo dedicado (ej. `ChatModule` o `AiModule`).

2. **Módulo NestJS**
   - `AiModule` (o `ChatModule`): `AiService` que use el cliente `openai`.
   - Un endpoint de chat, ej. `POST /api/chat` con body `{ messages: [...] }` (y opcional `conversationId` si guardás historial).

3. **“Tools” (function calling)**
   Definir funciones que el modelo pueda invocar, por ejemplo:
   - `get_available_classes` – devuelve clases disponibles (desde tu DB o servicio).
   - `schedule_interview` – recibe fecha/hora y contacto (email/teléfono o alumno_id), guarda en DB y devuelve confirmación.
   - `get_payment_link` – recibe tipo (curso/suscripción) e identificador, genera link (ej. Mercado Pago Preference) y lo devuelve para que el bot lo ponga en la respuesta.

   En el servicio:
   - Llamás a `chat.completions.create` con `model`, `messages` y `tools` (definición de las 3 funciones).
   - Si la respuesta trae `tool_calls`, ejecutás la función correspondiente en tu backend (consultando tu DB, Mercado Pago, etc.) y volvés a llamar al modelo con el resultado en un mensaje de tipo `tool`.
   - La respuesta final del modelo es lo que mostrás al usuario (texto + link de pago si aplica).

4. **Persistencia mínima**
   - **Conversaciones:** tabla (o colección) por conversación y mensajes, para historial y contexto en la siguiente llamada.
   - **Entrevistas:** tabla “entrevistas” (fecha, alumno/contacto, estado).
   - **Clases:** ya las tenés en tu modelo de dominio; el tool las lee.

5. **Integraciones**
   - **Clases disponibles:** desde tu base de datos (TypeORM/Prisma).
   - **Entrevistas:** crear/actualizar en tu DB desde el tool `schedule_interview`.
   - **Links de pago:** desde tu módulo de Mercado Pago (Preference o suscripción); el tool devuelve la URL y el bot la incluye en el mensaje.

6. **Frontend**
   - Cliente de chat (web o móvil) que llame a `POST /api/chat` y muestre la respuesta. Opcional: streaming con `stream: true` y Server-Sent Events o similar.

Orden sugerido de implementación:
1. Módulo + `AiService` + endpoint de chat sin tools (solo mensajes).
2. Añadir un tool (ej. `get_available_classes`) y conectar con tu DB.
3. Añadir `schedule_interview` y persistencia de entrevistas.
4. Añadir `get_payment_link` y enlace con Mercado Pago.

---

### Fase 2 – Analizar alumnos (recorrer la base de datos)

Objetivo: usar la misma IA para “analizar” alumnos (tendencias, resúmenes, recomendaciones) a partir de los datos que ya tenés en la DB.

1. **Enfoque “resumen con contexto” (más simple)**
   - Endpoint de admin, ej. `POST /api/ai/analyze-students` (o con parámetros de rango de fechas, curso, etc.).
   - En el servicio:
     - Consultar la DB (alumnos, inscripciones, pagos, asistencias, etc.) y armar un resumen estructurado o un JSON acotado (evitar mandar 100.000 filas crudas).
     - Enviar ese contexto al modelo con un prompt del tipo: “Analizá estos datos de alumnos e indicá tendencias, alumnos en riesgo de abandono, sugerencias.”
   - El modelo responde en lenguaje natural; opcionalmente guardar el análisis en DB o mostrarlo solo en pantalla.

2. **Enfoque “preguntas en lenguaje natural” (más flexible)**
   - Mismo endpoint (o uno tipo “consulta”) donde el admin escribe una pregunta (ej. “¿Cuántos alumnos nuevos hubo por mes?”).
   - Vos generás una consulta SQL o TypeORM a partir de la pregunta (con un prompt que pida “solo una consulta SQL” o usando un paso intermedio) **o** predefinís un conjunto de “consultas permitidas” y el modelo elige la más adecuada (tool calling).
   - Ejecutás la consulta, pasás el resultado al modelo y este genera la respuesta en texto.

3. **Enfoque RAG (opcional, más adelante)**
   - Si tenés muchos documentos o descripciones de alumnos: generar **embeddings** (OpenAI `embeddings`) de perfiles o textos, guardarlos en DB (o en un índice vectorial).
   - Para cada pregunta del admin, buscar los fragmentos más similares y enviarlos como contexto al chat. Útil cuando la respuesta depende de “buscar en textos” más que de agregar tablas.

En todos los casos la “librería” sigue siendo la misma: **OpenAI** (chat + opcionalmente embeddings). La diferencia está en qué datos preparás y cómo los inyectás en el prompt o en tools.

---

## Esquema de arquitectura (referencia)

```
┌─────────────────────────────────────────────────────────────────┐
│  Cliente (web / app)                                             │
│  POST /api/chat { messages }  →  Respuesta del bot (texto + link)│
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  NestJS – ChatController → AiService (OpenAI)                     │
│  • messages + system prompt (rol del bot de la academia)          │
│  • tools: get_available_classes, schedule_interview,              │
│           get_payment_link                                        │
│  • Si hay tool_calls → ejecutar en backend → nuevo mensaje tool   │
└─────────────────────────────────────────────────────────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────────┐   ┌─────────────────────┐
│  Clases/     │   │  Entrevistas     │   │  Mercado Pago        │
│  Cursos (DB) │   │  (DB)            │   │  (Preference / Sub)  │
└──────────────┘   └──────────────────┘   └─────────────────────┘
```

---

## Resumen

| Pregunta | Recomendación |
|----------|----------------|
| **Librería para el chatbot y la IA** | **OpenAI SDK** (`openai`) en NestJS; opcionalmente LangChain.js más adelante. |
| **Primer paso** | Chatbot con **tools**: clases disponibles, agendar entrevistas, link de pago/suscripción. |
| **Siguiente paso** | Análisis de alumnos: mismo `openai` + contexto desde tu DB (resúmenes o consultas); después podés sumar RAG si hace falta. |
| **Curso de acción** | 1) Módulo + servicio OpenAI + endpoint chat. 2) Tools + DB + Mercado Pago. 3) Persistir conversaciones y entrevistas. 4) Endpoint de análisis de alumnos con contexto de DB. |

Si querés, el siguiente paso puede ser esbozar en tu repo la estructura del `AiModule`, el `AiService` con un tool de ejemplo (`get_available_classes`) y el `POST /api/chat` usando tu stack actual (Nest + TypeORM, etc.).
