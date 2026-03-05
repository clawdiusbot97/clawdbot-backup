# Brokia — Propuesta reformulada de MVP (Chief Product Strategist + Advisor Académico)

**Fecha:** 2026-03-04  
**Marco conceptual obligatorio:** Brokia no es CRM ni cotizador. Es un asistente digital personalizado del corredor por WhatsApp que preserva su voz/criterio/estilo y genera trazabilidad estructurada y evidencia auditable.

---

## 1) Reposicionamiento conceptual (defendible ante tribunal)

Brokia es un **asistente digital personalizado para corredores de seguros** que opera principalmente por WhatsApp y funciona como **“capa de formalización”** sobre la relación corredor–cliente.

- **Qué es:** un sistema socio-técnico que **reduce carga operativa**, **estructura decisiones** y **captura evidencia auditable** de acuerdos y recomendaciones sin desplazar el juicio profesional del corredor.
- **Qué no es:** no es un CRM (no optimiza “gestión de cuentas” como fin), no es un cotizador online (no promete precio instantáneo), y no pretende automatizar el asesoramiento como si el cliente no necesitara criterio.
- **Diferencia vs CRM tradicional:** el CRM registra interacciones; Brokia **interviene en la conversación** para convertir mensajes informales en **actos trazables** (solicitudes, confirmaciones, aceptación, disclaimers y respaldo contractual) preservando estilo del corredor.
- **Diferencia vs insurtech 100% automatizada:** en lugar de reemplazar la relación, la **fortalece**: el corredor sigue siendo la “cara” y el decisor; Brokia es la infraestructura de coordinación, evidencia y consistencia.
- **Diferencia vs cotizadores online:** no compite por “precio en 30 segundos”; compite por **confianza + trazabilidad + acompañamiento** en casos reales (cambios, cancelaciones, siniestros, emisión y aceptación).

**Tesis (núcleo):** demostrar que la combinación de mensajería + formalización + evidencia auditable mejora eficiencia y reduce riesgo/ambigüedad sin perder la confianza interpersonal.

---

## 2) Tres MVP estratégicos alternativos (exactamente 3)

> Importante: cada MVP es una **tesis con hipótesis central**, no un conjunto de módulos.

### MVP 1 — “Formalización conversacional y evidencia contractual” (núcleo: emisión + aceptación)

**Problema central**  
En la práctica del corredor, decisiones y acuerdos críticos quedan en mensajes dispersos (“dale”, “ok”, “sí”), sin estructura ni resguardo contractual claro. Esto genera ambigüedad, retrabajo y exposición ante conflictos.

**Hipótesis validable**  
Si Brokia introduce una capa de **formalización conversacional** (sin romper la voz del corredor) —con solicitudes estructuradas, resúmenes confirmables y un acto explícito de **ACEPTO**— entonces aumenta la claridad del acuerdo, reduce re-trabajo por malentendidos y mejora la auditabilidad de punta a punta.

**Diferenciación frente al mercado**  
- Las insurtechs automatizadas optimizan autoservicio; Brokia optimiza **respaldo y claridad** en una relación humana.
- Los CRMs guardan registros; Brokia **crea evidencia** (resumen + confirmación + marca temporal + contexto).
- No es “chatbot genérico”: su rol es **protocolo de formalización**, no FAQ.

**Alcance hasta septiembre (realista)**  
- Un flujo conversacional estándar (por WhatsApp) para convertir un caso en:
  1) **Resumen estructurado** (qué se pide / qué se ofrece / condiciones relevantes),
  2) **Confirmación del cliente** (ACEPTO / NO ACEPTO / NECESITO ACLARAR),
  3) **Archivo de evidencia auditable** (con timestamps, adjuntos y responsable).
- Aplicable en 2–3 situaciones de alto valor académico (ya analizadas): **emisión con aceptación**, **cambio de vehículo con análisis financiero**, y **cancelación con términos cortos** (no por features, sino porque son contextos donde la evidencia importa).

**Qué queda fuera**  
- Integración automática con aseguradoras para cotización.
- Automatización total del asesoramiento.
- Predicción de riesgos o pricing.

**Riesgos**  
- Riesgo de fricción si el protocolo de formalización se siente “robotizado”.
- Riesgo legal/comercial si el texto de aceptación no es consistente con prácticas del corredor/aseguradora.
- Riesgo de adopción: el corredor debe confiar en que Brokia no “traiciona” su estilo.

**Métricas para tesis (claras)**  
- % casos con **resumen + aceptación** completos.
- Reducción de “idas y vueltas” antes de cerrar (mensajes o tiempo).
- Tasa de discrepancias/rectificaciones post-acuerdo.
- Percepción de confianza (encuesta breve cliente/corredor).

