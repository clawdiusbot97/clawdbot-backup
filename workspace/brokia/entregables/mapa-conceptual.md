# BROKIA - Mapa Conceptual del Sistema

**Fecha:** 2026-02-26  
**Estado:** Borrador para revisión  
**Enfoque:** Análisis del sistema tal cual existe (pre-intervención)  
**Rol:** PM interno prepara, Manu revisa y envía como cara visible

---

## 📋 PLAN DE TAREAS POR EQUIPO

### Juan Manuel (Broker, Experiencia de Campo)

| # | Tarea | Entregable | Deadline |
|---|-------|------------|----------|
| 1 | **Mapear flujo completo de una cotización** | Secuencia paso a paso: desde que llega el cliente hasta que se emite la póliza. Incluir: quién hace qué, cuánto tarda cada paso, qué herramientas usa, dónde se pierde tiempo | 2 días |
| 2 | **Identificación de NPO (Necesidades, Problemas, Oportunidades)** | Para cada actor que interactúa con vos: ¿qué necesitan? ¿qué les duele? ¿dónde hay oportunidad de mejora? | 2 días |
| 3 | **Actores ocultos** | ¿Quién más interviene en una operación además de cliente-vos-aseguradora? (ej: tasadores, gestores de siniestros, familia del cliente, etc.) | 2 días |

### Rodrigo (Legal → Sistemas)

| # | Tarea | Entregable | Deadline |
|---|-------|------------|----------|
| 1 | **Entrevistas a corredores** | Guion + notas de 2-3 entrevistas con corredores (no JM). Enfocarse en: ¿cómo es su día a día? ¿qué les estresa? ¿qué harían diferente si pudieran? | 3 días |
| 2 | **Análisis regulatorio** | ¿Qué obligaciones tiene un corredor? ¿Qué información debe conservar y por qué? ¿De dónde vienen las presiones de compliance? | 3 días |
| 3 | **Mapeo de incentivos** | ¿Quién gana qué en cada parte del proceso? ¿Cómo se alinean (o no) los intereses de cada actor? | 3 días |

### Manuel (Producto/Tesis)

| # | Tarea | Entregable | Deadline |
|---|-------|------------|----------|
| 1 | **Validar estructura contra PDF de emprendimientos** | Confirmar que estamos cubriendo: Identificación del problema / Clientes y actores clave / NPO / User Journey | 1 día |
| 2 | **Compilación v1 del análisis sistémico** | Documento integrando insumos del equipo, enfocado 100% en el "estado actual" sin proponer soluciones | 3 días |
| 3 | **Validación con JM** | 1-2 ciclos de feedback para confirmar que capturamos la realidad del campo | 4-5 días |

---

## 🗺️ MAPA CONCEPTUAL DEL SISTEMA

### 1. ACTORES

Quién participa en el ecosistema de intermediación de seguros de automotores.

#### Actores Primarios
| Actor | Rol | Intereses | Poder de decisión |
|-------|-----|-----------|-------------------|
| **Asegurado (cliente final)** | Necesita protección para su vehículo | Obtener el mejor precio/cobertura con mínimo esfuerzo | Alto (elige corredor, acepta o rechaza propuestas) |
| **Corredor de seguros** | Intermediario, asesor, operador | Maximizar operaciones atendidas sin sacrificar calidad; cumplir regulatoria | Medio-Alto (recomienda, gestiona, pero no fija precios) |
| **Aseguradora (compañía)** | Provee cobertura | Vender pólizas rentables; minimizar riesgo y fraude | Alto (fija precios, acepta/rechaza riesgos) |
| **SUSE/Regulador** | Supervisa el mercado | Cumplimiento normativo; trazabilidad de operaciones; protección del asegurado | Alto (puede sancionar, exige registros) |

#### Actores Secundarios
| Actor | Rol | Cuándo interviene |
|-------|-----|-------------------|
| **Productor asesor (corredores junior)** | Apoya en operativa baja | Cotizaciones masivas, seguimientos |
| **Tasadores/Peritos** | Valoran vehículos en casos especiales | Autos usados sin referencia clara, siniestros previos |
| **Familia/Referente del asegurado** | Influencia la decisión | Cuando el asegurado no entiende o necesita validación |
| **Sistemas/Plataformas** | Habilitan/dificultan operaciones | Portales de aseguradoras, WhatsApp, Excel, email |
| **Banco/Financiera (si hay préstamo)** | Exige seguro como garantía | Cuando el vehículo está prendado |

---

### 2. INCENTIVOS

¿Qué motiva a cada actor? ¿Dónde se alinean? ¿Dónde chocan?

#### Mapa de Incentivos

```
ASEGURADO          CORREDOR           ASEGURADORA         REGULADOR
───────────        ─────────          ───────────         ─────────
• Precio bajo      • Volumen alto      • Prima alta        • Compliance
• Cobertura alta   • Tiempo bajo por   • Riesgo bajo       • Trazabilidad
• Esfuerzo mínimo    operación         • Costo bajo        • Quejas mínimas
• Rapidez          • Satisfacción      • Retención         • Estabilidad
  total              cliente             cliente             mercado
• Confianza        • Sin sanciones     • Sin fraude        • Transparencia
```

