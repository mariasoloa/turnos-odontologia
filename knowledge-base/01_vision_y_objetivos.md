# Visión y Objetivos

## Propósito del sistema

**turnos-odontologia es un SaaS multi-tenant que permite a los consultorios odontológicos argentinos gestionar su agenda de profesionales y sillones sin solapamientos, recibir turnos online sin que el paciente cree una cuenta y reducir las ausencias mediante avisos automáticos y reglas configurables.**

Hoy los consultorios coordinan turnos por WhatsApp, teléfono, papel o Google Calendar. Esto genera tiempo administrativo perdido, superposición de profesionales o sillones y ausencias sin aviso que dejan huecos en la agenda (ver `docs/discovery/discovery.md`). El informe de mercado (`docs/discovery/informe-discovery.md`) muestra que el segmento "suite clínica integral" está saturado. El producto se posiciona, en cambio, como **agenda odontológica sin solapamientos y con control de ausentismo**, con cumplimiento normativo visible.

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|---|---|---|
| Administrador del consultorio | Que la agenda refleje exactamente cómo trabaja el consultorio | Configurar profesionales, sillones, horarios, prestaciones y reglas de ausentismo; gestionar usuarios del equipo |
| Recepcionista | Dar, mover y cancelar turnos sin coordinar a mano | Ver la agenda de todos los profesionales, registrar ausencias, desbloquear pacientes |
| Odontólogo | Saber qué pacientes atiende y cuándo | Ver su agenda del día y la ficha básica de sus pacientes |
| Paciente | Reservar un turno sin llamar ni escribir | Recibir confirmación y recordatorio; cancelar con un link |

## Alcance v1.0 (MVP)

- Configuración del consultorio: profesionales, sillones/boxes, horarios de atención, bloqueos y prestaciones con duración (con o sin sillón).
- Agenda diaria y semanal por profesional y por sillón, con **prevención de solapamientos garantizada en la base de datos** para ambos recursos.
- Alta, modificación y cancelación de turnos por el personal.
- Ficha básica del paciente: nombre, DNI, email, teléfono, obra social o prepaga (solo como dato) y notas administrativas no clínicas.
- Reserva online pública por consultorio (`/c/{slug}`), sin cuenta, con identificación por DNI dentro de cada consultorio y elección de profesional o "cualquier disponible".
- Emails de confirmación, cancelación y recordatorio 24 horas antes, enviados detrás de una **capa de notificaciones con canales intercambiables**.
- Cancelación por el paciente con un link de token de un solo uso.
- Registro de ausencias y cancelaciones tardías; bloqueo de reserva online tras N ausencias (configurable, por defecto 3).
- Multi-consultorio con aislamiento de datos (Row Level Security) y auditoría de accesos.
- Acceso del personal con email y contraseña; 2FA obligatorio para el administrador.
- Anonimización de datos del paciente ante un pedido de supresión (Ley 25.326).
- Alta y suspensión de consultorios mediante un **script interno** del equipo (sin pantallas de plataforma).

## Fuera de alcance (v1.0)

- Cobro de la suscripción y planes (el piloto es gratuito).
- Recordatorios y confirmación por WhatsApp (**primera prioridad posterior al MVP**).
- Lista de espera.
- Señas y cobros con Mercado Pago; caja; facturación electrónica ARCA.
- Historia clínica, odontograma y cualquier dato clínico.
- Gestión de obras sociales y prepagas (coberturas, copagos, liquidaciones).
- Sincronización con Google Calendar.
- Asistentes con IA.
- App móvil nativa (la web es responsive).
- Autoregistro de consultorios y panel de administración de la plataforma.
- Múltiples zonas horarias (se asume `America/Argentina/Buenos_Aires`).

## Métricas de éxito

| Métrica | Definición | Objetivo del piloto |
|---|---|---|
| Solapamientos | Turnos superpuestos de un mismo profesional o sillón | 0 (garantizado por la base de datos) |
| Tasa de ausentismo | Ausencias sin aviso / turnos pasados no cancelados | Medir la línea base del primer mes y bajarla en los meses siguientes |
| Adopción de reserva online | Turnos creados por el paciente / turnos totales | ≥ 30 % a los 3 meses _(supuesto a validar)_ |
| Consultorios activos | Consultorios con al menos un turno en los últimos 30 días | Al menos 1 piloto real |
| Tiempo de configuración | Desde el alta hasta el primer turno online | < 1 día |
