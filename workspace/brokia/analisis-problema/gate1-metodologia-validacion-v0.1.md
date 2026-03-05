# Brokia — Gate 1: Metodologia de validacion de nucleo de problema (v0.1)

**Fecha:** 2026-03-03  
**Version:** v0.1 (exploratoria)  
**Alcance:** validacion del problema (pre-diseno)

---

## 1) Proposito del Gate 1

### 1.1 Que es
El **Gate 1** es un umbral metodologico minimo para **seleccionar y cerrar** un nucleo de problema (A/B/C/D/E) con evidencia suficiente como para sostener, a nivel de anteproyecto, que:
1) el dolor existe en el segmento objetivo,
2) es prioritario frente a alternativas,
3) es **medible** con metricas observables,
4) y puede formularse de manera delimitada (sin dispersarse).

### 1.2 Que NO es
El Gate 1 **no** es:
- una evaluacion de factibilidad tecnica,
- una definicion de alcance de producto,
- una especificacion de implementacion,
- ni una validacion de una solucion.

Su funcion es asegurar que la tesis se apoye en un **problema defendible** antes de orientar cualquier esfuerzo a diseno.

### 1.3 Por que se aplica antes de disenar solucion
Aplicar Gate 1 antes del diseno reduce dos riesgos frecuentes:
- **Problema no medible:** objetivos vagos sin linea base, sin indicadores y sin segmentacion.
- **Dispersión:** ampliar el alcance para “cubrir todo” en vez de profundizar un nucleo verificable.

En terminos academicos, Gate 1 fuerza la transicion desde un planteo narrativo hacia un planteo **operacionalizable** (evidencia + metricas + umbral de decision).

---

## 2) Definicion operativa de “Top 3”

### 2.1 Como se obtiene
En cada entrevista Gate 1, se solicita al entrevistado:
1) enumerar dolores o fricciones principales de su operacion (lista corta),
2) seleccionar sus **tres** problemas mas relevantes (**Top 3**) “hoy”,
3) opcionalmente, ordenar del 1 al 3.

El Top 3 debe responder a una consigna explicita: “elegi los tres dolores que, si pudieras mejorar primero, te liberarian mas tiempo, reducirian mas friccion o disminuirian mas riesgo”.

### 2.2 Como se registra
Para evitar interpretacion libre del entrevistador, el registro debe consignar:
- el texto literal (o lo mas literal posible) del dolor declarado,
- su mapeo a un nucleo (A/B/C/D/E) si corresponde,
- y la evidencia minima de prioridad (por que quedo en Top 3 segun el entrevistado).

### 2.3 Como se evita subjetividad
La subjetividad se reduce con tres reglas:
1) **Prioridad declarada:** el Top 3 lo define el entrevistado, no el entrevistador.
2) **Mapeo trazable:** si el entrevistador mapea un dolor a un nucleo, debe anotar la frase que justifica el mapeo.
3) **Conteo por frecuencia:** la conclusion se basa en conteo de apariciones en Top 3 sobre N entrevistas, no en impresiones.

---

## 3) Metodo de conteo

### 3.1 Tabla ejemplo
Ejemplo (N=5 entrevistas). Se marca con “1” si el nucleo aparece en el Top 3 de esa entrevista.

| Entrevista | A | B | C | D | E | Notas breves |
|---|---:|---:|---:|---:|---:|---|
| 1 | 1 | 0 | 1 | 0 | 1 | Top 3 declarado: A/C/E |
| 2 | 1 | 1 | 1 | 0 | 0 | Top 3 declarado: C/A/B |
| 3 | 1 | 0 | 1 | 1 | 0 | Top 3 declarado: A/C/D |
| 4 | 1 | 0 | 1 | 0 | 1 | Top 3 declarado: C/E/A |
| 5 | 0 | 1 | 1 | 0 | 1 | Top 3 declarado: C/B/E |

### 3.2 Logica de frecuencia
Para cada nucleo X, se calcula:

- **Frecuencia Top 3 (X):** (entrevistas donde X aparece en Top 3) / (N total de entrevistas)

La evidencia de prioridad se interpreta como:
- mayor frecuencia ⇒ mayor consistencia del dolor,
- menor frecuencia ⇒ dolor mas dependiente de contexto, menos estable o secundario.

---

## 4) Umbral numerico segun cantidad de entrevistas

