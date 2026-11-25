# Informe de mercado — Sistemas odontológicos de gestión de turnos y agenda

---

## Portada

| Campo | Valor |
|---|---|
| **Título** | Investigación de mercado: sistemas odontológicos de gestión de turnos y agenda (Argentina, Latinoamérica e internacional) |
| **Proyecto** | turnos-odontologia |
| **Fecha de consulta de fuentes** | 24/11/2026 |
| **Versión** | 1.0 (borrador para revisión) |
| **Elaborado por** | _(completar)_ |
| **Revisado por** | _(completar tras la verificación manual de fuentes)_ |
| **Documento relacionado** | `docs/discovery/discovery.md` |

---

## Resumen ejecutivo

> _Borrador. Puede reemplazarse o ajustarse luego de la revisión manual._

Se relevaron **19 sistemas**: 13 con oferta explícita para Argentina, 3 latinoamericanos sin presencia argentina evidenciada y 3 internacionales de referencia. La evidencia proviene exclusivamente de sitios oficiales consultados el 24/11/2026. Ningún sistema fue probado mediante demo, por lo que **todas las funcionalidades consignadas son declaraciones del proveedor**: se distingue entre declaraciones con detalle funcional y afirmaciones comerciales sin sustento (marcadas como _[afirmación comercial]_).

Hallazgos principales:

1. **El mercado argentino está saturado en el segmento "gestión clínica integral".** Historia clínica, odontograma, obras sociales y presupuestos aparecen en casi todos los productos locales. Competir por amplitud clínica no es una estrategia viable para un producto nuevo.
2. **WhatsApp es un estándar de facto, no un diferencial.** 14 de los 19 sistemas mencionan WhatsApp y 10 evidencian recordatorios o atención automatizada por ese canal; varios ya ofrecen asistentes de IA que agendan por ese canal (Dentia, Dentalink, Doctocliq, MR Dental Cloud, Clinicorp). El MVP definido en Discovery, que usa solo email, quedará por debajo del estándar local en este punto.
3. **La facturación ARCA (ex AFIP) y Mercado Pago son expectativas locales.** Dentia, Oclusar, ZYRA y DentalTec declaran ARCA; DentalSoft, Dentia, Oclusar, Atiendo y Agenda Profesional declaran Mercado Pago (señas o cobros).
4. **Vacíos detectados:** casi ningún proveedor evidencia **prevención de solapamientos combinando profesional y sillón/box** (solo Oclusar declara asignación de sillones con aviso de solapamiento; Clinic Cloud y Dentally gestionan salas/sillones fuera de Argentina). **Ningún proveedor evidencia una política automática de ausentismo configurable** (bloqueo de reserva tras N ausencias). La **adecuación normativa argentina** (Ley 25.326 y Ley 26.529) está declarada públicamente solo por una minoría (DentalSoft, Odonto.ar, Oclusar, Agenda Profesional, Dentia).
5. **Precios publicados en Argentina:** entre **ARS 15.000 y ARS 80.000 por mes** según plan (ZYRA, Dentia, DentalSoft, VecDent, Doctoralia), con planes gratuitos o pruebas de 30 días como práctica habitual.

**Recomendación central:** posicionar el producto como **"agenda odontológica sin solapamientos y con control de ausentismo"**, con cumplimiento normativo visible y precio transparente, en lugar de competir como suite clínica. Se recomienda reconsiderar la incorporación temprana de recordatorios por WhatsApp (segunda etapa inmediata tras el MVP), dado que es el canal esperado por el mercado.

---

## Metodología y alcance

- **Búsqueda:** búsquedas web abiertas (Argentina, Latinoamérica e internacional) para identificar candidatos, seguidas de lectura directa de los sitios oficiales de cada proveedor (inicio, funcionalidades, precios, preguntas frecuentes, políticas de privacidad y seguridad cuando estaban disponibles). Los blogs comparativos de terceros se usaron **solo para identificar candidatos**, nunca como evidencia de funcionalidades.
- **Fecha de consulta:** 24/11/2026 para todas las fuentes.
- **Criterio de evidencia:**
  - **✔ Declarado:** el sitio oficial describe la funcionalidad con detalle concreto. Sigue siendo una declaración del proveedor, no una comprobación por uso.
  - **◐ Parcial o condicionado:** la funcionalidad aparece de forma incompleta, solo en un plan superior, como adicional pago, de forma manual o con información contradictoria.
  - **NE — No evidenciado:** no aparece en las páginas leídas. **No implica que el producto carezca de la funcionalidad.**
  - **✘ Excluido:** el proveedor declara expresamente que no la ofrece.
  - **N/A:** no aplica al mercado argentino (por ejemplo, facturación SAT de México).
  - _[afirmación comercial]_: eslogan o cifra sin detalle verificable.
- **Limitaciones:**
  - No se realizaron demos ni pruebas de uso.
  - Las cifras de adopción son autodeclaradas.
  - No se verificaron reseñas en plataformas independientes.
  - Algunas páginas cargan su contenido con JavaScript y se leyeron con navegador (ZYRA, Reservo). Reservo y OdontoGRAMA ofrecieron muy poca información legible.
  - Varias promociones vigentes en noviembre de 2026 (Black Friday) no reflejan el precio regular.

---

## A. Tabla comparativa de sistemas

Ordenados por relevancia para el mercado argentino: oferta local explícita, especialización odontológica, adecuación a integraciones locales y escala declarada.

### A.1 Identificación y modelo comercial

