# Architecture Design Report

**Item:** [{{ID}}]({{FILE}})  
**Type:** {{TYPE}}  
**Rol:** Architecture Lead  
**Generated:** {{TIMESTAMP}}  

---

## 1. Supuestos Arquitectónicos

<!-- Supuestos sobre arquitectura, patrones, constraints -->

- Supuesto 1: 
- Supuesto 2: 
- Supuesto 3: 

## 2. Arquitecturas Evaluadas

### Opción A: 

**Diagrama conceptual:**
```
[Componente A] → [Componente B] → [Componente C]
```

**Pros:**
- 

**Contras:**
-

### Opción B:

**Diagrama conceptual:**
```
[Componente A] → [Componente B] → [Componente C]
```

**Pros:**
- 

**Contras:**
-

### Opción C:

**Diagrama conceptual:**
```
[Componente A] → [Componente B] → [Componente C]
```

**Pros:**
- 

**Contras:**
-

## 3. Matriz de Decisión

| Criterio | Peso | Opción A | Opción B | Opción C |
|----------|------|----------|----------|----------|
| Escalabilidad | 30% | | | |
| Mantenibilidad | 25% | | | |
| Performance | 20% | | | |
| Seguridad | 15% | | | |
| Costo | 10% | | | |
| **Puntaje ponderado** | | | | |

## 4. Recomendación Arquitectónica

**Arquitectura recomendada:** 

**Justificación:**

## 5. Diagrama de Componentes (Recomendado)

<!-- Diagrama de la arquitectura propuesta -->

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│                   (Web/Mobile)                          │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                      API Gateway                        │
│                   (Auth/Rate Limit)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   Core Services                         │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Service  │  │ Service  │  │ Service  │              │
│  │    A     │  │    B     │  │    C     │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                      Data Layer                         │
│              (Database / Cache / Queue)                 │
└─────────────────────────────────────────────────────────┘
```

## 6. Riesgos Arquitectónicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Complejidad excesiva | | | |
| Vendor lock-in | | | |
| Deuda técnica | | | |
| Single point of failure | | | |

## 7. Decisiones Arquitectónicas (ADRs)

<!-- Links a ADRs relacionados -->

- [ ] ADR-001: Elección de base de datos
- [ ] ADR-002: Patrón de comunicación entre servicios
- [ ] ADR-003: Estrategia de deployment

## 8. Próximos Pasos

- [ ] Validar arquitectura con stakeholders
- [ ] Crear diagramas detallados
- [ ] Definir interfaces/contracts
- [ ] Estimación de esfuerzo de implementación

---
*Reporte generado por wi-pipeline.sh (research/arch)*
