# Flujos Principales

## Flujo 1: Reserva online

**Disparador**: el paciente abre `/c/{slug}`.
**Actor**: paciente (sin cuenta).

**Pasos**:
1. **Página pública**: resuelve el consultorio por slug. Si no existe o está suspendido, muestra un aviso genérico.
2. El paciente elige la prestación (solo las reservables online, RN-RE-01).
3. Elige un profesional habilitado para esa prestación o "cualquier disponible".
4. **Disponibilidad**: el servicio `calcularDisponibilidad(consultorio, prestación, profesional?, fecha)`:
   1. Toma los horarios vigentes del profesional ese día.
   2. Resta bloqueos y turnos activos del profesional.
   3. Si la prestación usa sillón, exige al menos un sillón libre durante toda la duración.
   4. Genera los inicios cada `granularidad_minutos`.
   5. Aplica la anticipación mínima y el horizonte de reserva.
5. El paciente elige un horario y completa nombre, apellido, DNI, email y teléfono, y acepta el consentimiento. Turnstile valida que no sea un bot.
6. **Server Action `reservarTurno`**, en una transacción con `app.tenant_id` fijado:
   1. Valida la entrada (Zod), Turnstile y el límite de solicitudes.
   2. Busca el paciente por DNI. Si no existe, lo crea con el consentimiento. Si existe y está bloqueado, aborta (RN-PA-05). Si el email difiere, marca `requiere_verificacion` (RN-PA-03).
   3. Resuelve el profesional (RN-RE-04) y el sillón (RN-RE-05).
   4. Inserta el `turno` (la restricción de exclusión garantiza que no haya solapamiento).
   5. Crea el `token_turno` (hasheado) y encola las notificaciones `confirmacion` y, si corresponde, `recordatorio`.
   6. Escribe la auditoría (`turno.crear`, `actor_tipo = paciente`).
7. Muestra el resumen del turno. La confirmación sale en el próximo ciclo del job o se dispara en ese momento (ver el flujo 3).

**Diagrama de secuencia**:
```
Paciente → Página /c/{slug} → Server Action → PostgreSQL (tx, RLS)
                                           ← turno insertado / 23P01 (exclusion_violation)
                              → notificacion (outbox) insertada
         ← resumen + "te enviamos un email"
```

**Casos de error**:
- Solapamiento concurrente (`exclusion_violation`, SQLSTATE 23P01) → se muestra "Ese horario se acaba de ocupar" y se recalculan las opciones, sin perder los datos cargados.
- Paciente bloqueado → mensaje neutro: "No es posible reservar online. Comunicate con el consultorio al {teléfono}."
- Turnstile inválido o límite de solicitudes superado → error genérico con opción de reintentar más tarde.
- Prestación o profesional desactivados en el medio → se vuelve al paso correspondiente.

## Flujo 2: Cancelación por el paciente

**Disparador**: el paciente abre `/t/{token}` desde un email.
**Actor**: paciente.

**Pasos**:
1. Se hashea el token y se busca un `token_turno` no usado y no vencido.
2. Se muestra el turno: fecha, hora, profesional, prestación y dirección.
3. Si faltan menos de 24 horas, se avisa: "La cancelación quedará registrada como tardía".
4. Al confirmar, en una transacción: estado `cancelado` o `cancelado_tarde` (RN-CA-02), `cancelado_por = paciente`, token marcado como usado, notificaciones pendientes descartadas y cancelación encolada. Se audita.
5. Se muestra la confirmación de la cancelación.

**Casos de error**:
- Token inexistente, usado o vencido → "Este link ya no es válido" y el teléfono del consultorio.
- El turno ya comenzó → solo se muestra la información (RN-CA-03).
- El turno ya fue cancelado por el personal → se muestra el estado actual.

## Flujo 3: Procesamiento de notificaciones (recordatorio de 24 horas)

**Disparador**: `pg_cron` cada 10 minutos.
**Actor**: sistema.

**Pasos**:
1. `pg_cron` ejecuta `net.http_post` (`pg_net`) hacia `POST {APP_URL}/api/jobs/notificaciones` con `Authorization: Bearer {JOBS_SECRET}`. El secreto vive en Supabase Vault.
2. El endpoint valida el secreto y toma un lote (por ejemplo, 50) de notificaciones `pendiente` con `programada_para <= now()`, usando `FOR UPDATE SKIP LOCKED`, y las pasa a `enviando`.
3. Para cada una:
   1. Si es un recordatorio de un turno que ya no está `reservado` o ya comenzó, la descarta (RN-NO-06).
   2. Arma el mensaje con la plantilla del tipo y canal.
   3. Lo envía por `NotificationChannel.send()`.
   4. Si sale bien, pasa a `enviada` con el `id_proveedor`. Si falla, suma `intentos`, guarda `ultimo_error` y reprograma con espera exponencial; al quinto intento queda `fallida`.
4. Responde con métricas (procesadas, enviadas, fallidas) para el log.

Además, tras crear un turno, la Server Action puede llamar al procesador para la confirmación inmediata. El job queda como garantía.

**Casos de error**:
- El job tarda más que el ciclo → `SKIP LOCKED` evita el doble procesamiento.
- Resend no responde o supera el límite de envío → reintento con espera.
- La notificación queda en `enviando` por un corte → un barrido la devuelve a `pendiente` si pasaron más de 15 minutos.

## Flujo 4: Registro de ausencia y bloqueo

**Disparador**: recepción u odontólogo marcan un turno pasado como `ausente`.

**Pasos**:
1. Se valida que el turno haya comenzado y esté `reservado`.
2. En una transacción: estado `ausente`, `paciente.ausencias_sin_aviso += 1`. Si el contador llega a `max_ausencias_bloqueo` (mayor que 0), `bloqueado_online = true` y `bloqueado_en = now()`.
3. Se audita. La interfaz informa si el paciente quedó bloqueado.

**Casos de error**:
- Corrección de un ausente → se decrementa el contador sin desbloquear (RN-CA-06).

## Flujo 5: Alta de consultorio e incorporación del administrador

**Disparador**: el equipo ejecuta `pnpm tenant:create`.

**Pasos**:
1. El script, conectado con un rol privilegiado de migraciones, valida los argumentos y crea `consultorio` e `invitacion` (`admin`) en una transacción.
2. Envía el email de invitación y registra la auditoría con `actor_tipo = plataforma`.
3. El administrador abre `/aceptar-invitacion/{token}`, crea su contraseña, verifica el email y configura 2FA.
4. Entra al panel con un checklist de puesta en marcha: profesionales, sillones, prestaciones, horarios y link público.

## Flujo 6: Anonimización por pedido de supresión

**Disparador**: el paciente pide al consultorio la supresión de sus datos (Ley 25.326, art. 16).

**Pasos**:
1. El administrador abre la ficha, elige "Anonimizar" y confirma escribiendo "ANONIMIZAR".
2. En una transacción:
   1. Cancela los turnos futuros, sin enviar emails.
   2. Descarta las notificaciones pendientes.
   3. Pone en null los campos personales y en `"Paciente anonimizado"` el nombre visible.
   4. Pone `anonimizado_en = now()` y deja el DNI en null, lo que libera el unique.
   5. Pone en null `email_contacto` en sus turnos.
3. Se audita `paciente.anonimizar`, solo con IDs.
4. El sistema muestra la fecha de anonimización para que el consultorio responda al titular dentro del plazo legal (5 días hábiles, art. 16).