| # | Sistema | Proveedor | Origen | Segmento | Modalidad | Precios publicados | Prueba / plan gratuito | Adopción declarada |
|---|---|---|---|---|---|---|---|---|
| 1 | **Dentalink** | Engenis SpA | Chile (con sitio para Argentina) | Consultorios y clínicas; multicentro | Nube; acceso web y móvil | NE (solo cotización). Adicional Contact Center IA: USD 50/mes, promoción para un profesional | NE | +15.000 clientes, +20 países _[afirmación comercial]_ |
| 2 | **Bilog** | Bilog | Argentina | Consultorios, clínicas, auditoría de obras sociales, facultades | Web, escritorio y app iOS/Android | NE. Abono mensual sin permanencia; configuración inicial sin costo | NE (demo) | +1.500 clínicas y consultorios; +5.000 usuarios |
| 3 | **DentalSoft** | DentalSoft | Argentina (La Plata y Rosario) | Profesional individual, consultorios y clínicas | Nube | Gratis (50 turnos/mes por 3 meses); Gestión $30.000/mes; Pro $60.000/mes (por profesional, moneda indicada solo con "$") | ✔ plan gratuito y demo sin tarjeta | NE. Reseñas de Google 5,0 (11), según el propio sitio |
| 4 | **Dentia** | Dentia | Argentina | Consultorios y clínicas; multisucursal | Web, instalable como app | Básico ARS 20.000/mes; Pro ARS 30.000/mes; Elite ARS 40.000/mes | ✔ prueba de 30 días | +100 clínicas _[afirmación comercial]_ |
| 5 | **Oclusar** | NE | Argentina | Consultorio individual y clínica | Web, enfoque móvil | NE ("en pesos") | ✔ "empezás gratis, sin tarjeta" (límites NE) | NE |
| 6 | **ZYRA** | ZYRA Clinical Management | Argentina | Consultorios y clínicas | Nube (SaaS) | Starter ARS 15.000/mes (50 pacientes); Profesional ARS 29.000/mes; Premium ARS 39.000/mes | ✔ prueba de 30 días | +15 clínicas activas; +2.000 turnos |
| 7 | **DentalTec** | Tándem Digital | Argentina (San Juan) | Odontólogos, clínicas, círculos y federaciones, obras sociales | Web | Software: "costo por odontólogo" (valor NE). Packs de WhatsApp: USD 9 (50 mensajes), USD 25 (150), USD 48 (300) | ◐ "demo gratuita" (condiciones NE) | 2.000+ profesionales; 30+ instituciones |
| 8 | **Odonto.ar** | Odonto.ar | Argentina (Córdoba) | Individual, consultorio, clínica de hasta 10 usuarios | Web (infraestructura Supabase) | Individual USD 29/mes; Profesional USD 49/mes; Clínica USD 99/mes (pago en ARS) | ✔ prueba de 30 días sin tarjeta | NE |
| 9 | **VecDent** | Vectora | NE (dominio .ar, precios en ARS) | Independientes a redes de consultorios | Web | Básico ARS 30.000/mes; Profesional ARS 50.000/mes; Premium ARS 80.000/mes | ◐ demo en vivo con datos de ejemplo | NE |
| 10 | **Atiendo** | NE | Argentina | Consultorios chicos y medianos, multiespecialidad | Web | Por profesional, en ARS (valor no legible); usuarios de secretaría sin costo | ✔ prueba de 30 días sin tarjeta | NE |
| 11 | **Agenda Profesional** | NE | Argentina | Profesionales de la salud y consultorios | Web | NE. Comisión posible sobre señas con Mercado Pago | NE (alta no pública) | NE |
| 12 | **Doctoralia Pro (Argentina)** | Doctoralia Internet S.L. (grupo con presencia en 13 países) | Internacional, con oferta para Argentina | Especialistas de la salud con consulta privada | Nube y app | Starter ARS 25.000/mes; Plus ARS 35.000/mes; VIP ARS 55.000/mes (facturación anual); sitio web profesional +ARS 4.000/mes | ◐ "versión gratuita" sin detalle | Calificación 4,8 en Capterra/GetApp, según el propio sitio |
| 13 | **Reservo** | NE | NE (dominio .cl, sitio para Argentina) | Consultorios médicos (no específico odontológico en lo leído) | NE | NE | ◐ "asesoría gratis" | +4.000 clientes en 15 países _[afirmación comercial]_ |
| 14 | **OdontoGRAMA** | Solsoftware (Julio Santolo) | NE (dominio .com.ar) | Consultorio | Nube _[afirmación comercial]_ | NE | ◐ "acceda a todas las funciones gratis" (condiciones NE) | NE |
| 15 | **Doctocliq** | Doctocliq | NE (opera en Latinoamérica; Argentina NE) | Independientes y clínicas dentales, estéticas y médicas | Nube y apps iOS/Android | Gratis USD 0; Individual USD 19/mes; Básico USD 29/mes; Avanzado USD 49/mes | ✔ plan gratuito; prueba de 7 días | +6.500 profesionales |
| 16 | **MR Dental Cloud** | MR Desarrollos Inteligentes | México | Dentistas, clínicas y grupos | Nube, app instalable, modo sin conexión | Básico MXN 750/mes; Premium MXN 950/mes | ◐ prueba de 30 o 7 días (inconsistente) | +100 clínicas _[afirmación comercial]_ |
| 17 | **Clinicorp** | Clinicorp | Brasil | Consultorios, clínicas, franquicias | Web y apps | Standard BRL 159,90/mes; Premium BRL 369,90/mes; Combo IA BRL 468,90/mes; implementación BRL 149,90–299 | NE (demo) | +32.000 clínicas en Brasil _[afirmación comercial]_ |
| 18 | **Clinic Cloud** | Doctoralia España SL | España | Consultorios, clínicas, franquicias | Nube | Mini EUR 29/mes; Pro EUR 49/mes; Max EUR 79/mes (más IVA) | ✔ prueba sin tarjeta | +12.000 doctores |
| 19 | **Dentally** | Henry Schein One UK Ltd | Reino Unido | Odontología: independientes a grupos multisede | Nube | Desde GBP 134/mes (Starter) hasta GBP 1.021/mes (Pro), según sillones, sin IVA | NE | NE (casos con nombre) |

### A.2 Agenda, turnos digitales y automatización

