# Informe de mercado — Sistemas odontológicos de gestión de turnos y agenda

---

## Portada

| Campo | Valor |
|---|---|
| **Título** | Investigación de mercado: sistemas odontológicos de gestión de turnos y agenda (Argentina, Latinoamérica e internacional) |
| **Materia** | Metodología I — Tecnicatura Universitaria en Programación |
| **Trabajo** | Trabajo de Integración: del Discovery al primer Change, con Spec-Driven Development y Active Stack |
| **Integrantes** | Laciar Yanela · Llerena Romina · Soloa María de los Ángeles · Urbani Constanza |
| **Proyecto** | turnos-odontologia |
| **Fecha del informe** | 25/11/2026 |
| **Fecha de consulta de fuentes** | 24/11/2026 (relevamiento) y 25/11/2026 (verificación manual de cinco fuentes) |
| **Versión** | 1.2 |
| **Elaborado por** | Integrantes del grupo, con asistencia de un agente de IA (Active Stack, skill `discovery-research`) |
| **Revisado por** | Llerena Romina |
| **Documento relacionado** | `docs/discovery/discovery.md` |

**Historial de versiones**

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 24/11/2026 | Informe generado por el agente a partir de los sitios oficiales. |
| 1.1 | 25/11/2026 | Verificación manual de cinco fuentes. Se cambiaron por error los planes y precios de Dentia (se registraron los de Dentalink). |
| 1.2 | 25/11/2026 | Se revisó otra vez dentia.tech y se restauraron sus planes y precios; se incorporó el plan gratuito de Bilog; se agregó la fuente y la fecha a cada fila de la tabla A; "NE" pasó a "No evidenciado" y se alinearon los criterios con la distinción entre funcionalidad comprobada y afirmación comercial. |

---

## Resumen ejecutivo

Se relevaron **19 sistemas**: 13 con oferta explícita para Argentina, 3 latinoamericanos sin presencia argentina evidenciada y 3 internacionales de referencia. La evidencia proviene exclusivamente de sitios oficiales consultados el 24/11/2026; cinco de ellos se verificaron manualmente el 25/11/2026. Ningún sistema se probó mediante demo. Se distingue entre **funcionalidad comprobada** (la muestra el producto o su documentación oficial con detalle concreto) y **afirmación comercial** (lo dice el proveedor sin demostrarlo, marcada como _[afirmación comercial]_).

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
- **Fecha de consulta:** 24/11/2026 para todas las fuentes. Cinco de ellas se volvieron a abrir el 25/11/2026 en la verificación manual (ver "Verificación de fuentes"). La tabla A.1 indica la fuente principal y la fecha de cada sistema.
- **Criterio de evidencia:**
  - **✔ Comprobada:** el producto, su documentación oficial (sitio, precios, centro de ayuda) o un video oficial la muestran con detalle concreto. Es una comprobación documental, no de uso: ningún sistema se probó.
  - **◐ Parcial o condicionado:** la funcionalidad aparece de forma incompleta, solo en un plan superior, como adicional pago, de forma manual o con información contradictoria.
  - **No evidenciado:** no aparece en las páginas leídas. **No implica que el producto carezca de la funcionalidad.**
  - **✘ Excluido:** el proveedor declara expresamente que no la ofrece.
  - **N/A:** no aplica al mercado argentino (por ejemplo, facturación SAT de México).
  - _[afirmación comercial]_: el proveedor lo afirma sin demostrarlo (eslogan o cifra sin detalle verificable). No cuenta como funcionalidad comprobada.
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

