# Reglas de Negocio

Cada regla tiene un código único `RN-{DOMINIO}-{NN}` para trazabilidad en historias, tests y código.

## Dominio: Agenda (RN-AG)

- **RN-AG-01**: Un profesional no puede tener dos turnos activos (`reservado`, `atendido` o `ausente`) que se superpongan en el tiempo. — Se garantiza con una restricción de exclusión en PostgreSQL.
- **RN-AG-02**: Un sillón/box no puede tener dos turnos activos que se superpongan en el tiempo. — Se garantiza con una restricción de exclusión.
- **RN-AG-03**: Una prestación con `requiere_sillon = true` debe tener un sillón asignado. Una prestación sin sillón (por ejemplo, la consulta breve) solo ocupa al profesional.
- **RN-AG-04**: La duración del turno es la de la prestación al momento de reservar. Si después se cambia la duración de la prestación, los turnos existentes no se modifican.
- **RN-AG-05**: Un turno solo puede caer dentro de un `horario_atencion` vigente del profesional y fuera de cualquier `bloqueo` que lo afecte (de ese profesional, de ese sillón o de todo el consultorio).
- **RN-AG-06**: El personal puede crear turnos fuera de horario (sobreturno), con confirmación explícita. Nunca puede saltear RN-AG-01 ni RN-AG-02.
- **RN-AG-07**: Un profesional solo puede atender las prestaciones que tiene asignadas (`prestacion_profesional`).
- **RN-AG-08**: Cancelar un turno libera de inmediato al profesional y al sillón.

## Dominio: Reserva online (RN-RE)

- **RN-RE-01**: Solo se ofrecen online las prestaciones con `reservable_online = true` y los profesionales con `visible_online = true`.
- **RN-RE-02**: Los horarios ofrecidos comienzan en múltiplos de `granularidad_minutos` y deben tener libres, durante toda la duración, al profesional y (si corresponde) al menos un sillón.
- **RN-RE-03**: No se reserva online con menos de `anticipacion_minima_horas` (por defecto 2) ni más allá de `horizonte_reserva_dias` (por defecto 60). _(Supuesto, ver SU-04.)_
- **RN-RE-04**: El paciente elige un profesional o "cualquier disponible". Con "cualquier disponible", el sistema asigna al profesional habilitado con **menos turnos activos ese día**; si hay empate, elige por `orden`. _(Supuesto, ver SU-05.)_
- **RN-RE-05**: El sillón lo asigna siempre el sistema. Elige el primer sillón activo libre según el nombre. El paciente no elige sillón.
- **RN-RE-06**: La reserva es atómica. Si otra reserva concurrente tomó el recurso, la restricción de exclusión falla y el paciente ve "Ese horario se acaba de ocupar" con nuevas opciones.
- **RN-RE-07**: Un consultorio `suspendido` no acepta reservas online y su página pública muestra un aviso genérico.
- **RN-RE-08**: Toda reserva online exige validar Turnstile y respetar el límite de solicitudes (RN-SE-05).
- **RN-RE-09**: Para reservar online, el paciente debe aceptar la política de privacidad y el consentimiento de tratamiento de datos (RN-PR-01).

## Dominio: Pacientes (RN-PA)

- **RN-PA-01**: Dentro de un consultorio, el paciente se identifica por DNI (normalizado, solo dígitos). Cada consultorio tiene sus propios pacientes: el mismo DNI en dos consultorios son dos fichas independientes.
- **RN-PA-02**: Al reservar online con un DNI nuevo, se crea la ficha con los datos ingresados. Con un DNI existente, se usa la ficha existente **y no se sobrescriben sus datos de contacto**.
- **RN-PA-03**: Si el email ingresado no coincide con el de la ficha, el turno se marca `requiere_verificacion`. La confirmación se envía al email ingresado **y** se avisa al email de la ficha. Recepción ve una alerta. — Mitiga la suplantación por DNI.
- **RN-PA-04**: El DNI es obligatorio en la reserva online. El personal puede crear pacientes sin DNI (por ejemplo, un menor sin documento a mano), pero no pueden reservar online hasta completarlo.
- **RN-PA-05**: Un paciente con `bloqueado_online = true` no puede reservar online. Ve un mensaje que le indica comunicarse con el consultorio, sin mencionar la causa. El personal sí puede darle turnos.

## Dominio: Cancelaciones y ausencias (RN-CA)

