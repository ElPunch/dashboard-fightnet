================================================================================
                         FIGHT.NET - MANUAL OPERATIVO
                    Sistema de Medición Integral del Proyecto ADN
                    Gestión Operativa y Control Estratégico - BSC
================================================================================
                          Aguascalientes, México
                            Marzo 2026 - Versión 1.0
================================================================================

ÍNDICE
------
1. Introducción
2. Objetivos del Sistema de Medición
3. Arquitectura del Dashboard
4. Configuración y Puesta en Marcha
5. Tabla de Ingeniería de Indicadores (28 KPIs)
   5.1 KR1 - Crecimiento de Usuarios (3 KPIs)
   5.2 KR2 - Eventos Verificados (3 KPIs)
   5.3 KR3 - Emparejamientos Confirmados (3 KPIs)
   5.4 KR4 - Participación de Peleadores (3 KPIs)
   5.5 KR5 - Usuarios Recurrentes (3 KPIs)
   5.6 KR6 - Rentabilidad y Finanzas (13 KPIs)
6. Análisis de Perspectivas BSC
   6.1 Perspectiva Financiera
   6.2 Perspectiva Cliente
7. Guía de Operación
8. Interpretación de Semáforos
9. Mantenimiento y Actualización
10.Anexos Técnicos

================================================================================
1. INTRODUCCIÓN
================================================================================

Fight.net es una plataforma digital diseñada para conectar peleadores de 
deportes de contacto con promotores de eventos en Aguascalientes, México.

Este Manual Operativo documenta el sistema de medición integral desarrollado
para el proyecto académico de la materia ADN (Administración de Negocios
Digitales), implementando los principios del Balanced Scorecard (BSC) para
garantizar un control estratégico efectivo de las operaciones.

ALCANCE DEL MANUAL:
- Configuración completa del dashboard
- Documentación técnica de 28 KPIs
- Análisis estratégico de perspectivas BSC
- Guía de operación para usuarios

================================================================================
2. OBJETIVOS DEL SISTEMA DE MEDICIÓN
================================================================================

OBJETIVO GENERAL:
 Consolidar el sistema de medición integral del proyecto ADN, integrando la
 ingeniería de indicadores y el análisis de las perspectivas del Balanced
 Scorecard para soportar la toma de decisiones estratégicas.

OBJECTIVOS ESPECÍFICOS:
1. Proporcionar visibilidad en tiempo real del desempeño operativo
2. Medir el avance hacia las metas establecidas en cada KR
3. Identificar desviaciones y áreas de oportunidad
4. Generar reportes ejecutivos para stakeholders
5. Soportar la cultura de mejora continua

META GLOBAL DEL PROYECTO:
- KR1: 200 usuarios activos registrados
- KR2: 30 eventos verificados
- KR3: 40 emparejamientos confirmados
- KR4: 60% de participación de peleadores
- KR5: 50% de usuarios recurrentes
- KR6: Runway ≥6 meses, Margen de Utilidad ≥20%

================================================================================
3. ARQUITECTURA DEL DASHBOARD
================================================================================

3.1 COMPONENTES DEL SISTEMA

┌─────────────────────────────────────────────────────────────────┐
│                        DASHBOARD FIGHT.NET                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  NAVEGACIÓN │  │    TOPBAR   │  │ DATE RANGE  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              SUMMARY STRIP (6 Métricas Clave)           │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │        BSC ANALYSIS - Balanced Scorecard                  │    │
│  │  ┌───────────────────┐  ┌───────────────────┐           │    │
│  │  │ Perspectiva       │  │ Perspectiva       │           │    │
│  │  │ Financiera        │  │ Cliente           │           │    │
│  │  │ 📊 Runway         │  │ 👥 Participación  │           │    │
│  │  │ 💵 Margen        │  │ 🤝 Cierre        │           │    │
│  │  │ 📈 Flujo Caja    │  │ 🔄 Recurrencia   │           │    │
│  │  └───────────────────┘  └───────────────────┘           │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   KR SECTIONS (6 Secciones)              │    │
│  │  KR1 - Usuarios │ KR2 - Eventos │ KR3 - Matches        │    │
│  │  KR4 - Peleadores │ KR5 - Recurrencia │ KR6 - Finanzas │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

3.2 ESTRUCTURA DE ARCHIVOS

fightnet/
├── index.html              # Página principal con tutorial
├── upload.html             # Carga de datos (manual y CSV)
├── dashboard.html          # Dashboard principal de KPIs
├── scripts/
│   ├── dataManager.js      # Gestión de datos y localStorage
│   ├── kpiEngine.js        # Motor de cálculos (28 KPIs)
│   ├── charts.js           # Renderizado de gráficos Chart.js
│   └── tutorial.js         # Tutorial interactivo
├── data_schema.json         # Esquema de base de datos
├── example_data/            # Datos de ejemplo CSV
└── static/                 # Recursos estáticos

3.3 STACK TECNOLÓGICO

- Frontend: HTML5, CSS3, JavaScript ES6+
- Gráficos: Chart.js 4.4.0 (CDN)
- PDF: jsPDF 2.5.1 + jsPDF-AutoTable
- Persistencia: localStorage del navegador
- Tipografía: Google Fonts (Inter)
- Servidor: No requerido (ejecución offline)

================================================================================
4. CONFIGURACIÓN Y PUESTA EN MARCHA
================================================================================

4.1 REQUISITOS DEL SISTEMA

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- Acceso a Internet (para cargar librerías CDN)
- Resoluciones de pantalla: 1024x768 mínimo

4.2 PROCEDIMIENTO DE ARRANQUE

PASO 1: Abrir el Dashboard
   - Localizar el archivo "dashboard.html"
   - Abrir en cualquier navegador moderno
   - O ejecutar servidor local: python -m http.server 8000

