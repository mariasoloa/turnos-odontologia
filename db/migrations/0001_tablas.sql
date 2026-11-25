CREATE TYPE "public"."cancelado_por" AS ENUM('paciente', 'personal');--> statement-breakpoint
CREATE TYPE "public"."estado_consultorio" AS ENUM('activo', 'suspendido');--> statement-breakpoint
CREATE TYPE "public"."estado_turno" AS ENUM('reservado', 'atendido', 'ausente', 'cancelado', 'cancelado_tarde');--> statement-breakpoint
CREATE TYPE "public"."origen_turno" AS ENUM('online', 'personal');--> statement-breakpoint
CREATE TABLE "consultorio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"slug" text NOT NULL,
	"direccion" text,
	"telefono" text,
	"email_contacto" text,
	"estado" "estado_consultorio" DEFAULT 'activo' NOT NULL,
	"max_ausencias_bloqueo" integer DEFAULT 3 NOT NULL,
	"granularidad_minutos" integer DEFAULT 15 NOT NULL,
	"anticipacion_minima_horas" integer DEFAULT 2 NOT NULL,
	"horizonte_reserva_dias" integer DEFAULT 60 NOT NULL,
	"zona_horaria" text DEFAULT 'America/Argentina/Buenos_Aires' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "consultorio_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "paciente" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"dni" text,
	"email" text,
	"telefono" text,
	"obra_social" text,
	"nro_afiliado" text,
	"notas_administrativas" text,
	"ausencias_sin_aviso" integer DEFAULT 0 NOT NULL,
	"bloqueado_online" boolean DEFAULT false NOT NULL,
	"bloqueado_en" timestamp with time zone,
	"consentimiento_aceptado_en" timestamp with time zone,
	"consentimiento_version" text,
	"anonimizado_en" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "paciente_tenant_id_id_unico" UNIQUE("tenant_id","id"),
	CONSTRAINT "paciente_dni_solo_digitos" CHECK ("paciente"."dni" is null or "paciente"."dni" ~ '^[0-9]+$'),
	CONSTRAINT "paciente_notas_largo" CHECK (char_length("paciente"."notas_administrativas") <= 500)
);
--> statement-breakpoint
CREATE TABLE "prestacion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"duracion_minutos" integer NOT NULL,
	"requiere_sillon" boolean DEFAULT true NOT NULL,
	"reservable_online" boolean DEFAULT true NOT NULL,
	"activa" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "prestacion_tenant_id_id_unico" UNIQUE("tenant_id","id"),
	CONSTRAINT "prestacion_duracion_valida" CHECK ("prestacion"."duracion_minutos" between 5 and 480)
);
--> statement-breakpoint
CREATE TABLE "prestacion_profesional" (
	"tenant_id" uuid NOT NULL,
	"prestacion_id" uuid NOT NULL,
	"profesional_id" uuid NOT NULL,
	CONSTRAINT "prestacion_profesional_pk" PRIMARY KEY("prestacion_id","profesional_id")
);
--> statement-breakpoint
CREATE TABLE "profesional" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"especialidad" text,
	"user_id" uuid,
	"activo" boolean DEFAULT true NOT NULL,
	"visible_online" boolean DEFAULT true NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profesional_tenant_id_id_unico" UNIQUE("tenant_id","id")
);
--> statement-breakpoint
CREATE TABLE "sillon" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sillon_tenant_id_id_unico" UNIQUE("tenant_id","id")
);
--> statement-breakpoint
CREATE TABLE "turno" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"paciente_id" uuid NOT NULL,
	"profesional_id" uuid NOT NULL,
	"sillon_id" uuid,
	"prestacion_id" uuid NOT NULL,
	"rango" "tstzrange" NOT NULL,
	"estado" "estado_turno" DEFAULT 'reservado' NOT NULL,
	"origen" "origen_turno" NOT NULL,
	"cancelado_en" timestamp with time zone,
	"cancelado_por" "cancelado_por",
	"motivo_cancelacion" text,
	"email_contacto" text,
	"requiere_verificacion" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "turno_rango_valido" CHECK (not isempty("turno"."rango") and lower_inc("turno"."rango") and not upper_inc("turno"."rango") and not lower_inf("turno"."rango") and not upper_inf("turno"."rango")),
	CONSTRAINT "turno_cancelacion_coherente" CHECK (("turno"."estado" in ('cancelado', 'cancelado_tarde')) = ("turno"."cancelado_en" is not null and "turno"."cancelado_por" is not null))
);
--> statement-breakpoint
ALTER TABLE "paciente" ADD CONSTRAINT "paciente_tenant_id_consultorio_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."consultorio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prestacion" ADD CONSTRAINT "prestacion_tenant_id_consultorio_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."consultorio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prestacion_profesional" ADD CONSTRAINT "prestacion_profesional_tenant_id_consultorio_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."consultorio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prestacion_profesional" ADD CONSTRAINT "prestacion_profesional_prestacion_fk" FOREIGN KEY ("tenant_id","prestacion_id") REFERENCES "public"."prestacion"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prestacion_profesional" ADD CONSTRAINT "prestacion_profesional_profesional_fk" FOREIGN KEY ("tenant_id","profesional_id") REFERENCES "public"."profesional"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profesional" ADD CONSTRAINT "profesional_tenant_id_consultorio_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."consultorio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sillon" ADD CONSTRAINT "sillon_tenant_id_consultorio_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."consultorio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turno" ADD CONSTRAINT "turno_tenant_id_consultorio_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."consultorio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turno" ADD CONSTRAINT "turno_paciente_fk" FOREIGN KEY ("tenant_id","paciente_id") REFERENCES "public"."paciente"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turno" ADD CONSTRAINT "turno_profesional_fk" FOREIGN KEY ("tenant_id","profesional_id") REFERENCES "public"."profesional"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turno" ADD CONSTRAINT "turno_sillon_fk" FOREIGN KEY ("tenant_id","sillon_id") REFERENCES "public"."sillon"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turno" ADD CONSTRAINT "turno_prestacion_fk" FOREIGN KEY ("tenant_id","prestacion_id") REFERENCES "public"."prestacion"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "paciente_tenant_dni_unico" ON "paciente" USING btree ("tenant_id","dni") WHERE "paciente"."dni" is not null;--> statement-breakpoint
CREATE INDEX "turno_tenant_profesional_rango_idx" ON "turno" USING btree ("tenant_id","profesional_id","rango");--> statement-breakpoint
CREATE INDEX "turno_tenant_paciente_idx" ON "turno" USING btree ("tenant_id","paciente_id");--> statement-breakpoint
CREATE INDEX "turno_tenant_estado_rango_idx" ON "turno" USING btree ("tenant_id","estado","rango");