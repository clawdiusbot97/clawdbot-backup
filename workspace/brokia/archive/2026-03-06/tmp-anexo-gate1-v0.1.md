# Brokia — Anexo metodologico Gate 1 (v0.1)

**Fecha:** 2026-03-04  
**Estado:** anexo metodologico (detalle completo)

---

## A) Gate 1A completo (corredores)

### A.1 Definicion Top 3, metodo de conteo y umbrales numericos
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

---

### A.2 Plantilla de entrevista (guion operativo)
# Guion operativo — Entrevista Gate 1 (v0.2)

**Duracion objetivo:** 30–40 minutos  
**Objetivo:** identificar dolores, forzar ranking Top 3 y capturar 2 metricas base (sin abrumar)

---

## A) Contexto (5 min)
1) ¿Cual es tu rol y como es tu operacion (corredor individual, agencia, backoffice)?
2) ¿Que volumen manejas en automotor? (aprox. casos/semana o polizas activas)
3) ¿Que canales usas para operar? (mensajeria, llamadas, portales, presencial)

## B) Dolores abiertos (10–12 min)
4) Contame el flujo tipico desde que entra un cliente hasta que queda resuelto (cotizacion / emision / renovacion / postventa).
5) ¿En que parte del flujo se tranca mas seguido?
6) ¿Que cosas te generan mas retrabajo (idas y vueltas) y por que?
7) ¿Que situaciones terminan en malentendidos o conflictos con clientes?
8) Si tu volumen creciera 50% manana, ¿que parte explotaria primero?

## C) Ranking Top 3 (obligatorio) (5 min)
9) De todo lo que mencionaste, elegi tus **3 dolores principales hoy**. (Top 3)
10) Si tuvieras que ordenar esos 3: ¿cual es #1, cual #2 y cual #3? (si no quiere ordenar, mantener Top 3 sin orden)
11) De esos 3:
   - ¿Cual te duele mas por **tiempo**?
   - ¿Cual por **impacto economico**?
   - ¿Cual por **riesgo/conflicto**?

## D) Deep dive sobre 1 nucleo (10–12 min)
> Elegir **solo 1 nucleo** para profundizar: el que la persona priorizo mas alto.

12) Para tu dolor #1, contame un ejemplo concreto reciente (ultima semana/mes): ¿que paso y cual fue el impacto?
13) En ese ejemplo, ¿que fue lo que mas tiempo consumio o que parte genero mas friccion?
14) Si tuvieras que medir este dolor, ¿que dos numeros te gustaria tener cada semana? (elegir 2 metricas base)

**Prueba practica (elegir 1, segun nucleo priorizado):**
15) (A) Cotizacion: elegi una cotizacion reciente demorada y reconstruimos timeline (inicio → primer feedback → datos completos → entrega). ¿cuanto tardo cada tramo?
    (B) Cambios/cancelaciones: elegi un caso reciente y anotamos tiempo total + # interacciones + monto de ajuste/devolucion.
    (C) Trazabilidad: elegi un caso de hace 2 meses y busca donde quedo registrada una aceptacion/condicion. ¿en cuanto tiempo la encontras?
    (D) Post-siniestro: elegi un siniestro activo o cerrado y listemos hitos + pendientes + tiempos entre hitos.
    (E) Renovacion: elegi una renovacion reciente con friccion y reconstruimos motivo + timeline + punto de confusion.

## E) Captura de 2 metricas base (3–5 min)
16) Para las 2 metricas elegidas: ¿como las estimarias hoy (aprox.)? ¿existe algun registro simple (timestamps, mensajes, planilla)?
17) Si repitieramos la medicion en 2 semanas: ¿que cambio esperarias ver para decir “esto mejoro”?

---

### Instrucciones para el entrevistador (breves)
- No cubrir todos los nucleos: forzar Top 3 y profundizar **solo 1**.
- Registrar frases literales para justificar mapeo a A/B/C/D/E.
- Evitar preguntas tecnicas o de solucion; mantener foco en problema, friccion, tiempos y ejemplos.

---

### A.3 Plantilla de registro de entrevista
# Plantilla de registro — Entrevista Gate 1 (v0.2)

---

## Identificacion
- **Fecha:** YYYY-MM-DD
- **Entrevistador:**
- **Duracion (min):**

## Perfil del entrevistado
- **Rol:** (corredor / agencia / administrativo / otro)
- **Tamano de operacion:** (personas)
- **Antiguedad en el rubro:**
- **Ramo:** (automotor principalmente / mixto)

## Volumen aproximado
- **Casos por semana (aprox.):**
- **Polizas activas (aprox., si aplica):**
- **Renovaciones por mes (aprox., si aplica):**

## Canales utilizados
- **Mensajeria:** (si/no) — ¿cual?
- **Llamadas:** (si/no)
- **Portales de aseguradoras:** (si/no)
- **Presencial:** (si/no)
- **Otros:**

## Dolores mencionados (lista)
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)

## Top 3 declarados (obligatorio)
- **#1:** (texto literal)
- **#2:** (texto literal)
- **#3:** (texto literal)

### Mapeo a nucleos (A/B/C/D/E)
- **Nucleo #1:** (A/B/C/D/E/mixto) — Justificacion (frase del entrevistado):
- **Nucleo #2:** (A/B/C/D/E/mixto) — Justificacion (frase del entrevistado):
- **Nucleo #3:** (A/B/C/D/E/mixto) — Justificacion (frase del entrevistado):

