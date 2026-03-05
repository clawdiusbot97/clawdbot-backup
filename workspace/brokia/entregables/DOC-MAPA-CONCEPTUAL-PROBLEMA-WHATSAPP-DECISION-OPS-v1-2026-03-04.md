# Brokia — Mapa conceptual del problema (WhatsApp → Decisiones → Operación) (v1)

**Fecha:** 2026-03-04  
**Versión:** v1  
**Objetivo:** mapa del **problema** (framing claro y presentable) enfocado en seguros auto por WhatsApp, incorporando el rol de mensajes interactivos como respuesta a la ambigüedad (sin describir solución completa).

---

## 1) Framing (en una frase)
En seguros automotores, las decisiones se toman en WhatsApp (system of conversation) pero la operación necesita un registro vigente y trazable (system of record); hoy el puente es memoria humana, lo que genera ambigüedad, cambios por goteo y trabajo que no se dispara.

---

## 2) Actores (mínimos)
- **Cliente/Asegurado:** decide y cambia condiciones; prioriza rapidez.
- **Corredor:** asesora y ejecuta; carga con seguimiento.
- **Broker/Aseguradora:** aportan reglas y requisitos; suman saltos y pérdida de contexto.
- **Regulador (SUSE):** no es el problema central; amplifica el costo de no tener trazabilidad.

---

## 3) Dónde nace el problema (puntos críticos)
Flujos donde se decide por conversación:
- Cotización
- Propuesta
- Selección/Aceptación
- (Luego: cambios/renovación/siniestros)

Datos típicos que entran “mal” por WhatsApp:
- uso del vehículo, zona, conductores
- cobertura/deducible
- vigencia
- documentación

---

## 4) Mecanismos de falla (raíz)
1) **Texto libre + audios** → datos ambiguos o incompletos.
2) **Estado vigente implícito** → no hay una “versión actual” fácil de ver.
3) **Cambios por goteo** → se superponen decisiones (“al final B”, “no, A”).
4) **Evidencia difícil de recuperar** → para reclamo/handoff/auditoría hay que releer chats.
5) **No hay disparadores operativos** → aunque el cliente confirme, el trabajo no se crea solo.

---

## 5) Por qué la ambigüedad es estructural (WhatsApp)
WhatsApp está optimizado para conversar, no para:
- capturar campos,
- comparar opciones,
- confirmar decisiones con formato estándar,
- y dejar trazabilidad operativa.

Esto explica por qué, incluso con un buen corredor, aparecen errores y retrabajo.

---

## 6) “Primitives” como indicador del problema (no como feature)
El hecho de que en la práctica ayuden **botones**, **listas** y formatos más estructurados refleja el problema raíz:
- cuando el input se estandariza, baja la ambigüedad,
- se reduce el “texto interpretado”,
- y se vuelve más fácil sostener un estado vigente.

(Esto no define la solución completa: solo muestra que el canal requiere estructura mínima para decisiones.)

---

## 7) Consecuencias (operativas)
- Retrabajo (ida y vuelta por faltantes)
- Errores (cobertura/deducible/vigencia mal entendidos)
- Demoras (ciclos más largos)
- Reclamos ("yo pedí otra cosa")
- Handoffs dolorosos (pérdida de continuidad)
- Trazabilidad manual (costosa; SUSE lo amplifica)

---

## 8) Mapa conceptual ASCII (presentable)

```text
(System of Conversation)
WhatsApp (texto + audios)
        |
        v
Decisiones en texto libre
+ ambigüedad + faltantes
        |
        v
Estado vigente implícito
+ cambios por goteo
        |
        +---------------------------+
        |                           |
        v                           v
Evidencia difícil de recuperar   La decisión no dispara trabajo
(releer chat)                    (tareas/seguimiento manual)
        |                           |
        v                           v
Reclamos / handoffs / compliance   Olvidos / demoras / reprocesos
        \                           /
         \                         /
          v                       v
     Costo operativo + pérdida de confianza

Indicador del problema:
- Botones/Listas/Carruseles (estructura mínima) reducen ambigüedad
```

---

## 9) Hipótesis medibles (sin números inventados)
- Tiempo de primera respuesta (minutos) desde primer mensaje.
- Tiempo de ciclo cotización→propuesta (horas/días).
- Tiempo de ciclo propuesta→aceptación (horas/días).
- % de casos con faltantes detectados tarde (por checklist).
- # de correcciones por malentendido (por mes).
- Tiempo para reconstruir el historial de un caso (minutos) sin pedirle al cliente de nuevo.

---

## 10) Preguntas para entrevista (para validar el mapa)
1) ¿Qué datos faltan más seguido en una cotización por WhatsApp?
2) ¿Qué frases/formatos generan más ambigüedad (fechas relativas, “lo de siempre”, audios)?
3) ¿Con qué frecuencia el cliente cambia de opción después de recibir propuesta?
4) ¿Cuánto tiempo te lleva reconstruir qué se acordó en un caso de hace 2 semanas?
5) ¿Qué parte del proceso depende más de “acordarse” y no de un sistema?
6) ¿Qué evidencia necesitás cuando hay un reclamo? ¿Cuánto te cuesta armarla?

---

**Nota:** este mapa es deliberadamente simple: apunta a clarificar el mecanismo de falla (conversation vs record + control de cambios + disparadores) para orientar el diseño del MVP sin agrandar el scope.
