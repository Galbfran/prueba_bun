# Qué se puede hacer con @afipsdk/afip.js

Resumen basado en el código del paquete **@afipsdk/afip.js** (node_modules/@afipsdk/afip.js). Este SDK se conecta a los Web Services de AFIP; la autenticación puede hacerse mediante **access_token** (plataforma AfipSDK) o con **certificado y clave privada**.

---

## Configuración inicial

```js
const Afip = require('@afipsdk/afip.js');

const afip = new Afip({
  CUIT: 20123456789,           // CUIT del emisor
  production: false,           // false = homologación, true = producción
  // Opción 1: token de la plataforma AfipSDK
  access_token: 'TU_ACCESS_TOKEN',
  // Opción 2: certificado y clave (PEM)
  // cert: 'contenido o ruta del .crt',
  // key: 'contenido o ruta del .key',
});
```

El SDK usa la API de **AfipSDK** (`https://app.afipsdk.com/api/`) para obtener el Token de Autorización (TA) de AFIP; no implementa WSAA localmente.

---

## 1. Facturación electrónica (ElectronicBilling)

Clase: **`afip.ElectronicBilling`**. Corresponde al Web Service de **Factura Electrónica (WSFE)** de AFIP.

### Crear comprobantes

| Método | Descripción |
|--------|-------------|
| **createVoucher(data, returnResponse?)** | Crea uno o más comprobantes en AFIP. Devuelve CAE y fecha de vencimiento (o la respuesta completa si `returnResponse === true`). |
| **createNextVoucher(data)** | Obtiene el último número usado, incrementa y crea el siguiente comprobante (no hace falta enviar `CbteDesde`/`CbteHasta`). |

### Consultas

| Método | Descripción |
|--------|-------------|
| **getLastVoucher(salesPoint, type)** | Último número de comprobante autorizado para un punto de venta y tipo. |
| **getVoucherInfo(number, salesPoint, type)** | Información completa de un comprobante. |

### CAEA (Código de Autorización Electrónico Anticipado)

| Método | Descripción |
|--------|-------------|
| **createCAEA(period, fortnight)** | Solicita un CAEA para el período y quincena (1 o 2). |
| **getCAEA(period, fortnight)** | Consulta un CAEA. |

### Parámetros y catálogos

| Método | Descripción |
|--------|-------------|
| **getSalesPoints()** | Puntos de venta habilitados. |
| **getVoucherTypes()** | Tipos de comprobante (factura A/B/C, etc.). |
| **getConceptTypes()** | Conceptos (productos, servicios, ambos). |
| **getDocumentTypes()** | Tipos de documento (CUIT, DNI, etc.). |
| **getAliquotTypes()** | Alícuotas de IVA. |
| **getCurrenciesTypes()** | Monedas. |
| **getOptionsTypes()** | Datos opcionales del comprobante. |
| **getTaxTypes()** | Tributos. |

### Otros

| Método | Descripción |
|--------|-------------|
| **createPDF(data)** | Envía datos al servidor AfipSDK para generar un PDF del comprobante. |
| **getServerStatus()** | Estado del servicio en AFIP (app, base de datos, autenticación). |
| **formatDate(date)** | Convierte fecha del formato AFIP (yyyymmdd) a `yyyy-mm-dd`. |
| **executeRequest(operation, params)** | Ejecuta cualquier operación SOAP del WSFE pasando nombre y parámetros. |

### Ejemplo: crear una factura

```js
const data = {
  CantReg: 1,
  PtoVta: 1,
  CbteTipo: 6,        // ej. Factura B
  Concepto: 1,        // Productos
  DocTipo: 80,       // CUIT
  DocNro: 20111111112,
  CbteDesde: 1,
  CbteHasta: 1,
  CbteFch: 20260208,  // yyyymmdd
  ImpTotal: 184.05,
  ImpTotConc: 0,
  ImpNeto: 150,
  ImpOpEx: 0,
  ImpIVA: 26.25,
  ImpTrib: 7.8,
  MonId: 'PES',
  MonCotiz: 1,
  Iva: [{ Id: 5, BaseImp: 100, Importe: 21 }],
  // Tributos, CbtesAsoc, Opcionales, Compradores son opcionales
};

const result = await afip.ElectronicBilling.createVoucher(data);
// result: { CAE, CAEFchVto, ... }
```