## Nucleo profundizado
- **Nucleo:** (A/B/C/D/E)
- **Por que se eligio:** (p. ej., fue dolor #1)

## Metricas estimadas (minimo 2)
- **Metrica 1 (definicion + valor aprox.):**
- **Metrica 2 (definicion + valor aprox.):**
- (Opcional) **Metrica 3:**

## Ejemplo concreto (caso reciente)
- **Descripcion breve del caso:**
- **Timeline (si aplica):**
- **Impacto (tiempo / negocio / riesgo):**

### Nivel de severidad percibido
- **Severidad (1–10):**

## Observaciones del entrevistador
- Notas de contexto
- Ambiguedades
- Contradicciones
- Señales de sesgo (p. ej., caso excepcional)

## Evaluacion preliminar (Gate 1)
- ¿El nucleo profundizado aparece como Top 3? (si/no)
- ¿Hay 2 metricas base estimables? (si/no)
- ¿Hay ejemplo concreto reciente? (si/no)
- ¿Se pudo delimitar “donde duele”? (si/no)

**Comentario preliminar:**

---

### A.4 Guia de mapeo de nucleos
# Guia de mapeo rapido — Nucleos A/B/C/D/E (v0.1)

**Proposito:** reducir ambiguedad al mapear dolores declarados por entrevistados a los nucleos A/B/C/D/E durante Gate 1.

---

## 1) Definicion corta por nucleo (2–3 lineas)

### Nucleo A — Cotizacion multi-aseguradora
Dolor centrado en el **cuello de botella operativo** para obtener y comparar cotizaciones entre varias aseguradoras: captura/normalizacion de datos, reprocesos por faltantes y tiempos de ciclo elevados.

### Nucleo B — Cambios / cancelaciones
Dolor centrado en la **complejidad financiera y administrativa** de endosos, cambios de vehiculo y cancelaciones: prorrateos, devoluciones, penalizaciones, correcciones y reclamos por montos.

### Nucleo C — Trazabilidad contractual
Dolor centrado en la **falta de evidencia recuperable** sobre decisiones y aceptaciones (que/por que/cuando/bajo que condicion), con informacion dispersa que obliga a reconstruir casos, afecta continuidad y aumenta riesgo de conflicto.

### Nucleo D — Post-siniestro / seguimiento
Dolor centrado en el **seguimiento del caso post-siniestro**: hitos, pendientes documentales, tiempos entre etapas, preguntas recurrentes de estado (“en que esta”) y escalaciones.

### Nucleo E — Renovacion / comparacion
Dolor centrado en la **renovacion** y la dificultad de comparar cambios de condiciones (prima, deducibles, exclusiones, servicios), con friccion que impacta retencion/churn y volumen estacional.

---

## 2) Frases tipicas (3 ejemplos por nucleo)

### Nucleo A
- “Me paso el dia pidiendo datos que faltan para poder cotizar.”
- “Con cada aseguradora es distinto; termino rehaciendo todo varias veces.”
- “La gente se me cae porque tardo en mandar la primera opcion.”

### Nucleo B
- “Cuando hay cambio de auto, nunca es claro cuanto termina pagando o devolviendo.”
- “Las cancelaciones generan discusiones por el prorrateo o penalizacion.”
- “Estos casos me llevan muchas idas y vueltas y despues hay que corregir.”

### Nucleo C
- “No encuentro donde quedo aceptado tal deducible/cobertura; queda en audios o chats.”
- “A los meses me preguntan por que se recomendo eso y es dificil reconstruirlo.”
- “Si lo atiende otra persona, se pierde todo el contexto y se arranca de cero.”

### Nucleo D
- “Lo que mas me preguntan es ‘en que esta el siniestro’.”
- “Siempre falta algun papel y se vuelve a pedir, y ahi se tranca todo.”
- “Entre taller, perito y aseguradora, se alarga y el cliente se enoja.”

### Nucleo E
- “En renovacion, el cliente compara por precio y no entiende cambios de condiciones.”
- “Cuando sube la prima, se me van o discuten y lleva muchas interacciones.”
- “En ciertos meses se me juntan las renovaciones y no doy abasto.”

---

## 3) Reglas para dolores mixtos

### 3.1 Como elegir nucleo dominante
Si un dolor declarado parece tocar mas de un nucleo, seleccionar como **dominante** el que mejor explique:
- **la causa principal del retraso/retrabajo** narrado,
- o **la consecuencia principal** (perdida, conflicto, riesgo) que el entrevistado enfatiza.

Regla practica:
- Si el entrevistado enfatiza “tardo/idas y vueltas para cotizar” ⇒ A.
- Si enfatiza “montos/prorrateos/devoluciones/penalizaciones” ⇒ B.
- Si enfatiza “no se puede reconstruir / no hay evidencia / se pierde contexto” ⇒ C.
- Si enfatiza “estado del siniestro / pendientes / hitos” ⇒ D.
- Si enfatiza “vencimientos / renovacion / comparacion de condiciones” ⇒ E.

### 3.2 Como anotar nucleo secundario
- Registrar el secundario en las **Notas** del registro de entrevista (no en el conteo), con una frase breve.
- Ejemplo: “Dominante A; secundario C (datos quedaron dispersos en chats)”.

---

## 4) Regla de conteo (obligatoria)
- El **conteo Top 3** exige asignar **1 nucleo por cada item** del Top 3.
- Si un item es mixto, se define **1 dominante** para conteo y se anota el secundario en notas.

---

## B) Gate 1B completo (clientes)

### B.1 Justificacion y metodologia de encuesta
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

---

### B.2 Encuesta estructurada
# Encuesta — Validacion cliente Gate 1B (v0.2)

**Duracion estimada:** < 5 minutos  
**Formato:** preguntas cerradas (escala 1–5 y opcion multiple) + 1 ranking + 1 abierta opcional

> Instruccion para implementacion (Google Forms u otro): mantener todas las preguntas como obligatorias excepto la ultima abierta.

---

## A) Perfil basico

1) **Rango de edad**
- ( ) 18–24
- ( ) 25–34
- ( ) 35–44
- ( ) 45–54
- ( ) 55–64
- ( ) 65+

