# 📌 Gestión de Siniestros con Reparación Particular y Pendiente de Levantamiento de Daños

**Área:** Operativa / Siniestros  
**Objetivo:** Garantizar el cierre correcto de siniestros cuando el cliente repara por su cuenta y evitar que queden daños abiertos en la compañía.

---

## 1. Descripción del Problema

Existen situaciones donde:

- El cliente cuenta con **cobertura parcial**.
    
- Fue culpable del siniestro.
    
- No pudo reclamar al tercero.
    
- O el daño no está cubierto por su póliza.
    

En estos casos, el cliente:

👉 Realiza la reparación del vehículo de forma particular (fuera del seguro).

Sin embargo, aunque la reparación sea particular, el siniestro queda registrado en la compañía.

Para que ese daño no quede abierto en el historial del vehículo, es necesario realizar lo que se denomina:

**Levantamiento de daños.**

---

## 2. ¿Qué es el Levantamiento de Daños?

Es el procedimiento mediante el cual:

- Se informa a la compañía que el vehículo fue reparado.
    
- Se presenta el vehículo a inspección (según compañía).
    
- Se actualiza el estado del siniestro.
    
- Se libera el antecedente de daño pendiente.
    

Si no se realiza este paso:

- El vehículo puede quedar con daño abierto.
    
- En un futuro siniestro similar, la compañía puede rechazar cobertura.
    
- Puede haber problemas en renovación.
    
- Puede afectar cambio de compañía.
    

---

## 3. Problema Operativo Actual

Cuando el cliente repara por su cuenta:

- Se le informa que debe avisar cuando finalice la reparación.
    
- Muchas veces responde informalmente.
    
- O directamente no avisa.
    
- O el aviso queda en un chat.
    
- O se conversa por teléfono.
    

Con el tiempo:

- El corredor lo olvida.
    
- El cliente lo olvida.
    
- El daño queda abierto indefinidamente.
    

Y no es viable estar reclamando manualmente cada semana.

---

## 4. Riesgos Asociados

- Rechazo de futuros siniestros.
    
- Conflictos con el cliente.
    
- Mala experiencia.
    
- Pérdida de credibilidad.
    
- Problemas al cambiar de compañía.
    
- Observaciones en inspecciones futuras.
    

Este es un riesgo invisible hasta que genera un problema.

---

## 5. Propuesta de Solución en el Sistema

Incorporar un **módulo de seguimiento de daños pendientes**.

---

## 6. Funcionamiento Propuesto

### 6.1 Registro del Siniestro

Cuando ocurre un siniestro no cubierto o reparado por cuenta del cliente, el sistema debe registrar:

- Fecha del siniestro.
    
- Tipo de daño.
    
- Cobertura involucrada.
    
- Si la reparación será particular.
    
- Estado: “Pendiente levantamiento”.
    

---

### 6.2 Activación de Seguimiento Automático

El sistema debería:

- Generar un recordatorio automático.
    
- Establecer intervalos configurables (ej: cada 15, 30 o 45 días).
    
- Enviar mensaje automático por WhatsApp o mail.
    

Ejemplo conceptual:

> Recordatorio: Tenemos pendiente el levantamiento de daños del siniestro del día XX/XX.  
> ¿El vehículo ya fue reparado?

---

### 6.3 Confirmación del Cliente

Si el cliente confirma que ya reparó:

- Se agenda inspección.
    
- Se gestiona levantamiento en la compañía.
    
- Se marca el siniestro como cerrado.
    

Si el cliente indica que aún no reparó:

- El sistema reinicia el ciclo de seguimiento.
    

---

## 7. Estado del Siniestro en el Sistema

El módulo debería contemplar estados como:

- Abierto.
    
- Reparación particular pendiente.
    
- En seguimiento.
    
- Inspección solicitada.
    
- Levantamiento realizado.
    
- Cerrado.
    

---

## 8. Beneficios Estratégicos

Implementar este seguimiento permite:

- Evitar daños abiertos indefinidamente.
    
- Reducir riesgos futuros.
    
- Mejorar experiencia del cliente.
    
- Proteger al corredor.
    
- Profesionalizar la gestión post-siniestro.
    
- No depender de memoria ni chats.
    

---

## 9. Diferenciación Competitiva

Ninguna app de cotización automática hace seguimiento de daños pendientes.

Este tipo de gestión:

👉 Refuerza el rol asesor del corredor.  
👉 Agrega valor después del siniestro.  
👉 Genera fidelización.

---

## 10. Visión a Futuro

Este módulo podría integrarse con:

- Historial completo de siniestros.
    
- Alertas previas a renovación.
    
- Análisis de riesgo del cliente.
    
- Recordatorios inteligentes basados en tiempo promedio de reparación.
    

Incluso podría generar alertas internas como:

> Cliente con daño pendiente hace más de 90 días.