| # | Sistema | Vistas y múltiples profesionales | Sillones / boxes | Prevención de solapamientos | Reserva online del paciente | WhatsApp | Recordatorios y confirmación | Lista de espera | Otras automatizaciones |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Dentalink | Múltiples profesionales ✔; vistas NE | NE | NE | ✔ | ◐ Contact Center IA (adicional) que da, confirma y reprograma turnos | ✔ WhatsApp | NE | ◐ campañas y tareas automáticas (plan Titanium) |
| 2 | Bilog | ✔ día, semana y por profesional; sobreturnos ✔ | ◐ "múltiples consultorios" | NE | ✔ link o QR; chatbot iAngela | ◐ alta desde WhatsApp; recordatorios | ✔ WhatsApp, SMS y email | NE | ◐ reprogramación de ausentes con aviso |
| 3 | DentalSoft | ✔ día, semana y mes; arrastrar y soltar; multisucursal | NE | ✔ detección automática | ✔ 24/7 desde web propia; identificación por DNI | ◐ automático solo en Pro (en Gestión es manual); recepcionista IA (Pro) | ✔ WhatsApp y email; la agenda se actualiza con la respuesta | NE | ◐ campañas de recuperación, cobro de deudas y reseñas (Pro) |
| 4 | Dentia | Múltiples profesionales ✔; sobreturnos ✔; vistas NE | NE | NE | ◐ vía asistente IA en WhatsApp (plan Elite) | ✔ asistente IA 24/7 | ✔ email (Básico) o WhatsApp (Pro) | NE | ✔ recaptación, controles, cumpleaños, reseñas (Elite) |
| 5 | Oclusar | ◐ vista del día; equipo con roles | ✔ asignación de sillones | ✔ aviso automático | ✔ página propia; link por WhatsApp e Instagram | ◐ recordatorio manual "con un toque" | ◐ el paciente confirma desde el celular | NE | NE |
| 6 | ZYRA | ◐ "agenda/calendario completo" | NE | NE | NE | ✔ vinculación del número propio por QR (no se indica API oficial) | ✔ WhatsApp automático (día anterior) y email; confirmación SÍ/NO | NE | ◐ módulo de fidelización (sin detalle) |
| 7 | DentalTec | ✔ por odontólogo, con intervalos configurables | NE | NE | NE | ✔ "integración oficial" (sin precisar si es API) | ✔ WhatsApp al crear el turno; confirmación | NE | NE. Reducción de 40 % del ausentismo _[afirmación comercial]_ |
| 8 | Odonto.ar | ✔ día, semana y mes; duración por motivo | NE | NE | ✔ link con reglas de anticipación y cancelación | NE | NE | NE | NE |
| 9 | VecDent | ◐ semanal por profesional | NE | NE | ◐ portal del paciente | NE | NE | NE | ◐ "CRM" (sin detalle) |
| 10 | Atiendo | ◐ agenda del día; bloqueos ✔ | NE | NE | ✔ 24 h, link o QR, sin crear cuenta | ◐ aviso manual; recordatorio "próximamente" | ✔ email (reserva, reprogramación, cancelación) | ✔ con cobertura automática de cancelaciones | NE |
| 11 | Agenda Profesional | ✔ día y semana; excepciones | ◐ pestaña "Box" en captura | NE | ✔ página pública por profesional | ◐ botones que abren WhatsApp | ✔ email | ✔ | NE |
| 12 | Doctoralia Pro | ◐ duración configurable; bloqueos | NE | NE | ✔ 24/7, directorio de pacientes, web, Google y redes | ◐ inconsistente entre páginas | ✔ email, push y SMS | ◐ solo plan VIP | ◐ campañas por SMS y email |
| 13 | Reservo | NE | NE | NE | ◐ "turnero online" mencionado | NE | NE | NE | NE |
| 14 | OdontoGRAMA | ◐ "agendas personalizables con control de asistencia" | NE | NE | NE | NE | NE | NE | NE |
| 15 | Doctocliq | ✔ por consultorio y doctor | ◐ "por consultorio" | NE | ✔ en todos los planes | ✔ Soyla IA (adicional) | ✔ WhatsApp y email | NE | ◐ campañas (adicional) |
| 16 | MR Dental Cloud | Profesionales ilimitados ✔ | NE | NE | ◐ vía chatbot de WhatsApp (Premium) | ✔ chatbot IA | ✔ WhatsApp, SMS y email; confirmación en un toque | NE | ◐ reagendamiento automático |
| 17 | Clinicorp | ◐ "múltiples agendamientos" | NE | NE | ✔ con Google Business | ✔ agentes IA (paquete adicional) | ✔ WhatsApp, SMS, email y app | NE | ✔ alerta de retorno, agente de faltas, CRM |
| 18 | Clinic Cloud | ✔ multiprofesional y multisede | ✔ salas y boxes | NE | ✔ vía Doctoralia | ✔ recordatorios | ✔ WhatsApp, SMS y email | NE | ✔ campañas por SMS y email |
| 19 | Dentally | ✔ multisede; duración configurable | ✔ precio por sillón | NE | ✔ portal (link, QR o web) | NE | ✔ (canal NE) | ✔ y relleno de huecos de último momento | ✔ informes de recall |

### A.3 Gestión odontológica clínica y administración