2) **Hace cuantos anos tenes seguro automotor (aprox.)**
- ( ) < 1 ano
- ( ) 1–3 anos
- ( ) 4–7 anos
- ( ) 8–12 anos
- ( ) 13+ anos

3) **Tipo de seguro que tenes actualmente (elige 1)**
- ( ) Responsabilidad civil
- ( ) Terceros
- ( ) Todo riesgo
- ( ) No se / no estoy seguro

---

## B) Experiencia reciente (ultima gestion relevante)

4) **En los ultimos 12 meses, cual fue tu gestion mas relevante con tu seguro? (elige 1)**
- ( ) Cotizar / comparar opciones
- ( ) Emitir / contratar una poliza
- ( ) Renovar
- ( ) Cambio de vehiculo / endoso / cancelacion
- ( ) Gestion por siniestro
- ( ) No hice gestiones relevantes

5) **Que tan dificil te resulto esa gestion?** (1–5)
- 1 Muy facil
- 2
- 3
- 4
- 5 Muy dificil

---

## C) Momentos de mayor confusion (1–5)

6) **Cotizacion:** Que tan confundido/a te sentiste al cotizar o comparar opciones? (1–5)
7) **Emision/contratacion:** Que tan claro te fue que estabas contratando (condiciones/cobertura)? (1–5)
8) **Renovacion:** Que tan claro te fue lo que cambiaba al renovar? (1–5)
9) **Cambio de vehiculo / cancelacion:** Que tan claro te fue el impacto economico (prorrateos, devoluciones, penalizaciones)? (1–5)
10) **Siniestro:** Que tan claro te fue el estado del tramite y los proximos pasos? (1–5)

> Nota de escala para 6–10:
> 1 Nada confundido/a / muy claro
> 5 Muy confundido/a / nada claro

---

## D) Claridad de condiciones y coberturas

11) **En general, que tan claro/a sentis que tenes las coberturas y exclusiones de tu seguro?** (1–5)
- 1 Muy claro
- 2
- 3
- 4
- 5 Nada claro

---

## E) Confianza

12) **Que tan confiado/a estas de que entendiste correctamente lo que contrataste?** (1–5)
- 1 Muy confiado/a
- 2
- 3
- 4
- 5 Nada confiado/a

---

## F) Malentendidos o sorpresas

13) **Alguna vez tuviste un malentendido o una sorpresa sobre lo que tu seguro cubria o no cubria?**
- ( ) Si
- ( ) No
- ( ) No estoy seguro/a

---

## I) Relacion con tu corredor

16) ¿Que tan disponible sentis que esta tu corredor cuando lo necesitas? (1–5)
1 Muy disponible
2
3
4
5 Nunca disponible

17) Cuando necesitas una gestion, ¿cuanto suele tardar en responderte?
( ) Menos de 1 hora
( ) En el dia
( ) 1–2 dias
( ) Mas de 2 dias
( ) No tengo corredor

18) ¿Que tan claras te resultan las explicaciones que te da tu corredor? (1–5)
1 Muy claras
2
3
4
5 Nada claras

19) ¿Sentis que tu corredor te asesora activamente o solo ejecuta lo que pedis?
( ) Me asesora activamente
( ) A veces asesora
( ) Solo ejecuta lo que pido
( ) No tengo corredor

20) En una escala 1–5, ¿que tan acompanado/a te sentis por tu corredor ante un problema?
1 Muy acompanado/a
2
3
4
5 Nada acompanado/a

---

## G) Ranking (2 momentos mas frustrantes)

14) **Elegí los 2 momentos mas frustrantes para vos** (selecciona 2)
- [ ] Cotizacion
- [ ] Emision/contratacion
- [ ] Renovacion
- [ ] Cambio de vehiculo / cancelacion
- [ ] Siniestro

---

## H) Pregunta abierta final (opcional)

15) **Si pudieras mejorar una cosa de tu experiencia con seguros, ¿cual seria?**
(Respuesta abierta)

---

### B.3 Plantilla de analisis de resultados
# Plantilla — Analisis de encuesta cliente Gate 1B (v0.1)

**Fecha de analisis:** YYYY-MM-DD  
**Fuente:** encuesta-validacion-cliente-gate1b-v0.1  

---

## 1) N total de respuestas
- **N:**
- **Periodo de recoleccion:**
- **Canal de distribucion:**

---

## 2) Distribucion por perfil

### 2.1 Rango de edad
- 18–24: ___%
- 25–34: ___%
- 35–44: ___%
- 45–54: ___%
- 55–64: ___%
- 65+: ___%

### 2.2 Antiguedad con seguro
- < 1 ano: ___%
- 1–3 anos: ___%
- 4–7 anos: ___%
- 8–12 anos: ___%
- 13+ anos: ___%

### 2.3 Tipo de seguro
- Responsabilidad civil: ___%
- Terceros: ___%
- Todo riesgo: ___%
- No se / no estoy seguro: ___%

---

## 3) Resultados por momento (confusion alta 4–5)

> Definicion: “confusion significativa” = respuestas 4–5 en escala 1–5.

- **Cotizacion (A):** ___% (4–5)
- **Emision/contratacion:** ___% (4–5)
- **Renovacion (E):** ___% (4–5)
- **Cambio de vehiculo/cancelacion (B):** ___% (4–5)
- **Siniestro (D):** ___% (4–5)

### 3.1 Interpretacion por umbral
- Relevante (>=40%):
- Moderado (25%–39%):
- Bajo (<25%):