PASO 2: Cargar Datos de Prueba
   - Ubicar el botón "🎯 Datos de Ejemplo" en el topbar
   - Hacer clic para cargar datos simulados
   - Verificar que las métricas se actualicen

PASO 3: Verificar Visualizaciones
   - Confirmar que los 6 KR se muestren correctamente
   - Verificar que los gráficos se rendericen
   - Comprobar los semáforos de colores

PASO 4: Explorar Filtros de Fecha
   - Probar "Todo el tiempo"
   - Probar "Últimos 30 días"
   - Probar rango personalizado

4.3 CARGA DE DATOS REALES

Para cargar datos reales, ir a "Carga de Datos" y:
1. Seleccionar la tabla a poblar
2. Ingresar datos manualmente o importar CSV
3. Validar campos requeridos
4. Guardar cambios

================================================================================
5. TABLA DE INGENIERÍA DE INDICADORES
================================================================================

NORMATIVA: Cada KPI está documentado con:
- Objetivo asociado: ¿A qué meta mayor pertenece?
- KR: Número de Resultado Clave (1-6)
- KPI: Métrica específica de control
- Fórmula: Lógica matemática
- Herramienta: Fuente de datos
- Gráfica: Justificación del tipo de visualización

--------------------------------------------------------------------------------
5.1 KR1 - CRECIMIENTO DE USUARIOS
Meta: 200 usuarios activos registrados
--------------------------------------------------------------------------------

┌────┬─────────────────────────────────┬─────────────────────────────────────┐
│ #  │ KPI                            │ USUARIOS_01                        │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│    │ Objetivo                       │ Adquirir y activar usuarios        │
│    │                                │ registrados en la plataforma       │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 1  │ Usuarios Activos               │ COUNT(perfil_completo=true AND    │
│    │ Registrados                    │ última_actividad ≤ 30 días)        │
│    │                                │                                     │
│    │ KR: 1                          │ USUARIOS_01 = usuarios_registrados  │
│    │ Fórmula: COUNT                 │                                     │
│    │ Herramienta: Bitácora          │ Line Chart: Muestra evolución      │
│    │ Gráfica: LINE                  │ temporal del crecimiento           │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 2  │ Tasa de Crecimiento            │ ((Usuarios_mes - Usuarios_prev) /  │
│    │ Mensual                        │ Usuarios_prev) × 100               │
│    │                                │                                     │
│    │ KR: 1                          │ CREC_01 = ((U_t - U_t-1) / U_t-1)  │
│    │ Fórmula: Variación %           │                                     │
│    │ Herramienta: Bitácora          │ Line Chart: Identifica aceleración  │
│    │ Gráfica: LINE                  │ o desaceleración del crecimiento    │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 3  │ Tasa de Conversión             │ (Usuarios_activos /                │
│    │ de Registros                   │ Usuarios_registrados) × 100       │
│    │                                │                                     │
│    │ KR: 1                          │ CONV_01 = (U_act / U_reg) × 100    │
│    │ Fórmula: Porcentaje            │                                     │
│    │ Herramienta: Bitácora          │ Line Chart: Mide efectividad       │
│    │ Gráfica: LINE                  │ del proceso de onboarding           │
└────┴─────────────────────────────────┴─────────────────────────────────────┘

--------------------------------------------------------------------------------
5.2 KR2 - EVENTOS VERIFICADOS
Meta: 30 eventos verificados
--------------------------------------------------------------------------------

┌────┬─────────────────────────────────┬─────────────────────────────────────┐
│ #  │ KPI                            │ EVENTOS_01                          │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│    │ Objetivo                       │ Aumentar el volumen de eventos      │
│    │                                │ de calidad verificados               │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 4  │ Eventos Verificados            │ COUNT(eventos WHERE estatus =       │
│    │                                │ "Verificado")                       │
│    │ KR: 2                          │ EVT_01 = eventos_verificados         │
│    │ Fórmula: COUNT                 │                                     │
│    │ Herramienta: Bitácora          │ Bar Chart: Compara volumen mensual  │
│    │ Gráfica: BAR                   │ de eventos verificados              │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 5  │ Tiempo Promedio de             │ Σ(días_pub → días_verif) /         │
│    │ Verificación                   │ Total_verificados                    │
│    │                                │                                     │
│    │ KR: 2                          │ TPV_01 = Σ(t_verif - t_pub) / N     │
│    │ Fórmula: Promedio              │                                     │
│    │ Herramienta: Bitácora          │ Line Chart: Detecta cuellos de      │
│    │ Gráfica: LINE                  │ botella en el proceso               │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 6  │ Porcentaje de Eventos          │ (Eventos_verificados /              │
│    │ Aprobados                      │ Eventos_enviados) × 100             │
│    │                                │                                     │
│    │ KR: 2                          │ APR_01 = (EVT_verif / EVT_env)×100 │
│    │ Fórmula: Porcentaje            │                                     │
│    │ Herramienta: Bitácora          │ Line Chart: Mide calidad de         │
│    │ Gráfica: LINE                  │ eventos que se envían a revisión    │
└────┴─────────────────────────────────┴─────────────────────────────────────┘

--------------------------------------------------------------------------------
5.3 KR3 - EMPAREJAMIENTOS CONFIRMADOS
Meta: 40 emparejamientos confirmados
--------------------------------------------------------------------------------

