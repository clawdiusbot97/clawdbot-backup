# Brokia — Análisis del Sistema Actual de Intermediación en Seguros Automotores (v0.1)

**Fecha:** 2026-03-04  
**Estado:** borrador para revisión académica  
**Alcance:** descripción y análisis del sistema actual (pre‑intervención)

---

## 1. Introducción
La intermediación en seguros automotores se desarrolla en un mercado caracterizado por una combinación de presión competitiva (precio, rapidez de respuesta), heterogeneidad contractual (condiciones, exclusiones, deducibles, servicios) y requisitos operativos que varían entre compañías. En este contexto, el corredor de seguros cumple un rol que excede la venta: traduce necesidades del asegurado a categorías asegurables, coordina múltiples actores y sostiene continuidad de atención durante el ciclo de vida de la póliza.

La complejidad del ecosistema se incrementa por tres factores estructurales. Primero, la fragmentación del mercado en múltiples compañías con procesos y portales propios. Segundo, el predominio de canales informales de interacción (mensajería, llamadas) que favorecen captura desestructurada de información. Tercero, la presencia de intermediarios técnico‑comerciales (broker) que operan como puente entre corredor y compañía en una porción relevante de los casos, introduciendo dependencias y variabilidad adicionales.

Este documento describe el sistema tal como opera hoy y explicita actores, flujos e interdependencias, con el objetivo de establecer una base conceptual sólida antes de delimitar un foco de problema.

---

## 2. Descripción del sistema actual

### 2.1 Actores primarios
En el sistema actual de intermediación se observan, como mínimo, los siguientes actores primarios:

- **Asegurado (cliente final):** busca protección y previsibilidad económica frente a eventos de daño o pérdida.
- **Corredor de seguros:** intermediario que asesora, opera la cotización y gestiona emisión, renovaciones y postventa.
- **Broker (intermediario técnico‑comercial):** intermediario entre corredor y compañía; provee soporte operativo, técnico y comercial; canaliza excepciones y gestiones que el corredor no resuelve directamente; opera a través de una relación personalizada corredor–ejecutivo asignado.
- **Compañía de seguros:** acepta o rechaza riesgos, define primas y condiciones contractuales, y ejecuta prestaciones ante siniestros.
- **Regulador (Uruguay):** **BCU — Superintendencia de Servicios Financieros (SSF)**, con capacidad de supervisión y exigencias vinculadas a cumplimiento, protección del consumidor y conservación de registros.

### 2.2 Actores secundarios
Sin agotar el conjunto, suelen intervenir:

- **Productores asesores / apoyos operativos:** personal junior o administrativo que absorbe tareas de seguimiento.
- **Tasadores / peritos:** en valuación e inspecciones (casos especiales y siniestros).
- **Talleres y proveedores de reparación:** en la cadena post‑siniestro.
- **Banco/financiera:** cuando el vehículo está prendado y el seguro opera como requisito.
- **Referentes familiares:** que influyen en decisiones cuando el asegurado requiere validación externa.

### 2.3 Relaciones dominantes
La relación dominante no es una interacción directa y continua cliente–compañía. En la práctica, el corredor organiza la relación y, con frecuencia, canaliza gestiones a través del broker.

Relación típica observada:

Cliente → Corredor → Broker (frecuente) → Compañía

Variaciones relevantes:

- El corredor puede trabajar con **varios brokers**.
- Un broker puede representar **varias compañías**.
- El corredor puede tratar **directamente** con una compañía, pero en casos de excepción o gestión compleja el canal broker tiende a volverse predominante.

---

## 3. Flujo operativo real

A continuación se describe el flujo operativo por procesos. Los tiempos presentados se entienden como rangos **preliminares** (no línea base final) y se expresan donde ya se identificaron fricciones recurrentes.