| # | Sistema | Proveedor | Origen | Segmento | Modalidad | Precios publicados | Prueba / plan gratuito | Adopción declarada | Fuente oficial y fecha de consulta |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Dentalink** | Engenis SpA | Chile (con sitio para Argentina) | Consultorios y clínicas; multicentro | Nube; acceso web y móvil | No publicados: planes Esencial, Pro y Titanium con cotización (verificado el 25/11/2026). Adicional Contact Center IA: USD 50/mes, promoción para un profesional | No evidenciado | +15.000 clientes, +20 países _[afirmación comercial]_ | https://www.softwaredentalink.com/ar/planes · 25/11/2026 |
| 2 | **Bilog** | Bilog | Argentina | Consultorios, clínicas, auditoría de obras sociales, facultades | Web, escritorio y app iOS/Android | No evidenciado. Abono mensual sin permanencia; configuración inicial sin costo | ✔ plan gratuito (verificado el 25/11/2026; límites No evidenciado) | +1.500 clínicas y consultorios; +5.000 usuarios _[afirmación comercial]_ | https://bilog.com.ar/ · 25/11/2026 |
| 3 | **DentalSoft** | DentalSoft | Argentina (La Plata y Rosario) | Profesional individual, consultorios y clínicas | Nube | Gratis (50 turnos/mes por 3 meses); Gestión $30.000/mes; Pro $60.000/mes (por profesional, moneda indicada solo con "$") | ✔ plan gratuito y demo sin tarjeta | No evidenciado. Reseñas de Google 5,0 (11), según el propio sitio | https://dentalsoft.com.ar/ · 24/11/2026 |
| 4 | **Dentia** | Dentia | Argentina | Consultorios y clínicas; multisucursal | Web, instalable como app | Básico ARS 20.000/mes; Pro ARS 30.000/mes; Elite ARS 40.000/mes | ✔ prueba de 30 días | +100 clínicas _[afirmación comercial]_ | https://dentia.tech/ · 25/11/2026 |
| 5 | **Oclusar** | No evidenciado | Argentina | Consultorio individual y clínica | Web, enfoque móvil | No evidenciado ("en pesos") | ✔ "empezás gratis, sin tarjeta" (límites No evidenciado) | No evidenciado | https://www.oclusar.com.ar/ · 25/11/2026 |
| 6 | **ZYRA** | ZYRA Clinical Management | Argentina | Consultorios y clínicas | Nube (SaaS) | Starter ARS 15.000/mes (50 pacientes); Profesional ARS 29.000/mes; Premium ARS 39.000/mes | ✔ prueba de 30 días | +15 clínicas activas; +2.000 turnos | https://www.appzyra.ar/ · 24/11/2026 |
| 7 | **DentalTec** | Tándem Digital | Argentina (San Juan) | Odontólogos, clínicas, círculos y federaciones, obras sociales | Web | Software: "costo por odontólogo" (valor No evidenciado). Packs de WhatsApp: USD 9 (50 mensajes), USD 25 (150), USD 48 (300) | ◐ "demo gratuita" (condiciones No evidenciado) | 2.000+ profesionales; 30+ instituciones | https://web.dentaltec.com.ar/ · 24/11/2026 |
| 8 | **Odonto.ar** | Odonto.ar | Argentina (Córdoba) | Individual, consultorio, clínica de hasta 10 usuarios | Web (infraestructura Supabase) | Individual USD 29/mes; Profesional USD 49/mes; Clínica USD 99/mes (pago en ARS) | ✔ prueba de 30 días sin tarjeta | No evidenciado | https://odonto.ar/ · 24/11/2026 |
| 9 | **VecDent** | Vectora | No evidenciado (dominio .ar, precios en ARS) | Independientes a redes de consultorios | Web | Básico ARS 30.000/mes; Profesional ARS 50.000/mes; Premium ARS 80.000/mes | ◐ demo en vivo con datos de ejemplo | No evidenciado | https://vectora.ar/pages/vecdent/ · 24/11/2026 |
| 10 | **Atiendo** | No evidenciado | Argentina | Consultorios chicos y medianos, multiespecialidad | Web | Por profesional, en ARS (valor no legible); usuarios de secretaría sin costo | ✔ prueba de 30 días sin tarjeta | No evidenciado | https://atiendoapp.com/ · 24/11/2026 |
| 11 | **Agenda Profesional** | No evidenciado | Argentina | Profesionales de la salud y consultorios | Web | No evidenciado. Comisión posible sobre señas con Mercado Pago | No evidenciado (alta no pública) | No evidenciado | https://www.agenda-profesional.com/ · 24/11/2026 |
| 12 | **Doctoralia Pro (Argentina)** | Doctoralia Internet S.L. (grupo con presencia en 13 países) | Internacional, con oferta para Argentina | Especialistas de la salud con consulta privada | Nube y app | Starter ARS 25.000/mes; Plus ARS 35.000/mes; VIP ARS 55.000/mes (facturación anual); sitio web profesional +ARS 4.000/mes | ◐ "versión gratuita" sin detalle | Calificación 4,8 en Capterra/GetApp, según el propio sitio | https://pro.doctoralia.com/ar/precio · 24/11/2026 |
| 13 | **Reservo** | No evidenciado | No evidenciado (dominio .cl, sitio para Argentina) | Consultorios médicos (no específico odontológico en lo leído) | No evidenciado | No evidenciado | ◐ "asesoría gratis" | +4.000 clientes en 15 países _[afirmación comercial]_ | https://reservo.cl/ar/ · 24/11/2026 |
| 14 | **OdontoGRAMA** | Solsoftware (Julio Santolo) | No evidenciado (dominio .com.ar) | Consultorio | Nube _[afirmación comercial]_ | No evidenciado | ◐ "acceda a todas las funciones gratis" (condiciones No evidenciado) | No evidenciado | https://odontograma.com.ar/ · 24/11/2026 |
| 15 | **Doctocliq** | Doctocliq | No evidenciado (opera en Latinoamérica; Argentina No evidenciado) | Independientes y clínicas dentales, estéticas y médicas | Nube y apps iOS/Android | Gratis USD 0; Individual USD 19/mes; Básico USD 29/mes; Avanzado USD 49/mes | ✔ plan gratuito; prueba de 7 días | +6.500 profesionales | https://www.doctocliq.com/planes-y-precios · 24/11/2026 |
| 16 | **MR Dental Cloud** | MR Desarrollos Inteligentes | México | Dentistas, clínicas y grupos | Nube, app instalable, modo sin conexión | Básico MXN 750/mes; Premium MXN 950/mes | ◐ prueba de 30 o 7 días (inconsistente) | +100 clínicas _[afirmación comercial]_ | https://www.mrdentalcloud.com/precios · 24/11/2026 |
| 17 | **Clinicorp** | Clinicorp | Brasil | Consultorios, clínicas, franquicias | Web y apps | Standard BRL 159,90/mes; Premium BRL 369,90/mes; Combo IA BRL 468,90/mes; implementación BRL 149,90–299 | No evidenciado (demo) | +32.000 clínicas en Brasil _[afirmación comercial]_ | https://www.clinicorp.com/planos · 24/11/2026 |
| 18 | **Clinic Cloud** | Doctoralia España SL | España | Consultorios, clínicas, franquicias | Nube | Mini EUR 29/mes; Pro EUR 49/mes; Max EUR 79/mes (más IVA) | ✔ prueba sin tarjeta | +12.000 doctores | https://clinic-cloud.com/tarifas · 24/11/2026 |
| 19 | **Dentally** | Henry Schein One UK Ltd | Reino Unido | Odontología: independientes a grupos multisede | Nube | Desde GBP 134/mes (Starter) hasta GBP 1.021/mes (Pro), según sillones, sin IVA | No evidenciado | No evidenciado (casos con nombre) | https://www.dentally.com/en-gb/pricing · 24/11/2026 |

