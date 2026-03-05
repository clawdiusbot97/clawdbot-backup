# Brokia — Anexo metodológico Gate 1 (v0.1)

**Fecha:** 2026-03-04  
**Estado:** anexo metodológico (detalle completo)

---

## A) Gate 1A completo (corredores)

### A.1 Definición Top 3, método de conteo y umbrales numéricos

# Brokia — Gate 1: Metodología de validación de núcleo de problema (v0.1)

**Fecha:** 2026-03-03  
**Versión:** v0.1 (exploratoria)  
**Alcance:** validación del problema (pre‑diseño)

---

## 1) Propósito del Gate 1

### 1.1 Qué es
El **Gate 1** es un umbral metodológico mínimo para **seleccionar y cerrar** un núcleo de problema (A/B/C/D/E) con evidencia suficiente como para sostener, a nivel de anteproyecto, que:
1) el dolor existe en el segmento objetivo,
2) es prioritario frente a alternativas,
3) es **medible** con métricas observables,
4) y puede formularse de manera delimitada (sin dispersarse).

### 1.2 Qué NO es
El Gate 1 **no** es:
- una evaluación de factibilidad técnica,
- una definición de alcance,
- una especificación de implementación,
- ni una validación de una solución.

Su función es asegurar que la tesis se apoye en un **problema defendible** antes de orientar cualquier esfuerzo a diseño.

### 1.3 Por qué se aplica antes de diseñar solución
Aplicar Gate 1 antes del diseño reduce dos riesgos frecuentes:
- **Problema no medible:** objetivos vagos sin línea base, sin indicadores y sin segmentación.
- **Dispersión:** ampliar el alcance para “cubrir todo” en vez de profundizar un núcleo verificable.

En términos académicos, Gate 1 fuerza la transición desde un planteo narrativo hacia un planteo **operacionalizable** (evidencia + métricas + umbral de decisión).

---

## 2) Definición operativa de “Top 3”

### 2.1 Cómo se obtiene
En cada entrevista Gate 1, se solicita al entrevistado:
1) enumerar dolores o fricciones principales de su operación (lista corta),
2) seleccionar sus **tres** problemas más relevantes (**Top 3**) “hoy”,
3) opcionalmente, ordenar del 1 al 3.

El Top 3 debe responder a una consigna explícita: “elegí los tres dolores que, si pudieras mejorar primero, te liberarían más tiempo, reducirían más fricción o disminuirían más riesgo”.

### 2.2 Cómo se registra
Para evitar interpretación libre del entrevistador, el registro debe consignar:
- el texto literal (o lo más literal posible) del dolor declarado,
- su mapeo a un núcleo (A/B/C/D/E) si corresponde,
- y la evidencia mínima de prioridad (por qué quedó en Top 3 según el entrevistado).

### 2.3 Cómo se evita subjetividad
La subjetividad se reduce con tres reglas:
1) **Prioridad declarada:** el Top 3 lo define el entrevistado, no el entrevistador.
2) **Mapeo trazable:** si el entrevistador mapea un dolor a un núcleo, debe anotar la frase que justifica el mapeo.
3) **Conteo por frecuencia:** la conclusión se basa en conteo de apariciones en Top 3 sobre N entrevistas, no en impresiones.

---

## 3) Método de conteo

### 3.1 Tabla ejemplo
Ejemplo (N=5 entrevistas). Se marca con “1” si el núcleo aparece en el Top 3 de esa entrevista.

| Entrevista | A | B | C | D | E | Notas breves |
|---|---:|---:|---:|---:|---:|---|
| 1 | 1 | 0 | 1 | 0 | 1 | Top 3 declarado: A/C/E |
| 2 | 1 | 1 | 1 | 0 | 0 | Top 3 declarado: C/A/B |
| 3 | 1 | 0 | 1 | 1 | 0 | Top 3 declarado: A/C/D |
| 4 | 1 | 0 | 1 | 0 | 1 | Top 3 declarado: C/E/A |
| 5 | 0 | 1 | 1 | 0 | 1 | Top 3 declarado: C/B/E |