### 3.1 Cotización (paso a paso)
1. **Inicio de solicitud:** el cliente expresa intención de cotizar (habitualmente por mensajería o llamada).
2. **Captura de información:** el corredor solicita datos del vehículo y del riesgo. La información suele llegar **parcial** o en formatos heterogéneos.
3. **Detección de faltantes y reprocesos:** se generan idas y vueltas hasta completar datos mínimos. Esta etapa concentra retrabajo.
4. **Ingreso a portales / canales por compañía:** el corredor (y en algunos casos el broker) carga información en portales distintos.
5. **Recepción de respuestas:** la compañía devuelve cotización o rechazo; el corredor consolida alternativas.
6. **Presentación al cliente:** comparación manual, explicación de diferencias y recomendación.

**Puntos donde se acumula retrabajo:**
- normalización de datos y completitud (pedidos reiterados),
- traducción de campos entre portales,
- reingreso de información.

**Tiempos preliminares identificados en la descripción del sistema:**
- Captura desestructurada: del orden de **5–15 minutos** de trabajo operativo, más demoras por idas y vueltas.
- Multi‑portales: del orden de **10–20 minutos por compañía** en escenarios manuales.

### 3.2 Emisión
Una vez aceptada la propuesta:
- se ejecuta la emisión en el circuito de la compañía,
- puede requerirse **re‑carga** o transcripción de datos ya ingresados en la etapa de cotización,
- se coordinan pagos y entrega de documentación.

El broker aparece con mayor frecuencia en emisiones complejas, excepciones o requerimientos adicionales de documentación.

### 3.3 Renovación
La renovación combina tres dimensiones:
- gestión operativa (contacto y confirmación),
- interpretación de cambios (prima, condiciones, servicios),
- continuidad de la información histórica.

En ausencia de un registro recuperable de decisiones previas, el corredor puede requerir reconstruir antecedentes o re‑solicitar información, generando fricción y potencial pérdida de continuidad.

### 3.4 Cambios / cancelaciones
Incluye cambios de vehículo, endosos y cancelaciones. Se caracteriza por:
- recalcular impacto económico (prorrateos, devoluciones, penalizaciones),
- gestionar validaciones con la compañía (frecuentemente vía broker),
- sostener explicaciones claras al cliente.

El retrabajo aparece cuando cambian criterios, falta documentación o existen discrepancias entre expectativa del cliente y resultado económico final.

### 3.5 Post‑siniestro
El proceso post‑siniestro es un flujo multi‑actor:
- denuncia y registro,
- inspecciones/peritajes,
- presupuestos y aprobaciones,
- reparación o indemnización,
- cierre.

La fricción se concentra en la visibilidad del estado del trámite, pendientes documentales y tiempos entre hitos. El corredor actúa como punto de contacto, pero parte del ciclo depende de compañía, broker y proveedores.

---

## 4. Flujo económico e incentivos

### 4.1 Esquema de comisiones
El flujo económico típico puede representarse como:

Cliente
 ↓ (prima)
Compañía
 ↓ (comisión)
Corredor
 ↓ (porcentaje de comisión)
Broker

Conceptualmente:
- el cliente paga la prima a la compañía,
- la compañía liquida comisión al corredor por la intermediación,
- del monto liquidado se descuenta el porcentaje correspondiente al broker cuando participa,
- el corredor no opera, en este esquema, bajo una cuota fija mensual al broker.

### 4.2 Dependencias económicas y tensiones de incentivos
Este esquema configura incentivos basados en volumen y continuidad de pólizas. A su vez:
- puede reforzar la dependencia del corredor respecto de la disponibilidad del canal broker para destrabar gestiones,
- puede inducir tensiones entre rapidez de respuesta y cumplimiento/registro,
- y puede influir en decisiones de colocación cuando existen circuitos preferentes de gestión.

El análisis no asume juicios normativos: se limita a reconocer que el incentivo económico forma parte de la estructura y condiciona comportamientos operativos.

---

## 5. Fricciones observadas

Las fricciones se agrupan en tres categorías: operativas, informacionales y de coordinación multi‑actor.