#### Tensiones de Incentivos

| Actores | Incentivos en conflicto | Resultado |
|---------|--------------------------|-----------|
| Asegurado vs Aseguradora | Precio bajo vs Prima alta | Negociación, comparación, desconfianza inicial |
| Corredor vs Tiempo | Volumen alto vs Calidad por operación | Prisa, errores, oportunidades perdidas |
| Corredor vs Regulador | Rapidez vs Trazabilidad completa | Doble trabajo (operar + documentar) |
| Aseguradora vs Regulador | Eficiencia vs Auditoría exhaustiva | Friction en integraciones, reportes |

---

### 3. FLUJOS

Cómo se mueve la información, el dinero y las decisiones.

#### Flujo de Información

```
┌─────────────┐
│  CLIENTE    │◀── Datos desordenados (WhatsApp, tel, mail)
│  (intención) │    "Quiero asegurar el auto"
└──────┬──────┘
       │
       ▼
┌────────────────────────────────────────────────────────────┐
│                    CORREDOR                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Pide datos  │  │ Cotiza en   │  │ Compara y elige     │ │
│  │ faltantes   │  │ N portales  │  │ opción a presentar  │ │
│  │ (perseguir) │  │ diferentes  │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└────────────────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────────┐
│                    ASEGURADORAS                            │
│  • Cada una recibe datos en formato propio                 │
│  • Devuelven cotización o rechazo                          │
│  • No se "hablan" entre ellas                              │
└────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│   CLIENTE   │◀── Propuesta presentada (manualmente)
│  (decisión)  │    "Esta es la mejor opción porque..."
└──────┬──────┘
       │
       ▼
┌────────────────────────────────────────────────────────────┐
│                    EMISIÓN                                 │
│  • Corredor vuelve a sistema de aseguradora elegida        │
│  • Carga datos de nuevo (muchos ya ingresados antes)       │
│  • Póliza emitida, comisión registrada                    │
└────────────────────────────────────────────────────────────┘
```

#### Flujo de Dinero

| Paso | Quién paga | A quién | Concepto |
|------|------------|---------|----------|
| 1 | Asegurado | Aseguradora | Prima del seguro |
| 2 | Aseguradora | Corredor | Comisión por intermediación |
| 3 | Asegurado | Corredor | Fee/servicio (si aplica) |

#### Flujo de Decisión

1. **Cliente decide** → ¿Busco corredor o voy directo a aseguradora?
2. **Corredor decide** → ¿Qué aseguradoras cotizo para este cliente?
3. **Aseguradoras deciden** → ¿Acepto este riesgo? ¿A qué precio?
4. **Corredor decide** → ¿Qué opción recomiendo? ¿Por qué?
5. **Cliente decide** → ¿Acepto la recomendación? ¿Pido alternativas?
6. **Corredor decide** → ¿Emito con A o sigo negociando?

---

### 4. FRICCIONES

Dónde se pierde energía, tiempo, dinero, confianza.

#### Fricciones Operativas

| Punto | Descripción | Costo |
|-------|-------------|-------|
| **Captura desestructurada** | El cliente envía datos sin formato por WhatsApp. El corredor debe interpretar, organizar, pedir faltantes | 5-15 min + días de ida-vuelta |
| **Documentación dispersa** | Cada aseguradora pide campos ligeramente diferentes. Hay que "traducir" datos cada vez | 3-5 min por portal |
| **Multi-portales** | Login separado, interfaces diferentes, campos en distinto orden para cada aseguradora | 10-20 min por aseguradora |
| **Comparación manual** | Copiar resultados a Excel o email para presentar al cliente. Riesgo de error, omisión de opción | 5-10 min + riesgo de error |
| **Doble carga** | Los datos ingresados para cotizar se vuelven a cargar (o transcriben) para emitir | 5-10 min repetidos |

#### Fricciones de Información

| Punto | Descripción | Impacto |
|-------|-------------|---------|
| **Asimetría cliente** | El cliente no sabe si la cotización presentada es realmente la mejor disponible | Desconfianza, negociación agresiva, churn |
| **Asimetría corredor** | El corredor no ve precios "reales" hasta cotizar, no puede pre-cotizar rápido | Pierde clientes impacientes, no puede asesorar proactivamente |
| **Sin memoria institucional** | Cada operación es "nueva", no se reutiliza conocimiento de clientes previos | Ineficiencia, errores repetidos |

#### Fricciones Regulatorias

| Punto | Descripción | Impacto |
|-------|-------------|---------|
| **Trazabilidad manual** | Se debe poder justificar por qué se recomendó X aseguradora. Hoy: notas personales, memoria | Riesgo sanción, estrés, tiempo extra documentando |
| **Conservación de registros** | Obligación de guardar comunicaciones y documentos. Hoy: WhatsApp personal, emails dispersos | Riesgo no-compliance, pérdida de información |

