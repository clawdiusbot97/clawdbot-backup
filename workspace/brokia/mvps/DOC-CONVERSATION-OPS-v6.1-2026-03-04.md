# Brokia — MVP Concept (v6.1)

**Idea central (sin cambiarla):** transformar

**Conversation → memoria humana → operación**

en

**Conversation → Decision Objects → Decision Events → Process Execution**

Brokia no intenta “gestionar chats”. Brokia crea un **system of record** para decisiones tomadas en conversaciones y permite ejecutar procesos operativos a partir de esas decisiones.

---

## 1) Problema estructural
Muchas empresas (y en particular corredores de seguros) toman decisiones operativas críticas con clientes por WhatsApp, audios y llamadas. Esas decisiones **son operativas** (tienen consecuencias reales) pero quedan como texto disperso, sin control de cambios, sin evidencia usable y sin disparadores hacia el trabajo.

Esto produce un patrón repetitivo:
- acuerdos incompletos o ambiguos,
- cambios incrementales (“por goteo”) sin versión vigente clara,
- seguimiento manual dependiente de memoria,
- errores y reclamos,
- trazabilidad/compliance reconstruidos tarde y “a mano”.

---

## 2) Conversation vs System of Record
**System of conversation:** donde se conversa y se acuerda (WhatsApp/audios/llamadas). Es rápido, informal y no estructurado.

**System of record:** donde debería quedar el estado vigente de lo acordado (para operar y auditar): campos claros, quién confirmó, cuándo, qué cambió, y cuál es la evidencia.

**Problema raíz:** las decisiones no cruzan de forma confiable desde el system of conversation al system of record. En la práctica, el “puente” hoy es memoria humana + copy/paste + re-carga + seguimiento manual.

---

## 3) Decision Objects (núcleo)
Brokia representa decisiones como **Decision Objects**: entidades estructuradas que capturan “lo acordado” de forma operable.

Ejemplos (genéricos, transferibles):
- **ChangeRequest:** solicitud/cambio sobre algo existente (póliza, condiciones, fechas).
- **Agreement:** acuerdo de condiciones (qué queda vigente).
- **Commitment:** compromiso de una parte (enviar documento, pagar, llamar, entregar).
- **Approval:** aprobación explícita de un cambio material.

Cada Decision Object (en MVP) tiene:
- **Schema** (campos + validaciones mínimas)
- **State** (draft / needs_info / confirmed / executed / canceled)
- **Versioning** (historial y “versión vigente”)
- **Evidence links** (mensajes + audio transcrito con referencias)

Punto clave: el chat es **fuente**; el Decision Object es la **unidad de operación**.

---

## 4) Trazabilidad operativa
Brokia introduce trazabilidad **operativa**, no “legal abstracta”. Significa que, ante una duda o reclamo, el corredor puede responder en minutos:

- **Qué decisión se tomó** (y cuál es su versión vigente)
- **Cuándo** se tomó / cambió
- **Quién** la confirmó
- **Con qué evidencia** (mensaje, audio transcrito, timestamps)
- **Qué procesos** se ejecutaron como consecuencia

Esto requiere explícitamente:
- **Decision Store (system of record):** persistencia versionada y determinística.
- **Evidence Store:** links a mensajes y audios con referencias.
- **Diff determinístico:** qué cambió entre versiones.
- **Cadena de eventos:** qué se disparó después de confirmar.

### 4.1 Decision Timeline (refuerzo de trazabilidad)
Además del registro “en tablas”, Brokia necesita una **Decision Timeline** por caso (cliente/póliza/siniestro), para visualizar:
- qué Decision Objects aparecieron y en qué orden,
- qué cambió entre versiones (diff),
- quién confirmó cada decisión o cambio material,
- qué evidencia respalda cada paso (mensaje/audio + referencia),
- qué procesos se ejecutaron después (y su estado).

En términos de problema que resuelve: la timeline evita “releer el chat” para reconstruir historia y reduce la dependencia de memoria humana.

---

## 5) Decision Events (puente entre decisión y ejecución)
Un Decision Object es “estado”. Un **Decision Event** es “momento”.

Brokia genera eventos cuando ocurre un cambio relevante en el estado de un Decision Object. Ejemplos:
- `decision.detected` (candidato creado)
- `decision.needs_info` (faltan datos críticos)
- `decision.confirmed` (queda vigente; ya es operable)
- `decision.executed` (se completó el proceso asociado)
- `decision.overdue` (SLA incumplido)

**Rol de los eventos:**
- separar el “registro” (store) de la “acción” (execution),
- permitir automatización controlada (event-driven) sin depender de un humano “acordándose”.

---

## 6) Process Execution Layer (más allá de integraciones)
La capa final no es “conectar con herramientas”. Es ejecutar **procesos operativos** a partir de eventos confirmados.