┌────┬─────────────────────────────────┬─────────────────────────────────────┐
│ #  │ KPI                            │ MATCHES_01                          │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│    │ Objetivo                       │ Asegurar el éxito en conectar      │
│    │                                │ peleadores con promotores           │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 7  │ Emparejamientos                │ COUNT(matches WHERE estatus =      │
│    │ Confirmados                    │ "Confirmado por ambas partes")      │
│    │                                │                                     │
│    │ KR: 3                          │ MTCH_01 = matches_confirmados       │
│    │ Fórmula: COUNT                 │                                     │
│    │ Herramienta: Bitácora          │ Bar Chart: Compara matches por      │
│    │ Gráfica: BAR                   │ período                             │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 8  │ Tasa de Cierre                 │ (Matches_confirmados /              │
│    │ de Emparejamientos             │ Matches_iniciados) × 100            │
│    │                                │                                     │
│    │ KR: 3                          │ TCI_01 = (MTCH_conf / MTCH_ini)×100│
│    │ Fórmula: Porcentaje            │                                     │
│    │ Herramienta: Bitácora          │ Line Chart: Mide calidad del        │
│    │ Gráfica: LINE                  │ sistema de emparejamiento           │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 9  │ Tiempo Promedio               │ Σ(días_solicitud →                  │
│    │ de Cierre de Match            │ días_confirmación) / Total_conf     │
│    │                                │                                     │
│    │ KR: 3                          │ TPM_01 = Σ(t_conf - t_sol) / N      │
│    │ Fórmula: Promedio              │                                     │
│    │ Herramienta: Bitácora          │ Line Chart: Identifica retrasos     │
│    │ Gráfica: LINE                  │ en el proceso de cierre             │
└────┴─────────────────────────────────┴─────────────────────────────────────┘

--------------------------------------------------------------------------------
5.4 KR4 - PARTICIPACIÓN DE PELEADORES
Meta: 60% de participación
--------------------------------------------------------------------------------

┌────┬─────────────────────────────────┬─────────────────────────────────────┐
│ #  │ KPI                            │ PELEADORES_01                       │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│    │ Objetivo                       │ Fomentar la participación activa    │
│    │                                │ de peleadores en la plataforma      │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 10 │ Porcentaje de Peleadores      │ (Peleadores_con_postulación /       │
│    │ con Participación              │ Total_peleadores) × 100             │
│    │                                │                                     │
│    │ KR: 4                          │ PAR_01 = (PEL_post / PEL_total)×100 │
│    │ Fórmula: Porcentaje            │                                     │
│    │ Herramienta: Postulaciones     │ Doughnut: Muestra proporción de     │
│    │ Gráfica: DOUGHNUT              │ participación vs inactividad       │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 11 │ Postulaciones Promedio        │ Total_postulaciones /               │
│    │ por Peleador                   │ Total_peleadores                    │
│    │                                │                                     │
│    │ KR: 4                          │ PPP_01 = POST_total / PEL_total     │
│    │ Fórmula: División             │                                     │
│    │ Herramienta: Postulaciones     │ Line Chart: Compara engagement       │
│    │ Gráfica: LINE                  │ por fighter a lo largo del tiempo   │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 12 │ Tasa de Conversión            │ (Postulaciones_confirmadas /        │
│    │ de Postulación                │ Total_postulaciones) × 100         │
│    │                                │                                     │
│    │ KR: 4                          │ TCP_01 = (POST_conf / POST_tot)×100│
│    │ Fórmula: Porcentaje            │                                     │
│    │ Herramienta: Postulaciones     │ Line Chart: Mide éxito de cada      │
│    │ Gráfica: LINE                  │ postulación                          │
└────┴─────────────────────────────────┴─────────────────────────────────────┘

--------------------------------------------------------------------------------
5.5 KR5 - USUARIOS RECURRENTES
Meta: 50% de recurrencia
--------------------------------------------------------------------------------

┌────┬─────────────────────────────────┬─────────────────────────────────────┐
│ #  │ KPI                            │ RECURRENCIA_01                      │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│    │ Objetivo                       │ Generar lealtad y uso constante     │
│    │                                │ de la plataforma                    │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 13 │ Tasa de Usuarios              │ (Usuarios_con_2+_accesos /          │
│    │ Recurrentes                    │ Total_usuarios) × 100              │
│    │                                │                                     │
│    │ KR: 5                          │ REC_01 = (U_2+acc / U_total) × 100 │
│    │ Fórmula: Porcentaje            │                                     │
│    │ Herramienta: Analytics        │ Line Chart: Mide retención y        │
│    │ Gráfica: LINE                  │ lealtad mes a mes                   │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 14 │ Frecuencia Promedio           │ Total_accesos_mes /                 │
│    │ de Uso                         │ Total_usuarios_mes                  │
│    │                                │                                     │
│    │ KR: 5                          │ FRE_01 = ACC_total / U_total        │
│    │ Fórmula: División             │                                     │
│    │ Herramienta: Analytics        │ Line Chart: Compara frecuencia      │
│    │ Gráfica: LINE                  │ de uso en el tiempo                 │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 15 │ Tasa de Retención            │ (Usuarios_retenidos_mes_t /         │
│    │ Mensual                        │ Usuarios_activos_mes_t-1) × 100    │
│    │                                │                                     │
│    │ KR: 5                          │ RET_01 = (U_ret_t / U_act_t-1)×100│
│    │ Fórmula: Porcentaje            │                                     │
│    │ Herramienta: Analytics        │ Line Chart: Identifica churn y      │
│    │ Gráfica: LINE                  │ tendencias de abandono              │
└────┴─────────────────────────────────┴─────────────────────────────────────┘

--------------------------------------------------------------------------------
5.6 KR6 - RENTABILIDAD Y FINANZAS
Meta: Runway ≥6 meses, Margen ≥20%
--------------------------------------------------------------------------------

┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUB-KR 6A: INGRESOS                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌────┬─────────────────────────────────┬─────────────────────────────────────┐
│ #  │ KPI                            │ INGRESOS_01                         │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 16 │ Ingresos por Eventos          │ COUNT(eventos_verif) × $15,000 MXN  │
│    │ Verificados                    │ o SUM(ingresos WHERE tipo=evento)   │
│    │                                │                                     │
│    │ KR: 6                          │ ING_EVT = EVT_verif × $15,000       │
│    │ Fórmula: Multiplicación        │                                     │
│    │ Herramienta: Módulo Financiero │ Bar Chart: Compara ingresos por     │
│    │ Gráfica: BAR                   │ evento en cada período              │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 17 │ Ingresos por Participación   │ COUNT(post_confirmadas) × $5,000    │
│    │ de Peleadores                  │ MXN o SUM(ingresos WHERE tipo=post) │
│    │                                │                                     │
│    │ KR: 6                          │ ING_PEL = POST_conf × $5,000        │
│    │ Fórmula: Multiplicación        │                                     │
│    │ Herramienta: Módulo Financiero │ Bar Chart: Analiza ingresos por     │
│    │ Gráfica: BAR                   │ segmento de peleadores              │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 18 │ Valor de Usuario              │ Accesos_recurrentes × $100 MXN     │
│    │ Recurrente (LTV)               │ o SUM(ingresos WHERE tipo=usuario) │
│    │                                │                                     │
│    │ KR: 6                          │ LTV_01 = ACC_rec × $100            │
│    │ Fórmula: Multiplicación        │                                     │
│    │ Herramienta: Módulo Financiero │ Bar Chart: Estima valor de          │
│    │ Gráfica: BAR                   │ lifetime de usuarios                │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 21 │ Ingresos Totales              │ SUM(ingresos.monto)                │
│    │ Acumulados                     │                                     │
│    │                                │                                     │
│    │ KR: 6                          │ ING_TOT = Σ ING                    │
│    │ Fórmula: Suma                  │                                     │
│    │ Herramienta: Módulo Financiero │ Bar Chart: Muestra volumen total    │
│    │ Gráfica: BAR                   │ de ingresos por período             │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 28 │ Tendencia de Ingresos        │ ((ING_actual - ING_anterior) /     │
│    │                               │ ING_anterior) × 100                 │
│    │                                │                                     │
│    │ KR: 6                          │ TND_ING = ((ING_t - ING_t-1)/ING_t-1│
│    │ Fórmula: Variación %           │)×100                                 │
│    │ Herramienta: Módulo Financiero │ Line Chart: Mide crecimiento o     │
│    │ Gráfica: LINE                  │ decrecimiento de ventas             │
└────┴─────────────────────────────────┴─────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          SUB-KR 6B: ANÁLISIS DE RUNWAY                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌────┬─────────────────────────────────┬─────────────────────────────────────┐
│ #  │ KPI                            │ RUNWAY_01                           │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 19 │ Runway                         │ Efectivo_disponible /               │
│    │ (Meses de Operación)           │ Burn_Rate_mensual                   │
│    │                                │                                     │
│    │ KR: 6                          │ RUN_01 = EFEC / BURN                │
│    │ Fórmula: División              │                                     │
│    │ Herramienta: Módulo Financiero │ Line Chart: Evolución del runway     │
│    │ Gráfica: LINE                  │ en el tiempo                         │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 22 │ Burn Rate Mensual             │ SUM(gastos.monto) por mes           │
│    │                                │                                     │
│    │ KR: 6                          │ BURN_MES = Σ GASTOS_mes             │
│    │ Fórmula: Suma mensual          │                                     │
│    │ Herramienta: Módulo Financiero │ Bar Chart: Identifica picos de      │
│    │ Gráfica: BAR                   │ gasto y patrones estacionales       │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 25 │ Runway Proyectado             │ Efectivo / |Flujo_neto_promedio|    │
│    │                                │                                     │
│    │ KR: 6                          │ RUN_PROY = EFEC / |FLUJO_prom|      │
│    │ Fórmula: Proyección            │                                     │
│    │ Herramienta: Módulo Financiero │ Bar Chart: Proyecta sostenibilidad │
│    │ Gráfica: BAR                   │ futura basada en tendencias         │
└────┴─────────────────────────────────┴─────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        SUB-KR 6C: ANÁLISIS DE MARGEN                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌────┬─────────────────────────────────┬─────────────────────────────────────┐
│ #  │ KPI                            │ MARGEN_01                           │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 20 │ Margen de Utilidad            │ ((Ingresos - Gastos) /              │
│    │ Neta                           │ Ingresos) × 100                     │
│    │                                │                                     │
│    │ KR: 6                          │ MAR_01 = ((ING - GAS) / ING) × 100  │
│    │ Fórmula: Porcentaje            │                                     │
│    │ Herramienta: Módulo Financiero │ Line Chart: Mide rentabilidad       │
│    │ Gráfica: LINE                  │ porcentual histórica               │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 23 │ Flujo de Caja Neto            │ Ingresos - Gastos (por mes)         │
│    │                                │                                     │
│    │ KR: 6                          │ FLU_01 = ING_mes - GAS_mes          │
│    │ Fórmula: Diferencia            │                                     │
│    │ Herramienta: Módulo Financiero │ Bar Chart: Muestra ganancia o       │
│    │ Gráfica: BAR                   │ pérdida mensual                     │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 24 │ Margen de Utilidad           │ ((ING_mes - GAS_mes) / ING_mes)    │
│    │ por Mes                        │ × 100                               │
│    │                                │                                     │
│    │ KR: 6                          │ MAR_MES = ((ING_m - GAS_m)/ING_m)×100│
│    │ Fórmula: Porcentaje mensual    │                                     │
│    │ Herramienta: Módulo Financiero │ Line Chart: Analiza evolución de    │
│    │ Gráfica: LINE                  │ márgenes en el tiempo              │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 26 │ Ratio Gastos/Ingresos         │ (Gastos / Ingresos) × 100          │
│    │                                │                                     │
│    │ KR: 6                          │ RAT_01 = (GAS / ING) × 100         │
│    │ Fórmula: Porcentaje            │                                     │
│    │ Herramienta: Módulo Financiero │ Line Chart: Mide eficiencia         │
│    │ Gráfica: LINE                  │ operativa                           │
├────┼─────────────────────────────────┼─────────────────────────────────────┤
│ 27 │ Gastos por Categoría         │ SUM(gastos.monto) GROUP BY         │
│    │                                │ categoria                           │
│    │                                │                                     │
│    │ KR: 6                          │ GAS_CAT = Σ GASTOS GROUP BY CAT    │
│    │ Fórmula: Agrupación            │                                     │
│    │ Herramienta: Módulo Financiero │ Doughnut: Identifica áreas de      │
│    │ Gráfica: DOUGHNUT              │ gasto principales                  │
└────┴─────────────────────────────────┴─────────────────────────────────────┘