### A.2 Agenda, turnos digitales y automatización

| # | Sistema | Vistas y múltiples profesionales | Sillones / boxes | Prevención de solapamientos | Reserva online del paciente | WhatsApp | Recordatorios y confirmación | Lista de espera | Otras automatizaciones |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Dentalink | Múltiples profesionales ✔; vistas No evidenciado | No evidenciado | No evidenciado | ✔ | ◐ Contact Center IA (adicional) que da, confirma y reprograma turnos | ✔ WhatsApp | No evidenciado | ◐ campañas y tareas automáticas (plan Titanium) |
| 2 | Bilog | ✔ día, semana y por profesional; sobreturnos ✔ | ◐ "múltiples consultorios" | No evidenciado | ✔ link o QR; chatbot iAngela | ◐ alta desde WhatsApp; recordatorios | ✔ WhatsApp, SMS y email | No evidenciado | ◐ reprogramación de ausentes con aviso |
| 3 | DentalSoft | ✔ día, semana y mes; arrastrar y soltar; multisucursal | No evidenciado | ✔ detección automática | ✔ 24/7 desde web propia; identificación por DNI | ◐ automático solo en Pro (en Gestión es manual); recepcionista IA (Pro) | ✔ WhatsApp y email; la agenda se actualiza con la respuesta | No evidenciado | ◐ campañas de recuperación, cobro de deudas y reseñas (Pro) |
| 4 | Dentia | Múltiples profesionales ✔; sobreturnos ✔; vistas No evidenciado | No evidenciado | No evidenciado | ◐ vía asistente IA en WhatsApp (plan Elite) | ✔ asistente IA 24/7 | ✔ email (Básico) o WhatsApp (Pro) | No evidenciado | ✔ recaptación, controles, cumpleaños, reseñas (Elite) |
| 5 | Oclusar | ◐ vista del día; equipo con roles | ✔ asignación de sillones | ✔ aviso automático | ✔ página propia; link por WhatsApp e Instagram | ◐ recordatorio manual "con un toque" | ◐ el paciente confirma desde el celular | No evidenciado | No evidenciado |
| 6 | ZYRA | ◐ "agenda/calendario completo" | No evidenciado | No evidenciado | No evidenciado | ✔ vinculación del número propio por QR (no se indica API oficial) | ✔ WhatsApp automático (día anterior) y email; confirmación SÍ/NO | No evidenciado | ◐ módulo de fidelización (sin detalle) |
| 7 | DentalTec | ✔ por odontólogo, con intervalos configurables | No evidenciado | No evidenciado | No evidenciado | ✔ "integración oficial" (sin precisar si es API) | ✔ WhatsApp al crear el turno; confirmación | No evidenciado | No evidenciado. Reducción de 40 % del ausentismo _[afirmación comercial]_ |
| 8 | Odonto.ar | ✔ día, semana y mes; duración por motivo | No evidenciado | No evidenciado | ✔ link con reglas de anticipación y cancelación | No evidenciado | No evidenciado | No evidenciado | No evidenciado |
| 9 | VecDent | ◐ semanal por profesional | No evidenciado | No evidenciado | ◐ portal del paciente | No evidenciado | No evidenciado | No evidenciado | ◐ "CRM" (sin detalle) |
| 10 | Atiendo | ◐ agenda del día; bloqueos ✔ | No evidenciado | No evidenciado | ✔ 24 h, link o QR, sin crear cuenta | ◐ aviso manual; recordatorio "próximamente" | ✔ email (reserva, reprogramación, cancelación) | ✔ con cobertura automática de cancelaciones | No evidenciado |
| 11 | Agenda Profesional | ✔ día y semana; excepciones | ◐ pestaña "Box" en captura | No evidenciado | ✔ página pública por profesional | ◐ botones que abren WhatsApp | ✔ email | ✔ | No evidenciado |
| 12 | Doctoralia Pro | ◐ duración configurable; bloqueos | No evidenciado | No evidenciado | ✔ 24/7, directorio de pacientes, web, Google y redes | ◐ inconsistente entre páginas | ✔ email, push y SMS | ◐ solo plan VIP | ◐ campañas por SMS y email |
| 13 | Reservo | No evidenciado | No evidenciado | No evidenciado | ◐ "turnero online" mencionado | No evidenciado | No evidenciado | No evidenciado | No evidenciado |
| 14 | OdontoGRAMA | ◐ "agendas personalizables con control de asistencia" | No evidenciado | No evidenciado | No evidenciado | No evidenciado | No evidenciado | No evidenciado | No evidenciado |
| 15 | Doctocliq | ✔ por consultorio y doctor | ◐ "por consultorio" | No evidenciado | ✔ en todos los planes | ✔ Soyla IA (adicional) | ✔ WhatsApp y email | No evidenciado | ◐ campañas (adicional) |
| 16 | MR Dental Cloud | Profesionales ilimitados ✔ | No evidenciado | No evidenciado | ◐ vía chatbot de WhatsApp (Premium) | ✔ chatbot IA | ✔ WhatsApp, SMS y email; confirmación en un toque | No evidenciado | ◐ reagendamiento automático |
| 17 | Clinicorp | ◐ "múltiples agendamientos" | No evidenciado | No evidenciado | ✔ con Google Business | ✔ agentes IA (paquete adicional) | ✔ WhatsApp, SMS, email y app | No evidenciado | ✔ alerta de retorno, agente de faltas, CRM |
| 18 | Clinic Cloud | ✔ multiprofesional y multisede | ✔ salas y boxes | No evidenciado | ✔ vía Doctoralia | ✔ recordatorios | ✔ WhatsApp, SMS y email | No evidenciado | ✔ campañas por SMS y email |
| 19 | Dentally | ✔ multisede; duración configurable | ✔ precio por sillón | No evidenciado | ✔ portal (link, QR o web) | No evidenciado | ✔ (canal No evidenciado) | ✔ y relleno de huecos de último momento | ✔ informes de recall |

