# Privacidad y Cumplimiento

> Este documento traduce requisitos legales a decisiones de producto. **No reemplaza asesoría legal**: ver PA-04 y PA-05 en `10_preguntas_abiertas.md`.

## Marco normativo aplicable

| Norma | Aplicación en el MVP |
|---|---|
| **Ley 25.326** de Protección de Datos Personales | Datos de pacientes y personal. La obra social y las notas pueden revelar datos de salud, que son **sensibles** |
| Ley 26.529 de Derechos del Paciente (historia clínica) | **No aplica al MVP**, que no guarda datos clínicos (RN-PR-03). Aplicará al módulo de historia clínica |
| AAIP (Agencia de Acceso a la Información Pública) | Autoridad de control; registro de bases de datos (PA-05) |
| Ley 25.506 de Firma Digital | No aplica al MVP (no hay consentimientos firmados) |

## Roles en el tratamiento

| Rol legal | Quién | Responsabilidades |
|---|---|---|
| **Responsable del tratamiento** | Cada consultorio | Decide sobre los datos de sus pacientes; responde los pedidos de acceso, rectificación y supresión |
| **Encargado del tratamiento** | La plataforma (turnos-odontologia) | Trata los datos por cuenta del consultorio; garantiza seguridad y confidencialidad; no usa los datos para fines propios |
| Subencargados | Supabase, Vercel, Resend, Cloudflare | Listados públicamente en la política de privacidad |

Hace falta un **acuerdo de tratamiento de datos** entre la plataforma y cada consultorio, que se acepta en el alta (PA-04).

## Requisitos de producto

| ID | Requisito | Implementación |
|---|---|---|
| PR-01 | Consentimiento informado y registrado | Casilla obligatoria en la reserva online con enlace a `/privacidad`; se guardan fecha y versión (RN-PR-01) |
| PR-02 | Información al titular | `/privacidad` indica responsable, finalidad, destinatarios, transferencia internacional, derechos y contacto |
| PR-03 | Minimización | La ficha guarda solo datos necesarios para el turno; las notas no clínicas tienen un límite de 500 caracteres; el odontólogo ve solo sus pacientes |
| PR-04 | Derecho de acceso | El consultorio puede exportar la ficha y los turnos de un paciente (PDF o JSON) a pedido; queda auditado |
| PR-05 | Rectificación | Edición de la ficha por recepción o administración |
| PR-06 | Supresión | Anonimización irreversible (RN-PR-02, flujo 6); el plazo legal de respuesta es de 5 días hábiles |
| PR-07 | Confidencialidad entre consultorios | RLS + tests de aislamiento obligatorios en CI |
| PR-08 | Seguridad de acceso | 2FA de administrador, bloqueo por intentos, sesiones seguras, contraseñas fuertes |
| PR-09 | Trazabilidad | `registro_auditoria` inalterable para ver, exportar o anonimizar fichas y para los cambios de turnos |
| PR-10 | Cifrado | TLS en tránsito; cifrado en reposo del proveedor (Supabase); tokens hasheados |
| PR-11 | Transferencia internacional | Datos alojados fuera de Argentina (DD-12). Base legal prevista: consentimiento y cláusulas contractuales del proveedor, a validar (PA-04) |
| PR-12 | Mensajes sin datos sensibles | Los emails no incluyen información clínica ni la obra social (RN-NO-07) |
| PR-13 | Logs sin datos personales | Solo IDs (RN-PR-05) |
| PR-14 | Retención | Turnos y auditoría se conservan mientras el consultorio esté activo. Al dar de baja un consultorio, se exportan sus datos y se eliminan en un plazo a definir (PA-04) |

## Checklist antes de cargar datos reales (piloto)

- [ ] Política de privacidad y términos publicados y revisados por asesoría legal.
- [ ] Acuerdo de tratamiento de datos aceptado por el consultorio piloto.
- [ ] Decisión tomada sobre la inscripción ante la AAIP.
- [ ] Plan de Supabase con backups adecuados y región elegida.
- [ ] Tests de aislamiento entre consultorios en verde en CI.
- [ ] 2FA del administrador del piloto activo.
- [ ] Dominio de email verificado (SPF y DKIM).
