# Brokia — Mapa Conceptual del Problema (v2)

**Fecha:** 2026-03-04  
**Versión:** v2  
**Foco:** seguros automotores + WhatsApp/audios/llamadas. (Problema transferible a otros rubros.)  
**Nota:** este documento describe **solo el problema**. No define solución ni arquitectura.

---

## 1) Ecosistema y actores
**Actores primarios**
- **Asegurado (cliente):** quiere resolver rápido con buen precio/cobertura; suele aportar información incompleta y cambia de opinión.
- **Corredor:** asesora y opera; necesita velocidad y precisión; carga con seguimiento y coordinación; es “responsable” frente al cliente.
- **Broker (intermediario técnico-comercial):** aparece en casos complejos/excepciones; agrega un eslabón humano (ejecutivo) que puede destrabar o demorar.
- **Aseguradora:** define aceptación del riesgo, condiciones y requisitos; sus sistemas y criterios no están alineados entre compañías.
- **SUSE / regulador:** no es el problema central; **amplifica** la necesidad de trazabilidad (exige registros y justificaciones).

**Actores secundarios (según caso)**
- Productores/juniors (handoffs internos), peritos/tasadores (siniestros), talleres/proveedores, banco/financiera (prenda), familia/referente del cliente.

**Tensión sistémica de base**
- La coordinación real ocurre en un **system of conversation** (WhatsApp/audios/llamadas), pero la operación requiere un **system of record** (estado vigente, seguimiento, evidencia recuperable). Hoy el puente entre ambos es, en gran parte, **memoria humana**.

---

## 2) Flujos donde se toman decisiones por conversación
En seguros automotores, las decisiones no se toman “en el sistema”: se toman en conversación y luego se intenta operar.

1) **Cotización (pre-venta)**
- Decisiones: qué datos son “suficientes”, qué compañías cotizar, qué cobertura recomendar, qué exclusiones aclarar.

2) **Emisión (venta)**
- Decisiones: vigencia, forma de pago, documentación final, confirmación de titular/vehículo.

3) **Endosos / cambios (post-venta)**
- Decisiones: cobertura/deducible, conductor, uso del vehículo, vigencia “desde cuándo”, excepciones.

4) **Renovación**
- Decisiones: renovar o migrar, condiciones actualizadas, fechas, forma de pago.

5) **Siniestros (gestión inicial y seguimiento)**
- Decisiones: próximos pasos, plazos, documentación, acuerdos prácticos (“te mando fotos hoy”).

En todos los flujos aparecen audios/llamadas: aceleran la coordinación, pero empeoran la recuperabilidad de lo acordado.

---

## 3) Problema estructural
**Problema:** decisiones operativas críticas se toman en conversaciones, pero **no se convierten de forma confiable** en un registro operativo con:
- **estado vigente explícito** (qué aplica hoy),
- **control de cambios** (qué cambió y cuándo),
- **evidencia recuperable** (sin releer todo el chat),
- **seguimiento y disparadores operativos** (que el acuerdo “genere trabajo”).

**Patrón actual (simplificado):**

Conversation → interpretación/memoria humana → ejecución manual (con re-trabajo)

---

## 4) Puntos de ruptura del sistema actual
Estos puntos explican por qué el sistema falla incluso con buenos corredores.

1) **Estado vigente implícito**
- Lo acordado queda repartido en mensajes y memoria (“lo último que leímos”).

2) **Cambios por goteo (sin control de cambios)**
- El cliente ajusta condiciones en varios mensajes; queda fácil que convivan “dos verdades”.

3) **Evidencia difícil de usar**
- Mensajes dispersos y audios: hay evidencia, pero no es **rápida de recuperar** ni **presentable**.

4) **Ambigüedad frecuente**
- Fechas relativas (“viernes”), expresiones vagas (“lo de siempre”), acuerdos implícitos tras una llamada.

5) **Handoffs sin continuidad**
- Cambio de persona (productor/junior/otro corredor) obliga a reconstruir contexto y vuelve a abrir preguntas al cliente.

6) **Multiactor con pérdida de contexto**
- En la cadena corredor–broker–aseguradora, el contexto se “resume” y se degrada en cada salto.

7) **Decisiones que no disparan acciones operativas**
- Aun si el cliente confirma, esa decisión no crea automáticamente tarea/SLA/ticket/email: depende de que alguien se acuerde.

8) **Trazabilidad/compliance como tarea extra**
- Cuando hay reclamo o auditoría, se arma evidencia “a mano”. SUSE amplifica este costo, pero el problema existe igual sin regulador.

---

## 5) Consecuencias operativas
Consecuencias típicas (observables en operación diaria):
- **Retrabajo**: pedir datos de nuevo, corregir, reemitir, reexplicar.
- **Errores**: endosos/renovaciones con condiciones incorrectas o incompletas.
- **Demoras**: ciclos más largos por ida y vuelta y por olvidos.
- **Reclamos y fricción con el cliente**: “yo pedí otra cosa”.
- **Dependencia de memoria humana**: el sistema “funciona” mientras la persona recuerde.
- **Baja escalabilidad**: el crecimiento agrega handoffs y multiplica pérdida de contexto.
- **Variabilidad por broker/aseguradora**: tiempos y requisitos cambian; se incrementan iteraciones.

---

