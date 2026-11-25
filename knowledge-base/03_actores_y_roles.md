# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| **Administrador del consultorio** (`admin`) | Dueño o responsable del consultorio | Panel `/panel`, con email, contraseña y **2FA obligatorio** |
| **Recepcionista** (`recepcion`) | Secretaria o secretario que gestiona la agenda | Panel `/panel`, con email y contraseña (2FA opcional) |
| **Odontólogo** (`odontologo`) | Profesional que atiende | Panel `/panel`, con email y contraseña (2FA opcional) |
| **Paciente** | Persona que reserva un turno. **No tiene cuenta** | Página pública `/c/{slug}` y links con token `/t/{token}` recibidos por email |
| **Equipo de plataforma** | Personas que operan el SaaS | **Sin rol en la aplicación.** Operan con scripts internos (`pnpm tenant:*`) usando credenciales de la base de datos |
| **Sistema (job)** | Proceso que envía notificaciones | Endpoint `/api/jobs/notificaciones`, invocado por `pg_cron` |

**Combinación de roles:** una persona puede tener más de un rol en el mismo consultorio (por ejemplo, un odontólogo dueño tiene `admin` y `odontologo`). Los roles se guardan en la membresía (`miembro_consultorio.roles`). Un usuario puede pertenecer a varios consultorios y en cada uno tiene roles independientes. Si tiene `admin` en alguno, se le exige 2FA para operar en ese consultorio.

Un **odontólogo** que usa el sistema tiene un registro `profesional` vinculado a su usuario. Puede haber profesionales sin usuario (agenda manejada por recepción).

## RBAC: matriz de permisos

C = crear, R = leer, U = modificar, D = eliminar o desactivar. Todo está siempre limitado al consultorio activo de la sesión.

| Recurso | admin | recepcion | odontologo | paciente (público) |
|---|---|---|---|---|
| Datos del consultorio (nombre, slug, reglas de ausentismo, granularidad) | R U | R | R | R (nombre, dirección) |
| Usuarios y membresías del consultorio | C R U D | — | — | — |
| Profesionales | C R U D | R | R (U propio perfil visible) | R (nombre y especialidad) |
| Sillones / boxes | C R U D | R | R | — |
| Prestaciones | C R U D | R | R | R (las publicables online) |
| Horarios de atención y bloqueos | C R U D | C R U D | R (propios) | — |
| Turnos | C R U D | C R U D | R (propios); U estado (atendido/ausente) de los propios | C (vía reserva online); D (cancelar el propio vía token) |
| Pacientes (ficha básica) | C R U | C R U | R (solo pacientes con turnos con ese profesional) | C (implícito al reservar) |
| Desbloquear paciente | U | U | — | — |
| Anonimizar paciente (supresión) | U | — | — | — (lo pide al consultorio) |
| Registro de auditoría | R | — | — | — |
| Notificaciones (historial de envíos) | R | R | — | — |

**Reglas de autorización:**
- La autorización se valida en cada Server Action. RLS impide además leer o escribir filas de otro consultorio (defensa en profundidad).
- Un odontólogo **no ve** las fichas de pacientes que no tienen turnos con él (minimización de datos, Ley 25.326).
- Ningún rol puede borrar físicamente turnos ni pacientes: solo cancelar o anonimizar.

## Rutas públicas (sin autenticación)

| Ruta | Propósito |
|---|---|
| `/` | Landing del producto |
| `/c/{slug}` | Reserva online del consultorio |
| `/c/{slug}/disponibilidad` | Consulta de horarios libres |
| `/t/{token}` | Ver el turno y cancelarlo |
| `/privacidad` | Política de privacidad (Ley 25.326) |
| `/terminos` | Términos de uso |
| `/login`, `/recuperar-clave`, `/restablecer-clave`, `/aceptar-invitacion/{token}` | Acceso del personal |

Todas las rutas bajo `/panel/*` requieren sesión y membresía activa en un consultorio **activo** (no suspendido).