================================================================================
6. ANÁLISIS DE PERSPECTIVAS BSC
================================================================================

El Balanced Scorecard (BSC) proporciona un marco para traducir la visión
estratégica en un conjunto coherente de indicadores de desempeño. Para este
proyecto, se implementan 2 perspectivas fundamentales:

--------------------------------------------------------------------------------
6.1 PERSPECTIVA FINANCIERA
--------------------------------------------------------------------------------

OBJETIVO ESTRATÉGICO:
 Asegurar la sostenibilidad económica y el crecimiento rentable de Fight.net
 mediante una gestión eficiente de ingresos, gastos y flujo de caja.

INDICADORES DE DESEMPEÑO FINANCIERO:

┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. RUNWAY (MESES DE OPERACIÓN)                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Definición: Meses de operación restantes con el efectivo disponible actual │
│ Fórmula: Efectivo disponible / Burn Rate mensual                          │
│ Meta: ≥ 6 meses                                                            │
│                                                                             │
│ Estados:                                                                    │
│ - VERDE (≥6): Solidez financiera garantizada                              │
│ - AMARILLO (3-6): Requiere atención y búsqueda de ingresos adicionales    │
│ - ROJO (<3): Estado crítico, medidas urgentes necesarias                  │
│                                                                             │
│ Análisis: El runway indica cuánto tiempo puede operar la empresa antes de  │
│ quedarse sin efectivo. Factores de riesgo:                                 │
│ - Dependencia de ingresos por eventos específicos                         │
│ - Estacionalidad del sector (vacaciones, festividades)                    │
│ - Capacidad de ajustar gastos variables rápidamente                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. MARGEN DE UTILIDAD NETA                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Definición: Porcentaje de rentabilidad sobre ingresos totales             │
│ Fórmula: ((Ingresos - Gastos) / Ingresos) × 100                           │
│ Meta: ≥ 20%                                                                │
│                                                                             │
│ Estados:                                                                    │
│ - VERDE (≥20%): Rentabilidad saludable                                    │
│ - AMARILLO (10-20%): Margen moderado, requiere optimización              │
│ - ROJO (<10%): Insostenible a largo plazo                                 │
│                                                                             │
│ Componentes:                                                                │
│ - Ingresos por eventos verificados                                         │
│ - Ingresos por participación de peleadores                                 │
│ - Ingresos por membresías/usuarios recurrentes                              │
│ - Gastos operativos, marketing, desarrollo y servicios                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. FLUJO DE CAJA NETO                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Definición: Diferencia entre ingresos y gastos en un período               │
│ Fórmula: Ingresos - Gastos                                                 │
│ Meta: Positivo consistente mes a mes                                       │
│                                                                             │
│ Estados:                                                                    │
│ - VERDE: Positivo (permite reinversión y ahorro)                          │
│ - ROJO: Negativo (requiere corrección inmediata)                          │
│                                                                             │
│ Estacionalidad identificada:                                                │
│ - Temporadas altas: Julio-Agosto, Diciembre                                │
│ - Temporadas bajas: Enero-Febrero (post-vacaciones)                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. BURN RATE MENSUAL                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ Definición: Gastos promedio mensual                                        │
│ Fórmula: Σ(gastos.monto) / número de meses                                │
│ Meta: Decreciente y controlado                                             │
│                                                                             │
│ Categorías de gasto:                                                        │
│ - Operativos: Servidores, hosting, herramientas de software               │
│ - Marketing: Publicidad, promociones, comisiones                          │
│ - Desarrollo: Mantenimiento de plataforma, nuevas funcionalidades         │
│ - Servicios: Pagos a terceros, soporte técnico                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. RATIO GASTOS/INGRESOS                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Definición: Porcentaje de ingresos destinado a gastos                     │
│ Fórmula: (Gastos / Ingresos) × 100                                        │
│ Meta: ≤ 80%                                                                │
│                                                                             │
│ Estados:                                                                    │
│ - VERDE (≤80%): Eficiencia operativa buena                                │
│ - AMARILLO (80-100%): En el límite, requiere atención                      │
│ - ROJO (>100%): Gastos superan ingresos, situación insostenible           │
└─────────────────────────────────────────────────────────────────────────────┘

RECOMENDACIONES ESTRATÉGICAS - PERSPECTIVA FINANCIERA:

1. DIVERSIFICACIÓN DE INGRESOS
   - Implementar programa de membresías mensuales para peleadores
   - Crear paquete de visibilidad premium para promotores
   - Negociar contratos de larga duración con organizadores recurrentes

2. CONTROL DE GASTOS
   - Revisar suscripciones y herramientas de software
   - Reducir gastos discrecionales en temporadas bajas
   - Automatizar procesos para reducir costos operativos

3. RESERVA DE EMERGENCIA
   - Mantener efectivo equivalente a 3 meses de burn rate mínimo
   - Establecer políticas de aprobación de gastos mayores

4. PLANEACIÓN FINANCIERA
   - Proyectar flujo de caja a 6 meses
   - Identificar meses de alta y baja temporada
   - Planear inversiones estratégicas en períodos de alta liquidez