---

## 4) Claridad y confianza (distribucion)

- **Claridad general de coberturas/exclusiones (P11):**
  - Promedio (1–5):
  - % 4–5 (baja claridad):

- **Confianza en que entendio lo contratado (P12):**
  - Promedio (1–5):
  - % 4–5 (baja confianza):

- **Sorpresa/malentendido (P13):**
  - % Si:
  - % No:
  - % No estoy seguro:

---

## 5) Ranking de momentos mas frustrantes (P14)

- #1:
- #2:
- #3:

(Agregar tabla con conteo por opcion si se dispone)

---

## 6) Cruce con nucleos A/B/C/D/E

### 6.1 Correspondencia
- Cotizacion → A
- Cambio de vehiculo/cancelacion → B
- Claridad/Confianza/Malentendidos → C (transversal) y/o E
- Siniestro → D
- Renovacion → E

### 6.2 Coincidencia o no con Gate 1A
- Nucleos prioritarios en Gate 1A (corredores):
- Momentos prioritarios en Gate 1B (clientes):
- Coincidencias:
- Divergencias:

---

## 7) Conclusion preliminar
- Hallazgo principal:
- Hallazgos secundarios:
- Limitaciones (sesgo de muestra, canal, N, etc.):

---

## 8) Decision: impacta Gate 1 o no
- ¿Los resultados Gate 1B refuerzan el/los nucleos candidatos? (si/no)
- ¿Requiere re-evaluar segmentacion o definicion operativa? (si/no)
- Recomendacion:

---

## 9) Anexo: respuestas abiertas (P15)
- Temas recurrentes:
- Citas representativas (3–5):

---

## C) Mapa conceptual actualizado (v0.2 con Broker)
# BROKIA - Mapa Conceptual del Sistema (v0.2)

**Fecha:** 2026-03-04  
**Estado:** Borrador para revision  
**Enfoque:** Analisis del sistema tal cual existe (pre-intervencion)  
**Rol:** PM interno prepara, Manu revisa y envia como cara visible

---

## 📋 PLAN DE TAREAS POR EQUIPO

### Juan Manuel (Corredor, Experiencia de Campo)

| # | Tarea | Entregable | Deadline |
|---|-------|------------|----------|
| 1 | **Mapear flujo completo de una cotizacion** | Secuencia paso a paso: desde que llega el cliente hasta que se emite la poliza. Incluir: quien hace que, cuanto tarda cada paso, que herramientas usa, donde se pierde tiempo | 2 dias |
| 2 | **Identificacion de NPO (Necesidades, Problemas, Oportunidades)** | Para cada actor que interactua con vos: ¿que necesitan? ¿que les duele? ¿donde hay oportunidad de mejora? | 2 dias |
| 3 | **Actores ocultos** | ¿Quien mas interviene en una operacion ademas de cliente-vos-aseguradora? (ej: tasadores, gestores de siniestros, familia del cliente, etc.) | 2 dias |

### Rodrigo (Legal → Sistemas)

| # | Tarea | Entregable | Deadline |
|---|-------|------------|----------|
| 1 | **Entrevistas a corredores** | Guion + notas de 2-3 entrevistas con corredores (no JM). Enfocarse en: ¿como es su dia a dia? ¿que les estresa? ¿que harian diferente si pudieran? | 3 dias |
| 2 | **Analisis regulatorio** | ¿Que obligaciones tiene un corredor? ¿Que informacion debe conservar y por que? ¿De donde vienen las presiones de compliance? | 3 dias |
| 3 | **Mapeo de incentivos** | ¿Quien gana que en cada parte del proceso? ¿Como se alinean (o no) los intereses de cada actor? | 3 dias |

### Manuel (Producto/Tesis)

| # | Tarea | Entregable | Deadline |
|---|-------|------------|----------|
| 1 | **Validar estructura contra PDF de emprendimientos** | Confirmar que estamos cubriendo: Identificacion del problema / Clientes y actores clave / NPO / User Journey | 1 dia |
| 2 | **Compilacion v1 del analisis sistemico** | Documento integrando insumos del equipo, enfocado 100% en el "estado actual" sin proponer soluciones | 3 dias |
| 3 | **Validacion con JM** | 1-2 ciclos de feedback para confirmar que capturamos la realidad del campo | 4-5 dias |

---

## 🗺️ MAPA CONCEPTUAL DEL SISTEMA

### 1. ACTORES

Quien participa en el ecosistema de intermediacion de seguros de automotores.

#### Actores Primarios

| Actor | Rol | Intereses | Poder de decision |
|-------|-----|-----------|-------------------|
| **Asegurado (cliente final)** | Necesita proteccion para su vehiculo | Obtener el mejor precio/cobertura con minimo esfuerzo | Alto (elige corredor, acepta o rechaza propuestas) |
| **Corredor de seguros** | Intermediario, asesor, operador | Maximizar operaciones atendidas sin sacrificar calidad; cumplir regulatoria | Medio-Alto (recomienda, gestiona, pero no fija precios) |
| **Broker (intermediario tecnico-comercial)** | Intermediario entre corredor y compania | Soporte operativo, tecnico y comercial; destrabar excepciones; acelerar gestiones | Medio (influye en tiempos y resolucion, no define pricing final) |
| **Aseguradora (compania)** | Provee cobertura | Vender polizas rentables; minimizar riesgo y fraude | Alto (fija precios, acepta/rechaza riesgos) |
| **SUSE/Regulador** | Supervisa el mercado | Cumplimiento normativo; trazabilidad de operaciones; proteccion del asegurado | Alto (puede sancionar, exige registros) |

