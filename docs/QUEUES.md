# Queues (Colas) – Para qué sirven y cómo usarlas

Explicación de **colas de trabajos (job queues)** y cómo usarlas en **NestJS** con BullMQ (o Bull) y Redis.

---

## ¿Qué es una Queue (cola)?

Una **cola** es una lista de **tareas (jobs)** que se procesan **en segundo plano**, una tras otra (o varias en paralelo), sin bloquear la respuesta al usuario.

Flujo básico:

1. **Productor:** tu API recibe una petición y en lugar de hacer el trabajo pesado ahí, **añade un job a la cola** y responde rápido (ej. “Tu solicitud está en proceso”).
2. **Worker (trabajador):** un proceso **saca jobs de la cola** y los ejecuta (envío de mail, llamada a AFIP, generación de PDF, etc.).
3. Si un job falla, se puede **reintentar** automáticamente; los jobs pueden tener **prioridad**, **retraso** o **repetición programada**.

La cola suele estar respaldada por **Redis** (o similar): los jobs se guardan ahí y uno o varios workers los consumen.

---

## ¿Para qué sirve?

| Problema | Cómo ayuda la cola |
|----------|---------------------|
| **Operaciones lentas** | El usuario no espera: la request termina rápido y el trabajo se hace en background. |
| **Picos de tráfico** | Los jobs se encolan y se procesan de a poco; no se satura el servidor. |
| **Fallos puntuales** | Reintentos automáticos (ej. 3 intentos con delay) sin perder el job. |
| **Tareas que no pueden perderse** | Los jobs quedan en Redis hasta que se procesen correctamente. |
| **Rate limits de APIs** | Procesar jobs con límite de concurrencia o con delay entre ellos. |
| **Orden o prioridad** | Procesar en orden (FIFO) o dar prioridad a ciertos jobs. |

### Ejemplos típicos

- **Enviar email** tras registrarse o tras una compra → encolar “enviar mail” y responder al usuario al instante.
- **Generar PDF/factura** → encolar “generar factura para venta X” y notificar cuando esté listo.
- **Sincronizar con AFIP/Mercado Pago** → encolar “sincronizar pago Y” y reintentar si falla.
- **Procesar subida de archivos** (resize, virus scan) → encolar “procesar archivo Z”.
- **Envío masivo** (newsletter, notificaciones) → encolar un job por destinatario y procesar con concurrencia limitada.

---

## Cola vs Task Scheduling

| | **Queue (Cola)** | **Task Scheduling (Cron)** |
|---|------------------|----------------------------|
| **Cuándo se ejecuta** | Cuando **alguien añade un job** (p. ej. una request). | A una **hora fija** o cada X tiempo (definido en código). |
| **Ejemplo** | “Cada vez que un usuario se registra, encolar envío de mail.” | “Todos los días a las 8:00, generar reporte.” |
| **Datos del job** | Cada job puede llevar datos distintos (userId, orderId, etc.). | La tarea es la misma; los datos suelen leerse de DB o config. |

Podés combinar ambos: un **cron** que cada hora **añada jobs a una cola** (ej. “sincronizar pagos pendientes”) y un **worker** que procese esos jobs.

---

## Cómo funciona (conceptos)

```
┌─────────────┐     add job      ┌─────────────┐     process     ┌─────────────┐
│   API       │ ───────────────► │    Redis    │ ◄────────────── │   Worker    │
│ (Producer)  │                  │   (Queue)   │    get job      │ (Consumer)  │
└─────────────┘                  └─────────────┘                 └─────────────┘
                                       │
                                       │  job 1, job 2, job 3...
                                       ▼
                                Worker procesa uno (o N en paralelo)
                                y marca como completado o fallido.
```

- **Producer:** en NestJS suele ser un servicio que inyecta la cola y llama a `queue.add(data)`.
- **Redis:** guarda la lista de jobs y el estado (waiting, active, completed, failed).
- **Worker / Processor:** en NestJS es un método con el decorador `@Processor('nombre-cola')` que recibe el job y hace el trabajo.

---

## Cómo usarlo en NestJS (BullMQ + Redis)

NestJS recomienda **BullMQ** (evolución de Bull) con **Redis**. Los jobs se definen en “queues”; cada queue tiene un nombre y opcionalmente un worker que los procesa.

### Requisitos

- **Redis** corriendo (local, Docker o servicio en la nube).

### Instalación

