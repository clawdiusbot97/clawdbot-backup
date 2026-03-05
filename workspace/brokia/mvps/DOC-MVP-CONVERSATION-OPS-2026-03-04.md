# Brokia — Conversation Operations Platform (v1)

## 1. Resumen ejecutivo (5–8 líneas)
Brokia propone una **Conversation Operations Platform** para empresas que acuerdan condiciones operativas con clientes por mensajería. En la práctica, decisiones como precio, cobertura, excepciones o cambios quedan “perdidas” en chats de WhatsApp y luego se traducen en errores, retrabajo y disputas. El producto convierte fragmentos conversacionales en **decisiones estructuradas**, **versionadas** y **auditables** con evidencia (mensajes, audios transcritos y referencias). Con un enfoque **copiloto / human-in-the-loop**, el sistema ayuda al corredor a capturar datos, reducir ambigüedad, y disparar **workflows** configurables una vez confirmada una decisión (tareas, emails, tickets). El primer vertical para validar (por urgencia y repetición del dolor) son **corredores de seguros automotores que operan por WhatsApp**. El MVP se construye en 6 meses con foco en WhatsApp y 2–3 flujos de alto impacto.

## 2. Problema (sistémico) y por qué duele hoy
El problema no es “falta de un canal” (WhatsApp ya existe), sino la ausencia de una capa de **gobernanza operacional de decisiones**:

- **Las conversaciones son el sistema operativo real**, pero no tienen: estructura de datos, control de versiones, ni trazabilidad explícita de decisiones.
- **Las decisiones son incrementales y cambiantes**: lo acordado hoy se ajusta mañana (“cambiemos deducible”, “agregá conductor”, “cubrime desde tal fecha”), y el estado vigente queda implícito.
- **La evidencia existe, pero no es utilizable**: está fragmentada en mensajes y audios. Cuando hay disputa o auditoría interna, reconstruir “qué quedó acordado” consume tiempo y es vulnerable a sesgos.
- **No hay disparadores confiables para operar**: aunque el corredor “lea” el chat, no hay un evento estructurado que cree una tarea, pida datos faltantes, marque SLA, o deje registro de aprobación.

Por qué duele hoy (impacto medible):
- Retrabajo por datos faltantes o contradictorios.
- Errores de emisión/cambio (endosos) por interpretar mal el chat.
- Demoras por falta de seguimiento (SLA informal).
- Disputas con clientes (“yo te pedí X”, “yo entendí Y”).
- Pérdida de continuidad cuando cambia la persona que atiende.

## 3. Propuesta de valor (en lenguaje de negocio, no técnico)
Brokia ayuda a un corredor a **no perder acuerdos**, mantener **control de cambios**, y **automatizar tareas** desde conversaciones.

En concreto:
- **Captura automática de solicitudes y acuerdos** desde WhatsApp (incluyendo audios transcritos).
- **Unifica lo acordado en una vista clara**: qué cambió, qué está vigente y desde cuándo.
- **Reduce errores y reclamos** porque cada decisión relevante queda registrada con evidencia.
- **Acelera la operación**: cuando una decisión se confirma, Brokia dispara tareas y recordatorios (sin depender de memoria o planillas).

Brokia no reemplaza al corredor: lo vuelve **más consistente** y **menos vulnerable** a ambigüedad y multitarea.

## 4. Público objetivo (vertical inicial seguros + expansión horizontal)
**Vertical inicial (validación):**
- Corredores de **seguros automotores** que operan principalmente por WhatsApp.
- Equipos chicos (1–10 personas) con alto volumen de conversaciones y cambios.
- Dolor típico: endosos/cambios frecuentes, renovaciones, siniestros, seguimiento.

**Expansión horizontal (misma arquitectura):**
- Logística (cambios de ventana/condiciones/recargos).
- Servicios profesionales/agencias (cambio de alcance/fechas/revisiones).
- Construcción (change orders, materiales, cronograma).
- Ventas B2B (términos, SLAs, excepciones).
- Freelancers (alcance/fees/revisiones).

## 5. Diferenciación vs:

### CRM con WhatsApp (Kommo/otros)
- Un CRM organiza contactos, pipeline y mensajes; Brokia organiza **decisiones y cambios** como objetos versionados.
- El foco no es “gestionar relación” sino **gobernar acuerdos operativos**: estado vigente + evidencia + control de cambios.
- Brokia puede integrarse con un CRM luego; no compite por ser el “registro de clientes”, compite por ser el “registro de lo acordado”.