| # | Sistema | Historia clínica | Odontograma | Periodontograma | Imágenes / RX | Presupuestos / plan de tratamiento | Caja y cobros | Facturación ARCA | Mercado Pago | Obras sociales / prepagas | Liquidaciones y reportes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Dentalink | ✔ y consentimientos | ✔ | ✔ | ✔ (RX con IA, adicional) | ✔ / ◐ "próximamente" | ✔ | NE | NE | ✔ | ✔ comisiones y reportes |
| 2 | Bilog | ✔ y consentimientos con firma | ✔ | NE | ✔ fotos, videos y PDF | ✔ / NE | ◐ pagos | ◐ facturación electrónica mencionada | NE | ✔ | ✔ obras sociales y honorarios |
| 3 | DentalSoft | ✔ | ✔ FDI, 18 estados | NE | ✔ 5–10 GB | ✔ / ✔ | ✔ | NE | ✔ señas y links de pago | ✔ | ✔ comisiones y KPIs |
| 4 | Dentia | ✔ configurable | ✔ por voz | ✔ | ✔ RX y cefalometría con IA | ✔ / ✔ | ✔ | ✔ A, B, C y notas | ✔ | ✔ | ✔ |
| 5 | Oclusar | ✔ evoluciones inalterables | ✔ | NE | NE | ✔ / NE | ✔ | ✔ | ✔ señas | ◐ presentaciones | NE |
| 6 | ZYRA | ✔ | ✔ adultos y niños | NE | ✔ | ✔ PDF / NE | ✔ (desde Profesional) | ✔ (Premium) | NE | ✔ aranceles | ✔ honorarios (PDF) |
| 7 | DentalTec | ✔ | ✔ con CIE-10 | NE | ✔ adjuntos | NE | NE | ✔ | NE | ✔ validación en línea | ✔ a prestadores; PDF y Excel |
| 8 | Odonto.ar | ✔ | ✔ con registro de cambios | NE | ✔ | ✔ / ✔ | ◐ panel de finanzas | NE | NE (solo para la suscripción) | ✔ cálculo de cobertura | NE |
| 9 | VecDent | ✔ | ✔ por voz | ✔ 6 puntos | ◐ RX con IA, sin detalle | ✔ / NE | NE | NE | NE | ✔ | ✔ (Premium) |
| 10 | Atiendo | ✔ 33 plantillas | ✔ FDI | NE | ✔ | NE / ✔ | NE | ✘ declara que no emite | ✔ señas | ✔ con copagos | ◐ estadísticas por obra social |
| 11 | Agenda Profesional | ✔ | ✔ | ✔ | ✔ | ✔ / ◐ | ✔ | NE | ✔ señas | ✔ | NE |
| 12 | Doctoralia Pro | ◐ registros médicos (planes pagos) | NE | NE | ◐ documentos | NE | NE | NE | NE | NE | ◐ informes |
| 13 | Reservo | ◐ "ficha clínica" | NE | NE | NE | NE | NE | ◐ mencionada | ◐ mencionado | NE | NE |
| 14 | OdontoGRAMA | ◐ ficha con imágenes | NE | NE | ◐ | NE | ✔ caja y cuentas corrientes | NE | NE | ✔ facturación a obras sociales | ✔ estadísticas |
| 15 | Doctocliq | ✔ y anamnesis | ✔ | ✔ | ✔ 1–20 GB | ✔ por fases | ◐ información contradictoria | NE | NE | NE | ✔ comisiones |
| 16 | MR Dental Cloud | ✔ NOM-004 | ✔ 2D y 3D | NE | ✔ | NE | NE | N/A (SAT México) | NE | NE | NE |
| 17 | Clinicorp | ✔ y anamnesis | ✔ | NE | ✔ integraciones de radiología | ✔ / ✔ | ✔ | N/A (Brasil) | NE | ◐ reportes de convenios | ✔ comisiones |
| 18 | Clinic Cloud | ✔ | ◐ plan Max | ◐ | NE | ✔ / NE | ✔ | N/A (España) | NE | ◐ mutuas | ✔ |
| 19 | Dentally | ✔ | ✔ | NE | ✔ con IA | ✔ / ✔ | ◐ pagos vía terceros | N/A | NE | N/A (NHS) | ✔ |

### A.4 Integraciones, operación, seguridad y cumplimiento

| # | Sistema | Google Calendar | API pública | Roles y auditoría | Exportación de datos | Sucursales | Seguridad y normativa declaradas |
|---|---|---|---|---|---|---|---|
| 1 | Dentalink | NE | ✔ adicional | Roles ✔; auditoría NE | ✔ | ✔ (Pro) | ISO 27001, AWS, cifrado, respaldos diarios, HIPAA. Ley 25.326: NE |
| 2 | Bilog | ◐ "calendario" | ✘ sin API documentada | Roles ✔; ◐ trazabilidad en auditoría de obras sociales | NE | ✔ | Ley 25.506 (firma). Ley 25.326 y respaldos: NE |
| 3 | DentalSoft | ✔ por profesional | NE | Roles ✔; registros de actividad ✔ | ✔ e importación desde Excel/CSV | ✔ | **Ley 25.326 y AAIP**; TLS; hash; base aislada por clínica |
| 4 | Dentia | ✔ | NE | 17 perfiles ✔; auditoría ✔; 2FA ✔ | ✔ | ✔ | **Ley 25.326**. Respaldos: NE |
| 5 | Oclusar | ✔ bidireccional | NE | Roles ✔; correcciones con fecha y autor ✔ | ✔ completa, con imágenes | NE | **Leyes 26.529, 25.326 y 25.506; Decreto 1089/2012**; SHA-256; copias diarias |
| 6 | ZYRA | NE | NE | Permisos granulares ✔; auditoría NE | NE | NE | "Datos encriptados y respaldados" _[afirmación comercial]_ |
| 7 | DentalTec | NE | NE | 10 roles ✔; auditoría ✔ | ◐ reportes en PDF y Excel | ◐ multientidad | JWT, bcrypt, respaldo automático. Ley 25.326: NE |
| 8 | Odonto.ar | NE | NE | Permisos ✔; ◐ auditoría del odontograma | NE | NE | **Ley 25.326 y AAIP**; cifrado en tránsito y en reposo; RLS. Datos posiblemente fuera de Argentina |
| 9 | VecDent | NE | NE | Roles ✔ | NE | ✔ multiconsultorio | "Permisos por usuario" _[afirmación comercial]_ |
| 10 | Atiendo | ✔ | NE | Roles ✔; registro de accesos a la historia clínica ✔ | ✔ PDF y al dar de baja | NE | Cifrado, copias diarias, datos separados por consultorio. Política de privacidad no legible |
| 11 | Agenda Profesional | ◐ solo enlaces, sin sincronización | NE | ◐ cuentas de equipo | NE | NE | **Leyes 25.326 y 26.529**; contraseñas cifradas. Respaldo a cargo del profesional |
| 12 | Doctoralia Pro | ◐ Google Business | NE | NE | NE | ◐ varias direcciones | RGPD, AWS. Ley 25.326: NE |
| 13 | Reservo | NE | NE | NE | NE | NE | NE |
| 14 | OdontoGRAMA | NE | NE | NE | NE | NE | "Olvídese de los backups" _[afirmación comercial]_ |
| 15 | Doctocliq | ◐ importación | ◐ adicional | Roles por módulo ✔ | ◐ al cancelar (15 días) | ◐ adicional | "Normativa local" genérica |
| 16 | MR Dental Cloud | NE | ✔ REST y HL7 FHIR | Roles ✔; auditoría inmutable ✔ | ✔ PDF y JSON | ✔ | NOM-004/024, LFPDPPP, GDPR; AES-256; respaldos diarios (México) |
| 17 | Clinicorp | NE | NE | Roles ✔ | NE | ✔ | LGPD (Brasil); prontuario cifrado |
| 18 | Clinic Cloud | NE | NE | Permisos ✔; 2FA ✔ | NE | ✔ | RGPD; insignia ISO 27001 |
| 19 | Dentally | NE | ◐ Developer Hub (no leído) | 5 roles ✔; registro de auditoría ✔; 2FA; restricción por IP | NE | ✔ | AWS UE, BCrypt, TLS, respaldos (Reino Unido/UE) |