--------------------------------------------------------------------------------
6.2 PERSPECTIVA CLIENTE
--------------------------------------------------------------------------------

OBJETIVO ESTRATÉGICO:
 Satisfacer las necesidades de peleadores y promotores, generando lealtad
 y engagement mediante una experiencia de plataforma fluida y efectiva.

INDICADORES DE DESEMPEÑO DE CLIENTE:

┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. PARTICIPACIÓN DE PELEADORES                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Definición: Porcentaje de peleadores que realizan postulaciones           │
│ Fórmula: (Peleadores_con_postulación / Total_peleadores) × 100            │
│ Meta: ≥ 60%                                                                │
│                                                                             │
│ Estados:                                                                    │
│ - VERDE (≥60%): Buena adopción de la plataforma                           │
│ - AMARILLO (30-60%): Moderada, requiere mejora en engagement              │
│ - ROJO (<30%): Baja adopción, revisar propuesta de valor                   │
│                                                                             │
│ Segmentación:                                                               │
│ - Peleadores activos: Con postulaciones en últimos 30 días                 │
│ - Peleadores pasivos: Registrados sin postulaciones                       │
│ - Peleadores inactivos: Sin actividad en últimos 60 días                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. TASA DE CIERRE DE EMPAREJAMIENTOS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Definición: Efectividad del sistema de emparejamiento                      │
│ Fórmula: (Matches_confirmados / Matches_iniciados) × 100                   │
│ Meta: ≥ 50%                                                                │
│                                                                             │
│ Estados:                                                                    │
│ - VERDE (≥50%): Sistema de matching efectivo                               │
│ - AMARILLO (25-50%): Moderado, revisar calidad de matches                  │
│ - ROJO (<25%): Sistema no funciona correctamente                          │
│                                                                             │
│ Factores de éxito:                                                          │
│ - Calidad y completitud de perfil de peleadores                           │
│ - Reputación y ratings de promotores                                       │
│ - Competitividad de precio y términos de pelea                             │
│ - Velocidad de respuesta de ambas partes                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. TIEMPO PROMEDIO DE CIERRE DE MATCH                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Definición: Velocidad promedio de confirmación de matches                 │
│ Fórmula: Σ(días_solicitud → confirmación) / Total_confirmados            │
│ Meta: ≤ 7 días                                                             │
│                                                                             │
│ Estados:                                                                    │
│ - VERDE (≤7 días): Proceso rápido y eficiente                             │
│ - AMARILLO (7-14 días): Aceptable pero mejorable                          │
│ - ROJO (>14 días): Demasiado lento, riesgo de abandono                    │
│                                                                             │
│ Optimizaciones posibles:                                                     │
│ - Notificaciones automáticas a ambas partes                               │
│ - Chat integrado peleador-promotor                                         │
│ - Plantillas de términos predefinidas                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. RECURRENCIA DE USUARIOS                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Definición: Porcentaje de usuarios con 2+ accesos mensuales                 │
│ Fórmula: (Usuarios_2+_accesos / Total_usuarios) × 100                    │
│ Meta: ≥ 50%                                                                │
│                                                                             │
│ Estados:                                                                    │
│ - VERDE (≥50%): Alta lealtad y engagement                                 │
│ - AMARILLO (25-50%): Moderada, implementar estrategias                    │
│ - ROJO (<25%): Alto riesgo de churn                                       │
│                                                                             │
│ Beneficios de usuarios recurrentes:                                         │
│ - Ingresos más predecibles y recurrentes                                  │
│ - Embajadores de marca naturales                                          │
│ - Feedback valioso para mejora continua                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. CONVERSIÓN DE POSTULACIONES                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Definición: Calidad de matches realizados                                 │
│ Fórmula: (Postulaciones_confirmadas / Total_postulaciones) × 100          │
│ Meta: ≥ 40%                                                                │
│                                                                             │
│ Estados:                                                                    │
│ - VERDE (≥40%): Alta tasa de éxito en postulaciones                       │
│ - AMARILLO (20-40%): Moderada, mejorar alineación expectativas            │
│ - ROJO (<20%): Expectativas desalineadas entre partes                     │
└─────────────────────────────────────────────────────────────────────────────┘

RECOMENDACIONES ESTRATÉGICAS - PERSPECTIVA CLIENTE:

1. MEJORA DE EXPERIENCIA DE USUARIO
   - Implementar onboarding guiado para peleadores nuevos
   - Crear tutorial interactivo de primera postulación
   - Simplificar proceso de registro al mínimo necesario

2. SISTEMA DE REPUTACIÓN
   - Implementar ratings peleadores → promotores
   - Implementar ratings promotores → peleadores
   - Mostrar estadísticas de éxito en perfiles

3. COMUNICACIÓN EFECTIVA
   - Notificaciones push para nuevas oportunidades
   - Alertas de matches potenciales según preferencias
   - Recordatorios de seguimiento post-evento

4. PROGRAMAS DE FIDELIZACIÓN
   - Beneficios para peleadores con alta tasa de conversión
   - Descuentos en membresías para usuarios recurrentes
   - Acceso anticipado a eventos exclusivos

5. SOPORTE Y SEGUIMIENTO
   - Canal de soporte directo (chat/WhatsApp)
   - Encuestas NPS mensuales de satisfacción
   - Seguimiento post-cierre de match

================================================================================
7. GUÍA DE OPERACIÓN
================================================================================

7.1 ACCESO AL SISTEMA

1. Abrir archivo dashboard.html en navegador
2. Navegar a través de menú superior si es necesario
3. El dashboard carga automáticamente con datos en localStorage

7.2 NAVEGACIÓN DEL DASHBOARD

