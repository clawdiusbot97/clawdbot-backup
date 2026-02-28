# 🗂️ Base de Datos de Subprocesos Operativos – Corredor de Seguros

**Objetivo:** Catálogo estructurado de subprocesos con métricas cuantitativas para análisis de eficiencia, automatización y optimización.

**Metodología:** Entrevista estructurada paso a paso (nombre, descripción, sistemas, tiempos, frecuencia, carga, riesgo, %retrabajo).

**Formato de salida:** JSON por subproceso + markdown consolidado + CSV para Google Sheets.

---

## 📋 Subprocesos Documentados

### 001 – Cotización multicompañía de vehículo

| Campo | Valor |
|-------|-------|
| **ID** | `001` |
| **Nombre** | Cotización multicompañía de vehículo |
| **Descripción** | Proceso de cotización de vehículo (nuevo o renovación) que incluye: 1. Recibir solicitud del cliente. 2. Recopilar y validar datos del riesgo (marca, modelo, año, versión, uso, zona de circulación, CI, fecha nacimiento). 3. Ingresar manualmente a portales web de múltiples aseguradoras (≈ 5–7). 4. Cargar datos en cada portal. 5. Obtener precios y condiciones. 6. Registrar resultados en Excel/Sheets. 7. Construir cuadro comparativo. 8. Enviar al cliente por WhatsApp (imagen o PDF). 9. Explicar opciones si es necesario. |
| **Sistemas usados** | Mapfre, Porto Seguro, Banco de Seguros del Estado (BSE), SURA, Sancor Seguros, HDI Seguros, Google Sheets, WhatsApp, Llamada telefónica |
| **Tiempo P50** | 20 minutos |
| **Tiempo P90** | 40 minutos |
| **Frecuencia mensual** | 150 cotizaciones |
| **Carga (1‑5)** | 4 – Exige concentración, hay casos que requieren más estudio y análisis, muy repetitivo y con pasos manuales. |
| **Riesgo (1‑5)** | 5 – Muy riesgoso si se comete un error. |
| **% Retrabajo** | 15% |
| **Proceso padre** | 100 – Cambio de vehículo |
| **Oportunidades** | Automatización de ingreso a portales y generación de cuadro comparativo. |

**JSON:** [001‑cotizacion‑multicompania‑vehiculo.json](./001-cotizacion-multicompania-vehiculo.json)

### 002 – Anulación de póliza

| Campo | Valor |
|-------|-------|
| **ID** | `002` |
| **Nombre** | Anulación de póliza |
| **Descripción** | Proceso de anulación de póliza que comienza cuando el cliente solicita cancelar su póliza y finaliza cuando la anulación queda confirmada por la compañía y registrada internamente. Pasos: 1) Recepción de solicitud (WhatsApp, llamada). 2) Relevamiento de datos de la póliza en portal de la compañía (fecha inicio, premio anual, plan de pagos, cuotas abonadas, siniestros, deuda). 3) Cálculo económico (tabla de términos cortos): automático en portales de BSE, SURA, Mapfre, Porto; manual en Sancor o HDI usando tablas y cálculos manuales. 4) Comunicación con cliente para confirmar anulación, especialmente si hay saldo pendiente o recupero. 5) Gestión formal con compañía (portal, mail, formulario). 6) Emisión de documentación (factura de cancelación, nota de crédito). 7) Registro interno (guardar mail, PDF). |
| **Sistemas usados** | BSE portal, SURA portal, Mapfre portal, Porto portal, Sancor portal, HDI portal, SBI portal, Plantillas personalizadas (Excel/Sheets), WhatsApp, Llamada telefónica, Correo electrónico |
| **Tiempo P50** | 5 minutos |
| **Tiempo P90** | 10 minutos |
| **Frecuencia mensual** | 5 anulaciones |
| **Carga (1‑5)** | 2 – Moderada |
| **Riesgo (1‑5)** | 2 – Bajo |
| **% Retrabajo** | 5% |
| **Proceso padre** | 100 – Cambio de vehículo |
| **Oportunidades** | Automatización de cálculo de términos cortos y generación de documentación. |

