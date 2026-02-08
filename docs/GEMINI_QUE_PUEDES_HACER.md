# Qué podés hacer con la IA de Gemini (API)

Resumen de las **capacidades** de la API de Google Gemini según la documentación oficial. Sirve para elegir qué usar en tu academia (chatbot, análisis, etc.).

---

## 1. Generación de texto (chat / completions)

- **Entrada:** texto (prompt o historial de mensajes).
- **Salida:** texto (respuesta del modelo).

**Uso típico:** Chatbot, respuestas automáticas, resúmenes, respuestas a preguntas.

- Modelos: **Gemini 2.5 Flash**, **2.5 Flash-Lite**, **2.5 Pro**, **Gemini 3 Flash/Pro**, etc.
- Ventana de contexto grande (ej. 1M tokens según modelo).
- Podés enviar system instruction + mensajes de usuario/asistente.

**Doc:** [Text generation](https://ai.google.dev/gemini-api/docs/text-generation)

---

## 2. Multimodal: texto + imagen + video + audio

- **Entrada:** texto + imágenes, o video, o audio (según modelo).
- **Salida:** texto (descripción, análisis, respuestas).

**Uso típico:** Analizar fotos (ej. documentos, formularios), describir videos, transcripción/resumen de audio, preguntas sobre un PDF o una imagen.

- Algunos modelos aceptan **imágenes** (JPEG, PNG, WebP, etc.).
- **Video** y **audio** en modelos que lo soporten.
- Útil para “subir un comprobante” o “analizar esta hoja” en tu app.

**Doc:** [Multimodal](https://ai.google.dev/gemini-api/docs) (overview) y documentación de cada modelo.

---

## 3. Function calling (herramientas / tools)

- El modelo puede **pedir llamar funciones** que vos definís (ej. consultar clases, agendar entrevista, generar link de pago).
- Vos ejecutás la función en tu backend y devolvés el resultado al modelo; el modelo sigue la conversación con ese dato.

**Uso típico:** Chatbot de la academia que lista clases, agenda entrevistas y envía links de pago (como en tu doc de IA_ACADEMIA_RECOMENDACION).

**Doc:** [Function calling](https://ai.google.dev/gemini-api/docs/function-calling)

---

## 4. Structured output (respuesta en JSON)

- Podés **pedir que la respuesta sea JSON** con un esquema (campos, tipos).
- Útil para integrar con tu código sin parsear texto libre.

**Uso típico:** Formularios automáticos, extracción de datos (nombre, email, fecha) desde un mensaje del usuario, respuestas que tu backend consume directo.

**Doc:** [Structured output](https://ai.google.dev/gemini-api/docs/structured-output)

---

## 5. Embeddings (vectores de texto)

- **Entrada:** texto (frase, párrafo, etc.).
- **Salida:** vector numérico (ej. 768 o 3072 dimensiones).

**Uso típico:** Búsqueda semántica, RAG (Retrieval Augmented Generation): indexar alumnos o cursos por embeddings y luego “preguntar en lenguaje natural” y recuperar lo más parecido antes de generar la respuesta.

**Doc:** [Embeddings](https://ai.google.dev/gemini-api/docs/embeddings)

---

## 6. Long context (contexto muy largo)

- Algunos modelos aceptan **hasta 1M tokens** (o más) en una sola request.
- Podés mandar muchos documentos, un historial muy largo o una base de datos resumida en texto.

**Uso típico:** “Analizá estos 100 alumnos (resumen en texto)” sin tener que cortar; análisis de documentos largos; chat con historial extenso.

**Doc:** [Long context](https://ai.google.dev/gemini-api/docs/long-context)

---

## 7. Document understanding (PDF y archivos)

- Subir **PDFs u otros archivos** (hasta ~1000 páginas según doc) y hacer preguntas o pedir resúmenes.
- El modelo “ve” el contenido (texto + imágenes en el PDF).

**Uso típico:** Analizar programas de curso, reglamentos, CVs en PDF, facturas o comprobantes escaneados.

**Doc:** [Document processing](https://ai.google.dev/gemini-api/docs/document-processing)

---

## 8. Thinking (razonamiento explícito)

- Algunos modelos tienen modo **“thinking”**: piensan paso a paso antes de responder (más tokens, más costo, mejor para tareas complejas).
- Podés configurar un “presupuesto” de tokens de pensamiento para controlar costo y latencia.

**Uso típico:** Análisis de alumnos más complejo, decisiones que requieren varios pasos de razonamiento.

**Doc:** [Thinking](https://ai.google.dev/gemini-api/docs/thinking)

---

## 9. Herramientas integradas (Google Search, Code Execution, etc.)

- Gemini puede usar **tools** como:
  - **Google Search** (buscar en la web).
  - **Code Execution** (ejecutar código en un sandbox).
  - **URL Context** (leer contenido de una URL).
  - **Google Maps**, **Computer Use**, etc. (según disponibilidad).

**Uso típico:** Chatbot que “busca en Google” o que ejecuta un cálculo y te devuelve el resultado; en la academia podría usarse para búsquedas o cálculos bajo demanda.

**Doc:** [Tools](https://ai.google.dev/gemini-api/docs/tools)

---

## 10. Generación de imágenes (Nano Banana)

- Modelos de **generación de imágenes** (ej. Nano Banana) para crear o editar imágenes a partir de texto o de otra imagen.

**Uso típico:** Ilustraciones, banners, edición de imágenes para contenido de la academia (si está disponible en tu región/cuenta).

**Doc:** [Image generation](https://ai.google.dev/gemini-api/docs/image-generation)

---

## 11. Video (Veo) y voz (Live API)

- **Veo:** generación de video a partir de texto o imagen (modelo Veo 3.1).
- **Live API:** agentes de voz en tiempo real (entrada/salida de audio).

**Uso típico:** Contenido audiovisual para cursos; asistente por voz (ej. “llamá a la academia” y hablar con un bot). Depende de disponibilidad y planes.

**Doc:** [Video](https://ai.google.dev/gemini-api/docs/video), [Live API](https://ai.google.dev/gemini-api/docs/live)

---

## Resumen para tu academia

| Necesidad | Qué usar con Gemini |
|-----------|----------------------|
| **Chatbot** (clases, entrevistas, pagos) | Generación de texto + **function calling**. |
| **Analizar alumnos** (resúmenes, tendencias) | Generación de texto + **long context** (resumen de DB en texto). |
| **Búsqueda “en lenguaje natural”** sobre cursos/alumnos | **Embeddings** + búsqueda por similitud + generación de texto (RAG). |
| **Subir PDF** (programa, reglamento, CV) y preguntar | **Document understanding** o multimodal (imagen/PDF). |
| **Respuestas en formato fijo** (ej. JSON) | **Structured output**. |
| **Que el bot “busque en Google” o haga cálculos** | **Tools** (Google Search, Code Execution). |
| **Probar sin gastar** | Tier **gratuito** de la API (con límites RPM/RPD; ver GEMINI_FREE_TIER_RESTRICCIONES.md). |

---

## Enlaces rápidos

- **Documentación general:** https://ai.google.dev/gemini-api/docs  
- **Modelos:** https://ai.google.dev/gemini-api/docs/models  
- **Quickstart:** https://ai.google.dev/gemini-api/docs/quickstart  
- **API key:** https://aistudio.google.com/apikey  

Si querés, el siguiente paso puede ser armar en NestJS un módulo que use solo **generación de texto** (y después **function calling**) con Gemini para el chatbot de la academia.
