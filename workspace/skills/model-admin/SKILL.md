---
name: model-admin
description: Gestionar cambios de modelo en sesiones OpenClaw y solicitar habilitación de modelos nuevos de forma segura. Use when the user asks to switch the current model, check which models are allowed, troubleshoot "model not allowed" errors, or prepare config patch requests to add allowed models.
---

# Model Admin

1. Verificar el estado actual de la sesión con `session_status`.
2. Intentar cambiar el modelo con `session_status(model=...)` cuando el usuario lo pida.
3. Si falla con "not allowed", explicar que el bloqueo viene del allowlist del gateway y que un skill no puede saltar esa restricción.
4. Ofrecer alternativas inmediatas:
   - Usar un modelo ya permitido.
   - Mantener el modelo actual.
5. Si el usuario quiere agregar modelos, preparar solicitud explícita de cambio de configuración:
   - Pedir confirmación para modificar config.
   - Aplicar `gateway.config.patch` solo con permiso explícito.
   - Reiniciar gateway con nota clara si corresponde.
6. Validar luego del cambio:
   - Consultar `session_status`.
   - Reintentar `session_status(model=...)` con el nuevo modelo.

## Reglas

- No inventar nombres de modelos.
- No prometer acceso a modelos no habilitados.
- No usar workarounds para eludir políticas.
- Comunicar siempre causa real y siguiente acción concreta.