### A.5 Fortalezas, limitaciones y diferenciales evidentes

| # | Sistema | Fortalezas | Limitaciones | Diferencial evidente |
|---|---|---|---|---|
| 1 | Dentalink | Suite clínica amplia; escala regional declarada; certificación ISO 27001 declarada | Precios no publicados; IA, API, recetas y firma son adicionales; ARCA no evidenciada | Contact Center IA por WhatsApp y llamadas |
| 2 | Bilog | Trayectoria local (+20 años); cobertura de obras sociales y liquidaciones; app móvil | Precios no publicados; poca información de seguridad; sin API pública | Perfiles para auditoría de obras sociales y facultades |
| 3 | DentalSoft | Precios y plan gratuito publicados; prevención de solapamientos; cumplimiento de la Ley 25.326 detallado; web propia incluida | WhatsApp automático solo en Pro; ARCA no evidenciada | Software integrado con sitio web de la clínica y reserva 24/7 |
| 4 | Dentia | La cobertura más completa del relevamiento (clínica, ARCA, Mercado Pago, WhatsApp IA); precios accesibles; prueba de 30 días | Funciones IA clave solo en Elite; detalle de agenda no publicado | Asistente IA que agenda por WhatsApp y cobra seña |
| 5 | Oclusar | Mayor nivel de cumplimiento normativo declarado; historia clínica inalterable; sillones y aviso de solapamiento | Sin precios publicados; recordatorios manuales | Historia clínica con validez legal explicada y red de proveedores (Red Oclusar) |
| 6 | ZYRA | Precios bajos y publicados; ARCA homologada; recordatorios automáticos por WhatsApp | Reserva online del paciente no evidenciada; adopción baja declarada; seguridad sin detalle | Liquidación automática de honorarios y control de stock |
| 7 | DentalTec | Validación de prácticas contra obras sociales en línea; ARCA; integración con círculos odontológicos | Sin reserva online evidenciada; precio no publicado; foco institucional | Validación preventiva de prácticas con obras sociales |
| 8 | Odonto.ar | Precio transparente por usuario; prueba sin tarjeta; política de privacidad detallada | Sin recordatorios, WhatsApp ni ARCA evidenciados | Reserva online con reglas configurables |
| 9 | VecDent | Clínica muy completa (periodontograma, estética, voz); precios publicados | Casi sin información de agenda, integraciones ni seguridad | Odontograma dictado por voz |
| 10 | Atiendo | La experiencia de reserva más cercana al MVP definido (link sin cuenta, lista de espera, seña) | No emite factura; WhatsApp pendiente; multiespecialidad, no solo odontológico | Lista de espera que cubre cancelaciones automáticamente |
| 11 | Agenda Profesional | Cumplimiento explícito de las leyes 25.326 y 26.529; seña con Mercado Pago; lista de espera | Sin precios; alta no pública; sin WhatsApp ni ARCA | Página pública de reserva con seña |
| 12 | Doctoralia Pro | Visibilidad ante pacientes (directorio); reserva 24/7 multicanal; precios en ARS | Sin funciones odontológicas; información de WhatsApp inconsistente | Marketplace de pacientes |
| 13 | Reservo | Oferta explícita con ARCA y Mercado Pago para Argentina | Información pública mínima legible | Escala regional declarada |
| 14 | OdontoGRAMA | Gratuidad declarada | Información funcional mínima | Trayectoria como software de escritorio _[afirmación comercial]_ |
| 15 | Doctocliq | Plan gratuito; precios en USD; odontograma y periodontograma en todos los planes | Argentina no figura entre sus mercados; facturación local NE | Agente IA de WhatsApp (Soyla) |
| 16 | MR Dental Cloud | Documentación de seguridad muy detallada; API y FHIR | Orientado a México | Seguridad y auditoría documentadas |
| 17 | Clinicorp | Automatización de retorno, faltas y cobranza; capacitación incluida | Solo Brasil; costos de implementación | Agentes IA para faltas y cobranza |
| 18 | Clinic Cloud | Integración con Doctoralia; salas y boxes; IA para notas clínicas | Orientado a España | Combinación de marketplace y gestión clínica |
| 19 | Dentally | Portal del paciente; relleno de huecos; seguridad documentada | Solo mercados anglófonos; precio alto | Recall y relleno de cancelaciones de último momento |

---

## B. Matriz de puntuación ponderada

### Nota metodológica

- **Escala por criterio (0 a 5):**
  - **0:** sin evidencia pública.
  - **1:** mención mínima o eslogan.
  - **2:** cobertura básica o parcial.
  - **3:** cobertura funcional razonable, con vacíos relevantes.
  - **4:** cobertura amplia y detallada.
  - **5:** cobertura completa y detallada, o referente del relevamiento.
- **Tratamiento de "No evidenciado":** un NE se puntúa como ausencia (criterio conservador). La puntuación mide **la evidencia pública disponible**, no la capacidad real del producto. Un sistema con poca documentación pública (Reservo, OdontoGRAMA, VecDent) puede estar subvaluado, y eso debe corregirse en las demos.
- **Integraciones de otros países:** las integraciones que no aplican a Argentina (SAT, NFS-e, NHS, Verifactu) no suman en el criterio "Integraciones locales y WhatsApp".
- **Afirmaciones comerciales:** las afirmaciones sin detalle no suman.
- **Puntaje total:** Σ (nota × peso). Los pesos son T 25 %, C 20 %, I 15 %, A 15 %, P 10 %, S 10 % y $ 5 %.

**Referencias de columnas:**
- **T:** Gestión de turnos y automatización (25 %)
- **C:** Funcionalidad odontológica clínica (20 %)
- **I:** Integraciones locales y WhatsApp (15 %)
- **A:** Administración, cobros y facturación (15 %)
- **P:** Experiencia del paciente (10 %)
- **S:** Seguridad, exportación y trazabilidad (10 %)
- **$:** Precio y facilidad de adopción (5 %)

