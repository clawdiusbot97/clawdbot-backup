# Guión Presentación Enrique - Brokia

**Duración total:** 5-7 minutos  
**Formato:** 3 slides + conversación  
**Objetivo:** Obtener feedback estratégico + intro a redes de corredores

---

## SLIDE 1: Problema Cuantificado (90 segundos)

### Guión hablado
"Enrique, te voy a dar un número primero: **[PLACEHOLDER: X] horas semanales**.

Eso es lo que un corredor de seguros promedio dedica a cotización manual. Lo medimos con Juan Manuel —corredor con 10 años de experiencia— durante un día de trabajo real. Cronómetro en mano, 10 cotizaciones.

El resultado: cada cotización le lleva **[PLACEHOLDER: XX] minutos**. Multiplicado por **[PLACEHOLDER: Y] cotizaciones diarias**, son **[PLACEHOLDER: Z] horas semanales** haciendo papeleo que el cliente no valora.

El corredor es profesional de relación, pero está forzado a ser administrativo. Esa tensión es estructural y perpetua."

### Key visual
- Número grande: **[PLACEHOLDER: X]h/semana**
- Barra simple: tiempo cotización vs tiempo asesoría
- Quote de Juan Manuel: *"[PLACEHOLDER: cita textual sobre frustración]"*

---

## SLIDE 2: Oportunidad Concreta (90 segundos)

### Guión hablado
"El modelo que estamos evaluando es **SaaS B2B a redes de corredores**.

No corredor individual —bajo poder adquisitivo, churn alto—. No aseguradora paga —riesgo de cooptación—. Redes: decisión centralizada, presupuesto de tecnología, ROI fácil de calcular.

Precio tentativo: **[PLACEHOLDER: $50-100]/corredor/mes**. Una red de [PLACEHOLDER: 10-20] corredores nos da **[PLACEHOLDER: $500-2,000]** MRR inicial.

El mercado es Uruguay sandbox, pero la expansión es natural: las mismas redes operan en AR/CL/MX. Y el moat real no es la feature, son los **datos históricos de cotizaciones** —network effects a medida que más corredores usan la plataforma."

### Key visual
- Comparativa modelos A/B/C/D con X marcando B
- TAM SAM SOM (burbujas o números)
- Flecha: UY → AR/CL/MX

---

## SLIDE 3: Experimento en Curso (60 segundos)

### Guión hablado
"Estamos en semana 2 de validación. El experimento es simple:

- Baseline manual con Juan: cronómetro + planilla de Google
- Entrevistas con 2 corredores adicionales para validar si el problema es generalizable
- Métrica de go/no-go: si el corredor dedica >6 horas semanales y reporta dolor alto, construimos MVP-1

**Estado**: [PLACEHOLDER: en curso / validado X% / completo]

Lo que necesitamos de vos hoy: feedback en el modelo de negocio e intro a redes de corredores para validación extendida."

### Key visual
- Timeline: Semana 1 (baseline) → Semana 2 (entrevistas) → Semana 3 (decisión)
- Checkmarks en completado, reloj en en curso
- "Ask" claro en último slide

---

## TRANSICIÓN A CONVERSACIÓN (30-60 segundos)

"¿Qué te parece? ¿Dónde ves el mayor riesgo en esto?"

[PAUSA. DEJAR QUE ENRIQUE HABLE.]

---

## PREGUNTAS DIFÍCILES - ANTECIPADAS Y RESPUESTAS

### 1. "¿Por qué una red de corredores pagaría por esto si usan Excel gratis?"
**Respuesta:** Excel no conecta con aseguradoras, no trackea tiempos, no da analytics. El valor no es el reemplazo de Excel, es el workflow integrado + datos para gerenciar la red. Si el gerente de red puede demostrarle al dueño que sus corredores pierden 40% del tiempo en tareas bajo valor, tiene un caso para la inversión.

### 2. "¿Qué pasa si las aseguradoras desarrollan su propia plataforma?"
**Respuesta:** Cada aseguradora tiene un sistema distinto. El corredor necesita AGREGAR, no depender de 1 aseguradora. El riesgo mayor es que una sola aseguradora domine el mercado y obligue a usar su plataforma —no es el caso hoy en UY. De todos modos, si el modelo C (aseguradora paga) emerge como dominante, podemos pivotear; pero empezar ahí nos convierte en "empleados" de la aseguradora desde día 1.

### 3. "¿Cómo saben que Juan Manuel no es un outlier?"
**Respuesta:** Es una pregunta válida. Por eso estamos haciendo N=2 entrevistas con corredores independientes. Si los datos discrepan significativamente, lo vamos a saber antes de escribir código. El baseline de Juan es el punto de partida, no la verdad absoluta.