#### Broker (intermediario tecnico-comercial) — definicion conceptual
- Intermediario entre **Corredor** y **Compania de Seguros**.
- Provee soporte operativo, tecnico y comercial al corredor.
- Representa una o varias companias.
- Tiene **ejecutivo asignado** al corredor (relacion personalizada Corredor–Ejecutivo).
- Facilita gestiones que el corredor no puede resolver directamente.
- Canal frecuente en: cotizaciones, emisiones complejas, cambios, siniestros, excepciones.

#### Actores Secundarios

| Actor | Rol | Cuando interviene |
|-------|-----|-------------------|
| **Productor asesor (corredores junior)** | Apoya en operativa baja | Cotizaciones masivas, seguimientos |
| **Tasadores/Peritos** | Valoran vehiculos en casos especiales | Autos usados sin referencia clara, siniestros previos |
| **Familia/Referente del asegurado** | Influye la decision | Cuando el asegurado no entiende o necesita validacion |
| **Sistemas/Plataformas** | Habilitan/dificultan operaciones | Portales de aseguradoras, mensajeria, planillas, email |
| **Banco/Financiera (si hay prestamo)** | Exige seguro como garantia | Cuando el vehiculo esta prendado |

---

### 2. RELACIONES (estructura del ecosistema)

#### Relacion dominante (observada)

Cliente
 ↓
Corredor
 ↓
Broker (opcional pero frecuente)
 ↓
Compania de Seguros

#### Reglas y variaciones relevantes
- El **corredor puede trabajar con varios brokers** (segun companias, productos o relaciones historicas).
- Un **broker puede representar varias companias**.
- El corredor **puede tratar directo** con una compania, pero **no es el flujo dominante** cuando hay excepciones, emisiones complejas o gestion postventa.
- Existe una relacion personalizada **Corredor–Ejecutivo de Broker**, que actua como canal de destrabe.

---

### 3. INCENTIVOS

¿Que motiva a cada actor? ¿Donde se alinean? ¿Donde chocan?

#### Mapa de Incentivos

```
ASEGURADO          CORREDOR           BROKER              ASEGURADORA         REGULADOR
───────────        ─────────          ─────────           ───────────         ─────────
• Precio bajo      • Volumen alto      • Flujo ordenado    • Prima alta        • Compliance
• Cobertura alta   • Tiempo bajo por   • Resolver rapido   • Riesgo bajo       • Trazabilidad
• Esfuerzo minimo    operacion         • Evitar reclamos   • Costo bajo        • Quejas minimas
• Rapidez total    • Satisfaccion      • Relacion estable  • Retencion         • Estabilidad
• Confianza          cliente             con corredor        cliente             mercado
                   • Sin sanciones     • Cumplir SLAs      • Sin fraude        • Transparencia
```

#### Tensiones de Incentivos (ejemplos)

| Actores | Incentivos en conflicto | Resultado |
|---------|--------------------------|-----------|
| Asegurado vs Aseguradora | Precio bajo vs Prima alta | Negociacion, comparacion, desconfianza inicial |
| Corredor vs Tiempo | Volumen alto vs Calidad por operacion | Prisa, errores, oportunidades perdidas |
| Corredor vs Regulador | Rapidez vs Trazabilidad completa | Doble trabajo (operar + documentar) |
| Broker vs Aseguradora | Resolver excepciones vs Politicas/tiempos internos | Demoras, escalaciones, idas y vueltas |
| Corredor vs Broker | Necesidad de respuesta rapida vs disponibilidad/cola del ejecutivo | Esperas y dependencia del canal humano |

---

### 4. FLUJOS

Como se mueve la informacion, el dinero y las decisiones.

#### 4.1 Flujo de informacion (con Broker)

```
┌─────────────┐
│  CLIENTE    │◀── Datos desordenados (mensajeria, tel, mail)
│ (intencion) │    "Quiero asegurar el auto"
└──────┬──────┘
       │
       ▼
┌────────────────────────────────────────────────────────────┐
│                    CORREDOR                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Pide datos  │  │ Cotiza en   │  │ Compara y elige     │ │
│  │ faltantes   │  │ N portales  │  │ opcion a presentar  │ │
│  │ (perseguir) │  │ diferentes  │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└────────────────────────────────────────────────────────────┘
       │
       │ (frecuente en excepciones / casos complejos)
       ▼
┌────────────────────────────────────────────────────────────┐
│                    BROKER                                  │
│  • Ejecutivo asignado al corredor                           │
│  • Destraba requisitos/documentacion                        │
│  • Canaliza consultas a companias                           │
└────────────────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────────┐
│                 ASEGURADORAS (COMPANIAS)                   │
│  • Cada una recibe datos en formato propio                 │
│  • Devuelven cotizacion o rechazo                          │
│  • No se "hablan" entre ellas                              │
└────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│   CLIENTE   │◀── Propuesta presentada (manualmente)
│ (decision)  │    "Esta es la mejor opcion porque..."
└──────┬──────┘
       │
       ▼
┌────────────────────────────────────────────────────────────┐
│                    EMISION                                 │
│  • Corredor (y a veces broker) coordinan la emision         │
│  • Puede haber re-carga o retrabajo de datos                │
│  • Poliza emitida, comision registrada                      │
└────────────────────────────────────────────────────────────┘
```

#### 4.2 Flujo de dinero

| Paso | Quien paga | A quien | Concepto |
|------|------------|---------|----------|
| 1 | Asegurado | Aseguradora | Prima del seguro |
| 2 | Aseguradora | Corredor | Comision por intermediacion |
| 3 | (Opcional) Aseguradora | Broker | Comision/estructura comercial (segun acuerdo) |
| 4 | Asegurado | Corredor | Fee/servicio (si aplica) |