| Ranking | Sistema | T | C | I | A | P | S | $ | **Total (0–5)** |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Dentia | 4 | 5 | 5 | 5 | 4 | 4 | 5 | **4,55** |
| 2 | DentalSoft | 5 | 4 | 4 | 4 | 4 | 4 | 5 | **4,30** |
| 3 | Oclusar | 3 | 4 | 5 | 4 | 4 | 5 | 3 | **3,95** |
| 4 | Atiendo | 4 | 4 | 3 | 3 | 5 | 4 | 4 | **3,80** |
| 5 | Dentalink | 4 | 5 | 3 | 3 | 3 | 4 | 2 | **3,70** |
| 5 | Clinicorp _(referencia, Brasil)_ | 5 | 5 | 1 | 3 | 4 | 3 | 3 | **3,70** |
| 7 | ZYRA | 3 | 4 | 4 | 5 | 2 | 2 | 5 | **3,55** |
| 8 | Bilog | 4 | 4 | 3 | 4 | 3 | 2 | 2 | **3,45** |
| 9 | DentalTec | 3 | 3 | 4 | 5 | 2 | 4 | 2 | **3,40** |
| 10 | Doctocliq | 4 | 5 | 2 | 2 | 3 | 2 | 5 | **3,35** |
| 11 | MR Dental Cloud _(referencia, México)_ | 4 | 4 | 2 | 1 | 3 | 5 | 4 | **3,25** |
| 11 | Dentally _(referencia, Reino Unido)_ | 4 | 4 | 1 | 2 | 4 | 5 | 2 | **3,25** |
| 13 | Agenda Profesional | 3 | 4 | 2 | 3 | 4 | 4 | 1 | **3,15** |
| 14 | Clinic Cloud _(referencia, España)_ | 4 | 3 | 1 | 3 | 3 | 3 | 4 | **3,00** |
| 15 | Odonto.ar | 3 | 4 | 1 | 2 | 3 | 4 | 5 | **2,95** |
| 16 | Doctoralia Pro | 4 | 1 | 2 | 1 | 5 | 2 | 4 | **2,55** |
| 17 | VecDent | 2 | 5 | 0 | 3 | 2 | 1 | 4 | **2,45** |
| 18 | Reservo _(evidencia parcial)_ | 2 | 1 | 3 | 3 | 2 | 0 | 2 | **1,90** |
| 19 | OdontoGRAMA _(evidencia parcial)_ | 1 | 2 | 0 | 3 | 0 | 1 | 4 | **1,40** |

**Lectura crítica:**
- Los primeros puestos se concentran en productos argentinos recientes con documentación pública abundante (Dentia, DentalSoft, Oclusar). Esto refleja tanto amplitud funcional como **transparencia comunicacional**.
- Bilog y Dentalink, con mayor escala declarada, puntúan por debajo de su posición real de mercado porque no publican precios y documentan poco su cumplimiento normativo.
- La prevención de solapamientos es la funcionalidad de agenda peor documentada del relevamiento: solo DentalSoft y Oclusar la evidencian, y solo Oclusar la combina con la asignación de sillones.

---

## C. Análisis competitivo

### C.1 Funcionalidades que ya son estándar de mercado

Presentes en la mayoría de los productos argentinos relevados; un producto nuevo debe tenerlas para no quedar descartado.

- Agenda web para múltiples profesionales, accesible desde el celular.
- Historia clínica digital y **odontograma** (15 de 19 los evidencian).
- Gestión de **obras sociales y prepagas** (11 de 19).
- Presupuestos.
- **Recordatorios automáticos**, con WhatsApp como canal esperado en Argentina.
- Roles y permisos diferenciados (recepción frente a profesional).
- **Prueba gratuita de 30 días o plan gratuito** como mecanismo de captación.
- Precios en pesos con suscripción mensual sin permanencia.

### C.2 Funcionalidades diferenciadoras reales (presentes en pocos)

- **Asistentes de IA que agendan, reprograman y cobran seña por WhatsApp** (Dentia, Dentalink, Doctocliq, MR Dental Cloud, Clinicorp). Es una tendencia en rápida expansión que pronto será estándar.
- **Validación en línea de prácticas contra obras sociales** (DentalTec): ataca los débitos, un dolor económico concreto.
- **Historia clínica inalterable con validez legal explicada** (Oclusar).
- **Lista de espera que cubre cancelaciones automáticamente** (Atiendo, Agenda Profesional, Dentally).
- **Marketplace de pacientes** (Doctoralia): genera demanda, no solo la gestiona.
- **Automatizaciones de retorno y recaptación** (Clinicorp, Dentia, Dentally).

### C.3 Vacíos frecuentes del mercado argentino

1. **Sillón/box como recurso de agenda con doble restricción.** Casi ningún producto local evidencia la gestión de sillones combinada con prevención de solapamientos. Es un problema operativo real para clínicas con más profesionales que sillones.
2. **Política de ausentismo configurable.** Varios registran inasistencias o muestran estadísticas, pero **ninguno evidencia bloqueo de reserva online tras N ausencias** ni separación entre ausencia y cancelación tardía.
3. **Cumplimiento normativo visible.** Solo 5 de 19 citan la Ley 25.326 y solo 2 (Oclusar y Agenda Profesional) citan la Ley 26.529, pese a tratar datos de salud.
4. **Transparencia de precios en los líderes.** Dentalink, Bilog, Oclusar, DentalTec y Agenda Profesional no publican precios.
5. **APIs públicas.** Ningún producto de origen argentino evidencia una API pública documentada (Bilog declara no tenerla).
6. **Identificación del paciente sin cuenta y sin fricción.** Solo DentalSoft (DNI) y Atiendo (sin contraseña) lo hacen explícito.

### C.4 Oportunidades de innovación para un nuevo sistema

