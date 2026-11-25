-- Rol de grupo de la aplicación. Los roles son del servidor (no de la base), así que se crea solo si falta.
-- El rol de login (por ejemplo turnos_app) lo crea `pnpm db:migrate` y se hace miembro de este grupo.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
  END IF;
END
$$;
--> statement-breakpoint
GRANT USAGE ON SCHEMA public TO app_user;
--> statement-breakpoint
-- Permisos explícitos por tabla (sin privilegios por defecto): ninguna tabla nueva queda accesible
-- sin una decisión consciente. Sin DELETE: la aplicación no borra datos físicamente (RN-GL-03).
GRANT SELECT ON consultorio TO app_user;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON profesional, sillon, prestacion, prestacion_profesional, paciente, turno TO app_user;
