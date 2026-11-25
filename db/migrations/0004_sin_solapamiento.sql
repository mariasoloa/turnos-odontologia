-- Garantía central del producto (RN-AG-01, RN-AG-02, design D1): la base de datos rechaza dos turnos
-- activos superpuestos del mismo profesional o del mismo sillón, incluso con inserciones concurrentes.
-- `rango` es [inicio, fin): los turnos contiguos no se superponen. Los cancelados no ocupan recursos.
-- Los nombres de las restricciones son estables: la aplicación los usa para traducir el error 23P01.
ALTER TABLE turno ADD CONSTRAINT turno_sin_solapamiento_profesional
  EXCLUDE USING gist (tenant_id WITH =, profesional_id WITH =, rango WITH &&)
  WHERE (estado IN ('reservado', 'atendido', 'ausente'));
--> statement-breakpoint
ALTER TABLE turno ADD CONSTRAINT turno_sin_solapamiento_sillon
  EXCLUDE USING gist (tenant_id WITH =, sillon_id WITH =, rango WITH &&)
  WHERE (sillon_id IS NOT NULL AND estado IN ('reservado', 'atendido', 'ausente'));