**Complejidad técnica:** **Media** (conversación + persistencia + auditoría + plantillas; IA opcional asistiva).

---

### MVP 2 — “Asistente del corredor para coordinación operativa multi-caso (sin ser CRM)”

**Problema central**  
La carga operativa del corredor no es “gestionar clientes” sino **coordinar tareas** entre conversaciones, documentos, recordatorios y estados reales del caso (cotizando, esperando datos, enviando propuesta, seguimiento, etc.). Hoy esa coordinación es mental, en notas sueltas o en WhatsApp mismo.

**Hipótesis validable**  
Si Brokia actúa como “copiloto” que **ordena el caso** (qué falta, qué sigue, qué promesas quedaron hechas y cuándo) y sugiere mensajes en la voz del corredor, entonces reduce carga cognitiva, disminuye olvidos y aumenta velocidad de respuesta sin imponer una herramienta tipo CRM.

**Diferenciación frente al mercado**  
- CRMs: exigen que el corredor “alimente el sistema”. Brokia **extrae estructura desde la conversación** y devuelve orden accionable.
- Insurtech automatizada: busca autoservicio del cliente. Brokia optimiza **productividad del corredor** preservando la relación.
- “Chatbot más”: no responde preguntas genéricas; mantiene **estado del caso** y consistencia.

**Alcance hasta septiembre (realista)**  
- Brokia como “memoria operativa” por caso:
  - detecta compromisos (“te lo mando hoy”),
  - registra faltantes y próxima acción,
  - propone respuesta lista para enviar,
  - y deja un rastro auditable de por qué se pidió X y qué se acordó.
- Cubrir 2–3 procesos ya analizados como “escenarios de prueba” (p. ej. cotización manual multi-aseguradora y gestión de siniestros) sin intentar automatizarlos completamente.

**Qué queda fuera**  
- Automatización de cotización multi-aseguradora.
- Enrutamiento avanzado, dashboards comerciales, forecasting.

**Riesgos**  
- Si la extracción de estructura es mala, genera desconfianza.
- Riesgo de privacidad/seguridad si no se diseña bien el manejo de datos (especialmente siniestros).

**Métricas para tesis**  
- Tiempo de respuesta del corredor (mediana) antes/después.
- % casos sin “olvidos” (tareas vencidas / promesas incumplidas).
- Reducción del tiempo total de ciclo del caso (cuando aplique).
- Satisfacción del corredor (carga percibida).

**Complejidad técnica:** **Media–Alta** (estado, extracción de intención/compromisos, auditoría; IA asistiva con validación humana).

---

### MVP 3 — “Gestión de riesgo de malentendidos en siniestros (evidencia + claridad)”

**Problema central**  
En siniestros, el costo del malentendido es alto: requisitos, plazos, documentación y expectativas. WhatsApp acelera pero también dispersa información crítica.

**Hipótesis validable**  
Si Brokia estructura la comunicación de siniestros en WhatsApp con **checkpoints confirmables** (requisitos, documentos recibidos, próximos pasos) y evidencia auditable, entonces se reduce el retrabajo y aumenta la claridad para el cliente sin transformar el proceso en un portal impersonal.

**Diferenciación frente al mercado**  
- Insurtech automatizada: deriva a formularios/portales. Brokia mantiene WhatsApp pero agrega **protocolo y evidencia**.
- CRM: registra “hubo siniestro”. Brokia conserva el hilo con **confirmaciones y pruebas** de lo que se informó/recibió.

**Alcance hasta septiembre (realista)**  
- Un flujo de siniestro por WhatsApp con:
  - solicitud guiada de documentación,
  - resumen confirmable de estado,
  - registro de recepción de evidencias,
  - y mensajes consistentes con la voz del corredor.
- No se automatiza resolución, solo se garantiza **claridad, consistencia y trazabilidad**.

**Qué queda fuera**  
- Integración completa con sistemas de aseguradoras.
- Automatización de aprobación/liquidación.

**Riesgos**  
- Variabilidad de casos (diferentes tipos de siniestro) puede romper el flujo si no se acota.
- Alto cuidado de datos sensibles.

**Métricas para tesis**  
- % casos con checklist completo y confirmaciones.
- Reducción de solicitudes repetidas de documentos.
- Tiempo hasta “expediente completo” (documentación mínima reunida).
- NPS/satisfacción del cliente en el siniestro.

**Complejidad técnica:** **Baja–Media** (si se acota a plantillas + evidencia; sube si se intenta IA fuerte).

---

## 3) Análisis específico — “Asistente personalizado con voz”

### 3.1 Personalización de tono (factibilidad y complejidad)
**Factibilidad:** alta si se implementa como **guías + plantillas paramétricas + ejemplos** y, opcionalmente, un LLM que redacta “en el estilo” con supervisión del corredor.