### A.3 Gestión odontológica clínica y administración

| # | Sistema | Historia clínica | Odontograma | Periodontograma | Imágenes / RX | Presupuestos / plan de tratamiento | Caja y cobros | Facturación ARCA | Mercado Pago | Obras sociales / prepagas | Liquidaciones y reportes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Dentalink | ✔ y consentimientos | ✔ | ✔ | ✔ (RX con IA, adicional) | ✔ / ◐ "próximamente" | ✔ | No evidenciado | No evidenciado | ✔ | ✔ comisiones y reportes |
| 2 | Bilog | ✔ y consentimientos con firma | ✔ | No evidenciado | ✔ fotos, videos y PDF | ✔ / No evidenciado | ◐ pagos | ◐ facturación electrónica mencionada | No evidenciado | ✔ | ✔ obras sociales y honorarios |
| 3 | DentalSoft | ✔ | ✔ FDI, 18 estados | No evidenciado | ✔ 5–10 GB | ✔ / ✔ | ✔ | No evidenciado | ✔ señas y links de pago | ✔ | ✔ comisiones y KPIs |
| 4 | Dentia | ✔ configurable | ✔ por voz | ✔ | ✔ RX y cefalometría con IA | ✔ / ✔ | ✔ | ✔ A, B, C y notas | ✔ | ✔ | ✔ |
| 5 | Oclusar | ✔ evoluciones inalterables | ✔ | No evidenciado | No evidenciado | ✔ / No evidenciado | ✔ | ✔ | ✔ señas | ◐ presentaciones | No evidenciado |
| 6 | ZYRA | ✔ | ✔ adultos y niños | No evidenciado | ✔ | ✔ PDF / No evidenciado | ✔ (desde Profesional) | ✔ (Premium) | No evidenciado | ✔ aranceles | ✔ honorarios (PDF) |
| 7 | DentalTec | ✔ | ✔ con CIE-10 | No evidenciado | ✔ adjuntos | No evidenciado | No evidenciado | ✔ | No evidenciado | ✔ validación en línea | ✔ a prestadores; PDF y Excel |
| 8 | Odonto.ar | ✔ | ✔ con registro de cambios | No evidenciado | ✔ | ✔ / ✔ | ◐ panel de finanzas | No evidenciado | No evidenciado (solo para la suscripción) | ✔ cálculo de cobertura | No evidenciado |
| 9 | VecDent | ✔ | ✔ por voz | ✔ 6 puntos | ◐ RX con IA, sin detalle | ✔ / No evidenciado | No evidenciado | No evidenciado | No evidenciado | ✔ | ✔ (Premium) |
| 10 | Atiendo | ✔ 33 plantillas | ✔ FDI | No evidenciado | ✔ | No evidenciado / ✔ | No evidenciado | ✘ declara que no emite | ✔ señas | ✔ con copagos | ◐ estadísticas por obra social |
| 11 | Agenda Profesional | ✔ | ✔ | ✔ | ✔ | ✔ / ◐ | ✔ | No evidenciado | ✔ señas | ✔ | No evidenciado |
| 12 | Doctoralia Pro | ◐ registros médicos (planes pagos) | No evidenciado | No evidenciado | ◐ documentos | No evidenciado | No evidenciado | No evidenciado | No evidenciado | No evidenciado | ◐ informes |
| 13 | Reservo | ◐ "ficha clínica" | No evidenciado | No evidenciado | No evidenciado | No evidenciado | No evidenciado | ◐ mencionada | ◐ mencionado | No evidenciado | No evidenciado |
| 14 | OdontoGRAMA | ◐ ficha con imágenes | No evidenciado | No evidenciado | ◐ | No evidenciado | ✔ caja y cuentas corrientes | No evidenciado | No evidenciado | ✔ facturación a obras sociales | ✔ estadísticas |
| 15 | Doctocliq | ✔ y anamnesis | ✔ | ✔ | ✔ 1–20 GB | ✔ por fases | ◐ información contradictoria | No evidenciado | No evidenciado | No evidenciado | ✔ comisiones |
| 16 | MR Dental Cloud | ✔ NOM-004 | ✔ 2D y 3D | No evidenciado | ✔ | No evidenciado | No evidenciado | N/A (SAT México) | No evidenciado | No evidenciado | No evidenciado |
| 17 | Clinicorp | ✔ y anamnesis | ✔ | No evidenciado | ✔ integraciones de radiología | ✔ / ✔ | ✔ | N/A (Brasil) | No evidenciado | ◐ reportes de convenios | ✔ comisiones |
| 18 | Clinic Cloud | ✔ | ◐ plan Max | ◐ | No evidenciado | ✔ / No evidenciado | ✔ | N/A (España) | No evidenciado | ◐ mutuas | ✔ |
| 19 | Dentally | ✔ | ✔ | No evidenciado | ✔ con IA | ✔ / ✔ | ◐ pagos vía terceros | N/A | No evidenciado | N/A (NHS) | ✔ |