---

## 2. Padrón / Registros de contribuyentes

El SDK incluye varias clases que exponen Web Services de **padrón** (consulta de datos fiscales). Todas comparten:

- **getServerStatus()** – Estado del servicio.
- **getTaxpayerDetails(identifier)** – Datos del contribuyente por identificador (CUIT, etc.).
- **executeRequest(operation, params)** – Llamada genérica SOAP.

Diferencias principales:

| Clase | Uso típico |
|-------|------------|
| **RegisterScopeFour** (`afip.RegisterScopeFour`) | Padrón A4 – consulta por CUIT. Solo `getTaxpayerDetails(identifier)` y `getServerStatus()`. |
| **RegisterScopeFive** (`afip.RegisterScopeFive`) | Padrón A5 – consulta. Incluye **getTaxpayersDetails(identifiers)** (varios CUIT a la vez). |
| **RegisterInscriptionProof** (`afip.RegisterInscriptionProof`) | Constancia de inscripción. `getTaxpayerDetails`, `getTaxpayersDetails`, `getServerStatus`. |
| **RegisterScopeTen** (`afip.RegisterScopeTen`) | Padrón A10 – consulta por CUIT. `getTaxpayerDetails`, `getServerStatus`. |
| **RegisterScopeThirteen** (`afip.RegisterScopeThirteen`) | Padrón A13. Incluye **getTaxIDByDocument(documentNumber)** – obtener CUIT a partir del número de documento. |

Ejemplo:

```js
const datos = await afip.RegisterScopeFive.getTaxpayerDetails(20123456789);
const porDoc = await afip.RegisterScopeThirteen.getTaxIDByDocument(12345678);
```

---

## 3. Web Service genérico

**`afip.WebService(service, options?)`** crea un cliente genérico para cualquier Web Service de AFIP por nombre (ej. `'wsfe'`, `'wsfev1'`). Útil si necesitás una operación que las clases anteriores no encapsulan.

```js
const ws = afip.WebService('wsfe');
const result = await ws.executeRequest('FECAESolicitar', { ... });
```

---

## 4. Autenticación y certificados (vía AfipSDK)

Estos métodos llaman a la API de **app.afipsdk.com** (no a AFIP directo):

| Método | Descripción |
|--------|-------------|
| **CreateAutomation(automation, params, wait?)** | Ejecuta una automatización de la plataforma AfipSDK (ej. crear certificado, autorizar WS). `wait` (default true) espera a que termine. |
| **GetAutomationDetails(id, wait?)** | Consulta el estado y resultado de una automatización. |
| **getLastRequestXML()** | Devuelve el último request y response XML (útil para depuración). |

**Deprecados** (reemplazados por automatizaciones):

- **CreateCert(username, password, alias)** – Crear certificado (deprecado).
- **CreateWSAuth(username, password, alias, wsid)** – Crear autorización para un WS (deprecado).

---

## Resumen por clase

| Clase | Uso principal |
|-------|----------------|
| **ElectronicBilling** | Facturación electrónica: crear comprobantes, CAE/CAEA, consultas, catálogos, PDF. |
| **RegisterScopeFour** | Padrón – datos de un contribuyente por CUIT. |
| **RegisterScopeFive** | Padrón – uno o varios contribuyentes. |
| **RegisterInscriptionProof** | Constancia de inscripción – uno o varios. |
| **RegisterScopeTen** | Padrón – datos por CUIT. |
| **RegisterScopeThirteen** | Padrón – datos por CUIT y CUIT por número de documento. |
| **WebService(service)** | Cualquier WS de AFIP por nombre (llamadas SOAP genéricas). |

---

## Documentación y soporte

- **Documentación:** https://docs.afipsdk.com  
- **Repositorio:** https://github.com/AfipSDK/afip.js  
- **Comunidad:** https://discord.gg/A6TuHEyAZm  
- **Contacto:** ayuda@afipsdk.com  

*Este SDK no es oficial de AFIP; es un producto de AfipSDK que se conecta a los Web Services oficiales de AFIP.*