Definición: **Process Execution Layer** = motor que, ante un `decision.confirmed`, ejecuta una secuencia configurable de acciones con estado y seguimiento.

Ejemplos de procesos (no como roadmap, sino como categoría):
- iniciar flujo de endoso,
- iniciar flujo de renovación,
- iniciar checklist de siniestro,
- crear tareas y SLAs,
- solicitar aprobación interna,
- disparar comunicaciones (email/mensajes),
- abrir tickets o actualizar sistemas.

Punto conceptual: Brokia conecta **Decisions → Processes → Systems**.

---

## 7) Integration Layer (conectividad a sistemas)
La Integration Layer es el “adaptador” entre procesos/eventos y sistemas empresariales. Su trabajo es:
- **mapear campos** del Decision Object al formato del sistema destino,
- ejecutar acciones (crear ticket, enviar email, actualizar registro),
- devolver resultados al Process Execution Layer (para trazabilidad y estado).

En el MVP, el objetivo no es “integrar con todo”, sino demostrar el patrón con pocos destinos reales.

---

## 8) Arquitectura conceptual (vista completa)

```
Conversation Channels (WhatsApp + audios/llamadas)
          |
          v
Decision Engine (IA + reglas)
          |
          v
Decision Store (System of Record)
          |
          v
Decision Events (cambios de estado)
          |
          v
Process Execution Layer
          |
          v
Integration Connectors
          |
          v
Company Systems (email / Jira / CRM / ERP)
```

Nota de adopción: la interacción principal sigue siendo WhatsApp; la interfaz adicional existe solo para control humano cuando es necesario.

---

## 9) Decision Inbox (interfaz de control humano)
Aunque el canal de trabajo sea conversación, el usuario necesita un punto mínimo de control para intervenir solo cuando hace falta. El **Decision Inbox** cumple ese rol.

Qué permite (mínimo viable, orientado a adopción):
- ver Decision Objects detectados y su estado (draft / needs_info / confirmed),
- ver **pendientes materiales** que requieren confirmación explícita,
- completar información faltante (campos críticos),
- confirmar/rechazar cambios importantes,
- abrir el historial de un caso (Decision Timeline) sin leer el chat completo.

El inbox funciona como “centro de control de decisiones”: baja fricción, foco en excepciones y en cerrar loops.

---

## 10) Transferibilidad a otros sectores
El problema no es de “seguros”. Es de organizaciones que acuerdan por conversación y ejecutan en sistemas.

Patrones transferibles:
- **ChangeRequests:** cambios de ventana/condiciones (logística), cambios de alcance (agencias), cambios de términos (B2B).
- **Commitments:** promesas de envío/pago/documentación.
- **Approvals:** aprobaciones explícitas de cambios materiales.

Lo que varía por industria:
- los **schemas** (campos),
- las **políticas de materialidad**,
- las **reglas de ejecución** (qué procesos disparar) y los sistemas destino.

---

## 11) Principios de diseño (especialmente materialidad y adopción)

### 11.1 Copiloto invisible (human-in-the-loop)
- Brokia propone estructura y detecta riesgos.
- El humano confirma decisiones materiales.
- Objetivo: intervención mínima con máximo impacto.

### 11.2 Conversation-first
- El sistema nunca obliga al usuario a abandonar el canal de conversación.
- La estructura se genera alrededor del canal (WhatsApp), no en reemplazo.
- Cualquier interfaz adicional (Decision Inbox) existe para excepciones, confirmaciones y trazabilidad.

### 11.3 Materialidad (para no matar adopción)
**Materialidad** = regla que define qué cambios son críticos y requieren confirmación explícita.

- Cambios **materiales** (ej. fecha de vigencia, cobertura, deducible, precio, exclusiones) → pedir confirmación.
- Cambios **no materiales** (ej. aclaraciones menores) → versionar sin interrumpir.

Beneficio: reduce fricción y concentra la atención humana donde hay riesgo real.

### 11.4 Trazabilidad por defecto
- Todo Decision Object confirmado debe tener: campos críticos + evidencia + versión vigente + cadena de ejecución.
- La trazabilidad no se “arma después”; se produce como subproducto del flujo.

### 11.5 Configurabilidad mínima viable
Configurable no significa “plataforma infinita”. En MVP:
- pocos schemas predefinidos,
- políticas de materialidad explícitas,
- reglas WHEN/THEN simples,
- 1–2 integraciones que demuestren ejecución y trazabilidad.

---

### Nota (vertical inicial)
Este framing se valida primero en **seguros automotores por WhatsApp** (EndosoOps) porque el volumen de cambios, la ambigüedad y el costo del error son altos y medibles. El objetivo académico del MVP es demostrar que:
1) es posible extraer y gobernar decisiones sin cambiar el canal, y
2) esas decisiones pueden disparar procesos con trazabilidad operativa.
