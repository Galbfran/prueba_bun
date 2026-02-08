# Task Scheduling – Para qué sirve y cómo usarlo

Explicación de **task scheduling** (programación de tareas) y cómo usarlo en **NestJS** con `@nestjs/schedule`.

---

## ¿Qué es Task Scheduling?

Es ejecutar **código de forma automática** en momentos concretos o cada cierto tiempo, sin que un usuario haga una petición. Por ejemplo:

- Cada día a las 8:00.
- Cada 5 minutos.
- Una sola vez 30 segundos después de arrancar la app.
- Los lunes a las 9:00.

El servidor corre estas tareas en segundo plano según la regla que definas (cron, intervalo, timeout).

---

## ¿Para qué sirve?

| Uso | Ejemplo |
|-----|--------|
| **Recordatorios / notificaciones** | Enviar mail o push antes de una entrevista o clase. |
| **Reportes periódicos** | Resumen diario/semanal de alumnos, ingresos o asistencias. |
| **Limpieza de datos** | Borrar sesiones vencidas, logs viejos o archivos temporales. |
| **Sincronización** | Traer datos de AFIP, Mercado Pago o Google cada X horas. |
| **Chequeos de salud** | Ver cada minuto que la DB y APIs externas respondan. |
| **Procesos en lote** | Generar facturas, enviar newsletters o procesar colas a una hora fija. |
| **Renovación de tokens** | Refrescar tokens de OAuth o de APIs antes de que venzan. |

En una **academia** podrías: recordar entrevistas, enviar resúmenes semanales, limpiar datos antiguos, sincronizar pagos con Mercado Pago, etc.

---

## Cómo usarlo en NestJS

NestJS ofrece el paquete **`@nestjs/schedule`**, que usa **node-cron** por debajo. Permite:

1. **Cron:** expresión tipo “cada día a las 8:00”, “cada lunes a las 9:00”.
2. **Interval:** cada X milisegundos (ej. cada 60 segundos).
3. **Timeout:** ejecutar una vez tras X milisegundos (ej. al arrancar + 30 s).

### Instalación

```bash
bun add @nestjs/schedule
# o
npm install @nestjs/schedule
```

### Activar el módulo

En `app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  // ...
})
export class AppModule {}
```

A partir de ahí podés usar los decoradores en cualquier **provider** (por ejemplo un servicio).

---

## 1. `@Cron()` – Ejecutar con expresión cron

La expresión cron tiene 5 (o 6) campos:

```
* * * * * *
│ │ │ │ │ │
│ │ │ │ │ └── día de la semana (0-7, 0 y 7 = domingo)
│ │ │ │ └──── mes (1-12)
│ │ │ └────── día del mes (1-31)
│ │ └──────── hora (0-23)
│ └────────── minuto (0-59)
└──────────── segundo (0-59, opcional)
```

Ejemplos:

| Expresión | Significado |
|-----------|-------------|
| `0 8 * * *` | Todos los días a las 8:00 |
| `0 9 * * 1` | Todos los lunes a las 9:00 |
| `*/5 * * * *` | Cada 5 minutos |
| `0 0 1 * *` | El día 1 de cada mes a las 0:00 |
| `0 18 * * 1-5` | De lunes a viernes a las 18:00 |

Ejemplo en un servicio:

```ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  // Todos los días a las 8:00
  @Cron('0 8 * * *')
  handleDailyReport() {
    console.log('Generar reporte diario...');
    // Enviar mail, guardar en DB, etc.
  }

  // Cada lunes a las 9:00
  @Cron('0 9 * * 1', { name: 'weeklyReport' })
  handleWeeklyReport() {
    console.log('Generar reporte semanal...');
  }

  // Con zona horaria (ej. Argentina)
  @Cron('0 8 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  handleMorningReminder() {
    console.log('Recordatorios de entrevistas del día...');
  }
}
```

---

## 2. `@Interval()` – Ejecutar cada X ms

Útil para tareas que deben repetirse cada cierto tiempo sin depender del reloj (ej. cada 60 segundos).

```ts
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  // Cada 60 segundos
  @Interval(60_000)
  handleEveryMinute() {
    console.log('Chequeo cada minuto...');
  }

  // Cada 5 minutos
  @Interval(5 * 60 * 1000)
  handleEveryFiveMinutes() {
    console.log('Sincronizar con API externa...');
  }
}
```

---

## 3. `@Timeout()` – Ejecutar una vez tras X ms

Se ejecuta **una sola vez** después de que la aplicación arranca.

```ts
import { Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  // 30 segundos después de arrancar
  @Timeout(30_000)
  handleOnStartup() {
    console.log('App lista, tarea única ejecutada.');
  }
}
```

---

## Opciones útiles de `@Cron()`

```ts
@Cron('0 8 * * *', {
  name: 'dailyJob',           // Identificador (para inyectar o deshabilitar)
  timeZone: 'America/Argentina/Buenos_Aires',
  disabled: false,            // true = no se ejecuta
  waitForCompletion: true,    // No lanzar otra ejecución si la anterior sigue corriendo
})
handleDaily() {}
```

- **waitForCompletion:** evita solapamientos si el job tarda más que el intervalo.

---

## Ejemplos para una academia

| Tarea | Decorador | Ejemplo |
|-------|------------|--------|
| Recordatorio de entrevistas (cada mañana) | `@Cron('0 8 * * *')` | Buscar entrevistas del día y enviar mail/push. |
| Reporte semanal de alumnos | `@Cron('0 9 * * 1')` | Agregar alumnos de la semana y enviar resumen. |
| Sincronizar pagos con Mercado Pago | `@Interval(3600_000)` | Cada hora consultar pagos pendientes y actualizar estado. |
| Limpiar sesiones o tokens vencidos | `@Cron('0 3 * * *')` | Todas las noches a las 3:00. |
| Health check cada minuto | `@Interval(60_000)` | Comprobar DB y APIs. |
| Una tarea al arrancar | `@Timeout(5000)` | Cargar caché o verificar config. |

---

## Buenas prácticas

1. **No poner lógica pesada en el cron:** delegar a un servicio (ej. `ReportService.generateDailyReport()`).
2. **Manejar errores:** usar `try/catch` o un filtro global para que un fallo no rompa el scheduler.
3. **Evitar solapamientos:** usar `waitForCompletion: true` si el job puede tardar más que el intervalo.
4. **Zona horaria:** usar `timeZone` en crons para que “8:00” sea en tu país.
5. **Desactivar en tests:** usar `disabled: process.env.NODE_ENV === 'test'` o mockear el módulo.

---

## Resumen

| Pregunta | Respuesta |
|----------|-----------|
| **¿Qué es?** | Ejecutar código automáticamente a una hora o cada X tiempo. |
| **¿Para qué sirve?** | Recordatorios, reportes, limpieza, sincronización, health checks, procesos en lote. |
| **¿Cómo en NestJS?** | `@nestjs/schedule` + `@Cron()`, `@Interval()`, `@Timeout()` en un servicio. |
| **¿Dónde se define?** | En cualquier provider; el módulo debe importar `ScheduleModule.forRoot()`. |

Documentación oficial: [NestJS - Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling).