**JSON:** [002‑anulacion‑poliza.json](./002-anulacion-poliza.json)

---

## 🧩 Proceso Superior Documentado

### 100 – Cambio de vehículo

| Campo | Valor |
|-------|-------|
| **ID** | `100` |
| **Nombre** | Cambio de vehículo |
| **Descripción** | Proceso que comienza cuando el cliente informa que cambió o va a cambiar su vehículo y finaliza cuando: 1) El nuevo vehículo queda asegurado. 2) La póliza anterior queda correctamente modificada o anulada. 3) El impacto económico queda resuelto. Combina análisis comercial + gestión operativa + evaluación financiera. Incluye ejecución de Subproceso 001 (Cotización multicompañía) y Subproceso 002 (Anulación de póliza), comparación integral de tres escenarios (Endoso en compañía actual, Anular ahora + emitir nueva póliza, Mantener actual hasta vencimiento + cambiar luego), presentación al cliente y ejecución operativa final. |
| **Sistemas usados** | BSE portal, SURA portal, Mapfre portal, Porto portal, Sancor portal, HDI portal, SBI portal, Plantillas personalizadas (Excel/Sheets): Planilla de cálculos HDI, Planilla Sancor, Tablas de anulación de escala términos cortos (imágenes en Drive), Google Sheets/Excel para comparación de escenarios, WhatsApp, Llamada telefónica, Correo electrónico |
| **Tiempo P50** | 40 minutos |
| **Tiempo P90** | 55 minutos |
| **Frecuencia mensual** | 3 (promedio), con picos de 8‑10 en temporadas (vacaciones Julio, Enero, Febrero) |
| **Carga (1‑5)** | 4 – Alto: exige concentración constante, análisis profundo y decisiones bajo presión. |
| **Riesgo (1‑5)** | 4 – Alto: decisiones bajo presión, impacto financiero directo, posibilidad de error con consecuencias importantes. |
| **% Retrabajo** | 20% – Moderado, algunos casos necesitan ajustes, principalmente por falta de información del vehículo (libretas de propiedad que no ayudan a identificar correctamente el modelo o modelos contradictorios y dudosos en los cotizadores). |
| **Subprocesos incluidos** | 001, 002 |
| **JSON** | [../procesos/100‑cambio‑vehiculo.json](../procesos/100-cambio-vehiculo.json) |

---

## 📊 Métricas Consolidadas (para dashboards futuros)

| Subproceso | Tiempo P50 | Tiempo P90 | Frec/mes | Carga | Riesgo | %Retrabajo |
|------------|------------|------------|----------|-------|--------|------------|
| 001 – Cotización multicompañía de vehículo | 20 min | 40 min | 150 | 4 | 5 | 15% |
| 002 – Anulación de póliza | 5 min | 10 min | 5 | 2 | 2 | 5% |

**Proceso 100 – Cambio de vehículo**  
- **Tiempo P50:** 40 min · **P90:** 55 min  
- **Frecuencia mensual:** 3 (promedio)  
- **Carga:** 4 · **Riesgo:** 4 · **% Retrabajo:** 20%

---

## 🧭 Próximos Pasos

1. **Crear otro subproceso** – Continuar entrevista.
2. **Vincular estos subprocesos a otros procesos mayores** (ej: “Gestión comercial”, “Renovación de pólizas”).
3. **Exportar a CSV** para cargar en Google Sheets.
4. **Analizar oportunidades** de automatización por métrica (alto retrabajo, alto riesgo, alta frecuencia).

---

**Última actualización:** 2026‑02‑21T02:40 UTC  
**Entrevistador:** OpenClaw Orchestrator  
**Fuente:** Entrevista con Juan Manuel (corredor de seguros).