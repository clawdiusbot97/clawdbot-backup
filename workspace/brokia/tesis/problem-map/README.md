# Brokia: Mapa del Problema (Ecosistema de Seguros)

> **Objetivo:** Documentar el estado actual del ecosistema de seguros identificando actores, fricciones y ofortunidades de mejora sin anticipar soluciones.
>
> **Estado:** Borrador inicial - en construcción
> **Última actualización:** 2025-07-21

---

## 1. ACTORES DEL ECOSISTEMA

### 1.1 Corredor de Seguros
- **Rol en el ecosistema:** Intermediario entre cliente y aseguradora; asesor técnico en riesgos
- **Incentivos actuales:** Comisiones por colocación de pólizas, retención de cartera, fidelización
- **Puntos de presión identificados (preliminar):**
  - Gestión manual de múltiples relaciones con aseguradoras
  - Tiempo invertido en procesos administrativos repetitivos
  - Dependencia de conocimiento táctico/experiencia individual

### 1.2 Aseguradora
- **Rol en el ecosistema:** Toma de riesgo, emisión de pólizas, gestión de siniestros, definición de precios
- **Modelo de negocio:** Captación de primas vs. pago de siniestros; distribución vía canales (corredores, directo, bancos)
- **Puntos de presión identificados (preliminar):**
  - Costos de adquisición de clientes
  - Fidelización vs. rotación de corredores
  - Tiempos de respuesta en cotizaciones

### 1.3 Cliente Asegurado
- **Segmentos:** Persona física (auto/hogar/vida), PYME, grandes empresas
- **Necesidad fundamental:** Transferir riesgos de forma comprensible, con cobertura adecuada y precio justo
- **Puntos de presión identificados (preliminar):**
  - Falta de comprensión real de coberturas
  - Asimetría informativa al momento de la compra
  - Experiencia frustrante en momentos de siniestro

---

## 2. FLUJO ACTUAL REAL (Customer Journey)

### 2.1 Adquisición de Póliza (Auto - foco inicial)

| Etapa | Actor Principal | Acción Típica | Fricciones Identificadas |
|-------|-----------------|---------------|-------------------------|
| 1. Detección de necesidad | Cliente | Cliente identifica que necesita asegurar vehículo (compra nueva, vencimiento póliza anterior) | Falta de planeamiento; decisión reactina |
| 2. Búsqueda de opciones | Cliente/Corredor | Cliente consulta a corredor de confianza o busca directamente online | Información dispersa; comparabilidad limitada |
| 3. Recolección de datos | Corredor | Corredor solicita datos del vehículo y del cliente | Proceso manual; datos en diferentes formatos; errores de transcripción |
| 4. Cotización múltiple | Corredor | Corredor contacta múltiples aseguradoras (email/teléfono/plataformas) | **ALTA FRICCIÓN:** Tiempo elevado; múltiples interfaces; seguimiento manual |
| 5. Consolidación de opciones | Corredor | Corredor compila propuestas en formato digerible para cliente | Comparación no estandarizada; dificultad de comparar manzanas con manzanas |
| 6. Presentación/negociación | Corredor-Cliente | Corredor presenta opciones y asesora al cliente | Cliente no entiende diferencias puntuales de cobertura |
| 7. Decisión y contratación | Cliente | Cliente selecciona opción; corredor gestiona emisión | Papeleo; firmas; transferencias; tiempo hasta cobertura efectiva |

### 2.2 Vigencia de la Póliza

| Etapa | Actor Principal | Dolencias Operativas |
|-------|-----------------|---------------------|
| Renovación anual | Corredor-Cliente | Reproceso manual de todo el flujo anterior; comparación de renovación vs. mercado |
| Endosos/modificaciones | Corredor-Aseguradora | Cambios de datos del vehículo, conductores adicionales: trámites manuales, demoras |
| Contacto de servicio | Cliente-Corredor | Consultas de cobertura, dudas: dependencia de disponibilidad del corredor |

### 2.3 Siniestro (Momento de Verdad)

| Etapa | Actor Principal | Dolencias Operativas/Económicas |
|-------|-----------------|--------------------------------|
| 1. Denuncia del siniestro | Cliente-Corredor | Cliente en estrés; información incompleta; demora en notificación a aseguradora |
| 2. Gestión de liquidación | Corredor-Aseguradora-Cliente | **CRÍTICO:** Falta de trazabilidad; comunicación trilateral fragmentada; tiempos de respuesta inciertos |
| 3. Resolución | Aseguradora-Cliente | Cliente insatisfecho con monto/tiempo; falta de explicación clara |

