# KR6: Rentabilidad y Finanzas - Documentación Técnica

## 📊 Resumen Ejecutivo

El KR6 de **Rentabilidad y Finanzas** mide la salud financiera de Fight.net, asegurando que la plataforma pueda sostener sus operaciones y cumplir su misión social de formalizar el ecosistema de deportes de combate en Aguascalientes.

---

## 📋 Tabla de KPIs Financieros

| # | KPI | Definición | Fórmula | Frecuencia | Responsable | Meta |
|---|-----|------------|---------|------------|-------------|------|
| 1 | **Runway** | Meses de vida financiera restantes | Runway = Efectivo / Burn Rate mensual | Mensual | CFO/Dueño | ≥6 meses |
| 2 | **Margen de Utilidad Neta** | Porcentaje de rentabilidad | Margen = ((Ingresos - Gastos) / Ingresos) × 100 | Mensual | CFO/Dueño | ≥20% |
| 3 | **Ingresos Totales Acumulados** | Suma de todos los ingresos | SUM(ingresos.monto) | Mensual | Marketing/Ventas | Crecimiento |
| 4 | **Ingresos por Eventos** | Ingresos de eventos verificados | Eventos × $15,000 MXN | Mensual | Operaciones | — |
| 5 | **Ingresos por Peleadores** | Ingresos por postulaciones | Postulaciones × $5,000 MXN | Mensual | Operaciones | — |
| 6 | **Valor Usuario Recurrente** | LTV estimado | Accesos × $100 MXN | Mensual | Producto | — |

---

## 🚦 Sistema de Semáforo Financiero

### Runway (Meses de Operación)

| Estado | Condición | Color | Acción Requerida |
|--------|-----------|-------|------------------|
| **Saludable** | ≥ 6 meses | 🟢 Verde | Continuar operaciones normales |
| **Riesgo Moderado** | 3 - 6 meses | 🟡 Amarillo | Revisar gastos y buscar financiamiento |
| **Riesgo Crítico** | < 3 meses | 🔴 Rojo | **URGENTE**: Reducir costos y/o conseguir inversión |

### Margen de Utilidad Neta

| Estado | Condición | Color | Acción Requerida |
|--------|-----------|-------|------------------|
| **Saludable** | ≥ 20% | 🟢 Verde | Modelo financiero saludable |
| **Riesgo Moderado** | 10% - 20% | 🟡 Amarillo | Optimizar costos operativos |
| **Riesgo Crítico** | < 10% | 🔴 Rojo | **URGENTE**: Reestructurar modelo de ingresos |

---

## 🎯 Ubrales para Startup Tecnológica

### Valores Recomendados

| KPI | Verde (Saludable) | Amarillo (Advertencia) | Rojo (Crítico) |
|-----|-------------------|----------------------|----------------|
| **Runway** | ≥ 6 meses | 3 - 6 meses | < 3 meses |
| **Margen de Utilidad Neta** | ≥ 20% | 10% - 20% | < 10% |
| **Ingresos Mensuales** | Crecimiento >10% | Estables | Declive |

### Justificación de Ubrales

- **Runway ≥ 6 meses**: Permite tiempo suficiente para ejecutar estrategias de crecimiento sin presión inmediata de financiamiento.
- **Margen ≥ 20%**: Estándar para startups tecnológicas en etapa temprana, permitiendo reinversión en crecimiento.
- **Alertas tempranas**: Los umbrales amarillos dan tiempo para ajustar el rumbo antes de una crisis.

---

## 🔗 Conexión con el Propósito del Proyecto

### Impacto Social de Fight.net

Fight.net no es solo una plataforma tecnológica; es un **vehículo de transformación social** para el ecosistema de deportes de combate en Aguascalientes:

- **Peleadores amateurs**: Acceso a oportunidades formales de peleas, sin depender de contactos informales o situaciones de riesgo
- **Promotores**: Herramienta profesional para organizar y verificar eventos
- **Ecosistema formal**: Reduces la informalidad y generas confianza en la industria

### ¿Por qué importan las finanzas?

```
┌─────────────────────────────────────────────────────────────┐
│  META FINANCIERA = SOSTENIBILIDAD DEL IMPACTO SOCIAL      │
└─────────────────────────────────────────────────────────────┘
```

| Objetivo Financiero | Impacto Social |
|---------------------|----------------|
| **Runway ≥ 6 meses** | Garantiza que peleadores sigan encontrando oportunidades |
| **Margen ≥ 20%** | Permite invertir en mejoras para la comunidad fight |
| **Crecimiento de ingresos** | Más eventos = más peleas = más peleadores beneficiados |

### Ejemplo Concreto

> Si Fight.net mantiene un **margen del 25%** con ingresos mensuales de **$120,000 MXN**, genera una utilidad de **$30,000 MXN** que puede reinvertirse en:
> - Mejorar la plataforma para peleadores
> - Marketing para atraer más promotores
> - Eventos gratuitos para la comunidad
> - Becas para peleadores amateurs talentosos

**En resumen**: Sin salud financiera, no hay impacto social sostenible. Las métricas financieras son el termómetro que asegura que Fight.net pueda cumplir su misión de transformar el ecosistema de deportes de combate en Aguascalientes.

---

## 📁 Estructura de Datos

### Tablas Relacionadas

| Tabla | Descripción |
|-------|-------------|
| `ingresos` | Registro de todos los ingresos por tipo |
| `gastos` | Gastos operativos categorizados |
| `financials` | Indicadores clave de efectivo y burn rate |

### Ejemplo de Datos

```csv
# financials.csv
id,concepto,tipo,monto,fecha_actualizacion
1,efectivo_disponible,efectivo,150000,2026-02-28
2,burn_rate,gasto,40000,2026-02-28
3,ingresos_mensuales,ingreso,120000,2026-02-28
4,gastos_mensuales,gasto,90000,2026-02-28
```

---

## ✅ Checklist de Monitoreo

- [ ] Revisar Runway mensualmente
- [ ] Calcular Margen de Utilidad Neta cada mes
- [ ] Verificar alertas en dashboard
- [ ] Documentar decisiones financieras
- [ ] Ajustar presupuesto según indicadores
