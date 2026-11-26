# Discovery — turnos-odontologia

**Fecha**: 2026-11-24
**Fuentes investigadas**: ninguna todavía (entrevista con el equipo). La investigación de mercado de competidores se documenta aparte en `docs/discovery/informe-discovery.md`.

## 1. Problema que resuelve

Los consultorios odontológicos argentinos pierden tiempo coordinando turnos por WhatsApp y teléfono, les cuesta organizar la agenda de varios profesionales y sillones/boxes sin solapamientos, y sufren ausencias de pacientes que no avisan.

## 2. Usuarios / roles

- **Paciente**: reserva, cancela y recibe avisos de su turno sin crear cuenta.
- **Recepcionista**: gestiona la agenda del consultorio (da, mueve y cancela turnos).
- **Odontólogo**: ve su agenda y la ficha básica de sus pacientes.
- **Administrador / dueño**: configura profesionales, sillones/boxes, horarios, prestaciones y reglas del consultorio.

## 3. Casos de uso

1. Como administrador, quiero cargar profesionales, sillones, horarios y prestaciones con su duración, para que la agenda refleje cómo trabaja el consultorio.
2. Como recepcionista, quiero dar, mover y cancelar turnos con el sistema impidiendo solapamientos de profesional y sillón, para dejar de coordinar a mano.
3. Como paciente, quiero reservar online eligiendo prestación y profesional (o "cualquier disponible"), para no tener que llamar ni escribir.
4. Como paciente, quiero recibir confirmación y recordatorio por email con un link para cancelar, para liberar el turno si no puedo ir.
5. Como odontólogo, quiero ver mi agenda del día con la ficha básica de cada paciente, para prepararme antes de atender.

## 4. Competidores / soluciones existentes

Hoy los consultorios resuelven esto con agenda de papel, teléfono, WhatsApp y Google Calendar: la competencia principal es la costumbre.

Existen SaaS odontológicos en el mercado argentino que el equipo considera competencia, pero **todavía no fueron relevados**. El análisis se hará en `docs/discovery/informe-discovery.md`.

> **Actualización (25/11/2026):** el relevamiento ya está hecho. El informe `docs/discovery/informe-discovery.md` compara 19 sistemas; los cinco prioritarios para demo son Dentia, DentalSoft, Dentalink, Bilog y Oclusar.

## 5. Funcionalidades necesarias (MVP, en orden de prioridad)

1. Agenda por profesional y por sillón/box, sin solapamientos.
2. Prestaciones configurables con duración, con opción de no ocupar sillón.
3. Ficha básica del paciente: nombre, DNI, email, teléfono, obra social/prepaga y notas.
4. Autoturnos online sin crear cuenta.
5. Emails de confirmación, cancelación y recordatorio simple 24 horas antes (sin pedir confirmación).
6. Multi-consultorio con datos aislados por consultorio y suscripción mensual (SaaS).

## 6. Funcionalidades opcionales (etapas posteriores)

- **Primera prioridad posterior al MVP: recordatorios y confirmación por WhatsApp (API oficial).** Decisión del 2026-11-24, tomada a partir del informe de mercado: es el canal estándar en Argentina. El MVP debe diseñar las notificaciones con canales intercambiables para que WhatsApp se agregue sin rediseño.
- Recordatorios con confirmación o cancelación por parte del paciente.
- Lista de espera para cubrir huecos por cancelaciones.
- Historia clínica y odontograma, como módulo opcional.
- Integraciones: WhatsApp Business API, Mercado Pago, Google Calendar, obras sociales y prepagas.

## 7. Reglas de negocio

- Una práctica odontológica ocupa profesional **y** sillón/box, sin solapamientos en ninguno de los dos. Una consulta breve puede configurarse sin sillón.
- El paciente puede elegir profesional o "cualquier disponible".
- Se puede cancelar sin penalidad hasta 24 horas antes. Una cancelación con menos de 24 horas se registra como **cancelación tardía**, separada, y no bloquea automáticamente.
- Cada ausencia sin aviso se registra. Tras 3 ausencias el paciente queda bloqueado para reservar online; el límite es configurable por consultorio.
- El paciente se identifica por DNI dentro de cada consultorio. Cada consultorio tiene sus propios pacientes: una persona atendida en dos consultorios figura por separado en cada uno.
- Modelo de negocio: suscripción mensual por consultorio; gratis para el paciente.

## 8. Integraciones

- **MVP**: solo email (confirmación, cancelación y recordatorio), detrás de una capa de notificaciones con canales intercambiables.
- **Etapa siguiente al MVP**: WhatsApp Business API (primera prioridad).
- **Posteriores**: Mercado Pago, Google Calendar, obras sociales y prepagas.

## 9. Restricciones

- Proyecto de varias semanas, sin consultorio piloto esperando todavía.
- Stack a definir en la KB, priorizando simplicidad y facilidad de testeo automático.
- Presupuesto acotado: infraestructura gratuita o de bajo costo para el MVP.
- Web responsive; sin app móvil nativa en la v1.
- Cumplimiento de la Ley 25.326 de Protección de Datos Personales.

## 10. Riesgos

- **Adopción**: resistencia al cambio de consultorios que hoy usan WhatsApp y papel. *Supuesto sin validar*: que los pacientes prefieran reservar online.
- **Competencia**: SaaS odontológicos locales todavía no relevados.
- **Precio**: falta definir un precio competitivo para el mercado argentino.
- **Privacidad**: la ficha (obra social, notas) puede contener datos de salud, que son datos sensibles según la Ley 25.326. Requiere consentimiento, seguridad y aislamiento estricto entre consultorios.
- **Identidad por DNI**: el DNI no se verifica; alguien puede reservar con un DNI ajeno o esquivar el bloqueo por ausencias usando otro.
- **Ausencias**: sin piloto no se puede medir si el recordatorio por email alcanza para reducirlas.

## 11. Preguntas abiertas

- ~~¿Qué SaaS odontológicos compiten, qué ofrecen y cuánto cobran?~~ Resuelta el 25/11/2026 en `informe-discovery.md`.
- ¿Qué precio y qué planes tendrá la suscripción? ¿Habrá prueba gratuita?
- ¿Hace falta inscribir la base de datos ante la AAIP y definir un texto de consentimiento para el paciente?
- ¿Se limitan las notas de la ficha para no almacenar datos clínicos antes del módulo de historia clínica?
- ¿Cómo conseguir un primer consultorio piloto para validar la adopción?
- ¿El link de cancelación del email funciona sin identificarse, mediante un token de un solo uso?