> Nota: los umbrales propuestos balancean rigor con tamanos muestrales pequenos, asumiendo entrevistas cualitativas.

### 4.1 Para 5 entrevistas
Un nucleo **pasa Gate 1** si cumple simultaneamente:
- **Top 3 en al menos 3 de 5** entrevistas (>= 60%).
- Se obtienen **2 metricas base estimables** asociadas al nucleo.
- Se registra **1 ejemplo concreto reciente** (caso real narrado) por cada entrevista donde el nucleo fue priorizado.

Se **reevalua** si:
- aparece en Top 3 en 2 de 5 (40%),
- o si aparece en 3 de 5 pero no se logran metricas consistentes.

### 4.2 Para 8 entrevistas
Un nucleo **pasa Gate 1** si cumple simultaneamente:
- **Top 3 en al menos 5 de 8** entrevistas (>= 62.5%).
- Se obtienen **2 metricas base estimables** asociadas al nucleo.
- Se registra **1 ejemplo concreto reciente** en al menos 4 de las entrevistas donde fue Top 3.

Se **reevalua** si:
- aparece en Top 3 en 4 de 8 (50%),
- o si la prioridad depende de un subsegmento especifico no representado (sesgo de muestra).

### 4.3 Para 10 entrevistas
Un nucleo **pasa Gate 1** si cumple simultaneamente:
- **Top 3 en al menos 6 de 10** entrevistas (>= 60%).
- Se obtienen **2 metricas base estimables** asociadas al nucleo.
- Se registra **1 ejemplo concreto reciente** en al menos 5 de las entrevistas donde fue Top 3.

Se **reevalua** si:
- aparece en Top 3 en 5 de 10 (50%),
- o si los entrevistados no coinciden en “donde duele” (el dolor existe, pero no esta delimitado operacionalmente).

---

## 5) Requisitos adicionales obligatorios (ademas de Top 3)

### 5.1 Minimo 2 metricas base estimables
Para evitar un problema “interesante pero no medible”, cada nucleo candidato debe tener al menos **dos** metricas base que el entrevistado pueda:
- estimar de forma aproximada, o
- medir con registros simples (timestamps, conteo de interacciones, casos/semana).

Ejemplos de metricas base aceptables:
- tiempo de ciclo (mediana/p90),
- cantidad de idas y vueltas por caso,
- casos/semana con reconstruccion, etc.

### 5.2 Minimo 1 ejemplo concreto reciente
Para evitar respuestas abstractas o declarativas, se exige:
- al menos **un caso real reciente** por entrevista (ultima semana/mes) que ilustre el dolor.

El ejemplo debe incluir, cuando sea posible:
- que paso,
- cuanto demoro,
- y cual fue la consecuencia (retrabajo, perdida, conflicto).

### 5.3 Posibilidad de prueba practica (cuando aplique)
Cuando el nucleo lo permite, se intenta incluir una **prueba practica** simple (no invasiva) durante o despues de la entrevista, por ejemplo:
- buscar evidencia de una aceptacion en un caso reciente,
- reconstruir timeline de una cotizacion demorada,
- listar pendientes reales de un siniestro activo.

La prueba practica refuerza la calidad de evidencia sin transformar la entrevista en auditoria.

---

## 6) Regla de decision

### 6.1 Cuando un nucleo pasa Gate 1
Un nucleo pasa Gate 1 cuando se cumplen simultaneamente:
1) supera el umbral de frecuencia Top 3 segun N,
2) tiene al menos 2 metricas base estimables/medibles,
3) presenta ejemplos concretos recientes,
4) y el entrevistado puede describir con claridad “donde duele” (delimitacion operacional).

### 6.2 Cuando se reevalua
Se reevalua cuando:
- el nucleo aparece como dolor, pero no es prioritario (frecuencia insuficiente),
- no se logra definicion metrica consistente,
- o la evidencia se concentra en un unico perfil (sesgo).

La reevaluacion puede implicar:
- ajustar segmentacion,
- ajustar definicion operativa,
- o descartar el nucleo por no cumplir el Gate 1.

### 6.3 Como documentar la decision
La decision se documenta en `/workspace/brokia/decisiones/` como una entrada versionada que incluya:
- fecha,
- nucleo seleccionado,
- N entrevistas,
- tabla de conteo Top 3,
- metricas base definidas,
- ejemplos resumen,
- y justificacion de descarte de nucleos alternativos.
