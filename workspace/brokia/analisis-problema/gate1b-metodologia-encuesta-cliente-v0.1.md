# Brokia — Gate 1B: Metodologia de encuesta (perspectiva cliente) (v0.1)

**Fecha:** 2026-03-03  
**Version:** v0.1 (exploratoria)  
**Alcance:** validacion cuantitativa exploratoria del problema desde perspectiva cliente

---

## 1) Justificacion academica del uso de encuesta (vs entrevista)
Para la perspectiva cliente se adopta un instrumento de **encuesta estructurada** en lugar de entrevistas en profundidad por dos razones metodologicas principales:

1) **Acceso a volumen**: existe mayor disponibilidad de respondentes con seguro automotor, lo que habilita una medicion exploratoria con mayor N, reduciendo el riesgo de conclusiones apoyadas en casos aislados.
2) **Estandarizacion de medicion**: la encuesta permite aplicar escalas consistentes (1–5) para medir percepciones como claridad, confianza y dificultad, y estimar prevalencias de confusion o malentendidos por “momento” del ciclo de vida.

En terminos academicos, este enfoque busca aportar **evidencia descriptiva** (frecuencias/porcentajes) para complementar la evidencia cualitativa proveniente de corredores.

---

## 2) Diferencia entre validacion cualitativa (corredor) y cuantitativa exploratoria (cliente)

- **Gate 1A (corredores, cualitativo)**: apunta a identificar y priorizar nucleos de problema desde la operacion (friccion, retrabajo, tiempos), y a obtener ejemplos concretos y metricas base estimables. La entrevista permite capturar causalidad percibida, contexto y delimitacion operacional.

- **Gate 1B (clientes, cuantitativo exploratorio)**: apunta a medir **prevalencia** y **severidad percibida** de confusion/friccion a lo largo de momentos del ciclo (cotizacion, emision, renovacion, cambios, siniestros). La encuesta privilegia comparabilidad y volumen por encima de profundidad narrativa.

Ambos instrumentos se consideran complementarios: Gate 1A explica “como y por que duele” en la operacion; Gate 1B estima “a cuantas personas les duele y en que momentos”.

---

## 3) Objetivo de la encuesta (cliente)
La encuesta tiene como objetivos operativos:

1) **Identificar momentos de mayor friccion** del ciclo de vida del seguro automotor reportados por clientes.
2) **Medir claridad percibida** sobre condiciones y coberturas.
3) **Medir confianza** del cliente en que comprendio lo contratado.
4) **Detectar frecuencia de malentendidos o sorpresas** vinculadas a cobertura/condiciones o a gestiones (renovacion, cambios, siniestro).

El instrumento no busca evaluar satisfaccion global ni comparar aseguradoras; se centra en friccion y comprension.

---

## 4) Criterio de validacion (umbral y cruce con nucleos A/B/C/D/E)

### 4.1 Umbral porcentual de relevancia
Se define un umbral exploratorio para considerar que un momento/problema es relevante desde perspectiva cliente:

- **Confusion significativa:** porcentaje de respondentes que reporta confusion alta en un momento (escala 1–5) con valores **4–5**.

Criterios sugeridos:
- Si **>= 40%** reporta confusion 4–5 en un momento, se considera **relevante**.
- Si **25%–39%**, se considera **moderado** (requiere triangulacion con Gate 1A).
- Si **< 25%**, se considera **bajo** (no prioritario desde cliente en esta etapa).

> Nota: los umbrales son deliberadamente simples para fase exploratoria; su funcion es priorizar, no probar causalidad.

### 4.2 Cruce de resultados con nucleos
El cruce se realiza por correspondencia entre “momentos” y nucleos:
- **Cotizacion** → Nucleo A
- **Cambio de vehiculo / cancelacion** → Nucleo B
- **Confianza/claridad de condiciones + malentendidos** (transversal) → Nucleo C (y, segun el caso, E)
- **Siniestro (seguimiento/pendientes)** → Nucleo D
- **Renovacion/comparacion** → Nucleo E

El cruce debe registrarse explicitamente como una tabla de correspondencia y, cuando un item sea mixto, consignar secundario.

---

## 5) Regla de decision (triangulacion Gate 1A + Gate 1B)

### 5.1 Si cliente y corredor coinciden
Si un nucleo aparece como prioritario en Gate 1A (Top 3 consistente) y el/los momentos asociados superan el umbral en Gate 1B, se refuerza la prioridad y se reduce el riesgo de sesgo de muestra.

### 5.2 Si cliente y corredor NO coinciden
Si hay divergencia, se aplica la siguiente regla:

- Si **corredor alto / cliente bajo**: puede tratarse de un dolor principalmente operativo (backoffice) no visible para cliente. No invalida el nucleo, pero exige justificarlo como eficiencia/escala/riesgo operacional, y demostrar medibilidad en operacion.

- Si **cliente alto / corredor bajo**: puede existir dolor percibido por cliente que el corredor ya normalizo o no percibe como prioridad. Se requiere re-evaluar segmentacion y revisar si el nucleo esta correctamente formulado o si hay un subsegmento de clientes no cubierto por Gate 1A.

En ambos casos, se documenta la divergencia como hallazgo y se decide si afecta la seleccion final del nucleo.

### 5.3 Como se documenta la conclusion
La conclusion de Gate 1B se documenta en `analisis-problema/` con:
- N total,
- distribucion de perfiles,
- porcentajes por momento,
- ranking de frustracion,
- cruce a nucleos,
- y recomendacion: “impacta Gate 1 (si/no)”.

La decision final de nucleo se registra en `/workspace/brokia/decisiones/` incorporando explicitamente la triangulacion Gate 1A + Gate 1B.
