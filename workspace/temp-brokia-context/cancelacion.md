# 📌 Proceso de Cancelación (Anulación) de Póliza

**Área:** Operativa / Administrativa  
**Objetivo:** Gestionar correctamente la anulación de una póliza asegurando el cálculo adecuado del saldo pendiente o recupero correspondiente.

---

## 1. Descripción General del Proceso

La anulación de una póliza puede originarse por distintas razones:

- Venta del vehículo.
    
- Cambio de vehículo.
    
- Cambio de compañía por conveniencia comercial.
    
- Decisión unilateral del cliente.
    
- Reestructuración de cartera.
    

Es importante destacar que **anular una póliza no significa automáticamente que el cliente deje de pagar sin ajustes**. En la mayoría de los casos, la anulación genera un cálculo económico basado en el tiempo de vigencia utilizado.

---

## 2. Concepto Clave: Tabla de Términos Cortos

Cada compañía de seguros dispone de una **tabla de términos cortos**.

Esta tabla:

- Divide el año de vigencia en rangos de días.
    
- Asigna un porcentaje de premio devengado a cada rango.
    

Cuando el cliente solicita la anulación antes del fin de vigencia:

1. Se calcula la cantidad de días transcurridos desde el inicio de la póliza.
    
2. Se identifica el rango correspondiente en la tabla.
    
3. Se obtiene el porcentaje aplicable.
    
4. Ese porcentaje representa cuánto del premio total anual el cliente debería tener pago al momento de cancelar.
    

---

## 3. Posibles Escenarios al Anular

### 🔹 Camino 1 – Saldo a pagar

El cliente **no ha abonado el porcentaje que corresponde según la tabla**.

En este caso:

- Se genera una factura de cancelación.
    
- El importe a pagar será:
    

> (Porcentaje según tabla × Premio total) – Cuotas pagas

Esto ocurre comúnmente en clientes que pagan en **10 cuotas**, ya que el esquema de pago suele quedar por debajo del porcentaje devengado al momento de anular.

Resultado:  
➡️ El cliente debe pagar un saldo pendiente.

---

### 🔹 Camino 2 – Recupero a favor del cliente

El cliente **ha pagado más de lo que corresponde según el porcentaje devengado**.

En este caso:

- La factura de cancelación mostrará saldo negativo.
    
- Ese saldo representa un recupero a favor del cliente.
    
- El recupero debe solicitarse por mail a la compañía a través del corredor.
    

Esto ocurre generalmente cuando:

- El cliente pagó contado.
    
- El cliente pagó en pocas cuotas (menor a 10).
    

Resultado:  
➡️ La compañía debe devolver dinero al cliente.

---

### 🔹 Camino 3 – Sin saldo ni recupero

Aquí pueden darse dos situaciones:

1. La póliza está tan avanzada en vigencia que la tabla de términos cortos marca **100% del premio devengado**, aunque aún quede tiempo de vigencia.
    
2. La póliza fue utilizada (existió siniestro), lo que genera que al momento de anular se deba cobrar el 100%.
    

En estos casos:

- No hay saldo pendiente.
    
- No hay devolución.
    
- La póliza simplemente se cancela administrativamente.
    

Resultado:  
➡️ No hay movimiento económico adicional.

---

## 4. Procedimiento Operativo según Compañía

El proceso de cálculo depende de la compañía.

### 🔹 Cálculo manual

En compañías como:

- **Sancor Seguros**
    
- **HDI Seguros**
    

El cálculo debe realizarse:

- Manualmente (regla de tres).
    
- Consultando la tabla de términos cortos.
    
- O utilizando planillas Excel proporcionadas por la compañía.
    

Aquí el corredor debe:

- Verificar días exactos de vigencia.
    
- Aplicar porcentaje manualmente.
    
- Determinar saldo o recupero.
    

Este método es más propenso a errores y consume más tiempo.

---

### 🔹 Cálculo automático vía web

En compañías como:

- **Banco de Seguros del Estado**
    
- **SURA**
    
- **Mapfre**
    
- **Porto Seguro**
    

El cálculo puede realizarse directamente en el sistema web de la compañía.

El sistema:

- Calcula automáticamente el porcentaje.
    
- Emite la factura de cancelación.
    
- Muestra saldo o recupero.
    

Esto reduce el riesgo de error.

---

## 5. Riesgos del Proceso Actual

- Errores en cálculo manual.
    
- Interpretación incorrecta de tablas.
    
- No detectar recuperos a favor del cliente.
    
- Falta de registro histórico estructurado.
    
- Pérdida de tiempo operativo.
    

---

## 6. Oportunidad de Automatización

A nivel sistema, este módulo debería permitir:

1. Registrar fecha de inicio de póliza.
    
2. Registrar premio total.
    
3. Registrar plan de pagos.
    
4. Registrar cuotas abonadas.
    
5. Cargar tabla de términos cortos por compañía.
    
6. Calcular automáticamente:
    
    - Días de vigencia.
        
    - Porcentaje aplicable.
        
    - Saldo a pagar.
        
    - Recupero.
        

Además:

- Indicar si hubo siniestro (bloquea devolución).
    
- Generar documento de cancelación.
    
- Registrar histórico financiero.
    

---

## 7. Impacto Estratégico

Una correcta gestión de cancelaciones:

- Evita pérdidas económicas.
    
- Mejora transparencia con el cliente.
    
- Aumenta confianza.
    
- Reduce errores administrativos.
    
- Permite auditoría interna.