- **Motor de agenda con restricción doble (profesional + sillón)** y prestaciones de duración variable que ocupen o no sillón. Encaja exactamente con las reglas del Discovery.
- **Gestión inteligente del ausentismo:** reglas configurables por consultorio (bloqueo tras N ausencias, cancelación tardía separada) y, a futuro, sobrerreserva o lista de espera guiada por el historial del paciente.
- **"Cumplimiento por diseño" como argumento comercial:** consentimiento explícito del paciente, aislamiento por consultorio, auditoría de accesos y política de privacidad pública alineada con las leyes 25.326 y 26.529.
- **Precio transparente y plan gratuito acotado,** con migración simple desde WhatsApp o papel (importación de pacientes y agenda inicial).
- **Reserva sin cuenta por DNI con verificación liviana** (código por email o SMS) para mitigar el riesgo de suplantación detectado en el Discovery.

---

## D. Recomendación final

### D.1 Cinco competidores prioritarios para analizar mediante demo

| Prioridad | Sistema | Motivo |
|---|---|---|
| 1 | **Dentia** | Mejor puntuación del relevamiento; referente de WhatsApp con IA, ARCA y Mercado Pago a precio bajo. Conviene verificar en demo el detalle de agenda (sillones, solapamientos). |
| 2 | **DentalSoft** | Competidor más próximo en agenda (solapamientos, reserva 24/7 por DNI) y en cumplimiento de la Ley 25.326; tiene plan gratuito. |
| 3 | **Dentalink** | Mayor escala declarada en la región; define la expectativa de "suite completa" de clínicas medianas. |
| 4 | **Bilog** | Actor local con mayor base declarada (+1.500 clínicas); referencia de obras sociales y soporte local. |
| 5 | **Oclusar** | Único que evidencia sillones con aviso de solapamiento y el estándar más alto de cumplimiento normativo declarado. |

_Alternativa:_ **Atiendo**, si se busca contrastar con el competidor de alcance más parecido al MVP (centrado en turnos, reserva sin cuenta y lista de espera).

### D.2 Tres productos de referencia para experiencia de usuario

> La evaluación de experiencia se basa en la descripción pública de los flujos; debe validarse en uso.

1. **Atiendo:** flujo de reserva del paciente sin cuenta, link o QR, lista de espera y seña. Es la referencia directa para los autoturnos del MVP.
2. **Dentally (Portal):** portal del paciente con reserva por link, QR o web, formularios digitales y relleno de huecos de último momento. Es la referencia internacional para el ciclo completo del paciente.
3. **Doctoralia Pro:** reserva 24/7 multicanal (perfil, web, Google y redes) y recordatorios con confirmación, cancelación y reprogramación. Es la referencia de captación y reserva a escala.

### D.3 MVP sugerido

**Funcionalidades imprescindibles,** alineadas con `docs/discovery/discovery.md` y con el estándar de mercado:

1. Agenda por profesional y por sillón/box con **prevención de solapamientos en ambos recursos**; vistas diaria y semanal.
2. Prestaciones configurables con duración y opción "sin sillón".
3. Ficha básica del paciente (datos, DNI, obra social o prepaga, notas no clínicas).
4. Autoturnos online sin cuenta, por link, con identificación por DNI dentro de cada consultorio.
5. Emails de confirmación, cancelación (link con token de un solo uso) y recordatorio 24 horas antes.
6. Registro de ausencias y cancelaciones tardías, con bloqueo configurable de reserva online.
7. Multiconsultorio con datos aislados, roles (administrador, recepción, odontólogo) y registro de auditoría de accesos.
8. Política de privacidad y consentimiento del paciente conformes a la Ley 25.326.

**Diferenciadores a comunicar desde el lanzamiento:**
- "Cero solapamientos de profesional y sillón."
- Control de ausentismo configurable, sin equivalente evidenciado en la competencia.
- Cumplimiento normativo explícito y precio público con plan gratuito acotado.

**Funcionalidades para etapas posteriores,** en orden sugerido por presión competitiva:
1. **Recordatorios y confirmación por WhatsApp** (API oficial). Es la primera prioridad posterior, porque se trata de un estándar del mercado argentino.
2. Lista de espera con cobertura automática de cancelaciones.
3. Señas y cobros con Mercado Pago.
4. Historia clínica y odontograma (módulo opcional, con cumplimiento de la Ley 26.529).
5. Facturación electrónica ARCA.
6. Obras sociales y prepagas (coberturas, copagos, liquidaciones).
7. Google Calendar.
8. Asistente con IA por WhatsApp.

**Advertencia estratégica:** un MVP solo con email compite en desventaja frente a productos locales de ARS 15.000–40.000 por mes que ya incluyen WhatsApp. Se recomienda planificar WhatsApp como la etapa inmediatamente posterior al MVP y validar el precio frente al rango relevado (ARS 15.000–80.000 por mes).

---

## Verificación de fuentes

> Tabla para completar en la revisión manual de 5 fuentes. Las filas sugieren qué verificar, elegido por su impacto en las conclusiones; pueden reemplazarse por otras.

| # | Sistema | URL a verificar | Dato a verificar | Fecha de verificación | Resultado (Confirmado / Diferente / No encontrado) | Observaciones | Verificado por |
|---|---|---|---|---|---|---|---|
| 1 | Dentia | https://dentia.tech/ | Precios Básico, Pro y Elite (ARS 20.000, 30.000, 40.000/mes) y ARCA | | | | |
| 2 | DentalSoft | https://www.dentalsoft.com.ar/privacidad | Mención de la Ley 25.326 y AAIP; detección de solapamientos en la agenda | | | | |
| 3 | Oclusar | https://www.oclusar.com.ar/ | Asignación de sillones con aviso de solapamiento; leyes 26.529 y 25.326 | | | | |
| 4 | Bilog | https://bilog.com.ar/ | +1.500 clínicas; ausencia de precios publicados | | | | |
| 5 | Dentalink | https://www.softwaredentalink.com/ar/planes | Precios no publicados; módulos adicionales (Contact Center IA, API) | | | | |

---

## Referencias completas

Todas las fuentes se consultaron el **24/11/2026**.

### Fuentes oficiales leídas (evidencia)