> Nota: la estructura exacta de remuneracion puede variar; el objetivo del mapa es reconocer la existencia del actor y su influencia operativa.

#### 4.3 Flujo de decision (incorporando Broker)

1. **Cliente decide** → ¿Busco corredor o voy directo a compania?
2. **Corredor decide** → ¿Que companias cotizo para este cliente?
3. **Broker (si participa) decide** → ¿Que canal prioriza? ¿Que excepciones destraba? ¿Que informacion solicita adicional?
4. **Aseguradoras deciden** → ¿Acepto este riesgo? ¿A que precio?
5. **Corredor decide** → ¿Que opcion recomiendo? ¿Por que?
6. **Cliente decide** → ¿Acepto la recomendacion? ¿Pido alternativas?
7. **Corredor/Broker coordinan** → Emision y gestiones posteriores.

---

### 5. FRICCIONES

Donde se pierde energia, tiempo, dinero, confianza.

#### 5.1 Fricciones operativas (incluyendo Broker)

| Punto | Descripcion | Costo |
|-------|-------------|-------|
| **Captura desestructurada** | El cliente envia datos sin formato por mensajeria. El corredor debe interpretar, organizar, pedir faltantes | 5-15 min + dias de ida-vuelta |
| **Documentacion dispersa** | Cada compania pide campos ligeramente diferentes. Hay que "traducir" datos cada vez | 3-5 min por portal |
| **Multi-portales** | Login separado, interfaces diferentes, campos en distinto orden para cada compania | 10-20 min por compania |
| **Comparacion manual** | Copiar resultados para presentar al cliente. Riesgo de error, omision de opcion | 5-10 min + riesgo de error |
| **Doble carga** | Los datos ingresados para cotizar se vuelven a cargar (o transcriben) para emitir | 5-10 min repetidos |
| **Dependencia Corredor–Broker** | Casos se trancan esperando respuesta del ejecutivo o canalizacion hacia compania | Horas/dias; incertidumbre y retrabajo |
| **Demora Broker–Compania** | El broker depende de tiempos internos/validaciones de compania | Variabilidad alta; “cuellos” fuera de control del corredor |

#### 5.2 Fricciones de informacion

| Punto | Descripcion | Impacto |
|-------|-------------|---------|
| **Asimetria cliente** | El cliente no sabe si la cotizacion presentada es realmente la mejor disponible | Desconfianza, negociacion, churn |
| **Asimetria corredor** | El corredor no ve precios "reales" hasta cotizar, no puede pre-cotizar rapido | Pierde clientes impacientes, no puede asesorar proactivamente |
| **Sin memoria institucional** | Cada operacion es "nueva", no se reutiliza conocimiento de clientes previos | Ineficiencia, errores repetidos |
| **Cadena de traduccion** | Al agregarse broker, aumenta el riesgo de perdida de contexto entre actor y actor | Malentendidos y retrabajo |

#### 5.3 Fricciones regulatorias

| Punto | Descripcion | Impacto |
|-------|-------------|---------|
| **Trazabilidad manual** | Se debe poder justificar por que se recomendo X compania/cobertura. Hoy: notas personales, memoria | Riesgo sancion, estres, tiempo extra documentando |
| **Conservacion de registros** | Obligacion de guardar comunicaciones y documentos. Hoy: mensajeria personal, emails dispersos | Riesgo no-compliance, perdida de informacion |

---

### 6. TENSIONES ESTRUCTURALES

Conflictos sistemicos que persisten independientemente de la "voluntad" de los actores.

#### Tension 1: Eficiencia vs Compliance
> El corredor necesita ser rapido para atender mas clientes y competir. El regulador necesita trazabilidad completa para supervisar. Cada segundo en "documentar para auditoria" es un segundo no atendiendo clientes.

**Manifestacion:** Corredores operan a contrarreloj y dejan la documentacion "para despues", acumulando deuda regulatoria.

#### Tension 2: Personalizacion vs Estandarizacion
> Cada cliente tiene datos unicos. Cada compania tiene requisitos de entrada diferentes. No hay formato unico que sirva para todos.

**Manifestacion:** "Traduccion" constante de datos, errores de transcripcion, perdida de informacion en el traspaso.

#### Tension 3: Volumen vs Calidad de Asesoramiento
> Mientras mas clientes atiende un corredor, menos tiempo puede dedicarle a cada uno para entender sus necesidades reales y asesorar genuinamente.

**Manifestacion:** Corredores se convierten en "operadores de cotizacion" mas que asesores.

#### Tension 4: Transparencia del Cliente vs Eficiencia del Corredor
> El cliente ideal aporta datos completos de entrada. La realidad: datos parciales, incorrectos, o "lo que se acuerda". El corredor debe "perseguir" informacion.

**Manifestacion:** Ciclos de ida-vuelta, demoras de dias, frustracion en ambos lados.

#### Tension 5: Fragmentacion del Mercado Asegurador
> Multiples companias compiten, cada una con sistemas propietarios y formatos de datos distintos.

**Manifestacion:** Trabajo manual obligatorio y barrera de entrada para estandarizar la operacion.

#### Tension 6 (nueva): Dependencia de canal humano Broker–Compania
> El broker puede acelerar excepciones, pero introduce un eslabon adicional con disponibilidad, prioridades internas y tiempos propios.

**Manifestacion:** el corredor queda expuesto a demoras y variabilidad fuera de su control directo, especialmente en emisiones complejas, cambios y siniestros.

---

## Implicancias para validacion Gate 1