### A.4 Integraciones, operación, seguridad y cumplimiento

| # | Sistema | Google Calendar | API pública | Roles y auditoría | Exportación de datos | Sucursales | Seguridad y normativa declaradas |
|---|---|---|---|---|---|---|---|
| 1 | Dentalink | No evidenciado | ✔ adicional | Roles ✔; auditoría No evidenciado | ✔ | ✔ (Pro) | ISO 27001, AWS, cifrado, respaldos diarios, HIPAA. Ley 25.326: No evidenciado |
| 2 | Bilog | ◐ "calendario" | ✘ sin API documentada | Roles ✔; ◐ trazabilidad en auditoría de obras sociales | No evidenciado | ✔ | Ley 25.506 (firma). Ley 25.326 y respaldos: No evidenciado |
| 3 | DentalSoft | ✔ por profesional | No evidenciado | Roles ✔; registros de actividad ✔ | ✔ e importación desde Excel/CSV | ✔ | **Ley 25.326 y AAIP**; TLS; hash; base aislada por clínica |
| 4 | Dentia | ✔ | No evidenciado | 17 perfiles ✔; auditoría ✔; 2FA ✔ | ✔ | ✔ | **Ley 25.326**. Respaldos: No evidenciado |
| 5 | Oclusar | ✔ bidireccional | No evidenciado | Roles ✔; correcciones con fecha y autor ✔ | ✔ completa, con imágenes | No evidenciado | **Leyes 26.529, 25.326 y 25.506; Decreto 1089/2012**; SHA-256; copias diarias |
| 6 | ZYRA | No evidenciado | No evidenciado | Permisos granulares ✔; auditoría No evidenciado | No evidenciado | No evidenciado | "Datos encriptados y respaldados" _[afirmación comercial]_ |
| 7 | DentalTec | No evidenciado | No evidenciado | 10 roles ✔; auditoría ✔ | ◐ reportes en PDF y Excel | ◐ multientidad | JWT, bcrypt, respaldo automático. Ley 25.326: No evidenciado |
| 8 | Odonto.ar | No evidenciado | No evidenciado | Permisos ✔; ◐ auditoría del odontograma | No evidenciado | No evidenciado | **Ley 25.326 y AAIP**; cifrado en tránsito y en reposo; RLS. Datos posiblemente fuera de Argentina |
| 9 | VecDent | No evidenciado | No evidenciado | Roles ✔ | No evidenciado | ✔ multiconsultorio | "Permisos por usuario" _[afirmación comercial]_ |
| 10 | Atiendo | ✔ | No evidenciado | Roles ✔; registro de accesos a la historia clínica ✔ | ✔ PDF y al dar de baja | No evidenciado | Cifrado, copias diarias, datos separados por consultorio. Política de privacidad no legible |
| 11 | Agenda Profesional | ◐ solo enlaces, sin sincronización | No evidenciado | ◐ cuentas de equipo | No evidenciado | No evidenciado | **Leyes 25.326 y 26.529**; contraseñas cifradas. Respaldo a cargo del profesional |
| 12 | Doctoralia Pro | ◐ Google Business | No evidenciado | No evidenciado | No evidenciado | ◐ varias direcciones | RGPD, AWS. Ley 25.326: No evidenciado |
| 13 | Reservo | No evidenciado | No evidenciado | No evidenciado | No evidenciado | No evidenciado | No evidenciado |
| 14 | OdontoGRAMA | No evidenciado | No evidenciado | No evidenciado | No evidenciado | No evidenciado | "Olvídese de los backups" _[afirmación comercial]_ |
| 15 | Doctocliq | ◐ importación | ◐ adicional | Roles por módulo ✔ | ◐ al cancelar (15 días) | ◐ adicional | "Normativa local" genérica |
| 16 | MR Dental Cloud | No evidenciado | ✔ REST y HL7 FHIR | Roles ✔; auditoría inmutable ✔ | ✔ PDF y JSON | ✔ | NOM-004/024, LFPDPPP, GDPR; AES-256; respaldos diarios (México) |
| 17 | Clinicorp | No evidenciado | No evidenciado | Roles ✔ | No evidenciado | ✔ | LGPD (Brasil); prontuario cifrado |
| 18 | Clinic Cloud | No evidenciado | No evidenciado | Permisos ✔; 2FA ✔ | No evidenciado | ✔ | RGPD; insignia ISO 27001 |
| 19 | Dentally | No evidenciado | ◐ Developer Hub (no leído) | 5 roles ✔; registro de auditoría ✔; 2FA; restricción por IP | No evidenciado | ✔ | AWS UE, BCrypt, TLS, respaldos (Reino Unido/UE) |

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
| 15 | Doctocliq | Plan gratuito; precios en USD; odontograma y periodontograma en todos los planes | Argentina no figura entre sus mercados; facturación local No evidenciado | Agente IA de WhatsApp (Soyla) |
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
- **Tratamiento de "No evidenciado":** un dato "No evidenciado" se puntúa como ausencia (criterio conservador). La puntuación mide **la evidencia pública disponible**, no la capacidad real del producto. Un sistema con poca documentación pública (Reservo, OdontoGRAMA, VecDent) puede estar subvaluado, y eso debe corregirse en las demos.
- **Integraciones de otros países:** las integraciones que no aplican a Argentina (SAT, NFS-e, NHS, Verifactu) no suman en el criterio "Integraciones locales y WhatsApp".
- **Afirmaciones comerciales:** las afirmaciones sin detalle no suman.
- **Ajuste por la verificación manual (v1.2):** Bilog pasa de 2 a 3 en "Precio y facilidad de adopción" por el plan gratuito confirmado el 25/11/2026 (total 3,45 → 3,50; conserva el puesto 8). El resto de las notas no cambia.
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
| 8 | Bilog | 4 | 4 | 3 | 4 | 3 | 2 | 3 | **3,50** |
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

