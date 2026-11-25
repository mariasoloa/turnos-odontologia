-- Aislamiento entre consultorios (spec aislamiento-consultorios, design D5).
-- `app.tenant_id` lo fija withTenant() con set_config(..., true) en cada transacción.
-- current_setting(..., true) devuelve '' (o null) si no se fijó: nullif lo convierte en null y la
-- comparación no coincide con ninguna fila, así que sin consultorio no se ve nada.
-- FORCE ROW LEVEL SECURITY aplica las políticas incluso al dueño de la tabla.

-- consultorio: la aplicación solo lee su propio consultorio. La lectura pública por slug se
-- resolverá con una función acotada cuando exista la reserva online (fuera de este change).
ALTER TABLE consultorio ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE consultorio FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY consultorio_aislamiento ON consultorio
  USING (id = nullif(current_setting('app.tenant_id', true), '')::uuid);
--> statement-breakpoint

ALTER TABLE profesional ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE profesional FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY profesional_aislamiento ON profesional
  USING (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid);
--> statement-breakpoint

ALTER TABLE sillon ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE sillon FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY sillon_aislamiento ON sillon
  USING (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid);
--> statement-breakpoint

ALTER TABLE prestacion ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE prestacion FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY prestacion_aislamiento ON prestacion
  USING (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid);
--> statement-breakpoint

ALTER TABLE prestacion_profesional ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE prestacion_profesional FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY prestacion_profesional_aislamiento ON prestacion_profesional
  USING (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid);
--> statement-breakpoint

ALTER TABLE paciente ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE paciente FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY paciente_aislamiento ON paciente
  USING (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid);
--> statement-breakpoint

ALTER TABLE turno ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE turno FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY turno_aislamiento ON turno
  USING (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid);