### 4. "El mercado de Uruguay es muy chico. ¿No es un hobby?"
**Respuesta:** Uruguay es sandbox, no mercado final. Las redes que operan acá operan en AR/CL/MX. Si validamos el modelo con 1-2 redes en UY, tenemos case study para expansión regional. El TAM regional justifica la inversión; el SAM uruguayo nos da el espacio para probar sin quemar mucho capital.

### 5. "¿Qué pasa si el corredor promedio dedica 3 horas, no 6?"
**Respuesta:** Eso sería una refutación parcial. Si el dolor es menor al esperado, tenemos dos opciones: (a) pivotar a un problema más doloroso que identifiquemos en las entrevistas, o (b) abandonar y documentar por qué no funcionó. Estamos preparados para ambas. Prefiero saber ahora a descubrirlo después de 6 meses de desarrollo.

### 6. "¿Por qué los corredores no usan SYC o herramientas existentes?"
**Respuesta:** SYC [PLACEHOLDER: investigar qué hace exactamente]. Lo que vemos es que los corredores siguen usando Excel + WhatsApp + email. Eso sugiere que SYC no resuelve el workflow completo o no es accesible para el corredor promedio. Nuestra hipótesis es que el gap está en la orquestación del proceso, no en un sistema de gestión puramente administrativo.

### 7. "¿Cómo se defienden de una insurtech grande que entre con millones?"
**Respuesta:** No nos defendemos. Si Lemonade o alguien similar quiere este mercado, van a ganar porque tienen más capital. Nuestra apuesta es diferente: no queremos ser la insurtech que reemplaza a los corredores, queremos ser el software que los hace más eficientes. Eso es un posicionamiento diferente. Si ellos ofrecen "adelante con el corredor", nosotros ofrecemos "empoderá al corredor".

### 8. "¿Qué regulación aplica a esto?"
**Respuesta:** Estamos en proceso de mapeo regulatorio con Rodrigo. Lo que sabemos: datos de clientes de seguros tienen restricciones de tratamiento. Antes de cualquier desarrollo, vamos a tener un check legal de compliance. No queremos construir algo que sea ilegal operar.

### 9. "¿Por qué un corredor confiaría sus datos a ustedes?"
**Respuesta:** Es un riesgo real. La estrategia es empezar con datos mínimos necesarios (solo lo que ya comparte con aseguradoras), crecer la confianza, y eventualmente ofrecer valor por los datos (benchmarks, analytics). La data residency va a ser local/regional. No vendemos datos a terceros. Pero sí: la adopción depende de confianza, no solo de features.

### 10. "¿Cuánto capital necesitan para esto?"
**Respuesta:** Para el MVP-1 estimamos [PLACEHOLDER: $X] y [PLACEHOLDER: Y] meses de trabajo part-time. No estamos buscando inversión ahora; estamos buscando validación. Si el experimento da positivo y queremos escalar, ahí sí hablamos de capital. Hoy es prueba de concepto con recursos propios.

---

## ASK FINAL (preparar según flujo conversación)

### Opción A (si Enrique parece interesado/positivo)
"Enrique, ¿conocés a alguien en [PLACEHOLDER: red de corredores objetivo] que podría charlar con nosotros 30 min para validar esto? Una intro tuya abre puertas que nosotros no podemos abrir solos."

### Opción B (si Enrique es escéptico/con críticas constructivas)
"Enrique, tus objeciones son válidas. ¿Cuál es el riesgo que más te preocupa? Queremos asegurarnos de no perder tiempo construyendo algo que tenga fallas estructurales que estamos ignorando."

### Opción C (si Enrique pregunta siguientes pasos)
"Los siguientes 30 días son críticos: necesitamos completar las entrevistas, cerrar el baseline, y decidir si construimos MVP-1 o pivotamos. Tu feedback hoy nos ayuda a calibrar esa decisión."

---

## TIMING PRÁCTICO

| Sección | Tiempo | Corte |
|---------|--------|-------|
| Intro + Slide 1 | 90s | "Esa es la magnitud del problema" |
| Slide 2 | 90s | "Este es el modelo que proponemos" |
| Slide 3 | 60s | "Este es el estado del experimento" |
| Pregunta apertura | 30s | "¿Qué te parece?" |
| Conversación | 10-15 min | DEJAR QUE HABLE ENRIQUE |
| Ask final | 30s | "Necesitamos..." |
| **Total** | **15-20 min** | |

---

## NOTAS DE EJECUCIÓN

- **Hablar lento** en los números —son la credibilidad
- **Mirar a Enrique**, no a las slides
- **Si interrumpe**, dejarlo —las mejores preguntas surgen de interrupciones
- **Si no sabe algo**, decir "no lo sé, lo averiguamos" —mejor que inventar
- **Terminar a tiempo** —mejor dejarlo queriendo más que saturarlo