---

## 3. MATRIZ DE DOLENCIAS POR ACTOR

### 3.1 Corredor de Seguros

| Tipo | Dolencia | Impacto | Hipótesis de Magnitud | Evidencia |
|------|----------|---------|----------------------|-----------|
| **Operativa** | Proceso manual de cotización múltiple | Tiempo + Error + Retraso en atención | ~40-60% del tiempo productivo | A validar con entrevistas |
| **Operativa** | Seguimiento disperso de trámites con múltiples aseguradoras | Oportunidades perdidas; clientes insatisfechos | N clientes no renovados por demora | A validar |
| **Económica** | Dependencia de volumen de transacciones vs. valor agregado | Techo en ingresos por unidad de tiempo | Incentivo a maximizar cantidad sobre calidad | A validar |
| **Información** | Falta de historial estructurado de clientes y cotizaciones | No aprovecha datos para asesoría proactiva | Menor fidelización; menos renovaciones | A validar |
| **Información** | Datos del vehículo/cliente ingresados manualmente múltiples veces | Riesgo de error; tiempo perdido; mala experiencia | Duplicación de esfuerzo en cada operación | A validar |

### 3.2 Aseguradora

| Tipo | Dolencia | Impacto | Hipótesis de Magnitud | Evidencia |
|------|----------|---------|----------------------|-----------|
| **Económica** | Costo de adquisición vía corredores | Margin squeeze | Comisiones + costos operativos de integración | A validar |
| **Operativa** | Integraciones técnicas dispares con redes de corredores | Lentitud en cotizaciones; errores | Tiempo promedio de respuesta a corredores | A validar |
| **Información** | Falta de visibilidad del cliente final (el corredor es "dueño" de la relación) | Dependencia del corredor; retención difícil | Tasa de retención de clientes vs. tasa de retención de corredores | A validar |

### 3.3 Cliente Asegurado

| Tipo | Dolencia | Impacto | Hipótesis de Magnitud | Evidencia |
|------|----------|---------|----------------------|-----------|
| **Operativa** | Dificultad para comparar opciones de manera independiente | Compra subóptima; desconfianza | % de clientes que comparan < 2 opciones | A validar |
| **Información** | No comprensión real de coberturas contratadas | Sorpresas negativas en siniestro | % de clientes insatisfechos con liquidación | A validar |
| **Económica** | Precio percibido como opaco (¿por qué este precio?) | Desconfianza; "estafa" percibida | NPS del sector seguros vs. otros sectores | A validar |
| **Operativa** | Experiencia de siniestro frustrante | Trauma doble (siniestro + gestión) | Tasa de churn post-siniestro | A validar |

---

## 4. PUNTOS DE FRICCIÓN INTER-ACTORES

### 4.1 Corredor ↔ Aseguradora
- [ ] **Integración técnica:** Cada aseguradora con sistema/proceso propio; no estándar común
- [ ] **Tiempo de respuesta:** Cotizaciones que demoran horas/días; cliente espera
- [ ] **Calidad de datos:** Corredor debe "traducir" datos a formato de cada aseguradora
- [ ] **Comisiones y condiciones:** Negociación individual; falta de transparencia

### 4.2 Corredor ↔ Cliente
- [ ] **Asimetría informativa:** Cliente depende 100% del conocimiento y buena fe del corredor
- [ ] **Disponibilidad:** Cliente espera respuesta; corredor tiene múltiples prioridades
- [ ] **Documentación:** Cliente debe proveer mismos datos múltiples veces; formatos no estandarizados

### 4.3 Cliente ↔ Aseguradora
- [ ] **Trazabilidad nula:** Cliente no tiene visibilidad del estado de su trámite
- [ ] **Lenguaje técnico:** Pólizas ilegibles; exclusiones no evidentes
- [ ] **Momento de verdad:** Siniestro = trámites burocráticos en momento de estrés

---

## 5. RIESGOS SISTÉMICOS IDENTIFICADOS

