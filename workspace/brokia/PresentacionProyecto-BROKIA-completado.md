# Presentación de Proyecto - ORT Laboratorio de Ingeniería de Software
**Vigencia: 01-06-2027**

---

## INTEGRANTES DEL EQUIPO (nombre y número de estudiante):
- Manuel Pacheco - [Nº estudiante]
- [Completar con segundo integrante si aplica]

---

## CARRERA:
☑ Licenciatura en Sistemas
☐ Ingeniería
☐ Ambas

---

## TIPO DE PROYECTO:
☐ Emprendimiento Propio
☑ Proyecto para una persona o una empresa

---

## NOMBRE DEL PROYECTO:
**BROKIA - Sistema Operativo para Corredores de Seguros**

---

## PRIORIDAD DENTRO DE LAS PREFERENCIAS DEL EQUIPO:
**1** (Principal)

---

## TIPO DE PROYECTO (Seleccionar una opción):

☑ Desarrollo de solución a medida (solicitado por el cliente)
☐ Desarrollo de producto o solución
☐ Diseño de servicio con soporte tecnológico
☐ Investigación - Metodologías y procedimientos
☐ Investigación - Nuevas tecnologías
☐ Investigación - Desarrollo de prototipos
☐ Otros (especificar):

---

## NOMBRE DEL CLIENTE O EXPERTO DEL DOMINIO:
**Juan Manuel Pérez** - Corredor de Seguros Independiente

---

## CONTACTO EN EL CLIENTE O EXPERTO DEL DOMINIO:
- **Nombre:** Juan Manuel Pérez
- **Teléfono:** [Completar]
- **Email:** [Completar]
- **Dirección:** [Completar si aplica]

---

## DESCRIPCION DEL CLIENTE O EXPERTO DEL DOMINIO:

Juan Manuel es un corredor de seguros independiente especializado principalmente en seguros de automotores. Opera en Uruguay con una cartera aproximada de 700 clientes activos.

### Servicios que ofrece:
- Cotizaciones de seguros de vehículos
- Emisión de pólizas
- Cambios de vehículo (endosos)
- Seguimiento de siniestros
- Renovaciones de pólizas
- Avisos de vencimientos
- Gestión de cuotas impagas

### Situación actual:
La mayoría de la comunicación con clientes ocurre a través de **WhatsApp**. Su operación actual depende de:
- WhatsApp (principal canal de comunicación)
- Portales web de aseguradoras
- Hojas de cálculo (Excel)
- Memoria personal del corredor

Esta combinación genera problemas de:
- **Alta carga operativa:** Repetición de tareas, búsqueda de información dispersa
- **Falta de trazabilidad:** Dificultad para reconstruir qué se acordó con cada cliente
- **Procesos poco estructurados:** Cada caso se maneja de forma ad-hoc
- **Riesgo de errores:** Dependencia de la memoria humana
- **Imagen poco profesional:** Comunicaciones inconsistentes con clientes

**Adjunto:** Carta firmada por el cliente declarando su interés en trabajar con el equipo (disponible bajo solicitud).

---

## DESCRIPCION (Breve descripción del problema que se quiere resolver):

El corredor de seguros opera en un entorno donde la comunicación con 700+ clientes sucede principalmente por WhatsApp, pero carece de un sistema que estructure y automatice el trabajo operativo resultante.

**Problemas específicos:**
1. **Conversaciones sin estructura:** Un chat de WhatsApp sobre "quiero cotizar un auto" no se traduce automáticamente en un caso de trabajo estructurado con pasos definidos.

2. **Falta de sistema de recordatorios:** Los vencimientos de pólizas, cuotas impagas y seguimientos de siniestros dependen de la memoria del corredor, generando oportunidades perdidas.

3. **Re-trabajo constante:** Clientes envían información incompleta y el corredor debe pedir la misma información múltiples veces por distintos canales.

4. **Dificultad para reconstruir decisiones:** Cuando un cliente reclama "usted me dijo X", no hay registro fiable de qué se acordó.

5. **Comunicación no profesionalizada:** Cada email, PDF o mensaje se arma manualmente, generando inconsistencias de imagen.

