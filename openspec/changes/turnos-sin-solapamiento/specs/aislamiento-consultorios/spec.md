# Spec Delta

## Purpose

Garantiza que los datos de cada consultorio solo sean visibles y modificables dentro de ese consultorio, con el aislamiento aplicado por la base de datos y no solo por la aplicación.

## ADDED Requirements

### Requirement: Operaciones acotadas a un consultorio
Toda operación de la aplicación sobre datos de un consultorio SHALL ejecutarse dentro de una transacción asociada a un único consultorio (RN-SE-03).

#### Scenario: Operación con consultorio
- **WHEN** se crea un turno para el consultorio A
- **THEN** el turno queda asociado al consultorio A

### Requirement: Aislamiento aplicado por la base de datos
La base de datos MUST impedir leer o modificar filas de otro consultorio, aunque la consulta no filtre por consultorio. La conexión de la aplicación MUST NOT poder saltear esta restricción.

#### Scenario: Lectura de otro consultorio
- **GIVEN** turnos del consultorio A y del consultorio B
- **WHEN** una operación del consultorio A lista todos los turnos sin filtro
- **THEN** solo obtiene los turnos del consultorio A

#### Scenario: Modificación de otro consultorio
- **WHEN** una operación del consultorio A intenta cancelar un turno del consultorio B
- **THEN** el turno no se encuentra y no cambia

#### Scenario: Recurso de otro consultorio
- **WHEN** una operación del consultorio A intenta crear un turno con un profesional del consultorio B
- **THEN** la operación se rechaza y no se crea el turno

### Requirement: Sin consultorio no hay datos
Una operación sin consultorio asociado MUST NOT ver ni modificar datos de ningún consultorio.

#### Scenario: Consulta sin consultorio
- **WHEN** la aplicación consulta los turnos sin haber fijado un consultorio
- **THEN** no obtiene ninguna fila

### Requirement: Mismos horarios en consultorios distintos
Las reglas de no solapamiento SHALL aplicarse dentro de cada consultorio, sin interferir entre consultorios.

#### Scenario: Mismo horario en dos consultorios
- **GIVEN** un turno activo de 10:00 a 10:30 en el consultorio A
- **WHEN** se crea un turno de 10:00 a 10:30 en el consultorio B
- **THEN** el turno se crea