| Riesgo | Descripción | Afecta Principalmente | Magnitud Estimada |
|--------|-------------|----------------------|-------------------|
| Concentración de conocimiento | El negocio depende del "criterio" del corredor; no está documentado ni automatizado | Ecosistema completo | Alto - barrera a la innovación |
| Desintermediación tecnológica | Nuevos actores (insurtechs) con mejor UX/DX directo al cliente/cliente final | Corredores tradicionales | Medio-Alto |
| Desconfianza sistémica | Cliente percibe al sector como opaco y adversarial | Aseguradoras y corredores | Alto - NPS bajo del sector |
| Ineficiencia estructural | Costos de intermediación elevados que no agregan valor percibido | Cliente final | Medio - posición defensiva del sector |

---

## 6. INFORMACIÓN FRAGMENTADA

### 6.1 ¿Qué datos existen vs. qué datos fluyen?
| Dato | Existe en | ¿Fluye? | Problema |
|------|-----------|---------|----------|
| Historial de siniestralidad del cliente | Aseguradoras (sus pólizas) | NO - entre aseguradoras | Cliente "nuevo" para cada aseguradora aunque tenga historial |
| Datos del vehículo | Corredor lo solicita al cliente | USO ÚNICO - no reutilizable | Se recopila desde cero en cada cotización |
| Preferencias del cliente | Implícito en elecciones pasadas | NO estructurado | Corredor no puede asesorar proactivamente basado en historia |
| Estado de trámites | En cabeza del corredor/aseguradora | NO visible para cliente | Cliente "a ciegas" esperando respuestas |

### 6.2 ¿Dónde se pierde la trazabilidad?
- [ ] Cotización enviada por el corredor a aseguradora: ¿llegó? ¿en qué estado?
- [ ] Endoso solicitado: ¿fue procesado? ¿cuándo entra en vigencia?
- [ ] Siniestro declarado: ¿qué pasó desde que llamé hasta la resolución?

### 6.3 ¿Qué decisiones se toman "a ciegas"?
- Cliente elige cobertura sin entender realmente qué está excluido
- Corredor recomienda aseguradora basado en "intuición" vs. datos comparativos de servicio
- Aseguradora define precio sin visibilidad completa del riesgo (asimetría adversa)

---

## 7. HIPÓTESIS DE OPORTUNIDAD (Pre-solución)

> **Nota:** Oportunidades identificadas a partir de dolencias anteriores. **Sin comprometer arquitectura de solución.**

| ID | Oportunidad | Dolencia Relacionada | Indicador de Tamaño (Hipótesis) | Validación Pendiente |
|----|-------------|---------------------|--------------------------------|---------------------|
| O1 | Reducción del tiempo de cotización múltiple | Dolencia operativa del corredor (C3.1) | 40-60% de su tiempo productivo | Entrevista corredores |
| O2 | Centralización de datos del vehículo/cliente | Información fragmentada (C6) | Recolección repetida en cada operación | Medición en campo |
| O3 | Trazabilidad visible del estado de trámites | Información fragmentada (C6.2) | Cliente insatisfecho por falta de visibilidad | NPS/Métricas post-siniestro |
| O4 | Asesoría basada en datos históricos | Falta de historial estructurado (C3.1) | Renovaciones basadas en "inercia" vs. valor | Análisis de carteras |
| O5 | Extracción automática de datos de documentación física | Datos ingresados manualmente (C3.1) | Pérdida de tiempo + errores | Validación técnica de IA |

---

## 8. PRÓXIMOS PASOS

- [ ] **Entrevistas de validación:** Corredores (n=3) - Juan Manuel como entry point
- [ ] **Entrevistas de validación:** Aseguradoras (n=2)
- [ ] **Entrevistas de validación:** Clientes asegurados (n=5)
- [ ] **Observación etnográfica:** Shadowing de corredor en proceso de cotización real (si es posible)
- [ ] **Calibrar hipótesis de magnitud:** Medir tiempos reales, contar interacciones
- [ ] **Definir métricas de éxito:** ¿Qué cambio medible constituiría éxito para cada oportunidad?

---

## Anexos

### A. Fuentes de información
- [ ] Por poblar con entrevistas, artículos, datos de mercado

### B. Glosario
- **Endoso:** Modificación a una póliza vigente
- **Siniestralidad:** Relación entre primas cobradas y siniestros pagados
- **NPS:** Net Promoter Score (medición de satisfacción/recomendación)

---

*Documento vivo - se actualiza con evidencia empírica a medida que avanza la investigación de campo.*
