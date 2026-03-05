# BROKIA - Mapa Conceptual del Sistema (v0.3)

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

## Flujo economico y esquema de comisiones

En el esquema economico tipico de intermediacion en seguros automotores:
- El **cliente** paga la **prima** a la **compania de seguros**.
- La **compania** liquida una **comision** al **corredor** por la intermediacion.
- Del monto liquidado al corredor, se descuenta el **porcentaje correspondiente al broker** cuando este participa como intermediario tecnico-comercial.
- El corredor **no paga** una **cuota fija mensual** al broker; la participacion del broker se expresa dentro del esquema de comisiones.
- El broker participa como intermediario tecnico-comercial y su relacion economica se vincula a la colocacion/gestion de polizas.

### Esquema textual del flujo

Cliente
 ↓ (prima)
Compania
 ↓ (comision)
Corredor
 ↓ (porcentaje de comision)
Broker

### Implicancias estructurales
- Existe una **dependencia economica indirecta** del corredor respecto al broker, en la medida en que parte de su comision se relaciona con ese intermediario.
- Se configura un **incentivo compartido** basado en el volumen de polizas gestionadas/emitidas.
- El broker puede ejercer influencia en la **colocacion de companias** en tanto canaliza gestiones, destraba excepciones o prioriza determinados circuitos.
- Esto puede impactar en los nucleos **A, B y E**:
  - **A (cotizacion):** tiempos y priorizacion de consultas pueden estar condicionados por circuitos comerciales.
  - **B (cambios/cancelaciones):** excepciones y correcciones pueden escalar por el mismo canal.
  - **E (renovacion):** la dinamica de retencion y migracion puede estar influida por relaciones comerciales y disponibilidad del canal.
- Riesgo metodologico: si no se modela el incentivo economico, se puede subestimar por que ciertos flujos son dominantes o por que ciertos cuellos de botella persisten.

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

### Cambios respecto a v0.2
- Flujo economico incorporado.
- Esquema de comisiones explicitado.
- Implicancias de incentivos agregadas.