- **RN-CA-01**: El paciente puede cancelar desde el link del email hasta el inicio del turno.
- **RN-CA-02**: Si se cancela con **24 horas o más** de anticipación, el estado es `cancelado`. Con menos de 24 horas, el estado es `cancelado_tarde`. La cancelación tardía **no** suma ausencias ni bloquea.
- **RN-CA-03**: Después del inicio del turno no se puede cancelar online.
- **RN-CA-04**: El personal (recepción, o el odontólogo para sus propios turnos) marca el turno como `atendido` o `ausente` una vez que comenzó. Los turnos pasados todavía `reservado` aparecen como "sin registrar".
- **RN-CA-05**: Marcar `ausente` incrementa `paciente.ausencias_sin_aviso`. Si el contador llega a `consultorio.max_ausencias_bloqueo` (mayor que 0), el paciente pasa a `bloqueado_online = true`.
- **RN-CA-06**: Corregir un `ausente` (a `atendido` o `cancelado_tarde`) decrementa el contador. El bloqueo no se levanta solo: lo levanta el personal.
- **RN-CA-07**: Desbloquear a un paciente pone el contador en 0 y queda registrado en la auditoría.
- **RN-CA-08**: El contador cuenta todas las ausencias históricas del consultorio, sin ventana de tiempo. _(Supuesto, ver la pregunta abierta sobre la ventana de tiempo.)_

## Dominio: Notificaciones (RN-NO)

- **RN-NO-01**: Al crear un turno con email de contacto se encola una notificación `confirmacion` inmediata.
- **RN-NO-02**: Si el turno empieza en más de 24 horas, se encola un `recordatorio` programado para `inicio − 24 h`. Si empieza antes, no se envía recordatorio.
- **RN-NO-03**: Al cancelar un turno se descartan sus notificaciones pendientes y se encola `cancelacion` o `cancelacion_tarde`.
- **RN-NO-04**: Cada combinación de turno, tipo y canal se envía una sola vez (idempotencia).
- **RN-NO-05**: Un envío fallido se reintenta hasta 5 veces con espera exponencial. Después queda `fallida` y es visible para el personal.
- **RN-NO-06**: Si un recordatorio no salió antes del inicio del turno, se descarta.
- **RN-NO-07**: Los mensajes no incluyen datos clínicos ni la obra social. Solo llevan el nombre del paciente, el consultorio, el profesional, la fecha y hora, la dirección y el link de gestión.

## Dominio: Seguridad y acceso (RN-SE)

- **RN-SE-01**: El personal entra con email y contraseña (mínimo 10 caracteres, verificada contra contraseñas filtradas). El email debe estar verificado.
- **RN-SE-02**: Todo miembro con rol `admin` debe tener 2FA (TOTP) activo. Hasta activarlo, solo puede acceder a la pantalla de configuración de 2FA.
- **RN-SE-03**: Una sesión opera sobre un único consultorio activo a la vez. Cada operación fija `app.tenant_id` en la transacción y RLS rechaza cualquier acceso a otro consultorio.
- **RN-SE-04**: Los tokens de los links (gestión de turno, invitación) se generan aleatoriamente (≥ 128 bits), se guardan solo hasheados, son de un solo uso y vencen.
- **RN-SE-05**: Las rutas públicas tienen límite de solicitudes por IP y por DNI. Por ejemplo, como máximo 3 reservas por DNI por día y por consultorio. _(Valores a ajustar.)_
- **RN-SE-06**: La cuenta se bloquea temporalmente tras 5 intentos de login fallidos.
- **RN-SE-07**: Un consultorio `suspendido` impide el acceso al panel a todos sus miembros.

## Dominio: Privacidad (RN-PR)

- **RN-PR-01**: Antes de guardar datos de un paciente nuevo por reserva online, se registra la aceptación del consentimiento (fecha y versión del texto).
- **RN-PR-02**: Cuando el paciente pide la supresión, el administrador anonimiza la ficha. Se borran nombre, apellido, DNI, email, teléfono, obra social, número de afiliado y notas. Se conservan los turnos para las estadísticas, vinculados a la ficha anonimizada. Es irreversible y queda auditado.
- **RN-PR-03**: Las notas administrativas no pueden contener datos clínicos (diagnósticos, tratamientos, medicación). La interfaz lo advierte. Hasta que exista el módulo de historia clínica, rige la Ley 26.529.
- **RN-PR-04**: Se registra en la auditoría cada vez que se ve una ficha de paciente, se exporta o se anonimiza, y cada cambio de estado de turno hecho por el personal.
- **RN-PR-05**: Los registros de auditoría y los logs de la aplicación nunca guardan datos personales en texto plano: se referencian solo por ID.

## Dominio: Excepciones globales

- **RN-GL-01**: Todas las fechas se guardan en UTC y se muestran y calculan (días de la semana, horarios, regla de 24 horas) en la `zona_horaria` del consultorio.
- **RN-GL-02**: Toda entrada se valida en el servidor con Zod, aunque ya se haya validado en el cliente.
- **RN-GL-03**: Ninguna operación de la aplicación borra físicamente turnos, pacientes ni registros de auditoría.
- **RN-GL-04**: Alta, suspensión y reactivación de consultorios se hacen solo con scripts internos, y quedan auditadas con `actor_tipo = 'plataforma'`.