**El problema es concreto, real y afecta diariamente la operación del cliente.**

---

## REQUERIMIENTOS (Descripción de los principales requerimientos):

### Componente 1: CRM Operativo para Corredores
Sistema donde el corredor puede:
- **Gestionar clientes:** Ficha completa con datos de contacto, historial de pólizas, documentación adjunta
- **Administrar pólizas:** Vigencia, coberturas, aseguradora, vehículos asociados
- **Ver estados de procesos:** Pipeline visual de cotizaciones, endosos, siniestros en curso
- **Recibir alertas operativas:**
  - Vencimiento de pólizas (30, 15, 7 días antes)
  - Cuotas impagas
  - Renovaciones próximas
  - Seguimientos de siniestros pendientes

**Acciones ejecutables desde el CRM:**
- Enviar aviso de vencimiento a cliente
- Enviar recordatorio de cuota impaga
- Iniciar proceso de renovación
- Generar cotización
- Iniciar proceso de cambio de vehículo

### Componente 2: Motor Conversacional sobre WhatsApp

**Flujo principal: Conversación → Decisión → Proceso**

Ejemplo de funcionamiento:
1. Cliente escribe por WhatsApp: "Quiero cotizar un Gol 2021"
2. El sistema:
   - Detecta la intención (cotización)
   - Crea un Decision Object (caso de cotización)
   - Identifica datos faltantes (cilindrada, uso, edad del conductor, etc.)
   - Ejecuta un proceso para recopilar información
   - Genera comparativo de precios
   - Permite al corredor enviar resultados profesionalmente

### Interacción Híbrida Humano + IA

El sistema permite tres modos de operación:

1. **Modo Manual:** El corredor responde directamente al cliente.

2. **Modo Asistido:** El sistema sugiere respuestas o preguntas al corredor, quien decide enviarlas o modificarlas.

3. **Modo Delegado:** La IA se encarga de recopilar información del cliente de forma automática. El corredor puede retomar el control en cualquier momento.

### Profesionalización de comunicaciones

Generación automática de:
- PDFs de cotizaciones con identidad visual del corredor
- Emails de renovación personalizados
- Avisos de vencimiento
- Resúmenes de cobertura
- Documentos de identidad visual consistente

**Innovación:**
- Modifica procesos actuales (de manual/Excel a estructurado/automatizado)
- Integra tecnología de procesamiento de lenguaje natural para interpretar conversaciones de WhatsApp
- Usa tecnología de workflow engine para procesos determinísticos
- Aplica arquitectura event-driven para trazabilidad completa

---

## IMPACTO DEL PROYECTO PARA EL CLIENTE:

### Importancia para el cliente
El proyecto es **crítico** para la operación del corredor. Actualmente, la carga operativa le impide escalar su negocio y genera riesgo de pérdida de clientes por falta de seguimiento.

**Consecuencias del éxito:**
- Reducción estimada del **30% o más** en carga operativa semanal
- Capacidad de atender más clientes sin aumentar personal
- Menor tasa de errores y olvidos
- Mejor experiencia del cliente (comunicaciones más rápidas y profesionales)
- Registro completo de interacciones para defensa ante reclamos

**Consecuencias del fracaso:**
- Continuidad del estado actual de sobrecarga operativa
- Riesgo de perder clientes por falta de seguimiento
- Imposibilidad de escalar el negocio
- Dependencia crítica de la memoria del corredor (riesgo si está ausente)

### Impacto general
- **Cliente:** Profesionalización y eficiencia operativa
- **Mercado:** Elevación del estándar de servicio de corredores independientes
- **Sociedad:** Mejor servicio de seguros para consumidores finales

---

## TECNOLOGIAS a UTILIZAR:

### Stack Principal (Backend)
- **Lenguaje/Framework:** Ruby on Rails 7/8
- **Base de datos:** PostgreSQL 16+ (system of record + outbox pattern)
- **Colas/Workers:** Redis + Sidekiq
- **Almacenamiento:** S3-compatible (evidencia/media)