### 3.2 Lógica de frecuencia
Para cada núcleo X, se calcula:
- **Frecuencia Top 3 (X):** (entrevistas donde X aparece en Top 3) / (N total de entrevistas)

La evidencia de prioridad se interpreta como:
- mayor frecuencia ⇒ mayor consistencia del dolor,
- menor frecuencia ⇒ dolor más dependiente de contexto, menos estable o secundario.

---

## 4) Umbral numérico según cantidad de entrevistas

### 4.1 Para 5 entrevistas
Un núcleo **pasa Gate 1** si cumple simultáneamente:
- **Top 3 en al menos 3 de 5** entrevistas (>= 60%).
- Se obtienen **2 métricas base estimables** asociadas al núcleo.
- Se registra **1 ejemplo concreto reciente** por cada entrevista donde el núcleo fue priorizado.

### 4.2 Para 8 entrevistas
Un núcleo **pasa Gate 1** si cumple simultáneamente:
- **Top 3 en al menos 5 de 8** entrevistas (>= 62.5%).
- Se obtienen **2 métricas base estimables** asociadas al núcleo.
- Se registra **1 ejemplo concreto reciente** en al menos 4 de las entrevistas donde fue Top 3.

### 4.3 Para 10 entrevistas
Un núcleo **pasa Gate 1** si cumple simultáneamente:
- **Top 3 en al menos 6 de 10** entrevistas (>= 60%).
- Se obtienen **2 métricas base estimables** asociadas al núcleo.
- Se registra **1 ejemplo concreto reciente** en al menos 5 de las entrevistas donde fue Top 3.

---

## 5) Requisitos adicionales obligatorios
- Mínimo 2 métricas base estimables.
- Mínimo 1 ejemplo concreto reciente.
- Posibilidad de prueba práctica (cuando aplique).

---

## 6) Regla de decisión
Un núcleo pasa Gate 1 cuando se cumplen simultáneamente los umbrales y requisitos anteriores, y el entrevistado puede delimitar con claridad “dónde duele”.

---

### A.2 Plantilla de entrevista (guion operativo)

# Guion operativo — Entrevista Gate 1 (v0.2)

**Duración objetivo:** 30–40 minutos  
**Objetivo:** identificar dolores, forzar ranking Top 3 y capturar 2 métricas base (sin abrumar)

---

## A) Contexto (5 min)
1) ¿Cuál es tu rol y cómo es tu operación (corredor individual, agencia, backoffice)?
2) ¿Qué volumen manejás en automotor? (aprox. casos/semana o pólizas activas)
3) ¿Qué canales usás para operar? (mensajería, llamadas, portales, presencial)

## B) Dolores abiertos (10–12 min)
4) Contame el flujo típico desde que entra un cliente hasta que queda resuelto (cotización / emisión / renovación / postventa).
5) ¿En qué parte del flujo se tranca más seguido?
6) ¿Qué cosas te generan más retrabajo (idas y vueltas) y por qué?
7) ¿Qué situaciones terminan en malentendidos o conflictos con clientes?
8) Si tu volumen creciera 50% mañana, ¿qué parte explotaría primero?

## C) Ranking Top 3 (obligatorio) (5 min)
9) De todo lo que mencionaste, elegí tus **3 dolores principales hoy**. (Top 3)
10) Si tuvieras que ordenar esos 3: ¿cuál es #1, cuál #2 y cuál #3? (si no quiere ordenar, mantener Top 3 sin orden)
11) De esos 3:
   - ¿Cuál te duele más por **tiempo**?
   - ¿Cuál por **impacto económico**?
   - ¿Cuál por **riesgo/conflicto**?