### Chatbots
- Un chatbot intenta conversar y resolver; Brokia interviene en **momentos críticos de decisión**.
- No busca automatizar toda la conversación; prioriza **precisión** y **human review**.
- La IA no “decide”: propone estructura y detecta riesgos; el humano valida.

### Firma electrónica/contract tools
- La firma electrónica formaliza contratos; Brokia formaliza **cambios operativos cotidianos** que rara vez pasan por firma.
- El valor está en el **cambio incremental** (lo que en la práctica genera conflictos), no en el documento final.
- Puede complementar herramientas legales, pero no depende de ellas para generar valor.

## 6. MVP propuesto (1 solo, coherente)
**MVP v1: _EndosoOps_ — Motor de cambios gobernados por WhatsApp (con Decision Store versionado + Workflows)**

Objetivo del MVP: convertir conversaciones de WhatsApp en **Change Requests (CR)** versionados y auditables para 3 tipos de flujo en seguros, y disparar workflows tras confirmación.

### 6.1 Flujos cubiertos en seguros (2–3 escenarios máximo)
**Escenario A — Endoso / cambio de cobertura (alto impacto y frecuente)**
- Cliente solicita cambio: cobertura, deducible, conductor adicional, uso del vehículo, etc.
- Brokia detecta “solicitud de cambio”, extrae campos y crea un CR versionado.
- Brokia identifica información faltante y propone una pregunta mínima.
- Tras confirmación, dispara workflow: tarea “solicitar endoso” + recordatorio SLA + plantilla de email a aseguradora.

**Escenario B — Renovación con condiciones (evitar malentendidos en vigencia/precio)**
- Cliente confirma renovación pero introduce cambios: fecha, forma de pago, límites.
- Brokia crea una “Decisión de renovación” con versión vigente y evidencia.
- Tras confirmación, dispara workflow: tarea de renovación + check de pago + recordatorio.

**Escenario C — Siniestro: registro de acuerdos y próximos pasos (sin automatizar liquidación)**
- Cliente reporta siniestro y se acuerdan acciones: documentación, plazos, taller, franquicia.
- Brokia estructura “plan de acción” como decisiones con checklist y evidencia.
- Dispara workflow: tareas internas + mensajes de recordatorio al cliente.

> Nota: el MVP no pretende “resolver el siniestro”; pretende **reducir ambigüedad** y asegurar seguimiento consistente.

### 6.2 Qué queda fuera del MVP
- Multicanal completo (Slack/Teams/email como fuentes primarias quedan post-MVP).
- Integraciones profundas con aseguradoras (API bidireccional). En MVP: plantillas y tareas.
- Cotizador multi-aseguradora.
- Firma electrónica y generación de contratos.
- “Chatbot de atención” generalista.
- Automatización sin revisión humana para decisiones materiales.

## 7. Cómo funciona (experiencia de usuario)

### Interacción en WhatsApp
- El cliente conversa normalmente (texto y audio).
- Audios: Brokia transcribe y conserva referencias de evidencia (timestamp/segmento).
- Cuando aparece una solicitud o acuerdo relevante, Brokia **no interrumpe** con un bot genérico. En su lugar:
  - crea internamente un CR/Decisión,
  - y si faltan datos, sugiere al corredor una pregunta puntual para enviar.

**Confirmaciones (principio):**
- No se usa el patrón “resumen + ACEPTO” como producto central.
- La confirmación se implementa como **cierre de campos críticos**: si hay ambigüedad o falta un dato material, se pide confirmación mínima (“confirmame fecha exacta”, “DNI del conductor”, “franquicia 20.000, ¿ok?”).

### UI web mínima del corredor (inbox + decisiones + diff + evidencia)
La UI es una consola simple con 4 vistas:
1) **Inbox de items detectados** (candidatos a decisión/CR) con prioridad.
2) **Vista de CR/Decisión** con:
   - campos estructurados,
   - **diff** entre versión vigente y propuesta,
   - estado (draft / needs_info / confirmed / issued),
   - evidencia (links a mensajes + transcripción de audio con referencia).
3) **Timeline/auditoría** (quién, cuándo, qué cambió).
4) **Workflows**: configuración mínima por tipo de evento (confirmado/emitido/vencido).

## 8. Arquitectura propuesta (nivel implementable)

### Ingestión
- **WhatsApp Cloud API (WABA)** como canal del MVP.
- Webhooks para eventos de mensajes entrantes/salientes.
- Persistencia de:
  - message metadata (id, sender, timestamp),
  - payload texto,
  - audio (si aplica) + estado de transcripción.