┌─────────────────────────────────────────────────────────────────────────────┐
│ ELEMENTO              │ FUNCIÓN                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Barra de navegación   │ Acceso a Inicio, Carga de Datos, Dashboard         │
│ Topbar                │ Título, período actual, botones de acción           │
│ Filtros de fecha      │ Seleccionar rango temporal de análisis             │
│ Summary Strip         │ 6 métricas clave de un vistazo                      │
│ BSC Analysis          │ Análisis estratégico de perspectivas                │
│ KR Sections           │ 6 secciones con KPIs detallados                     │
│ Footer                │ Información del sistema                             │
└─────────────────────────────────────────────────────────────────────────────┘

7.3 FILTROS DE FECHA

┌─────────────────────────────────────────────────────────────────────────────┐
│ OPCIÓN              │ DESCRIPCIÓN                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Todo el tiempo      │ Sin restricciones temporales                        │
│ Últimos 30 días     │ Datos del último mes calendario                      │
│ Últimos 3 meses     │ Datos trimestrales                                   │
│ Últimos 6 meses     │ Datos semestrales                                    │
│ Personalizado       │ Rango de fechas específico                          │
└─────────────────────────────────────────────────────────────────────────────┘

7.4 BOTONES DE ACCIÓN

┌─────────────────────────────────────────────────────────────────────────────┐
│ BOTÓN              │ FUNCIÓN                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Actualizar          │ Recarga datos y visualizaciones                      │
│ Datos de Ejemplo    │ Carga datos simulados para pruebas                   │
│ Exportar PDF        │ Genera reporte ejecutivo completo                     │
│ Cargar Datos        │ Ir al módulo de carga de datos                       │
└─────────────────────────────────────────────────────────────────────────────┘

7.5 EXPORTACIÓN DE REPORTES

El botón "Exportar PDF" genera un reporte ejecutivo que incluye:
- Portada con logo y título
- Fecha y hora de generación
- Período de análisis seleccionado
- Resumen ejecutivo con métricas principales
- Tabla de KPIs por KR
- Análisis estratégico BSC

================================================================================
8. INTERPRETACIÓN DE SEMÁFOROS
================================================================================

El sistema utiliza colores semafóricos para indicar el estado de cada
indicador. La interpretación depende del tipo de métrica:

┌─────────────────────────────────────────────────────────────────────────────┐
│                    TABLA DE SEMÁFOROS POR TIPO DE MÉTRICA                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ TIPO MÉTRICA          │ VERDE           │ AMARILLO       │ ROJO           │
│ ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│ RUNWAY (meses)        │ ≥ 6 meses       │ 3 - 6 meses    │ < 3 meses      │
│                                                                             │
│ MARGEN UTILIDAD (%)   │ ≥ 20%           │ 10 - 20%       │ < 10%          │
│                                                                             │
│ PARTICIPACIÓN (%)    │ ≥ 60%           │ 30 - 60%       │ < 30%          │
│                                                                             │
│ RECURRENCIA (%)       │ ≥ 50%           │ 25 - 50%       │ < 25%          │
│                                                                             │
│ CIERRE MATCHES (%)   │ ≥ 50%           │ 25 - 50%       │ < 25%          │
│                                                                             │
│ CONVERSIÓN (%)       │ ≥ 40%           │ 20 - 40%       │ < 20%          │
│                                                                             │
│ RATIO GASTOS/ING (%) │ ≤ 80%           │ 80 - 100%      │ > 100%         │
│                                                                             │
│ FLUJO CAJA ($MXN)    │ ≥ 0 (positivo)  │ N/A            │ < 0 (negativo) │
│                                                                             │
│ TIEMPO CIERRE (días) │ ≤ 7 días        │ 7 - 14 días    │ > 14 días      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

NOTA: Las alertas visuales en el dashboard incluyen:
- Pulso animado para estados críticos (rojo)
- Bordes parpadeantes para atención urgente
- Iconos de alerta en el resumen de métricas

================================================================================
9. MANTENIMIENTO Y ACTUALIZACIÓN
================================================================================

9.1 ACTUALIZACIÓN DE DATOS

Frecuencia recomendada: Diaria o semanal, según volumen de operaciones

Pasos:
1. Ir a "Carga de Datos"
2. Seleccionar tabla a actualizar
3. Agregar nuevos registros
4. Validar campos requeridos
5. Guardar cambios

9.2 RESPALDO DE INFORMACIÓN

Los datos se almacenan en localStorage del navegador. Para respaldar:
1. Exportar datos en formato CSV desde "Carga de Datos"
2. Guardar archivos CSV en ubicación segura
3. Documentar fecha de último respaldo

9.3 LIMPIEZA DE DATOS

Si necesita reiniciar con datos frescos:
1. Ir a "Carga de Datos"
2. Seleccionar "Limpiar tabla" (por tabla específica)
3. Confirmar limpieza
4. Cargar nuevos datos o datos de ejemplo

9.4 ACTUALIZACIÓN DE KPIs

Para modificar fórmulas o agregar nuevos KPIs:
1. Editar archivo scripts/kpiEngine.js
2. Agregar/editar función de cálculo
3. Registrar en KPI_REGISTRY
4. Agregar al dashboard si es necesario

================================================================================
10. ANEXOS TÉCNICOS
================================================================================

10.1 ESQUEMA DE BASE DE DATOS

┌─────────────────────────────────────────────────────────────────────────────┐
│ TABLA: usuarios                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Campo               │ Tipo      │ Descripción                             │
├─────────────────────┼───────────┼─────────────────────────────────────────  │
│ id_usuario          │ NUMBER    │ Identificador único                     │
│ perfil_completo     │ BOOLEAN   │ Registro completado                     │
│ fecha_registro      │ DATE      │ YYYY-MM-DD                              │
│ ultima_actividad     │ DATE      │ Última interacción                       │
│ rol                 │ STRING    │ peleador | promotor | admin             │
└─────────────────────┴───────────┴─────────────────────────────────────────  │
                                                                             │