### 5.1 Fricciones operativas
Se observan fricciones recurrentes asociadas a:
- captura desestructurada de información y completitud,
- multiplicidad de portales con campos distintos,
- doble carga de datos entre cotización y emisión,
- concentración estacional de renovaciones.

### 5.2 Fricciones informacionales
Aparecen fricciones por asimetría de información:
- el cliente tiende a evaluar por precio y no siempre interpreta diferencias contractuales,
- el corredor debe traducir condiciones, exclusiones y deducibles a lenguaje operativo,
- la falta de continuidad de registros dificulta reconstruir decisiones previas.

### 5.3 Coordinación corredor–broker y variabilidad broker–compañía
La presencia del broker introduce un canal de destrabe, pero también:
- agrega un eslabón con disponibilidad y prioridades propias,
- puede acumular tiempos de espera fuera del control directo del corredor,
- aumenta el riesgo de pérdida de contexto en el traspaso de información.

**Ejemplos concretos (sin cuantificar):**
- demoras asociadas a la necesidad de validaciones o excepciones canalizadas por el ejecutivo asignado,
- reprocesos por documentación solicitada en iteraciones sucesivas,
- incertidumbre del cliente cuando no existe visibilidad clara de “próximo paso” en trámites post‑siniestro.

---

## 6. Tensiones estructurales del sistema
Las tensiones estructurales son conflictos persistentes entre objetivos legítimos de los actores, que tienden a reproducirse aun con buena fe.

1) **Eficiencia operativa vs. exigencias de registro y cumplimiento:** la operación requiere velocidad para sostener volumen, mientras que el cumplimiento exige evidencia y conservación de información. La coexistencia de canales informales incrementa el costo de registrar.

2) **Heterogeneidad contractual vs. necesidad de comparabilidad:** cada compañía define condiciones y estructuras no plenamente estandarizadas, lo que limita la comparación simple y desplaza carga cognitiva al corredor y al cliente.

3) **Fragmentación de procesos vs. continuidad de atención:** el ciclo de vida atraviesa cotización, emisión, renovaciones y siniestros con múltiples puntos de contacto; sin mecanismos de continuidad, el costo de reconstrucción aumenta.

4) **Coordinación multi‑actor vs. control local:** cuando interviene el broker y la compañía, parte del tiempo y del resultado depende de eslabones externos; el corredor sostiene la interfaz con el cliente, pero no controla todos los hitos.

---

## 7. Problemas candidatos derivados del análisis (A/B/C/D/E)
Del análisis del sistema actual emergen cinco hipótesis de núcleo de problema:

- **A (Cotización multi‑aseguradora):** derivada de la combinación de captura desestructurada + multi‑portales + reprocesos.
- **B (Cambios/cancelaciones):** derivada de la complejidad económica y administrativa de endosos y recalculaciones.
- **C (Trazabilidad contractual):** derivada de la dispersión de registros y la dificultad de reconstrucción de decisiones y aceptaciones.
- **D (Post‑siniestro):** derivada de la coordinación multi‑actor, pendientes documentales y visibilidad de hitos.
- **E (Renovación/comparación):** derivada de la asimetría de información y de la necesidad de explicar cambios contractuales en ventanas acotadas.

La evidencia preliminar de cada hipótesis se expresa, por ahora, en patrones observados del sistema (flujos, fricciones y tensiones). La validación empírica posterior determinará prioridad y medibilidad.

---

## 8. Criterio de delimitación del foco
Dado que el problema general es amplio, el foco se delimitará a partir de evidencia empírica para seleccionar un único núcleo prioritario. Se emplearán instrumentos de recolección (entrevistas a corredores y encuesta a clientes) con el objetivo de:
- priorizar por consistencia de dolor,
- verificar medibilidad con métricas base,
- y reducir el riesgo de elegir un núcleo que dependa principalmente de factores externos no modelados.

La intención es que el anteproyecto se apoye en un núcleo de problema defendible y operacionalizable, antes de cualquier etapa de diseño.
