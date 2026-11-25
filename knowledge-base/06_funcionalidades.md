# Funcionalidades

Organizadas por **épica** y luego por **historia de usuario** (formato US-NNN). Todas forman parte del MVP salvo que se indique otra cosa.

## Épica 1: Operación de plataforma (script interno)

### US-001 — Crear un consultorio
**Como** integrante del equipo de plataforma
**Quiero** ejecutar `pnpm tenant:create --nombre "..." --slug ... --admin-email ...`
**Para** dar de alta un consultorio del piloto sin pantallas de administración

**Criterios de aceptación**:
- [ ] Crea el `consultorio` con valores por defecto y valida que el `slug` sea único y válido.
- [ ] Crea una invitación con rol `admin` y envía el email de invitación.
- [ ] Registra la acción en la auditoría con `actor_tipo = 'plataforma'`.
- [ ] Falla con un mensaje claro si el slug existe o el email es inválido, sin dejar datos a medias (transacción).

**Reglas relacionadas**: RN-GL-04

### US-002 — Suspender y reactivar un consultorio
**Como** integrante del equipo de plataforma
**Quiero** ejecutar `pnpm tenant:suspend --slug ...` y `pnpm tenant:reactivate --slug ...`
**Para** cortar el acceso de un consultorio sin borrar sus datos

**Criterios de aceptación**:
- [ ] Un consultorio suspendido no acepta reservas online y su personal no accede al panel.
- [ ] Reactivar restituye el acceso sin pérdida de datos.
- [ ] Ambas acciones quedan auditadas.

**Reglas relacionadas**: RN-RE-07, RN-SE-07, RN-GL-04

## Épica 2: Acceso del personal

### US-010 — Aceptar una invitación y crear la cuenta
**Como** persona invitada a un consultorio
**Quiero** abrir el link de la invitación, definir mi contraseña y verificar mi email
**Para** acceder al panel con los roles asignados

**Criterios de aceptación**:
- [ ] El link vence a las 72 horas y es de un solo uso.
- [ ] Si el email ya tiene cuenta, la invitación agrega la membresía sin crear otra cuenta.
- [ ] Si los roles incluyen `admin`, se exige configurar 2FA antes de entrar al panel.

**Reglas relacionadas**: RN-SE-01, RN-SE-02, RN-SE-04

### US-011 — Iniciar sesión con 2FA
**Como** integrante del personal
**Quiero** entrar con email y contraseña (y el código TOTP si soy administrador)
**Para** operar sobre la agenda de mi consultorio

**Criterios de aceptación**:
- [ ] Tras 5 intentos fallidos, la cuenta se bloquea temporalmente.
- [ ] Si pertenezco a varios consultorios, elijo cuál operar y puedo cambiarlo.
- [ ] Hay recuperación de contraseña por email.

**Reglas relacionadas**: RN-SE-01, RN-SE-02, RN-SE-03, RN-SE-06

### US-012 — Gestionar el equipo del consultorio
**Como** administrador
**Quiero** invitar miembros, cambiar sus roles y desactivarlos
**Para** controlar quién accede a los datos del consultorio

**Criterios de aceptación**:
- [ ] No se puede desactivar ni quitar el rol al último administrador activo.
- [ ] Desactivar a un miembro cierra sus sesiones activas en ese consultorio.

## Épica 3: Configuración del consultorio

### US-020 — Configurar profesionales
**Como** administrador
**Quiero** dar de alta profesionales, vincularlos opcionalmente a un usuario y definir si aparecen online
**Para** que la agenda refleje quién atiende

**Criterios de aceptación**:
- [ ] Desactivar un profesional con turnos futuros exige decidir qué hacer con esos turnos (cancelarlos o reasignarlos) antes de confirmar.

**Reglas relacionadas**: RN-RE-01

### US-021 — Configurar sillones/boxes
**Como** administrador
**Quiero** dar de alta y desactivar sillones
**Para** que el sistema no asigne más turnos que sillones disponibles