## D) Deep dive sobre 1 núcleo (10–12 min)
12) Para tu dolor #1, contame un ejemplo concreto reciente (última semana/mes): ¿qué pasó y cuál fue el impacto?
13) En ese ejemplo, ¿qué fue lo que más tiempo consumió o qué parte generó más fricción?
14) Si tuvieras que medir este dolor, ¿qué dos números te gustaría tener cada semana? (elegir 2 métricas base)

**Prueba práctica (elegir 1, según núcleo priorizado):**
15) (A) Cotización: elegí una cotización reciente demorada y reconstruimos timeline (inicio → primer feedback → datos completos → entrega). ¿cuánto tardó cada tramo?
    (B) Cambios/cancelaciones: elegí un caso reciente y anotamos tiempo total + # interacciones + monto de ajuste/devolución.
    (C) Trazabilidad: elegí un caso de hace 2 meses y buscá dónde quedó registrada una aceptación/condición. ¿en cuánto tiempo la encontrás?
    (D) Post‑siniestro: elegí un siniestro activo o cerrado y listemos hitos + pendientes + tiempos entre hitos.
    (E) Renovación: elegí una renovación reciente con fricción y reconstruimos motivo + timeline + punto de confusión.

## E) Captura de 2 métricas base (3–5 min)
16) Para las 2 métricas elegidas: ¿cómo las estimarías hoy (aprox.)? ¿existe algún registro simple (timestamps, mensajes, planilla)?
17) Si repitiéramos la medición en 2 semanas: ¿qué cambio esperarías ver para decir “esto mejoró”?

---

### A.3 Plantilla de registro de entrevista

# Plantilla de registro — Entrevista Gate 1 (v0.2)

- **Fecha:** YYYY-MM-DD
- **Entrevistador:**
- **Duración (min):**

**Top 3 declarados (literal):**
- #1:
- #2:
- #3:

**Mapeo a núcleos (A/B/C/D/E) con justificación (frase):**
- Núcleo #1:
- Núcleo #2:
- Núcleo #3:

**Núcleo profundizado:**
- Núcleo:
- Métrica 1:
- Métrica 2:
- Ejemplo concreto:
- Severidad (1–10):

---

### A.4 Guía de mapeo de núcleos

- **Regla:** el conteo exige **1 núcleo dominante por cada ítem** del Top 3.
- Si es mixto: elegir dominante por causa/impacto y anotar secundario en notas.

---

## B) Gate 1B completo (clientes)

### B.1 Justificación y metodología de encuesta
La validación desde cliente se realiza mediante **encuesta estructurada** para capturar prevalencias y severidad percibida por momento del ciclo, complementando Gate 1A.

**Criterio exploratorio:** confusión significativa = respuestas 4–5 en escala 1–5; umbral relevante sugerido: >=40%.

### B.2 Encuesta estructurada (v0.2)
(Se reproduce íntegramente el cuestionario usado en campo.)

**Nota:** la encuesta incluye un bloque adicional de “Relación con tu corredor” (disponibilidad, tiempos de respuesta, claridad de explicaciones, acompañamiento).

### B.3 Plantilla de análisis de resultados
- N total
- Distribución por perfil
- % confusión alta 4–5 por momento
- Ranking de momentos
- Cruce con núcleos A/B/C/D/E
- Conclusión preliminar y decisión

---

## C) Mapa conceptual actualizado (v0.2 con Broker)
Se incorpora el actor **Broker** como intermediario técnico‑comercial entre Corredor y Compañía, con relación corredor–ejecutivo asignado, y se explicitan flujos, dependencias y puntos de fricción potencial.

---

## D) Tabla comparativa de núcleos (A/B/C/D/E)
Se incluye el comparativo cualitativo de medibilidad, diferenciación, complejidad futura, competencia existente y riesgo de dispersión.

---

## E) Criterios de validación
Los criterios Gate 1 se consideran cumplidos cuando:
- el núcleo supera el umbral de frecuencia Top 3 según N,
- tiene al menos 2 métricas base,
- presenta ejemplos concretos,
- y existe delimitación operacional del punto de dolor.
