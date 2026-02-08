# Opciones para conectarse a Google Drive, Sheets y Calendar

Todas son **APIs oficiales de Google**. Desde Node.js/Bun podés usar las librerías oficiales de Google (mantenidas por Google).

---

## Dos formas de instalar

### 1. Un solo paquete (todas las APIs)

```bash
bun add googleapis
# o
npm install googleapis
```

Incluye Drive, Sheets, Calendar, Gmail, etc. en un solo cliente. Ideal si vas a usar varias APIs.

### 2. Paquetes modulares (solo lo que necesitás)

```bash
bun add @googleapis/drive @googleapis/sheets @googleapis/calendar
```

Cada paquete es independiente: menos peso y arranque más rápido. Google lo recomienda si querés optimizar tamaño y tiempo de inicio.

---

## Autenticación (necesaria para las 3)

Para acceder a datos de un **usuario** (su Drive, sus hojas, su calendario) se usa **OAuth 2.0**: el usuario autoriza tu app desde su cuenta de Google.

1. **Google Cloud Console:** https://console.cloud.google.com  
2. Crear proyecto (o usar uno existente).  
3. Activar las APIs que uses:
   - **Google Drive API**
   - **Google Sheets API**
   - **Google Calendar API**
4. **Credenciales** → Crear **ID de cliente OAuth 2.0** (tipo “Aplicación web” o “Desktop”).  
5. Descargar el JSON del cliente o usar Client ID + Client Secret.  
6. En tu app: flujo OAuth (pantalla de login de Google → código o tokens → guardar `access_token` y `refresh_token`).

Para **Service Account** (acceso sin usuario, p. ej. una hoja/calendario/carpeta “de la app”): crear una cuenta de servicio en la consola, descargar el JSON de la clave y usarlo en el cliente. Para **calendario/carpeta de un usuario** con Service Account, ese usuario debe compartir el recurso con el email de la cuenta de servicio.

---

## Google Drive

**Qué permite:** listar/crear/descargar/eliminar archivos, carpetas, permisos, búsqueda, cambios.

| Paquete | Uso |
|---------|-----|
| `googleapis` | `const drive = google.drive({ version: 'v3', auth: oauth2Client });` |
| `@googleapis/drive` | `const { drive_v3 } = await import('@googleapis/drive');` + auth |

**Ejemplo (con googleapis):**

```js
const { google } = require('googleapis');
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

// Listar archivos
const res = await drive.files.list({ pageSize: 10, fields: 'nextPageToken, files(id, name)' });

// Subir archivo
await drive.files.create({
  requestBody: { name: 'mi-archivo.txt' },
  media: { mimeType: 'text/plain', body: readableStream }
});

// Descargar
const file = await drive.files.get({ fileId: 'ID', alt: 'media' }, { responseType: 'stream' });
```

Documentación: https://developers.google.com/drive/api/guides/about-sdk

---

## Google Sheets (planilla de cálculos)

**Qué permite:** leer y escribir celdas, rangos, hojas, formato, fórmulas (según la API).

| Paquete | Uso |
|---------|-----|
| `googleapis` | `const sheets = google.sheets({ version: 'v4', auth: oauth2Client });` |
| `@googleapis/sheets` | Import del cliente Sheets v4 + auth |

**Ejemplo (con googleapis):**

```js
const { google } = require('googleapis');
const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

const spreadsheetId = 'ID_DE_LA_HOJA';

// Leer rango
const res = await sheets.spreadsheets.values.get({
  spreadsheetId,
  range: 'Hoja1!A1:D10',
});

// Escribir celdas
await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: 'Hoja1!A1',
  valueInputOption: 'USER_ENTERED',
  requestBody: { values: [['Nombre', 'Edad'], ['Juan', 30]] },
});
```

Documentación: https://developers.google.com/sheets/api/guides/concepts

---

## Google Calendar

**Qué permite:** listar calendarios del usuario, crear/editar/eliminar eventos, listar eventos, aceptar/declinar invitaciones (vía API).

| Paquete | Uso |
|---------|-----|
| `googleapis` | `const calendar = google.calendar({ version: 'v3', auth: oauth2Client });` |
| `@googleapis/calendar` | Import del cliente Calendar v3 + auth |

**Ejemplo (con googleapis):**

```js
const { google } = require('googleapis');
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// Listar calendarios del usuario
const calendars = await calendar.calendarList.list();

// Listar eventos de un calendario
const events = await calendar.events.list({
  calendarId: 'primary', // o id del calendario
  timeMin: new Date().toISOString(),
  maxResults: 10,
  singleEvents: true,
  orderBy: 'startTime',
});

// Crear evento
await calendar.events.insert({
  calendarId: 'primary',
  requestBody: {
    summary: 'Reunión',
    description: 'Descripción',
    start: { dateTime: '2025-02-10T10:00:00-03:00', timeZone: 'America/Argentina/Buenos_Aires' },
    end:   { dateTime: '2025-02-10T11:00:00-03:00', timeZone: 'America/Argentina/Buenos_Aires' },
  },
});
```

Documentación: https://developers.google.com/calendar/api/guides/overview

---

## Resumen rápido

| Servicio   | API / Producto     | Librería (oficial)     | Autenticación típica |
|-----------|--------------------|------------------------|------------------------|
| Drive     | Google Drive API   | `googleapis` o `@googleapis/drive`   | OAuth 2.0 (usuario) o Service Account |
| Planillas | Google Sheets API  | `googleapis` o `@googleapis/sheets` | OAuth 2.0 (usuario) o Service Account |
| Calendario| Google Calendar API| `googleapis` o `@googleapis/calendar` | OAuth 2.0 (usuario) o Service Account |

- **Conectar “al Drive/Sheets/Calendario de un usuario”** → OAuth 2.0 con ese usuario.  
- **Conectar a recursos que controla tu app** (ej. una hoja/calendario/carpeta propios) → Service Account puede ser suficiente; si el recurso es de un usuario, debe compartirlo con el email de la cuenta de servicio.

Todos los paquetes son **oficiales de Google**, con TypeScript incluido y soporte para OAuth 2.0, JWT y API Key donde aplique.