│ TABLA: eventos                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Campo               │ Tipo      │ Descripción                             │
├─────────────────────┼───────────┼─────────────────────────────────────────  │
│ id_evento           │ NUMBER    │ Identificador único                     │
│ fecha_publicacion   │ DATE      │ Fecha de publicación                    │
│ fecha_verificacion  │ DATE      │ Fecha de aprobación                     │
│ estatus             │ STRING    │ Verificado | Pendiente | Rechazado      │
└─────────────────────┴───────────┴─────────────────────────────────────────  │
                                                                             │
│ TABLA: matches                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Campo               │ Tipo      │ Descripción                             │
├─────────────────────┼───────────┼─────────────────────────────────────────  │
│ id_match            │ NUMBER    │ Identificador único                     │
│ id_peleador         │ NUMBER    │ FK a usuarios                           │
│ id_promotor         │ NUMBER    │ FK a usuarios                           │
│ fecha_solicitud     │ DATE      │ Fecha de solicitud                      │
│ fecha_confirmacion  │ DATE      │ Fecha de confirmación                   │
│ estatus             │ STRING    │ Confirmado | Pendiente | Cancelado     │
└─────────────────────┴───────────┴─────────────────────────────────────────  │
                                                                             │
│ TABLA: postulaciones                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Campo               │ Tipo      │ Descripción                             │
├─────────────────────┼───────────┼─────────────────────────────────────────  │
│ id_postulacion      │ NUMBER    │ Identificador único                     │
│ id_peleador         │ NUMBER    │ FK a usuarios                           │
│ id_oportunidad      │ NUMBER    │ FK a eventos                            │
│ fecha_postulacion   │ DATE      │ Fecha de postulación                    │
│ estatus             │ STRING    │ postulada | confirmada | rechazada     │
└─────────────────────┴───────────┴─────────────────────────────────────────  │
                                                                             │
│ TABLA: ingresos                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Campo               │ Tipo      │ Descripción                             │
├─────────────────────┼───────────┼─────────────────────────────────────────  │
│ id_ingreso          │ NUMBER    │ Identificador único                     │
│ tipo                │ STRING    │ evento | postulacion | usuario          │
│ monto               │ NUMBER    │ Cantidad en MXN                         │
│ fecha               │ DATE      │ Fecha del ingreso                       │
└─────────────────────┴───────────┴─────────────────────────────────────────  │
                                                                             │
│ TABLA: gastos                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Campo               │ Tipo      │ Descripción                             │
├─────────────────────┼───────────┼─────────────────────────────────────────  │
│ id_gasto            │ NUMBER    │ Identificador único                     │
│ concepto            │ STRING    │ Descripción del gasto                   │
│ categoria           │ STRING    │ operativo | marketing | desarrollo      │
│ monto               │ NUMBER    │ Cantidad en MXN                         │
│ fecha               │ DATE      │ Fecha del gasto                         │
└─────────────────────┴───────────┴─────────────────────────────────────────  │
                                                                             │
│ TABLA: financials                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ Campo               │ Tipo      │ Descripción                             │
├─────────────────────┼───────────┼─────────────────────────────────────────  │
│ id                  │ NUMBER    │ Identificador único                     │
│ concepto            │ STRING    │ efectivo_disponible | burn_rate          │
│ tipo                │ STRING    │ efectivo | gasto | ingreso               │
│ monto               │ NUMBER    │ Cantidad en MXN                         │
│ fecha_actualizacion │ DATE      │ Última actualización                    │
└─────────────────────┴───────────┴─────────────────────────────────────────  │
                                                                             │
│ TABLA: accesos_usuario                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Campo               │ Tipo      │ Descripción                             │
├─────────────────────┼───────────┼─────────────────────────────────────────  │
│ id_usuario          │ NUMBER    │ FK a usuarios                           │
│ mes                 │ DATE      │ YYYY-MM-01                              │
│ total_accesos       │ NUMBER    │ Cantidad de accesos                     │
└─────────────────────┴───────────┴─────────────────────────────────────────  │
                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

10.2 CONSTANTES FINANCIERAS

┌─────────────────────────────────────────────────────────────────────────────┐
│ Constante                    │ Valor         │ Descripción                 │
├──────────────────────────────┼───────────────┼─────────────────────────────│
│ VALOR_PROMEDIO_EVENTO        │ $15,000 MXN   │ Ingreso estimado por evento │
│ VALOR_PROMEDIO_POSTULACION   │ $5,000 MXN    │ Ingreso estimado por post.   │
│ VALOR_PROMEDIO_ACCESO        │ $100 MXN      │ Valor estimado por acceso   │
│ EFFECTIVO_DEFAULT            │ $150,000 MXN  │ Efectivo inicial假设         │
│ BURN_RATE_DEFAULT            │ $40,000 MXN   │ Burn rate mensual假设       │
└──────────────────────────────┴───────────────┴─────────────────────────────  │

10.3 FUNCIONES AUXILIARES

- safeNum(val): Conversión segura a número
- safeDivide(a, b): División segura (evita /0)
- fmt(n, decimals): Formateo de números para display
- parseDate(dateStr): Parseo seguro de fechas
- getMonth(dateStr): Extrae YYYY-MM de fecha
- daysBetween(d1, d2): Calcula días entre fechas
- groupBy(array, keyFn): Agrupa array por función

================================================================================
                              FIN DEL MANUAL OPERATIVO
================================================================================

Documento elaborado para el proyecto Fight.net - Materia ADN
Universidad: Aguascalientes, México
Fecha de elaboración: Marzo 2026
Versión: 1.0

Para mayor información, consultar:
- Archivo dashboard.html (interfaz principal)
- Archivo scripts/kpiEngine.js (motor de cálculos)
- Archivo data_schema.json (esquema de datos)

================================================================================
