# Preguntas Abiertas

## Inconsistencias detectadas

### IN-01 — Suscripción mensual frente a un MVP sin cobro
**Discovery dice**: modelo de negocio con suscripción mensual por consultorio.
**La KB dice**: el MVP no cobra; el piloto es gratuito y el alta es por script (DD-10).
**Impacto**: si se cobra antes de lo previsto, faltan planes, estados de suscripción y un medio de pago.
**Resolución propuesta**: el `consultorio` ya tiene `estado` (activo/suspendido). Los planes y el cobro (Mercado Pago) se modelan en una etapa posterior.

### IN-02 — "Las prestaciones ocupan sillón" frente a "consulta sin sillón"
**Discovery dice**: las prácticas ocupan siempre profesional y sillón; una consulta breve puede configurarse sin sillón.
**La KB dice**: el flag `requiere_sillon` es por prestación (RN-AG-03).
**Impacto**: ninguno si el consultorio configura bien sus prestaciones.
**Resolución propuesta**: por defecto `true`; advertir al desactivarlo.

### IN-03 — Uso comercial en el plan gratuito de Vercel
**La KB dice**: el hosting es Vercel con costo bajo o nulo.
**Restricción del proveedor**: el plan Hobby de Vercel está pensado para uso personal y no comercial (verificar en sus términos vigentes).
**Impacto**: un SaaS, aunque el piloto sea gratis, es un producto comercial.
**Resolución propuesta**: presupuestar Vercel Pro para producción o evaluar una alternativa (ver PA-01).

## Preguntas abiertas (priorizadas)

| ID | Prioridad | Pregunta | Bloquea | Decisor |
|---|---|---|---|---|
| PA-01 | Alta | ¿Pagamos Vercel Pro para producción o usamos otro hosting compatible con uso comercial (por ejemplo, Netlify, Render o Cloudflare)? | Despliegue a producción | Equipo |
| PA-02 | Alta | ¿Supabase Free alcanza para el piloto? Pausa proyectos tras inactividad y sus backups son limitados. ¿Pasamos a Pro antes de cargar datos reales? | Piloto con datos reales | Equipo |
| PA-03 | Alta | ¿Qué dominio y remitente usan los emails? Hay que verificar el dominio en Resend (SPF y DKIM) para no caer en spam. | Envío de emails en producción | Equipo |
| PA-04 | Alta | Validar con asesoría legal la transferencia internacional de datos de salud (Ley 25.326, art. 12), el texto de consentimiento y el acuerdo de tratamiento de datos entre la plataforma (encargada) y cada consultorio (responsable). | Piloto con datos reales | Producto + asesoría legal |
| PA-05 | Alta | ¿Hace falta inscribir la base de datos ante la AAIP? ¿Quién la inscribe: cada consultorio, la plataforma o ambos? | Piloto con datos reales | Asesoría legal |
| PA-06 | Media | ¿Las ausencias cuentan para siempre o en una ventana de tiempo (por ejemplo, 12 meses)? | US-033 | Producto + piloto |
| PA-07 | Media | ¿Alcanza la marca `requiere_verificacion` para la suplantación por DNI, o se pide un código por email en la primera reserva con un email distinto? | US-050 | Producto |
| PA-08 | Media | ¿Qué anticipación mínima, horizonte y granularidad prefiere el piloto? (SU-03, SU-04) | Configuración por defecto | Piloto |
| PA-09 | Media | ¿Qué criterio de asignación para "cualquier disponible" prefiere el piloto? (SU-05) | RN-RE-04 | Piloto |
| PA-10 | Media | ¿Cómo conseguimos el primer consultorio piloto? | Validación del producto | Producto |
| PA-11 | Media | ¿El email de cancelación tardía debe incluir alguna política del consultorio (por ejemplo, un cargo)? | Plantillas de email | Piloto |
| PA-12 | Baja | ¿Precio, planes y prueba gratuita de la suscripción? Referencia de mercado: ARS 15.000–80.000 por mes. | Etapa de cobro | Producto |
| PA-13 | Baja | ¿Qué proveedor de WhatsApp usamos: Cloud API de Meta directa o un proveedor intermediario? ¿Cuál es el costo por conversación de utilidad en Argentina? | Etapa WhatsApp | Equipo |
| PA-14 | Baja | ¿Se usan las verificaciones de cumplimiento visible (política pública, página de seguridad) como argumento comercial desde el lanzamiento? | Landing | Producto |
| PA-15 | Resuelta | ~~Verificar manualmente las 5 fuentes marcadas en `docs/discovery/informe-discovery.md`.~~ Resuelta el 25/11/2026: ver la sección "Verificación de fuentes" del informe v1.2. | — | Equipo |
| PA-16 | Media | ¿Oclusar asigna sillones a los turnos y qué marco normativo declara? Ninguno de los dos datos se pudo comprobar en la verificación manual (informe, Verificación de fuentes, fila 3). | Demo de competidores (D.1) | Equipo |
| PA-17 | Media | ¿Cómo maneja Dentia las vistas de agenda, los sillones/boxes y la prevención de solapamientos? Figuran como "No evidenciado" en la tabla A.2. | Demo de competidores (D.1) | Equipo |
| PA-18 | Media | ¿DentalSoft menciona la AAIP y detecta solapamientos? Ambos datos quedaron sin validación manual (Verificación de fuentes, fila 2). | Demo de competidores (D.1) | Equipo |
| PA-19 | Media | ¿Algún competidor ofrece una política de ausentismo configurable (bloqueo tras N ausencias)? Ninguno la evidencia públicamente (C.3, punto 2); hay que confirmarlo en las demos antes de comunicarlo como diferencial. | Mensaje de lanzamiento | Producto |
| PA-20 | Baja | ¿Qué límites tiene el plan gratuito de Bilog y cuánto cuestan sus planes pagos? Ambos figuran como "No evidenciado" (A.1). | Definición de precio (PA-12) | Producto |
| PA-21 | Baja | ¿Dentalink factura con ARCA y declara cumplir la Ley 25.326? Ambos figuran como "No evidenciado" (A.3 y A.4). | Demo de competidores (D.1) | Equipo |
