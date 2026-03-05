# Brokia — Resumen de Solución (para CIE) (v3)

**Fecha:** 2026-03-04  
**Versión:** v3  
**Objetivo:** explicar la solución propuesta de forma corta y entendible (sin detalle de MVP técnico).

---

## 1) Problema (en 1 minuto)
En seguros automotores, la mayoría de los acuerdos operativos se cierran por WhatsApp (texto, audios y llamadas): cobertura, deducible, vigencia, selección de póliza, documentación.

Hoy eso genera un patrón frágil:
- conversación → memoria humana/copy-paste → operación

Consecuencias:
- decisiones dispersas, sin “versión vigente” clara,
- cambios por goteo que generan malentendidos,
- reprocesos, demoras y reclamos,
- trazabilidad operativa pobre (para el corredor y para el cliente).

---

## 2) Qué es Brokia (propuesta)
Brokia es un **asistente conversacional para corredores de seguros** que **estructura conversaciones de WhatsApp en decisiones operativas trazables**.

- El cliente conversa como siempre.
- El asistente guía con preguntas paso a paso y explica conceptos de forma simple.
- El corredor no se reemplaza: se mantiene **human-in-the-loop** para decisiones importantes.

El corazón de la propuesta es un motor reusable (“Decision Core”) que convierte conversaciones en decisiones registradas.

---

## 3) Concepto central (la transformación)
Brokia transforma conversaciones informales en **decisiones registradas** que disparan trabajo operativo.

```
Hoy:
Conversation → memoria humana → operación

Con Brokia:
Conversation → Decision Objects → Decision Events → Process Execution
```

En simple:
- detectar decisiones en conversaciones,
- dejarlas registradas de forma clara y versionada,
- y cuando se confirman, disparar trabajo operativo.

---

## 4) Qué resuelve concretamente (valor)
Para el corredor:
- menos tiempo de ida y vuelta por datos faltantes,
- menos errores por malentendidos (cobertura/deducible/vigencia),
- trazabilidad operativa: recuperar rápido qué se acordó, cuándo y con qué evidencia,
- decisiones confirmadas generan tareas/seguimiento (menos olvidos).

Para el cliente:
- experiencia más clara y rápida por WhatsApp,
- mejor entendimiento de opciones y condiciones.

---

## 5) Cómo funciona (alto nivel)
1) Cliente escribe o manda audio por WhatsApp.
2) Brokia hace preguntas breves para completar datos.
3) Brokia estructura lo acordado como **decisiones** (ej. “solicitud de cotización”, “propuesta enviada”, “cliente elige opción B”, “acepta emisión”).
4) Cuando el cliente confirma, eso genera un evento de decisión “confirmada”.
5) Ese evento dispara ejecución: tareas internas, notificaciones y documentos operativos (sin depender de memoria humana).

**Nota UX:** cuando aplica, Brokia usa **mensajes interactivos de WhatsApp** (botones y listas) para recolectar datos y confirmar opciones, reduciendo ambigüedad.

---

## 6) IA + humano (modelo híbrido)
- **Autopilot:** IA responde y avanza en lo simple (relevamiento, recordatorios, explicaciones).
- **Copilot:** el corredor valida decisiones materiales (elección de póliza, deducible, cobertura, aceptación final).

Esto reduce fricción y mantiene control profesional.

---

## 7) Alcance de validación (MVP, sin prometer de más)
- Foco inicial: **seguros automotores** y **WhatsApp**.
- 1 flujo completo a validar: **cotización → propuesta → aceptación**.
- Cotización: se asume **carga manual del corredor** (el sistema ordena y deja trazabilidad). Integraciones con aseguradoras quedan para fases futuras.

---

## 8) Escalabilidad (enfoque prudente)
El foco inicial es seguros automotores, pero el **motor de decisiones** es reutilizable en otros **procesos operativos basados en chat**, sin cambiar el concepto central.

---

## 9) Métricas de éxito (qué mediríamos)
- **tiempo de primera respuesta al cliente** (en WhatsApp),
- tiempo promedio para cerrar una cotización,
- reducción de reprocesos por información incompleta,
- cantidad de decisiones confirmadas con evidencia,
- tiempo para reconstruir el historial de un caso (antes vs después),
- percepción de valor del corredor piloto.

---

## Cierre (1 frase)
Brokia convierte conversaciones de WhatsApp en decisiones operativas trazables y ejecutables, reduciendo errores y carga operativa sin reemplazar al corredor.