```bash
bun add @nestjs/bullmq bullmq
# o
npm install @nestjs/bullmq bullmq
```

### Configuración del módulo

En `app.module.ts` (o en un módulo que use colas):

```ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
        // password: 'opcional',
      },
    }),
    BullModule.registerQueue(
      { name: 'emails' },      // cola de envío de mails
      { name: 'payments' },    // cola de procesamiento de pagos
    ),
  ],
})
export class AppModule {}
```

### Producer: añadir jobs a la cola

Un servicio (o controller) **inyecta** la cola e **incorpora jobs**:

```ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class UserService {
  constructor(
    @InjectQueue('emails') private emailQueue: Queue,
  ) {}

  async register(user: CreateUserDto) {
    const newUser = await this.userRepository.save(user);
    // No esperar al mail; encolar y responder
    await this.emailQueue.add('welcome', {
      to: newUser.email,
      name: newUser.name,
    });
    return newUser;
  }
}
```

`add('welcome', data)` añade un job de tipo `'welcome'` con payload `data`. El worker puede distinguir por ese nombre si hace falta.

### Worker (Processor): procesar los jobs

Un **processor** es un servicio que “escucha” la cola y ejecuta una función por cada job:

```ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'welcome') {
      await this.sendWelcomeEmail(job.data);
    }
  }

  private async sendWelcomeEmail(data: { to: string; name: string }) {
    // Lógica de envío (Nodemailer, SendGrid, etc.)
    console.log(`Enviando bienvenida a ${data.to}`);
  }
}
```

Ese servicio debe estar **registrado como provider** en el módulo que importa `BullModule.registerQueue('emails')`.

### Opciones útiles al añadir un job

```ts
await this.emailQueue.add(
  'welcome',
  { to: 'a@b.com', name: 'Juan' },
  {
    delay: 5000,           // ejecutar en 5 segundos
    attempts: 3,           // reintentar hasta 3 veces si falla
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100, // borrar después de completar (limitar memoria)
  },
);
```

---

## Eventos de la cola (opcional)

Podés escuchar eventos para logging, métricas o notificaciones:

```ts
@OnQueueCompleted()
onCompleted(job: Job) {
  console.log(`Job ${job.id} completado`);
}

@OnQueueFailed()
onFailed(job: Job, error: Error) {
  console.error(`Job ${job.id} falló:`, error.message);
}
```

Decoradores: `@OnQueueCompleted()`, `@OnQueueFailed()`, `@OnQueueActive()`, etc., del paquete `@nestjs/bullmq`.

---

## Ejemplos para una academia

| Tarea | Cola | Job | Uso |
|-------|------|-----|-----|
| Mail de bienvenida | `emails` | `welcome` | Tras registro, encolar y responder rápido. |
| Recordatorio de entrevista | `emails` | `interview-reminder` | Un cron o un trigger añade jobs con fecha del recordatorio. |
| Sincronizar pago con MP | `payments` | `sync-payment` | Tras crear pago, encolar sincronización y reintentar si falla. |
| Generar certificado PDF | `documents` | `generate-certificate` | Tras aprobar curso, encolar generación y notificar cuando esté. |
| Envío masivo a alumnos | `emails` | `bulk-newsletter` | Añadir un job por alumno o por lote; worker con concurrencia 1 o 5. |

---

## Resumen

| Pregunta | Respuesta |
|----------|-----------|
| **¿Qué es una queue?** | Una cola de trabajos que se procesan en segundo plano (productor añade, worker procesa). |
| **¿Para qué sirve?** | No bloquear al usuario, reintentos, picos de tráfico, tareas que no pueden perderse, rate limiting. |
| **¿Con qué se implementa en NestJS?** | `@nestjs/bullmq` + **Redis** (BullMQ usa Redis para guardar los jobs). |
| **¿Quién añade jobs?** | Cualquier servicio o controller (producer) inyectando la cola con `@InjectQueue('nombre')`. |
| **¿Quién procesa los jobs?** | Un processor (clase con `@Processor('nombre')` que extiende `WorkerHost` e implementa `process(job)`). |
| **¿Diferencia con cron?** | Cron = a una hora fija. Cola = cuando ocurre un evento (request, acción del usuario) y encolás un job. |

Documentación oficial: [NestJS - Queues](https://docs.nestjs.com/techniques/queues), [BullMQ - NestJS](https://docs.bullmq.io/guide/nestjs).