---

### 5. TENSIONES ESTRUCTURALES

Conflictos sistémicos que persisten independientemente de la "voluntad" de los actores.

#### Tensión 1: Eficiencia vs Compliance
> El corredor necesita ser rápido para atender más clientes y competir. El regulador necesita trazabilidad completa para supervisar. Cada segundo en "documentar para auditoría" es un segundo no atendiendo clientes.

**Manifestación:** Corredores operan a contrarreloj y dejan la documentación "para después", acumulando deuda técnica regulatoria.

#### Tensión 2: Personalización vs Estandarización
> Cada cliente tiene datos únicos (tipo de auto, uso, historial). Cada aseguradora tiene requisitos de entrada diferentes. No hay formato único que sirva para todos.

**Manifestación:** "Traducción" constante de datos, errores de transcripción, pérdida de información en el traspaso.

#### Tensión 3: Volumen vs Calidad de Asesoramiento
> Mientras más clientes atiende un corredor, menos tiempo puede dedicarle a cada uno para entender sus necesidades reales y asesorar genuinamente.

**Manifestación:** Corredores se convierten en "operadores de cotización" más que asesores, perdiendo valor diferencial frente a plataformas directas.

#### Tensión 4: Transparencia del Cliente vs Eficiencia del Corredor
> El cliente ideal aporta datos completos de entrada. La realidad: datos parciales, incorrectos, o "lo que se acuerda". El corredor debe "perseguir" información.

**Manifestación:** Ciclos de ida-vuelta (¿me mandás el título? ¿La cédula? ¿El año?), demoras de días, frustración en ambos lados.

#### Tensión 5: Fragmentación del Mercado Asegurador
> Múltiples aseguradoras compiten, cada una con sistemas propietarios, APIs inexistentes o cerradas, y formatos de datos distintos.

**Manifestación:** Integración imposible, trabajo manual obligatorio, barrera de entrada alta para tecnificar la intermediación.

---

## ❓ PREGUNTAS PARA VALIDAR CON EL EQUIPO

### Para Juan Manuel (Validar el Sistema)
1. ¿El flujo "Flujo de Información" representa fielmente tu día a día? ¿Qué paso omití o subestimé?
2. ¿Identificás las 5 tensiones estructurales en tu trabajo cotidiano? ¿Cuál es la que más te afecta?
3. ¿Hay actores secundarios que interactúan más de lo que parece? (ej: ¿cuánto interviene la familia del cliente en la decisión?)
4. ¿Dónde está la "fricción más cara"? ¿En tiempo? ¿En estrés? ¿En riesgo regulatorio?
5. ¿Los incentivos que mapeé coinciden con lo que observás? ¿Quién "gana" y quién "pierde" en el sistema actual?

### Para Rodrigo (Validar desde fuera)
1. ¿Los corredores entrevistados confirman estos flujos o hay variaciones importantes según tamaño/productora?
2. ¿Las tensiones estructurales son las mismas para corredores independientes vs los que trabajan en grandes productoras?
3. ¿El regulador (SUSE) efectivamente ejerce presión sobre trazabilidad o es más teórica?

### Para Manuel (Síntesis)
1. ¿Capturamos la complejidad suficiente como para demostrar que entendemos el sistema antes de proponer cambios?
2. ¿Qué parte de este mapa es más débil y necesita más validación de campo?

---

## 📅 MINI ROADMAP (Próximos 7 Días)

| Día | Actividad | Responsable | Output Esperado |
|-----|-----------|-------------|-----------------|
| 0 (hoy) | Revisión de este documento | Manu | Feedback/ajustes aprobados |
| 0-1 | Envío de tareas a equipo | Manu | JM y Rodrigo tienen claridad y deadline |
| 1-2 | Entregas Juan Manuel | JM | Mapeo de flujo completo + NPO + actores ocultos |
| 2-3 | Entregas Rodrigo | Rodrigo | Entrevistas + análisis regulatorio + mapeo de incentivos |
| 3 | Compilación v1 | Manu | Documento "Análisis del Sistema" completo (sin proponer solución) |
| 4-5 | Validación iterativa | Manu + JM | Ajustes al mapa, validación contra realidad del campo |
| 6-7 | Documento final | PM (borrador) + Manu (revisión) | Entregable listo: entendimiento demostrado del sistema |

---

## ✅ CHECKLIST DE ENTREGA

- [ ] Actores identificados y validados (primarios + secundarios)
- [ ] Incentivos mapeados y tensiones entre actores claras
- [ ] Flujos de información, dinero y decisión documentados
- [ ] Fricciones cuantificadas donde sea posible (tiempo, costo, riesgo)
- [ ] Tensiones estructurales explicitadas (no culpas a individuos, sino al sistema)
- [ ] Validado contra datos reales de campo (no solo teoría)

---

**Principio rector:** *"Primero entender el sistema. Luego, recién, intervenir."*

**Próximo paso:** Manu revisa, ajusta si es necesario, y envía tareas a JM y Rodrigo.
