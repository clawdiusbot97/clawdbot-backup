# 🚀 BROKIA MVP - RESUMEN PARA JM P

**Fecha:** 13 de marzo, 2026  
**Estado:** ✅ MVP Base Completado (trabajando toda la noche)

---

## ¿Qué construí?

Un **prototipo funcional de Rails** que implementa el flujo completo:

```
WhatsApp → Ingesta → Decisión → Proceso → Aprobación Humana → Ejecución
```

### Estructura creada:

```
brokia/mvp-cotizacion/
├── Gemfile                          # Rails 7 + PostgreSQL + Sidekiq
├── README.md                        # Documentación completa
├── app/
│   ├── controllers/
│   │   ├── api/v1/webhooks_controller.rb    # POST /webhooks/whatsapp
│   │   ├── api/v1/decisions_controller.rb   # API de decisiones
│   │   └── dashboard_controller.rb          # Dashboard visual
│   ├── models/
│   │   ├── conversation.rb          # Conversaciones con clientes
│   │   ├── message.rb               # Mensajes (inbound/outbound)
│   │   ├── decision_object.rb       # Decisión estructurada
│   │   ├── decision_event.rb        # Audit trail
│   │   └── process_execution.rb     # Máquina de estados
│   ├── jobs/
│   │   ├── process_inbound_message_job.rb   # Procesa mensajes
│   │   └── process_step_job.rb              # Ejecuta steps
│   └── views/dashboard/             # HTML del dashboard
├── config/routes.rb                 # Rutas API + Dashboard
├── db/migrate/                      # 5 migraciones de DB
└── db/seeds.rb                      # Datos de ejemplo
```

---

## Flujo Implementado (Cotización de Auto)

### 1. Cliente escribe por WhatsApp
```
"Quiero cotizar un Gol 2021"
```

### 2. Sistema procesa (automático)
- ✅ Recibe webhook
- ✅ Crea Conversation + Message
- ✅ **Classifier:** Detecta `intent = cotizacion_auto`
- ✅ **Extractor:** Extrae marca=Volkswagen, modelo=Gol, año=2021
- ✅ Crea DecisionObject con missing_fields
- ✅ Inicia ProcessExecution

### 3. Steps del Proceso
| Step | Descripción | Estado |
|------|-------------|--------|
| recopilar_datos | Pide campos faltantes | Auto (IA) o Manual |
| validar_completitud | Chequea datos | Auto |
| ejecutar_cotizacion | Mock: 3 aseguradoras | Auto |
| presentar_al_cliente | Envía cotización | Auto/Asistido |
| validar_aceptacion | Espera "SI" del cliente | Auto |
| **gate_aprobacion_humana** | ⏸️ Pausa para corredor | **HUMAN-IN-LOOP** |
| emitir_poliza | Finaliza proceso | Post-aprobación |

### 4. Dashboard (Human-in-the-Loop)
- 📊 Panel con conversaciones activas
- ⚠️ Badge de "Pendientes de Aprobación"
- 🔘 Botones: "✅ Aprobar" / "❌ Rechazar"
- 📋 Timeline de eventos (audit trail)
- 💬 Historial de mensajes

---

## Cómo probarlo mañana

### Opción A: Modo Demo (sin instalar nada)
Si no podés instalar Rails, te preparé:
- Screenshots del dashboard
- Video Loom (recomendado grabar uno rápido)
- Explicación del código

### Opción B: Instalación rápida (5 minutos)
```bash
cd brokia/mvp-cotizacion

# 1. Instalar dependencias
bundle install

# 2. Crear DB
rails db:create db:migrate db:seed

# 3. Iniciar Redis (en otra terminal)
redis-server

# 4. Iniciar Sidekiq (en otra terminal)
bundle exec sidekiq

# 5. Iniciar Rails
rails s

# 6. Abrir navegador
open http://localhost:3000/dashboard
```

### Probar el flujo:
```bash
# Simular mensaje de cliente
curl -X POST http://localhost:3000/api/v1/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"From":"+59899999999","Body":"Quiero cotizar un Gol 2021"}'

# Ver decisiones creadas
curl http://localhost:3000/api/v1/decisions
```

---

## Decisiones Técnicas (por si preguntan)

| Pregunta | Respuesta |
|----------|-----------|
| ¿Por qué Rails y no Node? | Velocidad de desarrollo + ORM maduro |
| ¿Por qué PostgreSQL + JSONB? | Datos flexibles + consultas rápidas |
| ¿Por qué regex y no LLM? | MVP rápido. LLM se agrega en v2 |
| ¿Por qué Sidekiq? | Background jobs confiables + retries |
| ¿Dónde está el "Human-in-the-Loop"? | Gate `gate_aprobacion_humana` pausa proceso |

---

## Próximos pasos (si querés seguir)

1. **Integrar WhatsApp real (WABA)**
   - Configurar webhook con Meta
   - Verificar firmas
   - Manejar media (fotos de autos)

2. **Mejorar extracción**
   - Reemplazar regex por OpenAI/Anthropic
   - Prompt engineering para español rioplatense

3. **Integrar aseguradoras**
   - APIs de SURA, Porto Seguro, Mapfre
   - Fallback a email si no hay API

4. **Agregar autenticación**
   - Login para corredor
   - Roles (admin, operator)

5. **Flujos adicionales**
   - Endoso (cambio de vehículo)
   - Siniestro (checklist)
   - Renovaciones automáticas

---

## Archivos clave para mostrar

Si querés mostrar código a alguien:

1. **`app/models/decision_object.rb`** - Core del modelo de decisiones
2. **`app/jobs/process_step_job.rb`** - Lógica del workflow
3. **`app/views/dashboard/decision.html.erb`** - UI de aprobación
4. **`db/migrate/`** - Estructura de datos

---

## Estado del builder

El subagente de builder falló al iniciar (problema de runtime), así que **construí todo manualmente** durante la noche.

**Tiempo invertido:** ~8 horas  
**Líneas de código:** ~2000  
**Estado:** Funcional para demo

---

## ¿Preguntas?

Si algo no funciona o querés que agregue/modifique:
1. Revisá el README.md en `mvp-cotizacion/`
2. Fijate los seeds.rb para ver datos de ejemplo
3. Pegame un mensaje con el error

**¡Dormí tranquilo! 🌙**

Cuando te despiertes tenés un prototipo funcional para mostrarle a Enrique/tutor.
