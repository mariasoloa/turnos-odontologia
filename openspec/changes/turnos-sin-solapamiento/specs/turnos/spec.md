# Spec Delta

## Purpose

Permite al personal de un consultorio crear y cancelar turnos y garantiza que un profesional o un sillón/box nunca tengan dos turnos activos superpuestos, incluso con operaciones simultáneas.

## ADDED Requirements

### Requirement: Crear un turno
El sistema SHALL permitir al personal crear un turno para un paciente existente, con una prestación, un profesional y, si corresponde, un sillón, a partir de una fecha y hora de inicio. El turno se crea en estado `reservado` y con origen `personal`.

#### Scenario: Turno creado
- **GIVEN** un paciente, una prestación de 30 minutos, un profesional habilitado y un sillón libres, todos activos
- **WHEN** el personal crea un turno con inicio a las 10:00
- **THEN** el turno queda en estado `reservado`, con origen `personal` y un rango de 10:00 a 10:30

### Requirement: Duración tomada de la prestación
El sistema SHALL calcular el fin del turno como el inicio más la duración de la prestación al momento de crearlo. Un cambio posterior de la duración de la prestación MUST NOT modificar los turnos existentes (RN-AG-04).

#### Scenario: Fin calculado
- **WHEN** se crea un turno de una prestación de 45 minutos con inicio a las 9:00
- **THEN** el turno termina a las 9:45

#### Scenario: Cambio posterior de duración
- **GIVEN** un turno de 9:00 a 9:45 creado con una prestación de 45 minutos
- **WHEN** la duración de la prestación pasa a 60 minutos
- **THEN** el turno existente sigue terminando a las 9:45

### Requirement: Sillón según la prestación
El sistema SHALL exigir un sillón cuando la prestación lo requiere y SHALL permitir crear sin sillón un turno de una prestación que no lo requiere (RN-AG-03). Si se indica un sillón en una prestación que no lo requiere, el sistema SHALL aceptar el turno y SHALL considerar ocupado ese sillón.

#### Scenario: Falta el sillón requerido
- **WHEN** se intenta crear un turno de una prestación que requiere sillón sin indicar sillón
- **THEN** la operación se rechaza con el error "sillón requerido" y no se crea el turno

#### Scenario: Consulta breve sin sillón
- **WHEN** se crea un turno de una prestación que no requiere sillón sin indicar sillón
- **THEN** el turno se crea sin sillón y ocupa solo al profesional

#### Scenario: Sillón indicado en una prestación que no lo requiere
- **GIVEN** un turno activo de una consulta breve (sin sillón requerido) creado con el Box 1 de 10:00 a 10:15
- **WHEN** se intenta crear otro turno en el Box 1 de 10:00 a 10:30 con otro profesional
- **THEN** el primer turno ocupa el Box 1 y la operación se rechaza con el error "sillón ocupado"

### Requirement: Prestación habilitada para el profesional
El sistema SHALL rechazar un turno si el profesional no tiene asignada la prestación (RN-AG-07).

#### Scenario: Prestación no habilitada
- **WHEN** se intenta crear un turno de una prestación que el profesional no realiza
- **THEN** la operación se rechaza con el error "prestación no habilitada para el profesional"

### Requirement: Recursos activos
El sistema SHALL rechazar un turno cuyo profesional, sillón o prestación estén inactivos, o cuyo paciente no exista en el consultorio.

#### Scenario: Profesional inactivo
- **WHEN** se intenta crear un turno con un profesional inactivo
- **THEN** la operación se rechaza con el error "recurso inactivo" y no se crea el turno

#### Scenario: Paciente inexistente
- **WHEN** se intenta crear un turno para un paciente que no existe en el consultorio
- **THEN** la operación se rechaza con el error "paciente inexistente"

### Requirement: Sin solapamiento por profesional
El sistema MUST impedir que un profesional tenga dos turnos activos (`reservado`, `atendido` o `ausente`) cuyos rangos se superpongan. La garantía MUST mantenerse con operaciones simultáneas (RN-AG-01).