1) **Nucleos potencialmente mas afectados por Broker:**
- **A (cotizacion multi-aseguradora):** parte del tiempo de ciclo puede depender del broker (destrabe, requisitos, consultas a compania).
- **B (cambios/cancelaciones):** prorrateos, excepciones y correcciones pueden pasar por broker, agregando iteraciones.
- **D (post-siniestro/seguimiento):** el estado del tramite y los pendientes pueden depender del broker y de su coordinacion con compania/taller/perito.

2) **Partes del dolor fuera del control directo del corredor:**
- Demoras por disponibilidad del ejecutivo.
- Tiempos de respuesta broker–compania.
- Requisitos adicionales o cambios de criterio que llegan por el broker.

3) **Riesgo metodologico si no se modela este actor:**
- Atribuir al corredor demoras cuyo origen esta en broker/compania.
- Elegir un nucleo (A/B/D) y fallar en medir correctamente “donde se acumula el tiempo”, por no separar eslabones.
- Entrevistas Gate 1A: si no se pregunta por broker, se pierde el factor explicativo de variabilidad de tiempos y retrabajo.

---

## ❓ PREGUNTAS PARA VALIDAR CON EL EQUIPO

### Para Juan Manuel (Validar el Sistema)
1. ¿El flujo "Flujo de informacion" representa fielmente tu dia a dia? ¿Que paso omiti o subestime?
2. ¿En que casos aparece el broker como canal dominante (emision compleja, excepciones, siniestros)?
3. ¿Como es la relacion corredor–ejecutivo de broker en la practica (disponibilidad, tiempos, prioridades)?
4. ¿Donde esta la "friccion mas cara" cuando interviene broker: tiempo, estres, riesgo regulatorio o perdida de venta?
5. ¿Que tensiones estructurales te parecen mas determinantes hoy?

### Para Rodrigo (Validar desde fuera)
1. ¿Los corredores entrevistados confirman la existencia del broker como actor frecuente? ¿En que tareas?
2. ¿Cambia el rol del broker segun el tamano de la operacion (independiente vs agencia)?
3. ¿Las tensiones de trazabilidad aumentan cuando se agrega el broker como canal?

### Para Manuel (Sintesis)
1. ¿Capturamos la complejidad suficiente como para demostrar que entendemos el sistema antes de proponer cambios?
2. ¿Que parte de este mapa es mas debil y necesita mas validacion de campo?

---

## 📅 MINI ROADMAP (Proximos 7 Dias)

| Dia | Actividad | Responsable | Output Esperado |
|-----|-----------|-------------|-----------------|
| 0 (hoy) | Revision de este documento | Manu | Feedback/ajustes aprobados |
| 0-1 | Envio de tareas a equipo | Manu | JM y Rodrigo tienen claridad y deadline |
| 1-2 | Entregas Juan Manuel | JM | Mapeo de flujo completo + NPO + actores ocultos |
| 2-3 | Entregas Rodrigo | Rodrigo | Entrevistas + analisis regulatorio + mapeo de incentivos |
| 3 | Compilacion v1 | Manu | Documento "Analisis del Sistema" completo (sin proponer solucion) |
| 4-5 | Validacion iterativa | Manu + JM | Ajustes al mapa, validacion contra realidad del campo |
| 6-7 | Documento final | PM (borrador) + Manu (revision) | Entregable listo: entendimiento demostrado del sistema |

---

## ✅ CHECKLIST DE ENTREGA

- [ ] Actores identificados y validados (primarios + secundarios)
- [ ] Relaciones explicitadas (incluyendo broker y ejecutivo asignado)
- [ ] Incentivos mapeados y tensiones entre actores claras
- [ ] Flujos de informacion, dinero y decision documentados
- [ ] Fricciones cuantificadas donde sea posible (tiempo, costo, riesgo)
- [ ] Tensiones estructurales explicitadas (no culpas a individuos, sino al sistema)
- [ ] Validado contra datos reales de campo (no solo teoria)

---

**Principio rector:** *"Primero entender el sistema. Luego, recien, intervenir."*

---

### Cambios respecto a v0.1
- Actor **Broker** incorporado (diferenciado de Corredor y Compania).
- Relaciones actualizadas (Cliente → Corredor → Broker → Compania; broker opcional pero frecuente).
- Implicancias metodologicas agregadas para validacion Gate 1.

---

## D) Tabla comparativa de nucleos (A/B/C/D/E)
# Brokia — Indice y comparativo de nucleos de problema (v0.2)

**Fecha:** 2026-03-03  
**Version:** v0.2 (exploratoria)  
**Modo:** analisis comparativo de problema nucleo (sin diseno de solucion)

---

## 1) Contexto (breve)
Este paquete documenta, en forma persistente y navegable, un analisis comparativo de **nucleos de problema** para Brokia. El objetivo es mantener separacion rigurosa entre **problema** y **solucion**, y habilitar validacion empirica con entrevistas/mediciones bajo un criterio minimo (Gate 1).

---

## 2) Indice de nucleos (archivos)
- **Nucleo C — Trazabilidad contractual:** [`nucleo-c-trazabilidad-contractual-v0.2.md`](./nucleo-c-trazabilidad-contractual-v0.2.md)
- **Nucleo A — Cotizacion multi-aseguradora:** [`nucleo-a-cotizacion-multiaseguradora-v0.2.md`](./nucleo-a-cotizacion-multiaseguradora-v0.2.md)
- **Nucleo B — Cambios / cancelaciones:** [`nucleo-b-cambios-cancelaciones-v0.2.md`](./nucleo-b-cambios-cancelaciones-v0.2.md)
- **Nucleo D — Post-siniestro / seguimiento:** [`nucleo-d-postsiniestro-seguimiento-v0.2.md`](./nucleo-d-postsiniestro-seguimiento-v0.2.md)
- **Nucleo E — Renovacion / comparacion:** [`nucleo-e-renovacion-comparacion-v0.2.md`](./nucleo-e-renovacion-comparacion-v0.2.md)