**Reglas relacionadas**: RN-AG-02, RN-RE-05

### US-022 — Configurar prestaciones
**Como** administrador
**Quiero** definir prestaciones con su duración, si usan sillón, si se reservan online y qué profesionales las hacen
**Para** que cada turno ocupe el tiempo y los recursos correctos

**Criterios de aceptación**:
- [ ] La duración va de 5 a 480 minutos.
- [ ] Cambiar la duración no altera los turnos existentes.

**Reglas relacionadas**: RN-AG-03, RN-AG-04, RN-AG-07

### US-023 — Configurar horarios y bloqueos
**Como** administrador o recepcionista
**Quiero** definir el horario semanal de cada profesional y cargar bloqueos (vacaciones, feriados, sillón en reparación)
**Para** que solo se ofrezcan horarios reales

**Criterios de aceptación**:
- [ ] Al crear un bloqueo que se superpone con turnos existentes, se los lista y se pide confirmar (los turnos no se cancelan solos).

**Reglas relacionadas**: RN-AG-05

### US-024 — Configurar reglas del consultorio
**Como** administrador
**Quiero** ajustar el máximo de ausencias para el bloqueo, la granularidad, la anticipación mínima y el horizonte de reserva
**Para** adaptar el sistema a la política del consultorio

**Reglas relacionadas**: RN-RE-02, RN-RE-03, RN-CA-05

## Épica 4: Agenda (personal)

### US-030 — Ver la agenda diaria y semanal
**Como** recepcionista
**Quiero** ver la agenda del día o la semana por profesional y por sillón
**Para** saber de un vistazo qué hay y qué está libre

**Criterios de aceptación**:
- [ ] Hay una vista por profesional (columnas) y una vista por sillón.
- [ ] Muestra estado, prestación, paciente, origen (online o personal) y la alerta `requiere_verificacion`.
- [ ] El odontólogo ve por defecto solo su propia agenda.
- [ ] Es usable en un celular (una columna, con selector de profesional).

### US-031 — Crear un turno desde el panel
**Como** recepcionista
**Quiero** crear un turno eligiendo paciente (o creándolo), prestación, profesional y horario
**Para** cargar los turnos que llegan por teléfono o en persona

**Criterios de aceptación**:
- [ ] El sistema propone el sillón y permite cambiarlo por otro libre.
- [ ] Si el horario choca con otro turno, se ve el conflicto y no se guarda.
- [ ] Fuera de horario se pide confirmar el sobreturno.
- [ ] Se envía confirmación por email si el paciente tiene email.

**Reglas relacionadas**: RN-AG-01 a RN-AG-07, RN-NO-01, RN-NO-02

### US-032 — Mover o cancelar un turno desde el panel
**Como** recepcionista
**Quiero** reprogramar un turno a otro horario o profesional, o cancelarlo
**Para** reflejar los cambios que pide el paciente

**Criterios de aceptación**:
- [ ] Mover un turno revalida los solapamientos y reprograma el recordatorio.
- [ ] Cancelar desde el panel registra `cancelado_por = 'personal'`. Se elige si se aplica la regla de 24 horas (por defecto sí).

**Reglas relacionadas**: RN-AG-08, RN-CA-02, RN-NO-03

### US-033 — Registrar asistencia
**Como** recepcionista u odontólogo
**Quiero** marcar un turno como atendido o ausente
**Para** llevar el control de asistencia

**Criterios de aceptación**:
- [ ] Solo se puede marcar después del inicio del turno.
- [ ] Hay un listado de turnos pasados "sin registrar".
- [ ] Marcar ausente actualiza el contador y puede bloquear al paciente.

**Reglas relacionadas**: RN-CA-04 a RN-CA-06

## Épica 5: Pacientes

### US-040 — Buscar y editar la ficha básica
**Como** recepcionista
**Quiero** buscar pacientes por nombre, apellido o DNI y editar su ficha
**Para** mantener actualizados sus datos de contacto