El 25/11/2026 se volvieron a abrir cinco fuentes oficiales, una por sistema y de distinto tipo (inicio con precios, página de planes, política de privacidad), elegidas por su impacto en las conclusiones. Se registra solo lo que se pudo observar en cada página. Comprobar una característica en el sitio no equivale a haber probado el sistema.

| # | Sistema · tipo de fuente | URL revisada | Qué afirmaba el informe | Qué se encontró | Resultado | Qué se corrigió |
|---|---|---|---|---|---|---|
| 1 | Dentia · inicio con precios | https://dentia.tech/ | Planes Básico, Pro y Elite a ARS 20.000, 30.000 y 40.000 por mes; prueba de 30 días. | La página publica Básico ($20.000/mes), Pro ($30.000/mes) y Elite ($40.000/mes), con precio anual aparte, 30 días gratis y sin contratos. | **Confirmado** (en la segunda revisión) | En la v1.1 se registró por error que Dentia ofrecía planes Esencial, Pro y Titanium a cotizar, que son los datos de Dentalink (fila 5). Al volver a abrir la página se detectó la confusión y se restauraron los datos originales en el resumen, en A.1, en A.5 y en D.1. |
| 2 | DentalSoft · política de privacidad | https://www.dentalsoft.com.ar/privacidad | Mención de la Ley 25.326 y de la AAIP; detección de solapamientos en la agenda. | La política declara que protege los datos personales y menciona expresamente el cumplimiento de la Ley 25.326. | **Confirmado parcialmente** | La mención de la AAIP y la detección de solapamientos no se comprobaron en esta página; quedan como dato del relevamiento inicial, sin validación manual. |
| 3 | Oclusar · inicio | https://www.oclusar.com.ar/ | Asignación de sillones con aviso de solapamiento; leyes 26.529 y 25.326. | Reserva online por enlace compartido por WhatsApp o Instagram, turnos que ingresan a la agenda, aviso de superposición, recordatorios por WhatsApp, señas con Mercado Pago, historia clínica y odontograma. | **Confirmado** para las funciones descritas | La asignación específica de sillones no se pudo comprobar en esta revisión: se mantiene como dato del relevamiento inicial, no como dato verificado. |
| 4 | Bilog · inicio | https://bilog.com.ar/ | Más de 1.500 clínicas; precios no publicados; sin plan gratuito evidenciado. | Plan gratuito; agenda, historia clínica, recordatorios, turnos online, alta por QR y app móvil; funciones para clínicas. Declara más de 1.500 clínicas y consultorios. No muestra precios. | **Diferente** (plan gratuito) | Se agregó el plan gratuito en A.1 y se subió de 2 a 3 la nota de "Precio y facilidad de adopción" (matriz B). La cifra de 1.500 clínicas se marcó como afirmación comercial. |
| 5 | Dentalink · página de planes | https://www.softwaredentalink.com/ar/planes | Precios no publicados. | Planes Esencial, Pro y Titanium; cada uno pide solicitar una cotización. No se muestran precios. | **Confirmado** | Se agregaron los nombres de los planes en A.1. |