---

## 3) Resumen ejecutivo por núcleo (5–8 líneas)

### C) Trazabilidad contractual (emisión/renovación)
El proceso de emisión y renovación mediado por corredores deja decisiones y aceptaciones registradas de forma parcial, informal o dispersa. Esto dificulta reconstruir qué se decidió, por qué, cuándo y con qué información, especialmente con el paso del tiempo o con casos en paralelo. La falta de evidencia verificable incrementa retrabajo, errores de comunicación, tiempos de resolución, pérdida de continuidad en renovaciones y exposición a conflictos posteriores. El foco no es “orden” general, sino **recuperabilidad y reconstrucción de decisiones específicas** (qué cambió, quién pidió, cuándo se aceptó y bajo qué condición).

### A) Cotización multi‑aseguradora (cuello de botella operativo)
La cotización con múltiples aseguradoras exige relevar y normalizar información heterogénea y sostener iteraciones con el cliente ante omisiones/ambigüedades. La variabilidad de requisitos entre compañías eleva tiempos de ciclo, reprocesos y variabilidad de calidad en la oferta final. El canal humano queda tensionado por tareas administrativas, afectando escalabilidad y experiencia del cliente. El riesgo clave es que el dolor sea estacional (picos) o ya mitigado por portales/agregadores.

### B) Cambios de vehículo / cancelaciones (complejidad financiera)
Cambios, endosos, cancelaciones y reemisiones introducen prorrateos, recálculos, devoluciones y penalizaciones poco transparentes. La incertidumbre sobre montos y consecuencias económicas incrementa consultas, fricción y riesgo de disputas. Operativamente, el proceso es propenso a demoras y correcciones, con impacto potencial en retención y continuidad de cobertura. El riesgo es que sea de baja frecuencia o muy dependiente de política de aseguradoras.

### D) Post‑siniestro (seguimiento y pendientes)
Tras un siniestro, el asegurado enfrenta múltiples puntos de contacto, requisitos documentales y tiempos inciertos, requiriendo seguimiento activo. Para el corredor, esto se traduce en coordinación sostenida y gestión de pendientes, con demoras, reprocesos y conflictos cuando el cliente percibe falta de acompañamiento. Suele dominar la pregunta “en qué está” y la falta de visibilidad de hitos. El riesgo es alta dependencia de terceros y competencia fuerte (apps/portales).

### E) Renovación (comparación de condiciones)
La renovación es crítica para retención y continuidad de cobertura, pero suele operarse con asimetría de información: el cliente compara por precio o inercia, sin comprender cambios de condiciones. Para el corredor, implica revisar tarifas/condiciones, ajustar coberturas al perfil y gestionar en ventanas acotadas. La falta de comparación accesible puede inducir decisiones subóptimas y churn. El riesgo es baja predisposición del cliente a comparar y comparabilidad limitada por falta de estandarización.

---

## 4) Tabla comparativa final (A/B/C/D/E)

### 4.1 Criterios y escala (cualitativa)
- **Medibilidad (Alta/Media/Baja):** facilidad de capturar línea base y post‑medición con métricas observables (tiempo, frecuencia, interacciones, impacto).
- **Diferenciación (Alta/Media/Baja):** claridad con que el problema exige capacidades específicas del dominio (no reducibles a “orden” general).
- **Complejidad futura (Alta/Media/Baja):** riesgo de que el núcleo arrastre variabilidad, dependencias externas y casos borde que dificulten sostenerlo como foco.
- **Competencia existente (Alta/Media/Baja):** presencia de soluciones parciales en mercado (portales, apps, multicotizadores) que ya mitiguen el dolor.
- **Riesgo de dispersión (Alta/Media/Baja):** probabilidad de que el núcleo empuje a abarcar múltiples subprocesos antes de validar.

| Núcleo | Medibilidad | Diferenciación | Complejidad futura | Competencia existente | Riesgo de dispersión |
|---|---|---|---|---|---|
| **A) Cotización multi‑aseguradora** | Alta | Media | Media | Alta | Media |
| **B) Cambios / cancelaciones** | Media | Media | Alta | Media | Media‑Alta |
| **C) Trazabilidad contractual** | Alta | Alta | Media | Media | Media |
| **D) Post‑siniestro / seguimiento** | Media | Media | Alta | Alta | Alta |
| **E) Renovación / comparación** | Alta | Media | Media | Alta | Media |

---

## 5) Criterio Gate 1 (validación preliminar)
Para considerar que un núcleo de problema está “cerrado” a nivel anteproyecto (pre‑solución), se establece como criterio mínimo:
- Identificación del actor principal (p. ej., corredor independiente vs agencia).
- Delimitación del punto exacto del proceso donde ocurre el dolor.
- Existencia de al menos **2 métricas base** capturables en operación real (p. ej., tiempo por cotización, idas y vueltas por datos, tasa de caída/abandono).
- Evidencia trazable: registros de timestamps y conteo de interacciones por caso (N casos, T semanas), para comparación posterior.

---

## 6) Decisión provisional
**Pendiente de validar.** La elección del núcleo debe cerrarse con evidencia: si un núcleo no aparece en el **top 3** de dolores y/o no se logra instrumentación métrica mínima en entrevistas/mediciones, debe re‑evaluarse.

---

## E) Criterios de validacion

Los criterios Gate 1 (Top 3, conteo, umbrales, metricas base, ejemplo concreto y prueba practica) se encuentran definidos en las secciones 2–6 del documento de metodologia Gate 1A incluido en el apartado A.1.