**Criterios de aceptación**:
- [ ] La ficha muestra el historial de turnos, las ausencias y el estado de bloqueo.
- [ ] El campo de notas advierte que no se deben cargar datos clínicos.
- [ ] Ver una ficha queda auditado.

**Reglas relacionadas**: RN-PA-01, RN-PR-03, RN-PR-04

### US-041 — Desbloquear a un paciente
**Como** recepcionista
**Quiero** levantar el bloqueo de reserva online de un paciente
**Para** darle otra oportunidad cuando corresponda

**Reglas relacionadas**: RN-CA-07

### US-042 — Anonimizar a un paciente
**Como** administrador
**Quiero** anonimizar la ficha de un paciente que pidió la supresión de sus datos
**Para** cumplir con la Ley 25.326

**Criterios de aceptación**:
- [ ] Pide una confirmación reforzada (escribir "ANONIMIZAR").
- [ ] Cancela los turnos futuros del paciente.
- [ ] Es irreversible y queda auditado.

**Reglas relacionadas**: RN-PR-02

## Épica 6: Reserva online (paciente)

### US-050 — Reservar un turno sin cuenta
**Como** paciente
**Quiero** entrar al link de mi consultorio, elegir prestación, profesional (o "cualquier disponible") y horario, e ingresar mis datos
**Para** tener mi turno sin llamar ni escribir

**Criterios de aceptación**:
- [ ] El flujo tiene como máximo 4 pasos, es usable en un celular de 390 px de ancho y cumple pautas de accesibilidad básicas.
- [ ] Se piden nombre, apellido, DNI, email y teléfono, y la aceptación del consentimiento.
- [ ] Solo se muestran horarios realmente libres.
- [ ] Si el horario se ocupa en el medio, se muestra un mensaje y otras opciones, sin perder los datos cargados.
- [ ] Un paciente bloqueado ve un mensaje neutro para que contacte al consultorio.
- [ ] Al final se muestra un resumen y llega el email de confirmación.

**Reglas relacionadas**: RN-RE-01 a RN-RE-09, RN-PA-01 a RN-PA-05, RN-PR-01

### US-051 — Ver y cancelar el turno desde el email
**Como** paciente
**Quiero** abrir el link del email para ver mi turno y cancelarlo
**Para** liberar el horario si no puedo ir

**Criterios de aceptación**:
- [ ] Antes de cancelar se avisa si la cancelación es tardía (menos de 24 horas).
- [ ] Tras cancelar, el link queda usado y muestra el estado final.
- [ ] Después del inicio del turno, el link solo muestra la información.

**Reglas relacionadas**: RN-CA-01 a RN-CA-03, RN-SE-04

## Épica 7: Notificaciones

### US-060 — Confirmación, recordatorio y cancelación por email
**Como** paciente
**Quiero** recibir la confirmación al reservar, un recordatorio 24 horas antes y un aviso si se cancela
**Para** no olvidarme del turno

**Criterios de aceptación**:
- [ ] Los emails se envían desde el dominio del producto, con el nombre del consultorio como remitente visible.
- [ ] Incluyen el link de gestión (excepto el de cancelación).
- [ ] No incluyen datos clínicos ni la obra social.

**Reglas relacionadas**: RN-NO-01 a RN-NO-07

### US-061 — Ver el estado de los envíos
**Como** recepcionista
**Quiero** ver si los emails de un turno se enviaron o fallaron
**Para** avisar por teléfono cuando el email falla

### US-062 — Recordatorios por WhatsApp _(post-MVP, prioridad 1)_
**Como** paciente
**Quiero** recibir el recordatorio por WhatsApp y confirmar o cancelar respondiendo
**Para** usar el canal que ya uso todos los días

**Notas**: requiere un `WhatsAppChannel` en la capa de notificaciones (ver `11_notificaciones.md`), plantillas aprobadas por Meta y un webhook de respuestas.
