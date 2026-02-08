# Resumen del SDK de Mercado Pago (Node.js)

SDK oficial **mercadopago** v2.x para Node.js. Todas las clases reciben una instancia de `MercadoPagoConfig` con tu `accessToken`.

---

## Configuración

```ts
import MercadoPagoConfig from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: 'TU_ACCESS_TOKEN',
  options: {
    timeout: 5000,
    idempotencyKey: 'opcional',
    platformId: 'opcional',
    integratorId: 'opcional',
  },
});
```

---

## Módulos y capacidades

### 1. **Payment** – Pagos

| Método | Descripción |
|--------|-------------|
| `create({ body, requestOptions })` | Crear un pago |
| `get({ id, requestOptions })` | Obtener un pago por ID |
| `search(paymentSearchOptions?)` | Buscar pagos (filtros, paginación) |
| `capture({ id, transaction_amount, requestOptions })` | Capturar un pago autorizado |
| `cancel({ id, requestOptions })` | Cancelar un pago |

---

### 2. **Preference** – Preferencias de Checkout Pro

Para generar el checkout de Mercado Pago (link o botón).

| Método | Descripción |
|--------|-------------|
| `create({ body, requestOptions })` | Crear preferencia (ítems, monto, URLs de éxito/fallo, etc.) |
| `get({ preferenceId, requestOptions })` | Obtener preferencia por ID |
| `update({ id, updatePreferenceRequest, requestOptions })` | Actualizar preferencia |
| `search(preferenceSearchData?)` | Buscar preferencias |

---

### 3. **Customer** – Compradores (clientes)

Gestión de compradores y sus tarjetas guardadas.

| Método | Descripción |
|--------|-------------|
| `create({ body, requestOptions })` | Crear cliente |
| `get({ customerId, requestOptions })` | Obtener cliente |
| `update({ customerId, body, requestOptions })` | Actualizar cliente |
| `remove({ customerId, requestOptions })` | Eliminar cliente |
| `search(CustomerSearchOptions?)` | Buscar clientes |
| `createCard({ customerId, body, requestOptions })` | Agregar tarjeta al cliente |
| `getCard({ customerId, cardId, requestOptions })` | Obtener tarjeta |
| `removeCard({ customerId, cardId, requestOptions })` | Eliminar tarjeta |
| `listCards({ customerId, requestOptions })` | Listar tarjetas del cliente |

---

### 4. **CardToken** – Tokenización de tarjetas

Para pagos con tarjeta sin guardar datos de la tarjeta en tu servidor.

| Método | Descripción |
|--------|-------------|
| `create({ body, requestOptions })` | Crear token a partir de datos de tarjeta (para usar en `Payment.create`) |

---

### 5. **CustomerCard** – Tarjetas de clientes

CRUD de tarjetas asociadas a un cliente (alternativa a los métodos de tarjetas en `Customer`).

| Método | Descripción |
|--------|-------------|
| `create({ customerId, body, requestOptions })` | Crear tarjeta |
| `get({ customerId, cardId, requestOptions })` | Obtener tarjeta |
| `update({ customerId, cardId, body, requestOptions })` | Actualizar tarjeta |
| `remove({ customerId, cardId, requestOptions })` | Eliminar tarjeta |
| `list({ customerId, requestOptions })` | Listar tarjetas |

---

### 6. **PaymentRefund** – Devoluciones de pagos

| Método | Descripción |
|--------|-------------|
| `create({ payment_id, body, requestOptions })` | Crear devolución (parcial o total) |
| `get({ payment_id, refund_id, requestOptions })` | Obtener devolución |
| `total({ payment_id, requestOptions })` | Devolución total del pago |
| `list({ payment_id, requestOptions })` | Listar devoluciones de un pago |

---

### 7. **PaymentMethod** – Métodos de pago

| Método | Descripción |
|--------|-------------|
| `get(requestOptions?)` | Listar métodos de pago disponibles |

---

### 8. **IdentificationType** – Tipos de documento

| Método | Descripción |
|--------|-------------|
| `list(identificationTypeListOptions?)` | Listar tipos de identificación (DNI, CI, etc.) |

---

### 9. **MerchantOrder** – Órdenes del vendedor

Órdenes de compra del comercio (no confundir con Order / Point).