### Event bus
- Bus simple (ej. Postgres outbox + worker, o Redis streams) con eventos:
  - `message.received`
  - `audio.transcription.completed`
  - `decision.candidate.detected`
  - `cr.created`
  - `cr.needs_info`
  - `cr.confirmed`
  - `cr.issued`
  - `cr.overdue`

### Decision detection (IA + reglas)
- **Reglas determinísticas** para señales fuertes (montos, fechas, palabras clave, “cambiemos”, “confirmo”).
- **IA** para:
  - clasificar tipo de intención (endoso/renovación/siniestro),
  - extraer campos y normalizarlos,
  - detectar ambigüedad (“viernes”, “más cobertura”, “lo de siempre”).
- Output: propuesta estructurada + score de confianza + lista de campos faltantes.

### Decision ledger/versionado (determinístico)
- Modelo “append-only” para versiones:
  - `Decision` (o `ChangeRequest`) como entidad raíz.
  - `DecisionVersion` con snapshot de campos.
  - `EvidenceLink` a mensajes/audios.
- Diff calculado determinísticamente entre versiones.
- Regla de “materialidad” configurable por tipo (ej: cambia precio/cobertura/fecha → material).

### Workflow engine (configurable)
- Reglas simples: `WHEN <event> AND <conditions> THEN <actions>`.
- Acciones en MVP:
  - crear tarea interna (en UI),
  - enviar email con plantilla,
  - crear ticket en Jira (ejemplo de conector),
  - recordatorios por WhatsApp (mensajes salientes pre-armados).

### Conectores (email/jira como ejemplo)
- Email: SMTP/API (solo envío de plantillas con campos).
- Jira: creación de issue con payload estructurado.
- Diseño extensible: interfaz de “connector action” para sumar Slack/Teams luego.

## 9. IA y agentes: dónde sí y dónde no

**Dónde sí (IA con retorno claro):**
- Transcripción de audios (ASR) + segmentación.
- Clasificación de intención (endoso/renovación/siniestro).
- Extracción de campos (monto, fecha, cobertura, deducible, datos de conductor) y normalización.
- Detección de contradicciones y ambigüedades (alertas para revisión humana).
- Sugerencia de “pregunta mínima” para completar datos faltantes.

**Dónde no (para evitar hype y riesgo):**
- No usar IA para “decidir” aprobación.
- No usar IA para persistencia/versionado/auditoría (debe ser determinístico).
- No automatizar cambios materiales sin confirmación humana.
- No intentar “conversación general” estilo bot.

**Agentes (en sentido de tareas acotadas):**
- Un agente interno puede ejecutar: “revisar candidatos”, “armar plantilla”, “verificar checklist”, siempre con salida a una cola de revisión.

## 10. Métricas para validar (tesis + negocio)

**Tesis (eficacia del enfoque):**
- Reducción de retrabajo atribuible a malentendidos (baseline vs piloto).
- Tiempo de ciclo: solicitud → confirmado → emitido (endoso/renovación).
- % de casos con evidencia completa (mensajes + campos críticos).

**Producto (calidad del sistema):**
- Precisión del detector de CRs (priorizar precision > recall en MVP).
- % de CRs que requieren edición “pesada” del corredor.
- Tasa de campos faltantes detectados correctamente.

**Negocio (señales de SaaS):**
- Activación: # CRs creados/confirmados en primeros 7 días.
- Retención: uso sostenido semana 4–8.
- WTP: disposición a pagar por asiento/mes o por volumen de CRs.

## 11. Roadmap post-MVP (fases)

**Fase 2 — Multicanal (Slack/Teams) como fuentes**
- Ingestión de Teams/Slack para acuerdos internos/externos.
- Mismo motor de decisiones + versionado.

**Fase 3 — Integraciones operativas**
- Más conectores: HubSpot/CRM, Google Drive, sistemas internos.
- Templates por industria y “políticas de materialidad” preconfiguradas.

**Fase 4 — Automatización avanzada (con límites)**
- Enrutamiento automático de casos simples.
- Detección proactiva de riesgo (contradicciones, SLA incumplido).
- Controles de compliance y retención de datos por mercado.

**Ejemplo de expansión (Teams/Jira — software B2B):**
- Un equipo acuerda por Teams: “entregamos el martes, incluye soporte 2 semanas, no incluye migración”.
- Brokia detecta decisión, crea objeto versionado, y al confirmarse dispara: ticket en Jira + tarea en backlog + email de confirmación al cliente.