### Integraciones
- **WhatsApp Business Cloud API (WABA):** Canal de comunicación principal
- **Proveedor de transcripción:** OpenAI Whisper API o Deepgram (audio a texto)
- **Email:** AWS SES / SendGrid / Mailgun

### Infraestructura
- **Containerización:** Docker + Docker Compose
- **Cloud:** Fly.io o AWS (ECS/Fargate + RDS)
- **Observabilidad:** Sentry (errores) + logs estructurados JSON

### Justificación técnica
- **Rails + Postgres:** Permite desarrollo rápido con equipo pequeño (2-3 devs), excelente soporte para transacciones fuertes y audit trails
- **Outbox pattern:** Garantiza consistencia entre base de datos y eventos
- **WABA:** API oficial de WhatsApp, estable y documentada
- **Arquitectura event-driven:** Facilita trazabilidad y extensibilidad

---

## EXPERIENCIA DEL EQUIPO CON ESTAS TECNOLOGIAS:

- **Ruby on Rails:** Experiencia previa en proyectos académicos y laborales
- **PostgreSQL:** Conocimiento sólido de modelado relacional y JSONB
- **Redis/Sidekiq:** Uso en sistemas de background jobs
- **Docker:** Containerización de aplicaciones
- **WhatsApp Cloud API:** Se requerirá investigación inicial (documentación oficial de Meta)
- **Procesamiento de audio (transcripción):** Integración con APIs de terceros

**Plan de mitigación:** Se contempla tiempo de investigación en las primeras semanas del proyecto para las tecnologías menos dominadas.

---

## DIFICULTADES PREVISIBLES DEL PROYECTO:

1. **WABA Setup y Webhooks:**
   - Verificación de firmas, rate limits, manejo de media expirada
   - *Mitigación:* Diseño idempotente y outbox pattern desde el inicio

2. **Transcripción de audio:**
   - Calidad con acentos locales (español rioplatense)
   - *Mitigación:* Validación con usuario real, feedback loop

3. **Extracción de información por IA:**
   - Riesgo de alucinaciones ("inventar" datos)
   - *Mitigación:* Diseño "evidence-bound" - todo campo extraído debe apuntar a evidencia; si no hay evidencia, marca como "unknown"

4. **Adopción por parte del cliente:**
   - Resistencia a cambiar workflow actual
   - *Mitigación:* Arrancar con modo "human-led" donde el corredor mantiene control total; IA como copiloto, no reemplazo

5. **Integraciones con aseguradoras:**
   - APIs no disponibles o inconsistencias
   - *Mitigación:* Fallback a email estructurado + scraping controlado

---

## MOTIVACION DEL EQUIPO PARA ESTE PROYECTO:

### Argumentos académicos
- Aplicación de conceptos de ingeniería de software en contexto real (cliente real, problema real)
- Diseño de arquitectura event-driven con audit trail completo
- Integración de IA/ML en flujo de trabajo operativo (no como reemplazo, sino como asistencia)
- Desarrollo de sistema con requisitos de confiabilidad y trazabilidad (crítico en dominio de seguros)

### Proyección profesional
- Experiencia con integración de APIs empresariales (WhatsApp Business)
- Desarrollo de producto con usuario real y feedback continuo
- Portafolio demostrable: sistema completo de gestión operativa
- Contacto con industria de seguros (fintech/insurtech)

### Personales
- Interés en automatización inteligente (IA que asiste, no reemplaza)
- Motivación por resolver problemas concretos de eficiencia operativa
- Oportunidad de mejorar el trabajo diario de un profesional real
- Desafío técnico interesante: procesamiento de lenguaje natural + workflows determinísticos

---

## NOTAS FINALES:

**Declaración:** Este proyecto cuenta con el aval del cliente (Juan Manuel Pérez, corredor de seguros) mediante carta firmada, disponible para presentación ante el comité.

**Alcance esperado para tesis:** Implementación completa del CRM Operativo + Motor Conversacional para los flujos de Endosos y Siniestros Checklist (Fase 1 y 2). Renovaciones y Cotizaciones como roadmap post-tesis.

---

*Documento preparado para presentación ante el Laboratorio de Ingeniería de Software - ORT Uruguay*
