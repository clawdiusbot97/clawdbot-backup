# OpenClaw Setup Actual - Resumen de Contexto

**Fecha de actualización:** 18-02-2026  
**Versión del documento:** 1.0

---

## 1. Arquitectura General

OpenClaw es un sistema multiagente orquestado mediante un **Gateway daemon** que gestiona la comunicación y coordinación entre agentes especializados.

- **Gateway:** Servicio central activo que orquestra 8 agentes configurados
- **Agentes:** Procesos especializados con roles definidos (researcher, writer, builder, chief, ops, brokia)
- **Sesiones:** Cada interacción genera una sesión efímera con contexto aislado
- **Comunicación:** Canales Slack y Telegram configurados para output de eventos

---

## 2. Agentes Especializados

| Agente | Rol Principal |
|--------|---------------|
| **researcher** | Búsqueda, investigación, scraping de fuentes |
| **writer** | Generación de contenido, resúmenes, documentación |
| **builder** | Construcción de artifacts, diagramas, código |
| **chief** | Orquestación de alto nivel, toma de decisiones |
| **ops** | Operaciones, cron jobs, mantenimiento |
| **brokia** | Gestión del proyecto Brokia, priorización de procesos |
| **brokia-ai** | Alertas y notificaciones del proyecto Brokia |
| **qubika-ai** | Monitoreo y radar de inteligencia artificial |

---

## 3. Cron Jobs Activos

| Job | Frecuencia | Propósito | Estado |
|-----|------------|-----------|--------|
| `brokia-doc-diario-sync` | Diario | Sincronización de documentación Brokia | Activo |
| `Twitter RSS Digest` | Cada 12h | Compilación de feeds RSS de Twitter | Activo |
| `Daily Newsletter Digest` | 9 AM UTC | Resumen diario de newsletter | Activo |
| `daily-research-scout` | 7 AM Montevideo | Búsqueda matutina de oportunidades | Activo |
| `brokia-calendar-alerts-daily` | Diario | Alertas de calendario Brokia | Activo |
| `qubika-daily-focus` | Diario | Focus diario del equipo Qubika | Activo |
| `qubika-deadline-check` | Diario | Verificación de deadlines pendientes | Activo |
| `evening-fallback-briefing` | Tarde | Resumen de fallback nocturno | Activo |
| `healthchecks` | Periódico | Monitoreo de salud del sistema | Activo |

---

## 4. Skills Implementados

| Skill | Agente | Propósito |
|-------|--------|-----------|
| `twitter-fetch` | researcher | Obtención de tweets via RSS/API |
| `twitter-format` | writer | Formateo de tweets para publicación |
| `excalidraw-diagram` | builder | Generación de diagramas Excalidraw |
| `newsletter-digest` | writer | Compilación de newsletters |
| `brokia-plan` | brokia | Planificación de procesos Brokia |
| `secure-token` | ops | Gestión segura de tokens y credenciales |
| `newsletter-render` | builder | Renderizado de newsletters a PNG |
| `tts` | writer | Text-to-speech para contenido de audio |

---

## 5. Canales Configurados

### Slack
| Canal | Estado | Propósito |
|-------|--------|-----------|
| `#twitter-news` | ⚠️ Falla por ID | Distribución de noticias Twitter |
| `#newsletter-digest` | ✅ Activo | Resúmenes de newsletters |
| `#brokia-ai-alerts` | ✅ Activo | Alertas del proyecto Brokia |
| `#qubika-ai-radar` | ⚠️ Falla delivery | Radar de IA para Qubika |

### Telegram
| Destinatario | Estado | Propósito |
|--------------|--------|-----------|
| Grupo twitter-news | ⚠️ Pendiente ID | Canal de backup Twitter |
| Usuario 2017549847 | ✅ Activo | Mensajes directos prioritarios |

---

## 6. Backend de Memoria

- **Configuración actual:** QMD (Quilted Markdown) para memoria a largo plazo
- **Estado:** Activo y funcionando
- **Daily notes:** Archivos `memory/YYYY-MM-DD.md` para continuidad entre sesiones
- **Nota:** MEMORY.md no se carga en contextos compartidos por seguridad

---

## 7. Proyectos Activos

### Brokia - Matriz de Procesos
- **Sheet ID:** `1dK6DFYY_IQxi2fG31Ed6ARcYSrSJFb8GUu-dcTZgAic`
- **Carpeta Drive:** Procesos Brokia - Prioritización
- **Propósito:** Prioritización y gestión de procesos del proyecto Brokia

### Twitter RSS Pipeline
- **Pipeline completo:** Fetch → Format → Digest → Distribución
- **Frecuencia:** Digest cada 12 horas
- **Canales:** Slack (#twitter-news) + Telegram

### Diagramas Excalidraw
- **Skill activo:** `excalidraw-diagram`
- **Propósito:** Generación visual de diagramas técnicos
- **Nota:** Renderizado a PNG pendiente de ajustes

---

## 8. Problemas Conocidos

| Issue | Gravedad | Descripción |
|-------|----------|-------------|
| Slack #twitter-news ID | Media | Error de channel ID, falla la publicación |
| Qubika AI Radar delivery | Media | Falla en entrega de mensajes al canal |
| Newsletter PNG render | Baja | Formato de salida requiere ajuste |
| Sheet formato Brokia | Baja | Formato de columnas requiere revisión |

---

## 9. Próximos Pasos

- [ ] Corregir ID de canal Slack #twitter-news
- [ ] Solucionar problema de delivery en #qubika-ai-radar
- [ ] Ajustar formato de renderizado PNG para newsletters
- [ ] Revisar formato de columnas en sheet Brokia
- [ ] Documentar IDs de Telegram para grupo twitter-news

---

## Referencias

- **Gateway:** `openclaw gateway status`
- **Configuración general:** `/home/manpac/.openclaw/workspace/agents/writer/`
- **Memory:** `memory/YYYY-MM-DD.md`, `MEMORY.md`
- **Tools:** `TOOLS.md` - Notas locales de configuración
- **Agents:** `AGENTS.md` - Documentación de agentes

---

*Documento generado automáticamente. Actualizar cuando hayan cambios significativos en la configuración.*