## 12. Riesgos y mitigaciones (técnicos, adopción, posicionamiento)

**Riesgos técnicos**
- *WhatsApp/WABA:* límites y complejidad de onboarding.
  - Mitigación: elegir proveedor o Cloud API early; piloto con 1–2 cuentas.
- *IA con ambigüedad:* falsos positivos/negativos.
  - Mitigación: human-in-the-loop + thresholds + foco en precision + tipos de flujo acotados.
- *Audios:* calidad de transcripción variable.
  - Mitigación: pedir post-call recap por WhatsApp en llamadas; conservar evidencia por timestamps.

**Riesgos de adopción**
- *Fricción percibida:* “otra herramienta más”.
  - Mitigación: UI mínima + valor inmediato (menos olvidos, menos retrabajo), no pedir que cambien de canal.
- *Disciplina de uso:* si no se revisa inbox, no hay valor.
  - Mitigación: alertas, SLA y cola priorizada; métricas visibles.

**Riesgos de posicionamiento**
- *Confusión con CRM/chatbot:* mercado saturado.
  - Mitigación: mensaje claro: “control de cambios + no perder acuerdos + automatización desde conversaciones”.
- *Expectativas legales:* “esto reemplaza un contrato”.
  - Mitigación: posicionar como trazabilidad operacional y evidencia, no como asesoría legal.

---

## Ejemplos concretos (mini-historias)

### Historia 1 (seguros — endoso)
El cliente escribe por WhatsApp: “subime a todo riesgo con franquicia 20k desde el viernes y agregá a mi hijo”. Brokia crea un CR con campos extraídos, marca que “viernes” es ambiguo y falta DNI del conductor. El corredor valida y envía una pregunta mínima. Al responder el cliente, el CR pasa a confirmado y Brokia crea la tarea “Solicitar endoso” con SLA 24h y genera la plantilla de email a la aseguradora con los datos estructurados. Queda el diff (antes/ahora) y la evidencia enlazada.

### Historia 2 (seguros — siniestro)
Tras un choque, por WhatsApp se acuerda: “llevalo al taller X”, “presentá denuncia hoy”, “franquicia 15k”. Brokia detecta decisiones y arma un checklist con plazos. Dispara recordatorios al corredor y al cliente (mensajes pre-armados) y registra evidencia. El corredor mantiene control del caso sin perder acuerdos en el chat.

### Historia 3 (expansión — Teams/Jira en software)
Un proveedor acuerda por Teams con un cliente: “release el martes, incluye hotfix 2 semanas; migración fuera de alcance”. Brokia crea una decisión versionada y, al confirmarse, dispara un ticket en Jira con el alcance y exclusiones, reduciendo discusiones posteriores por “malentendido”.

---

## Pitch 30s (español)
Brokia evita que los acuerdos por WhatsApp se pierdan en el chat. Detecta decisiones relevantes (cambios, renovaciones, compromisos), las convierte en un registro claro y versionado con evidencia, y cuando se confirman dispara tareas y recordatorios. No es un chatbot ni un CRM: es control de cambios y automatización desde conversaciones, pensado para corredores de seguros que viven de coordinar por WhatsApp.

## Pitch 2min (español)
Hoy muchas empresas —y especialmente los corredores de seguros— toman decisiones críticas con clientes por WhatsApp: coberturas, deducibles, renovaciones, excepciones, acuerdos en siniestros. El problema es sistémico: esas decisiones quedan como texto no gobernado, sin versión vigente, sin evidencia ordenada, y sin disparar procesos operativos. Eso genera errores, retrabajo, demoras y conflictos.

Brokia es una Conversation Operations Platform: convierte conversaciones en decisiones estructuradas, versionadas y auditables, con un enfoque de copiloto. La IA ayuda a detectar solicitudes y extraer datos, pero el corredor valida: human-in-the-loop. En el MVP nos enfocamos en WhatsApp y en tres flujos de alto impacto: endosos/cambios, renovaciones con condiciones y siniestros como plan de acción. Cuando una decisión se confirma, Brokia dispara workflows simples: crea tareas, envía plantillas, genera tickets y marca SLAs.

El valor es inmediato: menos acuerdos perdidos, control de cambios, mejor seguimiento y evidencia en caso de disputa. Y la arquitectura es horizontal: lo mismo aplica a logística, construcción o servicios profesionales. Primero validamos en seguros automotores, donde el dolor es repetitivo y medible, y luego expandimos a otros canales y conectores.