#### Scenario: Superposición con el mismo profesional
- **GIVEN** un turno activo del profesional de 10:00 a 10:30
- **WHEN** se intenta crear otro turno del mismo profesional de 10:15 a 10:45
- **THEN** la operación se rechaza con el error "profesional ocupado"

#### Scenario: Turnos contiguos
- **GIVEN** un turno activo del profesional de 10:00 a 10:30
- **WHEN** se crea otro turno del mismo profesional de 10:30 a 11:00
- **THEN** el turno se crea, porque el fin de un rango no incluye su último instante

#### Scenario: Otro profesional en el mismo horario
- **GIVEN** un turno activo del profesional A de 10:00 a 10:30
- **WHEN** se crea un turno del profesional B de 10:00 a 10:30 con otro sillón
- **THEN** el turno se crea

### Requirement: Sin solapamiento por sillón
El sistema MUST impedir que un sillón/box tenga dos turnos activos cuyos rangos se superpongan, aunque sean de profesionales distintos. Los turnos sin sillón no ocupan ningún sillón. La garantía MUST mantenerse con operaciones simultáneas (RN-AG-02).

#### Scenario: Superposición en el mismo sillón
- **GIVEN** un turno activo en el Box 1 de 10:00 a 10:30 con el profesional A
- **WHEN** se intenta crear un turno del profesional B en el Box 1 de 10:15 a 11:15
- **THEN** la operación se rechaza con el error "sillón ocupado"

#### Scenario: Turnos sin sillón superpuestos
- **GIVEN** un turno activo sin sillón del profesional A de 10:00 a 10:15
- **WHEN** se crea un turno sin sillón del profesional B de 10:00 a 10:15
- **THEN** el turno se crea

### Requirement: Garantía ante operaciones simultáneas
El sistema MUST aceptar como máximo uno de dos o más intentos simultáneos de crear turnos que se superpongan sobre el mismo profesional o el mismo sillón; los demás se rechazan con el error correspondiente (RN-RE-06).

#### Scenario: Dos creaciones simultáneas
- **WHEN** dos operaciones simultáneas intentan crear turnos superpuestos para el mismo profesional
- **THEN** exactamente una se completa y la otra se rechaza con el error "profesional ocupado"

### Requirement: Cancelar un turno
El sistema SHALL permitir al personal cancelar un turno en estado `reservado` antes de su inicio, registrando `cancelado_por = personal` y la fecha de cancelación. Con 24 horas o más de anticipación el estado es `cancelado`; con menos, `cancelado_tarde` (RN-CA-02).

#### Scenario: Cancelación con anticipación
- **GIVEN** un turno `reservado` que empieza dentro de 48 horas
- **WHEN** el personal lo cancela
- **THEN** el turno pasa a `cancelado` con `cancelado_por = personal`

#### Scenario: Cancelación tardía
- **GIVEN** un turno `reservado` que empieza dentro de 23 horas
- **WHEN** el personal lo cancela
- **THEN** el turno pasa a `cancelado_tarde`

#### Scenario: Exactamente 24 horas antes
- **GIVEN** un turno `reservado` que empieza dentro de exactamente 24 horas
- **WHEN** el personal lo cancela
- **THEN** el turno pasa a `cancelado`

#### Scenario: Turno ya comenzado o no reservado
- **WHEN** se intenta cancelar un turno que ya comenzó o que no está `reservado`
- **THEN** la operación se rechaza y el turno no cambia

### Requirement: Cancelar libera los recursos
El sistema SHALL liberar de inmediato al profesional y al sillón de un turno cancelado, para que se pueda crear otro turno en el mismo horario (RN-AG-08).

#### Scenario: Reutilizar el horario
- **GIVEN** un turno cancelado del profesional A en el Box 1 de 10:00 a 10:30
- **WHEN** se crea un turno del profesional A en el Box 1 de 10:00 a 10:30
- **THEN** el turno se crea

### Requirement: Fechas en la zona del consultorio
El sistema SHALL guardar los rangos en UTC y SHALL calcular la regla de 24 horas con instantes absolutos (RN-GL-01).

#### Scenario: Hora local
- **WHEN** se crea un turno con inicio a las 10:00 en `America/Argentina/Buenos_Aires`
- **THEN** el inicio guardado corresponde a las 13:00 UTC