- **Bajo riesgo (recomendado para MVP septiembre):**
  - Biblioteca de mensajes del corredor (saludos, cierre, pedidos de datos, recordatorios).
  - Reglas de estilo (formalidad, uso de tú/usted, longitud, emojis no, etc.).
  - IA solo como “asistente de redacción” y siempre editable.
- **Mayor complejidad:** aprendizaje automático del estilo real desde chats históricos (requiere dataset, permisos, anonimización, control de errores).

**Conclusión:** personalización de tono sí, pero como **sistema de estilo controlado**, no como “modelo que imita al corredor sin límites”.

### 3.2 Respuestas en audio generadas por IA
**Viabilidad técnica:** media (TTS es accesible).  
**Valor real:** depende del corredor y del tipo de cliente; puede acelerar “explicaciones repetitivas” (coberturas, pasos).

- **Para MVP septiembre:** hacerlo opcional y limitado a audios “explicativos” no contractuales.
- **Riesgo:** el audio puede percibirse menos “humano” si no se diseña bien; además complica auditoría textual (hay que transcribir y guardar).

### 3.3 Clonado de voz del corredor (viabilidad, legal, costos, recomendación)
**Viabilidad técnica:** posible, pero el riesgo no es técnico: es **legal, reputacional y de consentimiento**.

- **Riesgos legales:** consentimiento explícito del corredor, uso indebido, suplantación; necesidad de políticas claras.
- **Riesgos de confianza:** si el cliente cree que “le habló el corredor” y era IA, puede romper la promesa central de Brokia.
- **Costos:** servicios de voice cloning + infraestructura de seguridad; además aumenta costo de operación por audio.

**Recomendación:**
- **MVP septiembre:** **NO** clonado de voz. Mantener “voz” como estilo textual (y eventualmente TTS con voz neutral, marcada como asistida).
- **Fase futura:** explorar clonación solo si se cumple: consentimiento, disclosure al cliente, controles anti-abuso, y un marco contractual.

---

## 4) Integración con research de insurtechs (explícito)

### Qué hacen hoy las insurtechs (patrones dominantes)
- Autoservicio: cotizar/emitir en flujos de formulario.
- Estandarización: productos simples, comparadores, onboarding rápido.
- Atención: chatbots orientados a FAQ y derivación.

### Qué NO están resolviendo (espacio estratégico)
- **La zona gris de la asesoría real**: cambios, cancelaciones, siniestros, excepciones, y decisiones con criterio donde el cliente busca confianza humana.
- **Evidencia auditable de decisiones** dentro de WhatsApp: la mayoría no formaliza acuerdos conversacionales de forma defendible.
- **Preservar la voz del corredor** como activo (relación y estilo) mientras se profesionaliza la trazabilidad.

### Dónde hay espacio estratégico real
- “Infraestructura de confianza” para corredores: formalización + evidencia + consistencia.
- Un sistema que aumenta productividad sin exigir migrar a un portal/CRM.

### Cómo evitar ser “un chatbot más”
- Definir a Brokia como **protocolo conversacional auditable**, no como asistente genérico.
- Foco en **actos verificables** (resumen confirmable, aceptación, checklist de evidencias), no en “responder preguntas”.
- Medir y demostrar: antes/después en claridad, tiempos, retrabajo y completitud de evidencia.

---

## 5) Recomendación final (1 MVP recomendado para tesis)

### MVP recomendado: **MVP 1 — Formalización conversacional y evidencia contractual**

**Justificación (criterios obligatorios):**
- **Probabilidad de entrega:** alta. Se puede construir con alcance acotado y sin depender de integraciones con aseguradoras.
- **Claridad académica:** muy defendible: problema de sistemas (informalidad → falta de trazabilidad), intervención (formalización conversacional), evaluación (métricas de completitud, retrabajo, claridad y confianza).
- **Capacidad de medición:** fuerte. La evidencia es medible (porcentaje de casos con resumen+aceptación, tiempos, discrepancias).
- **Diferenciación real:** no compite con cotizadores ni CRMs; compite en “confianza + evidencia” dentro de WhatsApp.
- **Escalabilidad futura:** una vez que el “protocolo auditable” funciona, se puede extender a siniestros, renovaciones, multi-aseguradora y extracción documental sin romper el posicionamiento.

---

### Próximos pasos sugeridos (para decisión)
1) Elegir 2–3 **escenarios de demostración** para septiembre (emisión/aceptación + 1 de los otros ya analizados).
2) Definir el **formato exacto de evidencia** (qué se guarda, cómo se resume, cómo se confirma).
3) Acordar un set mínimo de **métricas** y un plan de recolección (baseline vs post).
