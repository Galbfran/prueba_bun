# APIs y librerías para AFIP (Argentina)

Resumen de opciones para integrar facturación electrónica y otros servicios de AFIP desde Node.js / TypeScript.

---

## Opción recomendada: **@afipsdk/afip.js**

- **npm:** `@afipsdk/afip.js`
- **Documentación:** https://docs.afipsdk.com  
- **Sitio:** https://afipsdk.com  
- **Licencia:** MIT  
- **Uso:** Muy usado, mantenido, con ejemplos y docs en español.

### Instalación

```bash
bun add @afipsdk/afip.js
# o
npm install @afipsdk/afip.js
```

### Web Services que cubre

| Servicio | Descripción |
|----------|-------------|
| **WSFE** | Factura Electrónica (comprobantes A, B, C, M; CAE/CAEA) |
| **WSFECRED** | Factura MiPyME |
| **Padrón** | Consulta de datos fiscales (CUIT, etc.) |
| Otros | Parámetros, tipos de comprobante, etc. |

### Uso básico (ejemplo)

```ts
import Afip from '@afipsdk/afip.js';

const afip = new Afip({
  CUIT: 20123456789,
  // En producción: certificado y clave privada
  // cert: 'ruta/certificado.crt',
  // key: 'ruta/clave.key',
  production: false, // true para homologación/producción
});

// Ejemplo: crear factura (WSFE)
const wsfe = afip.WebService('wsfe');
const result = await wsfe.executeRequest('FECAESolicitar', {
  Auth: { Token: '...', Sign: '...', Cuit: 20123456789 },
  FeCAEReq: { /* datos del comprobante */ },
});
```

En docs.afipsdk.com tenés guías paso a paso (certificados, entorno de prueba, FECAESolicitar, etc.).

---

## Otras librerías en npm

| Paquete | Descripción | Notas |
|---------|-------------|--------|
| **@cafecafe/afip.ts** | SDK TypeScript para AFIP | WSAA, SOAP, factura electrónica, padrón. |
| **afip-apis** | Integración con webservices AFIP | WSFE, WSAA, WSCDCV1. |
| **facturajs** | Comunicación con WS AFIP (Node.js) | SOAP, wsfev1, wsfe. |
| **@arcasdk/core** | SDK TypeScript ARCA/AFIP | Integración con entorno ARCA (homologación). |
| **tmn-afip** | Fork actualizado (ej. RG 5616/2024) | Factura electrónica, condiciones IVA. |

---

## API oficial de AFIP (Web Services SOAP)

AFIP no ofrece una “API REST” única; se accede por **Web Services SOAP**. Documentación oficial:

- **Factura electrónica (WS):**  
  https://www.afip.gob.ar/ws/documentacion/ws-factura-electronica.asp  
- **Ayuda general FE:**  
  https://www.afip.gob.ar/fe/ayuda/webservice.asp  
- **Entorno de prueba:**  
  https://www.afip.gob.ar/fe/ayuda/entorno-prueba.asp  

Servicios típicos:

- **wsfev1** – Factura electrónica (RG 4.291), comprobantes A, B, C, M (sin ítems), CAE/CAEA.
- **wsmtxca** – Comprobantes A y B con detalle de ítems (RG 2.904).
- **wsfexv1** – Exportación (comprobantes E).
- **wsct** – Comprobantes T (alojamiento turistas).
- **wsbfev1** – Bonos fiscales electrónicos.

Las librerías de la tabla anterior encapsulan estas APIs SOAP para que no tengas que armar los requests SOAP a mano.

---

## Requisitos típicos para facturar

1. **CUIT** del emisor (empresa o monotributista).
2. **Certificado digital** y **clave privada** (generados en AFIP, válidos por tiempo limitado).
3. **WSAA (Web Service de Autenticación y Autorización):** obtener Token y Sign para cada servicio (las librerías suelen hacerlo por vos).
4. **Punto de venta** y **tipo de comprobante** dados de alta en AFIP.
5. **Entorno de homologación** para pruebas (ARCA); en producción se usan URLs/productivos.

---

## Resumen práctico

- Para **Node.js/Bun** y **facturación electrónica** en Argentina, la opción más documentada y usada es **@afipsdk/afip.js**.
- Si preferís **TypeScript** y una API más tipada, podés evaluar **@cafecafe/afip.ts** o **@arcasdk/core**.
- La “API” de AFIP son los **Web Services SOAP**; las librerías son wrappers para no implementar SOAP/WSAA a mano.

Si querés, en el siguiente paso podemos agregar **@afipsdk/afip.js** a tu proyecto y un ejemplo mínimo de creación de factura (por ejemplo un endpoint en NestJS que llame a WSFE).