| Método | Descripción |
|--------|-------------|
| `create({ body, requestOptions })` | Crear orden |
| `get({ merchantOrderId, requestOptions })` | Obtener orden |
| `update({ merchantOrderId, body, requestOptions })` | Actualizar orden |
| `search(merchantOrderSearchOptions?)` | Buscar órdenes |

---

### 10. **Order** – Órdenes (API de Orders)

Crear órdenes, transacciones, capturar, cancelar y reembolsar.

| Método | Descripción |
|--------|-------------|
| `create({ body, requestOptions })` | Crear orden |
| `get({ id, requestOptions })` | Obtener orden |
| `process({ id, requestOptions })` | Procesar orden |
| `capture({ id, requestOptions })` | Capturar orden |
| `cancel({ id, requestOptions })` | Cancelar orden |
| `refund({ id, body, requestOptions })` | Reembolso (total o parcial) |
| `createTransaction({ id, body, requestOptions })` | Crear transacción en la orden |
| `updateTransaction({ id, transactionId, body, requestOptions })` | Actualizar transacción |
| `deleteTransaction({ id, transactionId, requestOptions })` | Eliminar transacción |

---

### 11. **Point** – Pagos en punto de venta (POS)

Para integraciones con dispositivos físicos (lectores, tablets, etc.).

| Método | Descripción |
|--------|-------------|
| `createPaymentIntent({ device_id, request, requestOptions })` | Crear intención de pago en dispositivo |
| `searchPaymentIntent({ payment_intent_id, requestOptions })` | Buscar intención de pago |
| `cancelPaymentIntent({ device_id, payment_intent_id, requestOptions })` | Cancelar intención de pago |
| `getPaymentIntentList(options?)` | Listar intenciones de pago |
| `getPaymentIntentStatus({ payment_intent_id, requestOptions })` | Estado de una intención de pago |
| `getDevices({ request, requestOptions })` | Listar dispositivos |
| `changeDeviceOperatingMode({ device_id, request, requestOptions })` | Cambiar modo de operación del dispositivo |

---

### 12. **PreApproval** – Suscripciones / pagos recurrentes

| Método | Descripción |
|--------|-------------|
| `create({ body, requestOptions })` | Crear preaprobación |
| `get({ id, requestOptions })` | Obtener preaprobación |
| `search(preApprovalSearchData?)` | Buscar preaprobaciones |
| `update({ id, body, requestOptions })` | Actualizar preaprobación |

---

### 13. **PreApprovalPlan** – Planes de suscripción

| Método | Descripción |
|--------|-------------|
| `create({ body, requestOptions })` | Crear plan |
| `get({ preApprovalPlanId, requestOptions })` | Obtener plan |
| `update({ id, updatePreApprovalPlanRequest, requestOptions })` | Actualizar plan |
| `search(preApprovalPlanSearchData?)` | Buscar planes |

---

### 14. **Invoice** – Facturación

| Método | Descripción |
|--------|-------------|
| `get({ id, requestOptions })` | Obtener factura |
| `search(invoiceSearchOptions?)` | Buscar facturas |

---

### 15. **User** – Usuario (cuenta MP)

| Método | Descripción |
|--------|-------------|
| `get(userGetData?)` | Obtener datos del usuario asociado al `accessToken` |

---

### 16. **OAuth** – Autenticación de vendedores

Para flujos donde el vendedor conecta su cuenta Mercado Pago.

| Método | Descripción |
|--------|-------------|
| `create({ body, requestOptions })` | Intercambiar código por access/refresh token |
| `refresh({ body, requestOptions })` | Renovar access token con refresh token |
| `getAuthorizationURL({ options })` | Generar URL para que el usuario autorice (redirect a MP) |

---

## Uso típico en el proyecto

```ts
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';

const config = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Checkout Pro (link/botón)
const preference = new Preference(config);
const { id } = await preference.create({ body: { items: [...], back_urls: {...} } });

// Pagos por API
const payment = new Payment(config);
const result = await payment.create({ body: { transaction_amount: 100, token: '...', ... } });
const one = await payment.get({ id: result.id });
await payment.capture({ id: result.id, transaction_amount: 100 });
await payment.cancel({ id: result.id });
```

---

## Referencias

- [Repositorio SDK Node](https://github.com/mercadopago/sdk-nodejs)
- [Documentación API Mercado Pago](https://www.mercadopago.com/developers/en/reference)
