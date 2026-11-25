# Notificaciones — Diseño con canales intercambiables

El MVP solo envía emails, pero WhatsApp es la **primera prioridad posterior al MVP** (decisión del 24/11/2026). Este documento fija el diseño para que agregar un canal sea **implementar una clase y registrar una plantilla**, sin tocar la lógica de turnos.

## Componentes

```
features/notificaciones/
├── domain/
│   ├── tipos.ts              # TipoNotificacion, Canal, EstadoNotificacion
│   ├── mensaje.ts            # Mensaje (canal-agnóstico): destinatario, tipo, datos
│   └── politica.ts           # qué notificaciones generar ante cada evento de turno (RN-NO-01..03)
├── application/
│   ├── encolar.ts            # crea filas en `notificacion` dentro de la tx del turno
│   ├── procesarPendientes.ts # lote + SKIP LOCKED + reintentos (RN-NO-04..06)
│   └── puertos.ts            # interface NotificationChannel
├── channels/
│   ├── email.resend.ts       # EmailChannel (MVP)
│   ├── fake.ts               # canal en memoria para tests
│   └── whatsapp.meta.ts      # WhatsAppChannel (post-MVP)
└── templates/
    ├── email/  confirmacion.tsx recordatorio.tsx cancelacion.tsx cancelacion_tarde.tsx
    └── whatsapp/ (post-MVP: nombre de la plantilla aprobada por Meta y sus variables)
```

## Puerto

```ts
export interface NotificationChannel {
  readonly canal: 'email' | 'whatsapp';
  /** Devuelve el id del proveedor. Lanza un error con `reintentable` si falló. */
  send(mensaje: MensajeRenderizado): Promise<{ idProveedor: string }>;
}

export interface MensajeRenderizado {
  destinatario: string;        // email o teléfono E.164 según el canal
  tipo: TipoNotificacion;
  contenido: unknown;          // email: { asunto, html, texto }; whatsapp: { plantilla, variables }
}
```

- La **política** decide qué notificaciones generar a partir de los eventos del turno (creado, movido, cancelado) y de los datos de contacto disponibles. En el MVP solo genera `canal = email`.
- El **render** transforma `(tipo, canal, datos)` en `MensajeRenderizado`. Los datos nunca incluyen información clínica ni la obra social (RN-NO-07).
- El **procesador** no sabe de proveedores: obtiene el canal de un registro `Map<Canal, NotificationChannel>`.

## Ciclo de vida de una notificación

```
pendiente ──(job toma)──► enviando ──ok──► enviada
    ▲                        │
    └──(reintento, backoff)──┤ error reintentable, intentos < 5
                             └──► fallida  (intentos = 5 o error no reintentable)
pendiente ──(turno cancelado / recordatorio vencido)──► descartada
```

## Email (MVP)

- Proveedor: Resend. Remitente `EMAIL_FROM`; nombre visible del consultorio en el `from` (por ejemplo, `Consultorio Sonrisas vía Turnos <turnos@dominio>`). `reply-to` al email del consultorio.
- Plantillas en React Email con versión en texto plano.
- Límite del plan gratuito: 100 emails por día y 3.000 por mes. El procesador respeta un tope diario configurable y deja el resto `pendiente`.

## WhatsApp (post-MVP): lo que ya queda previsto

| Necesidad | Previsión en el MVP |
|---|---|
| Teléfono normalizado | `paciente.telefono` se valida y guarda en formato E.164 (+54…) |
| Consentimiento del canal | Agregar `paciente.acepta_whatsapp` y su fecha en la migración de esa etapa |
| Plantillas aprobadas | `templates/whatsapp/` con nombre de plantilla y variables |
| Respuestas del paciente (confirmar o cancelar) | Endpoint de webhook que reutiliza los casos de uso de cancelación (flujo 2), sin lógica duplicada |
| Canal preferido | La política elige el canal: WhatsApp si hay consentimiento y teléfono; si no, email |
| Costos por mensaje | Ver PA-13; el registro `notificacion` permite medir el volumen por consultorio |

## Tests

- **Unitarios**: la política (qué se genera en cada evento) y el render (que no haya datos clínicos).
- **Integración**: encolado en la misma transacción que el turno; `SKIP LOCKED` con dos procesadores concurrentes; reintentos y descarte.
- **E2E**: con `FakeChannel`, la reserva genera una confirmación con un link válido.