Las cinco verificaciones las hizo Llerena Romina el 25/11/2026. La de Dentia se repitió ese mismo día.

**Hallazgo principal de la verificación:** el dato de Dentia del relevamiento inicial era correcto; el error apareció en la v1.1, durante la revisión, al cruzarse las páginas de planes de dos proveedores distintos. Por eso cada corrección se contrasta con la fuente antes de reemplazar un dato.

**Alcance:** esta verificación cubre cinco fuentes y los datos consignados arriba. El resto de la tabla comparativa se apoya en las referencias del relevamiento y no en pruebas personales. Cuando un dato no aparece en la página revisada se consigna como "No evidenciado", nunca se completa por suposición.

---

## Referencias completas

Las fuentes se consultaron el **24/11/2026**. Las cinco fuentes de la sección "Verificación de fuentes" se revisaron otra vez el **25/11/2026**.

### Fuentes oficiales leídas (evidencia)

| Sistema | URL | Fecha de consulta | Observación |
|---|---|---|---|
| Dentalink | https://www.softwaredentalink.com/ar | 24/11/2026 | Inicio para Argentina |
| Dentalink | https://www.softwaredentalink.com/ar/planes | 24/11/2026 y 25/11/2026 (verificación manual) | Planes (sin precios) |
| Bilog | https://bilog.com.ar/ | 24/11/2026 y 25/11/2026 (verificación manual) | Inicio |
| Bilog | https://bilog.com.ar/llms.txt | 24/11/2026 | Descripción oficial para asistentes |
| DentalSoft | https://dentalsoft.com.ar/ | 24/11/2026 | Inicio y precios |
| DentalSoft | https://www.dentalsoft.com.ar/privacidad | 24/11/2026 y 25/11/2026 (verificación manual) | Política de privacidad |
| Odonto.ar | https://odonto.ar/ | 24/11/2026 | Inicio y precios |
| Odonto.ar | https://odonto.ar/privacidad | 24/11/2026 | Política de privacidad |
| Oclusar | https://www.oclusar.com.ar/ | 24/11/2026 y 25/11/2026 (verificación manual) | Inicio |
| Oclusar | https://www.oclusar.com.ar/guias | 24/11/2026 | Guías |
| OdontoGRAMA | https://odontograma.com.ar/ | 24/11/2026 | Página única |
| Dentia | https://dentia.tech/ | 24/11/2026 y 25/11/2026 (verificación manual) | Inicio y precios |
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

Benty, DentalCore, Dentiqa, NacarOS, NexaDental y Odontosist. Aparecieron en las búsquedas, pero quedaron fuera por menor relevancia para Argentina o por falta de oferta local evidenciada. Pueden incorporarse en una versión posterior del informe.