| Sistema | URL | Fecha de consulta | Observación |
|---|---|---|---|
| Dentalink | https://www.softwaredentalink.com/ar | 24/11/2026 | Inicio para Argentina |
| Dentalink | https://www.softwaredentalink.com/ar/planes | 24/11/2026 | Planes (sin precios) |
| Bilog | https://bilog.com.ar/ | 24/11/2026 | Inicio |
| Bilog | https://bilog.com.ar/llms.txt | 24/11/2026 | Descripción oficial para asistentes |
| DentalSoft | https://dentalsoft.com.ar/ | 24/11/2026 | Inicio y precios |
| DentalSoft | https://www.dentalsoft.com.ar/privacidad | 24/11/2026 | Política de privacidad |
| Odonto.ar | https://odonto.ar/ | 24/11/2026 | Inicio y precios |
| Odonto.ar | https://odonto.ar/privacidad | 24/11/2026 | Política de privacidad |
| Oclusar | https://www.oclusar.com.ar/ | 24/11/2026 | Inicio |
| Oclusar | https://www.oclusar.com.ar/guias | 24/11/2026 | Guías |
| OdontoGRAMA | https://odontograma.com.ar/ | 24/11/2026 | Página única |
| Dentia | https://dentia.tech/ | 24/11/2026 | Inicio y precios |
| ZYRA | https://www.appzyra.ar/ | 24/11/2026 | Leído con navegador (contenido cargado con JavaScript) |
| VecDent | https://vectora.ar/pages/vecdent/ | 24/11/2026 | Página de producto y precios |
| DentalTec | https://web.dentaltec.com.ar/ | 24/11/2026 | Inicio |
| DentalTec | https://web.dentaltec.com.ar/preguntas-frecuentes | 24/11/2026 | Preguntas frecuentes |
| DentalTec | https://web.dentaltec.com.ar/funcionalidades | 24/11/2026 | Funcionalidades |
| DentalTec | https://web.dentaltec.com.ar/casos-de-exito | 24/11/2026 | Casos de éxito |
| Atiendo | https://atiendoapp.com/ | 24/11/2026 | Inicio (valores de precio no legibles) |
| Atiendo | https://atiendoapp.com/privacidad | 24/11/2026 | **Sin contenido legible** |
| Agenda Profesional | https://www.agenda-profesional.com/ | 24/11/2026 | Inicio |
| Agenda Profesional | https://www.agenda-profesional.com/privacidad | 24/11/2026 | Política de privacidad |
| Agenda Profesional | https://www.agenda-profesional.com/condiciones | 24/11/2026 | Condiciones |
| Doctoralia Pro | https://pro.doctoralia.com/ar | 24/11/2026 | Inicio para Argentina |
| Doctoralia Pro | https://pro.doctoralia.com/ar/precio | 24/11/2026 | Precios |
| Doctoralia Pro | https://pro.doctoralia.com/ar/agenda-doctoralia-para-especialistas | 24/11/2026 | Agenda |
| Doctoralia Pro | https://pro.doctoralia.com/ar/guias | 24/11/2026 | Solo títulos de guías |
| Reservo | https://reservo.cl/ar/ | 24/11/2026 | Leído con navegador; contenido mínimo |
| Doctocliq | https://www.doctocliq.com/ | 24/11/2026 | Inicio |
| Doctocliq | https://www.doctocliq.com/planes-y-precios | 24/11/2026 | Precios |
| Doctocliq | https://www.doctocliq.com/software-dental | 24/11/2026 | Producto dental |
| MR Dental Cloud | https://www.mrdentalcloud.com/ | 24/11/2026 | Inicio |
| MR Dental Cloud | https://www.mrdentalcloud.com/precios | 24/11/2026 | Precios |
| MR Dental Cloud | https://www.mrdentalcloud.com/security-compliance | 24/11/2026 | Seguridad y cumplimiento |
| Clinicorp | https://www.clinicorp.com/ | 24/11/2026 | Inicio |
| Clinicorp | https://www.clinicorp.com/planos | 24/11/2026 | Planes |
| Clinic Cloud | https://clinic-cloud.com/ | 24/11/2026 | Inicio |
| Clinic Cloud | https://clinic-cloud.com/tarifas | 24/11/2026 | Tarifas |
| Clinic Cloud | https://clinic-cloud.com/agenda | 24/11/2026 | Agenda |
| Clinic Cloud | https://clinic-cloud.com/faq | 24/11/2026 | Índice de ayuda |
| Dentally | https://www.dentally.com/en-gb/ | 24/11/2026 | Inicio |
| Dentally | https://www.dentally.com/en-gb/pricing | 24/11/2026 | Precios |
| Dentally | https://www.dentally.com/en-gb/dental-software-features | 24/11/2026 | Funcionalidades |
| Dentally | https://www.dentally.com/en-gb/security-policy | 24/11/2026 | Seguridad |
| Dentally | https://www.dentally.com/en-gb/product/dentally-portal | 24/11/2026 | Portal del paciente |

### Fuentes que fallaron

| URL | Fecha | Error |
|---|---|---|
| https://pro.doctoralia.com.ar/ | 24/11/2026 | Error de DNS (dominio inexistente); se usó https://pro.doctoralia.com/ar |
| https://www.doctoralia.com.ar/ | 24/11/2026 | Conexión rechazada |
| https://pro.doctoralia.com/ar/precios | 24/11/2026 | HTTP 404; la página vigente es /ar/precio |
| https://reservo.cl/blog/profesionales/dental/guia-para-elegir-el-mejor-software-dental-en-argentina/ | 24/11/2026 | Solo devolvió el título |

### Fuentes secundarias (solo para identificar candidatos, no usadas como evidencia)

| URL | Fecha | Uso |
|---|---|---|
| https://reservo.cl/blog/profesionales/dental/guia-para-elegir-el-mejor-software-dental-en-argentina/ | 24/11/2026 | Blog de un proveedor competidor |
| https://sodi.com.ar/blog/sistema-de-turnos-para-odontologos | 24/11/2026 | Blog comercial; rangos de precio de referencia |
| https://dentalcore.app/blog/mejor-software-dental-argentina | 24/11/2026 | Blog de un proveedor; no relevado |
| https://iasistemas.com/sistema-de-turnos-online | 24/11/2026 | Resultado de búsqueda; no relevado |

### Candidatos identificados y no relevados

Benty, DentalCore, Dentiqa, NacarOS, NexaDental y Odontosist. Aparecieron en las búsquedas, pero quedaron fuera por menor relevancia para Argentina o por falta de oferta local evidenciada. Pueden incorporarse en una versión 1.1 del informe.
