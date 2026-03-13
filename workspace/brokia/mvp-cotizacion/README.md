# BROKIA MVP - Cotización Workflow

**Proyecto Final de Carrera** - Licenciatura en Sistemas  
**Cliente:** Juan Manuel, corredor de seguros  
**Universidad ORT Uruguay**

## Descripción

MVP del sistema BROKIA: plataforma de software como "sistema operativo" para corredores de seguros.

Este MVP implementa el flujo de **cotización de vehículos** con:
- Ingesta de mensajes de WhatsApp (mock)
- Extracción de datos (regex simple)
- Decision Objects versionados
- Process Execution con aprobación humana
- Dashboard operativo

## Arquitectura

```
Conversación → Decisión → Proceso → Aprobación → Ejecución
```

## Tech Stack

- **Backend:** Ruby on Rails 7.1 (API + Views)
- **Database:** PostgreSQL (jsonb para datos flexibles)
- **Queue:** Sidekiq + Redis
- **Frontend:** Rails views con ERB (MVP - no React)

## Instalación Rápida

```bash
# 1. Clonar y entrar
cd brokia/mvp-cotizacion

# 2. Instalar dependencias
bundle install

# 3. Crear base de datos
rails db:create db:migrate

# 4. Cargar datos de prueba
rails db:seed

# 5. Iniciar Redis (para Sidekiq)
redis-server

# 6. Iniciar Sidekiq
bundle exec sidekiq

# 7. Iniciar Rails
rails s
```

## Uso

### Dashboard
Visita: `http://localhost:3000/dashboard`

### API Endpoints

**Webhook de WhatsApp (mock):**
```bash
curl -X POST http://localhost:3000/api/v1/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "From": "+59899123456",
    "Body": "Quiero cotizar un Gol 2021"
  }'
```

**Ver decisiones:**
```bash
curl http://localhost:3000/api/v1/decisions
```

**Aprobar decisión:**
```bash
curl -X POST http://localhost:3000/api/v1/decisions/1/approve
```

## Flujo de Cotización

1. **Cliente envía mensaje** → Webhook recibe
2. **ProcessInboundMessageJob** → Clasifica intención (cotizacion_auto)
3. **Crea DecisionObject** → Extrae datos (marca, modelo, año)
4. **Inicia ProcessExecution** → Template `cotizacion_auto_v1`
5. **Steps automáticos:**
   - recopilar_datos
   - validar_completitud
   - ejecutar_cotizacion (mock: 3 aseguradoras)
   - presentar_al_cliente
   - validar_aceptacion (espera "SI")
6. **Gate de aprobación humana** → Pausa, notifica corredor
7. **Corredor aprueba** en Dashboard → Continúa
8. **emitir_poliza** → Finaliza

## Decisiones de Diseño (MVP)

| Aspecto | Decisión | Justificación |
|---------|----------|---------------|
| Extracción de datos | Regex simple | MVP rápido. Reemplazar por LLM en v2 |
| WhatsApp | Mock (no WABA real) | Evitar dependencia externa para demo |
| Cotizaciones | Mock (3 aseguradoras fijas) | Integraciones reales post-MVP |
| UI | Rails views (no React) | Velocidad de desarrollo |
| Auth | Skip | MVP interno, agregar luego |

## Estructura de Datos

### Conversation
- phone, status, control_mode (ai_first/human_led/takeover)

### Message
- direction (inbound/outbound), actor_type (customer/ai/human)
- body, intent, correlation_id

### DecisionObject
- type (CotizacionAuto), status (draft/needs_info/ready/approved/executed)
- data:jsonb, missing_fields:jsonb, evidence_map:jsonb

### ProcessExecution
- template, current_step_key, status
- context:jsonb (paso datos entre steps)

### DecisionEvent
- Audit trail append-only (event_type, payload, occurred_at)

## Próximos Pasos (Post-MVP)

1. Integrar WhatsApp Business API real
2. Reemplazar regex por LLM (OpenAI/Anthropic)
3. Integrar APIs de aseguradoras reales
4. Agregar autenticación (Devise)
5. Flujos de Endoso y Siniestro
6. Renovaciones automáticas

## Autores

- Manuel Pacheco
- [Segundo integrante]

**Tutor:** [Nombre del tutor]  
**Laboratorio de Ingeniería de Software - ORT Uruguay**