## 6) Trazabilidad como necesidad sistémica (trazabilidad operativa)
**Trazabilidad operativa** (definición): capacidad de recuperar rápidamente:
- qué decisión se tomó,
- cuándo,
- por quién,
- con qué evidencia,
- y qué se hizo después,

**sin tener que revisar conversaciones completas**.

Por qué es una necesidad (no un “nice to have”):
- reduce disputas y reclamos,
- reduce estrés y tiempo de reconstrucción,
- habilita handoffs sanos,
- reduce el costo de compliance (SUSE lo amplifica).

---

## 7) Problem Tree simplificado

**Problema raíz:**
- Decisiones en conversaciones no se transforman en registros operativos confiables.

**Causas directas (6)**
1) Información desestructurada (texto/audio sin campos).
2) Falta de “versión vigente” explícita.
3) Cambios incrementales y contradictorios.
4) Evidencia dispersa (difícil de recuperar).
5) Ambigüedad lingüística/temporal.
6) Decisiones sin disparadores operativos (no crean trabajo automáticamente).

**Efectos (6)**
1) Retrabajo y costos ocultos.
2) Errores en emisión/endosos/renovación.
3) Demoras y pérdida de ventas.
4) Reclamos y pérdida de confianza.
5) Dependencia de memoria humana.
6) Dificultad para escalar (handoffs) + mayor costo de compliance.

---

## 8) Mapa conceptual ASCII (claro)

```
(System of Conversation)
WhatsApp / Audios / Llamadas
        |
        v
Decisiones operativas en conversación
        |
        v
NO se convierten en registro operativo confiable
(estado vigente + cambios + evidencia recuperable)
        |
        +---------------------------+
        |                           |
        v                           v
No hay control de cambios       No hay disparadores
(cambios por goteo)            (la decisión no crea trabajo)
        |                           |
        v                           v
Errores / versiones conflictivas   Olvidos / demoras / seguimiento manual
        \                           /
         \                         /
          v                       v
          Retrabajo + reclamos + dependencia de memoria
                          |
                          v
Necesidad sistémica: trazabilidad operativa
(recuperar qué/cuándo/quién/evidencia sin releer todo)

Amplificadores (no causa raíz):
- Broker/aseguradora: más saltos → más pérdida de contexto
- SUSE: exige trazabilidad → más costo si todo es manual
```

---

## 9) Hipótesis medibles (baseline, sin inventar números)
> Objetivo: medir cómo es hoy y establecer línea base. Unidades sugeridas.

### Tiempo (4)
1) **Ciclo de endoso/cambio**
- Unidad: horas/días desde “solicitud” → “cambio emitido/confirmado”.
- Medición: timestamps (primer mensaje) + cierre manual.

2) **Ciclo de renovación**
- Unidad: días desde “primer contacto” → “renovación cerrada”.
- Medición: registrar inicio y cierre por caso.

3) **Tiempo para completar documentación mínima (siniestro)**
- Unidad: horas/días hasta “set mínimo completo”.
- Medición: checklist con timestamps.

4) **Tiempo de reconstrucción de contexto (handoff)**
- Unidad: minutos para entender “qué quedó vigente + qué falta”.
- Medición: ejercicio interno con casos reales.

### Calidad (2)
5) **Correcciones por malentendidos de condiciones**
- Unidad: # casos/mes con corrección por cobertura/deducible/fecha.
- Medición: registro simple de incidentes.

6) **Faltantes detectados tarde**
- Unidad: % de casos donde aparece un faltante después de creer “listo para avanzar”.
- Medición: checklist por flujo; marcar momento de detección.

### Riesgo/compliance (2)
7) **Evidencia recuperable en <2 minutos**
- Unidad: % de casos donde se puede mostrar evidencia rápida de una decisión.
- Medición: muestreo semanal (sí/no).

8) **Tiempo para armar evidencia ante reclamo/auditoría**
- Unidad: minutos por caso.
- Medición: cronometrar armado de “paquete” en casos reales.

---

## 10) Preguntas para validar en entrevistas (corredores)
1) ¿En qué flujo (endoso/renovación/siniestro) aparecen más malentendidos? ¿Por qué?
2) ¿Qué decisiones “se pierden” más en WhatsApp? (listar 3)
3) ¿Qué frases/formatos generan más ambigüedad? (fechas relativas, “lo de siempre”, audios, llamadas)
4) ¿Qué parte del caso suele cambiar después de “ya estar acordado”?
5) ¿Cuánto tiempo se va en perseguir faltantes? ¿Qué faltantes son recurrentes?
6) ¿Cómo reconstruyen hoy el estado vigente cuando el chat tiene muchas idas y vueltas?
7) ¿Qué pasa cuando hay handoff? ¿Qué información se pierde primero?
8) Cuando entra el broker: ¿qué se resume y qué se pierde? ¿en qué formato lo manejan?
9) ¿Cuándo necesitan evidencia “presentable”? (reclamo, auditoría, cliente molesto)
10) ¿Qué sería “trazabilidad operativa” para ustedes en términos prácticos? (ej. recuperar evidencia en <2 min)

---

**Nota de transferibilidad:** el patrón del problema (decisiones en conversación sin registro operativo confiable) se repite en logística, agencias y servicios profesionales; cambia el tipo de decisión, no el mecanismo de falla.
