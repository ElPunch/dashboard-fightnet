/**
 * kpiEngine.js - Fight.net Dashboard
 * Safe KPI computation. No eval(). Handles division by zero and NaN.
 * 
 * 6 Key Results (KRs) con 18 KPIs totales:
 * KR1: Crecimiento de Usuarios (3 KPIs)
 * KR2: Eventos Verificados (3 KPIs)
 * KR3: Emparejamientos Confirmados (3 KPIs)
 * KR4: Participación de Peleadores (3 KPIs)
 * KR5: Usuarios Recurrentes (3 KPIs)
 * KR6: Rentabilidad y Finanzas (3 KPIs)
 */

const KPIEngine = (() => {

  // Safe number parsing
  function safeNum(val) {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  }

  // Safe division
  function safeDivide(a, b) {
    if (b === 0 || isNaN(b)) return 0;
    return a / b;
  }

  // Format a number nicely
  function fmt(n, decimals = 2) {
    if (isNaN(n) || n === null || n === undefined) return '—';
    return Number(n.toFixed(decimals)).toLocaleString('es-MX');
  }

  // Helper: Parse date string to Date object
  function parseDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d) ? null : d;
  }

  // Helper: Get month string from date (YYYY-MM)
  function getMonth(dateStr) {
    if (!dateStr || dateStr.length < 7) return 'Sin fecha';
    return dateStr.substring(0, 7);
  }

  // Helper: Calculate days between two dates
  function daysBetween(date1, date2) {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    if (!d1 || !d2) return 0;
    const diff = Math.abs(d2 - d1);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // Helper: Check if date is within last N days
  function isWithinLastDays(dateStr, days) {
    const d = parseDate(dateStr);
    if (!d) return false;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return d >= cutoff;
  }

  // Helper: Group array by key function
  function groupBy(array, keyFn) {
    return array.reduce((acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  // ─── KPI CALCULATORS ────────────────────────────────────────────────────────

  // ═══════════════════════════════════════════════════════════════════════════
  // KR1 - CRECIMIENTO DE USUARIOS
  // Meta: 200 usuarios
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * KR1 - KPI1: Usuarios Activos Registrados
   * Usuarios con perfil completo y actividad en los últimos 30 días
   */
  function calcUsuariosActivosRegistrados(data) {
    const usuarios = data.usuarios || [];
    if (usuarios.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const byMonth = {};
    usuarios.forEach(row => {
      const activo = row.perfil_completo === 'true' || row.perfil_completo === true || row.perfil_completo === '1' || row.perfil_completo === 1;
      const fechaActividad = row.ultima_actividad || row.fecha_registro;
      if (activo && fechaActividad) {
        const month = getMonth(fechaActividad);
        byMonth[month] = (byMonth[month] || 0) + 1;
      }
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => byMonth[m]);
    const total = values.reduce((a, b) => a + b, 0);
    const lastValue = values[values.length - 1] || 0;

    return { labels, values, summary: `Usuarios activos: ${lastValue} (total acumulado: ${total})`, total: lastValue };
  }

  /**
   * KR1 - KPI2: Tasa de Crecimiento Mensual
   * ((Usuarios activos mes actual - Usuarios activos mes anterior) / Usuarios activos mes anterior) × 100
   */
  function calcTasaCrecimientoMensual(data) {
    const usuarios = data.usuarios || [];
    if (usuarios.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    // Contar usuarios por mes de registro (no por última actividad)
    const byMonth = {};
    usuarios.forEach(row => {
      const activo = row.perfil_completo === 'true' || row.perfil_completo === true || row.perfil_completo === '1' || row.perfil_completo === 1;
      // Usar fecha_registro para ver cuándo se unieron los usuarios
      const fechaRegistro = row.fecha_registro;
      if (activo && fechaRegistro) {
        const month = getMonth(fechaRegistro);
        byMonth[month] = (byMonth[month] || 0) + 1;
      }
    });

    const sorted = Object.keys(byMonth).sort();
    if (sorted.length < 2) {
      return { labels: [], values: [], summary: 'Se necesitan 2+ meses de datos', total: 0, empty: true };
    }
    
    const labels = sorted.slice(1);
    const values = [];
    
    for (let i = 1; i < sorted.length; i++) {
      const current = byMonth[sorted[i]];
      const previous = byMonth[sorted[i - 1]];
      const growth = safeDivide(current - previous, previous) * 100;
      values.push(parseFloat(growth.toFixed(1)));
    }

    const lastValue = values[values.length - 1] || 0;
    return { labels, values, summary: `Crecimiento mensual: ${fmt(lastValue, 1)}%`, total: lastValue };
  }

  /**
   * KR1 - KPI3: Tasa de Conversión de Registros
   * (Usuarios activos / Usuarios registrados totales) × 100
   */
  function calcTasaConversionRegistros(data) {
    const usuarios = data.usuarios || [];
    if (usuarios.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const byMonth = {};
    usuarios.forEach(row => {
      const month = row.fecha_registro ? getMonth(row.fecha_registro) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { activos: 0, total: 0 };
      byMonth[month].total += 1;
      const activo = row.perfil_completo === 'true' || row.perfil_completo === true || row.perfil_completo === '1' || row.perfil_completo === 1;
      if (activo) byMonth[month].activos += 1;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const { activos, total } = byMonth[m];
      return parseFloat((safeDivide(activos, total) * 100).toFixed(1));
    });

    const lastValue = values[values.length - 1] || 0;
    return { labels, values, summary: `Tasa de conversión: ${fmt(lastValue, 1)}%`, total: lastValue };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // KR2 - EVENTOS VERIFICADOS
  // Meta: 30 eventos
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * KR2 - KPI1: Eventos Verificados
   * Conteo de eventos con estatus "Verificado"
   */
  function calcEventosVerificados(data) {
    const eventos = data.eventos || [];
    if (eventos.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const filtered = eventos.filter(r => r.estatus === 'Verificado');
    const byMonth = {};
    filtered.forEach(row => {
      const date = row.fecha_verificacion || row.fecha_publicacion;
      const month = date ? getMonth(date) : 'Sin fecha';
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => byMonth[m]);
    const total = filtered.length;

    return { labels, values, summary: `Eventos verificados: ${total}`, total };
  }

  /**
   * KR2 - KPI2: Tiempo Promedio de Verificación
   * Σ(Tiempo desde publicación hasta verificación) / Total de eventos verificados
   */
  function calcTiempoPromedioVerificacion(data) {
    const eventos = data.eventos || [];
    if (eventos.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const filtered = eventos.filter(r => r.estatus === 'Verificado' && r.fecha_publicacion && r.fecha_verificacion);
    const byMonth = {};
    
    filtered.forEach(row => {
      const month = getMonth(row.fecha_verificacion);
      if (!byMonth[month]) byMonth[month] = { totalDays: 0, count: 0 };
      const days = daysBetween(row.fecha_publicacion, row.fecha_verificacion);
      byMonth[month].totalDays += days;
      byMonth[month].count += 1;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const { totalDays, count } = byMonth[m];
      return count > 0 ? parseFloat((safeDivide(totalDays, count)).toFixed(1)) : 0;
    });

    const totalDays = filtered.reduce((sum, row) => sum + daysBetween(row.fecha_publicacion, row.fecha_verificacion), 0);
    const avgDays = filtered.length > 0 ? parseFloat((safeDivide(totalDays, filtered.length)).toFixed(1)) : 0;

    return { labels, values, summary: `Tiempo promedio: ${avgDays} días`, total: avgDays };
  }

  /**
   * KR2 - KPI3: Porcentaje de Eventos Aprobados
   * (Eventos verificados / Eventos enviados para revisión) × 100
   */
  function calcPorcentajeEventosAprobados(data) {
    const eventos = data.eventos || [];
    if (eventos.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const byMonth = {};
    eventos.forEach(row => {
      const date = row.fecha_publicacion || row.fecha_envio;
      const month = date ? getMonth(date) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { verificados: 0, enviados: 0 };
      byMonth[month].enviados += 1;
      if (row.estatus === 'Verificado') byMonth[month].verificados += 1;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const { verificados, enviados } = byMonth[m];
      return parseFloat((safeDivide(verificados, enviados) * 100).toFixed(1));
    });

    const totalVerificados = eventos.filter(r => r.estatus === 'Verificado').length;
    const totalEnviados = eventos.length;
    const pct = parseFloat((safeDivide(totalVerificados, totalEnviados) * 100).toFixed(1));

    return { labels, values, summary: `Tasa de aprobación: ${pct}%`, total: pct };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // KR3 - EMPAREJAMIENTOS CONFIRMADOS
  // Meta: 40 matches
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * KR3 - KPI1: Emparejamientos Confirmados
   * Conteo de matches con estatus "Confirmado por ambas partes"
   */
  function calcEmparejamientosConfirmados(data) {
    const matches = data.matches || [];
    if (matches.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const filtered = matches.filter(r => r.estatus === 'Confirmado por ambas partes');
    const byMonth = {};
    filtered.forEach(row => {
      const date = row.fecha_confirmacion;
      const month = date ? getMonth(date) : 'Sin fecha';
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => byMonth[m]);
    const total = filtered.length;

    return { labels, values, summary: `Emparejamientos confirmados: ${total}`, total };
  }

  /**
   * KR3 - KPI2: Tasa de Cierre de Emparejamientos
   * (Emparejamientos confirmados / Emparejamientos iniciados) × 100
   */
  function calcTasaCierreEmparejamientos(data) {
    const matches = data.matches || [];
    if (matches.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const byMonth = {};
    matches.forEach(row => {
      const date = row.fecha_solicitud || row.fecha_confirmacion;
      const month = date ? getMonth(date) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { confirmados: 0, iniciados: 0 };
      byMonth[month].iniciados += 1;
      if (row.estatus === 'Confirmado por ambas partes') byMonth[month].confirmados += 1;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const { confirmados, iniciados } = byMonth[m];
      return parseFloat((safeDivide(confirmados, iniciados) * 100).toFixed(1));
    });

    const totalConfirmados = matches.filter(r => r.estatus === 'Confirmado por ambas partes').length;
    const totalIniciados = matches.length;
    const pct = parseFloat((safeDivide(totalConfirmados, totalIniciados) * 100).toFixed(1));

    return { labels, values, summary: `Tasa de cierre: ${pct}%`, total: pct };
  }

  /**
   * KR3 - KPI3: Tiempo Promedio de Cierre de Match
   * Σ(Días desde solicitud hasta confirmación) / Total de matches confirmados
   */
  function calcTiempoPromedioCierreMatch(data) {
    const matches = data.matches || [];
    if (matches.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const filtered = matches.filter(r => r.estatus === 'Confirmado por ambas partes' && r.fecha_solicitud && r.fecha_confirmacion);
    const byMonth = {};
    
    filtered.forEach(row => {
      const month = getMonth(row.fecha_confirmacion);
      if (!byMonth[month]) byMonth[month] = { totalDays: 0, count: 0 };
      const days = daysBetween(row.fecha_solicitud, row.fecha_confirmacion);
      byMonth[month].totalDays += days;
      byMonth[month].count += 1;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const { totalDays, count } = byMonth[m];
      return count > 0 ? parseFloat((safeDivide(totalDays, count)).toFixed(1)) : 0;
    });

    const totalDays = filtered.reduce((sum, row) => sum + daysBetween(row.fecha_solicitud, row.fecha_confirmacion), 0);
    const avgDays = filtered.length > 0 ? parseFloat((safeDivide(totalDays, filtered.length)).toFixed(1)) : 0;

    return { labels, values, summary: `Tiempo promedio: ${avgDays} días`, total: avgDays };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // KR4 - PARTICIPACIÓN DE PELEADORES
  // Meta: 60% de participación
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * KR4 - KPI1: Porcentaje de Peleadores con Participación
   * (Peleadores que aplicaron o confirmaron participación / Total de peleadores activos) × 100
   */
  function calcPorcentajePeleadoresParticipacion(data) {
    const usuarios = data.usuarios || [];
    const postulaciones = data.postulaciones || [];
    if (usuarios.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const peleadoresActivos = usuarios.filter(u => u.rol === 'peleador' || u.rol === 'Peleador');
    const peleadoresConPost = new Set(postulaciones.map(p => p.id_peleador));
    const conPart = peleadoresActivos.filter(p => peleadoresConPost.has(p.id_usuario || p.id)).length;
    const totalPeleadores = peleadoresActivos.length;
    const pct = parseFloat((safeDivide(conPart, totalPeleadores) * 100).toFixed(1));

    return {
      labels: ['Con participación', 'Sin participación'],
      values: [conPart, totalPeleadores - conPart],
      summary: `${pct}% de peleadores participaron (${conPart}/${totalPeleadores})`,
      total: pct
    };
  }

  /**
   * KR4 - KPI2: Postulaciones Promedio por Peleador
   * Total de postulaciones / Total de peleadores
   */
  function calcPostulacionesPromedioPeleador(data) {
    const usuarios = data.usuarios || [];
    const postulaciones = data.postulaciones || [];
    if (usuarios.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const peleadores = usuarios.filter(u => u.rol === 'peleador' || u.rol === 'Peleador');
    const totalPeleadores = peleadores.length;
    const totalPostulaciones = postulaciones.length;
    const avg = parseFloat((safeDivide(totalPostulaciones, totalPeleadores)).toFixed(2));

    const byMonth = {};
    postulaciones.forEach(row => {
      const month = row.fecha_postulacion ? getMonth(row.fecha_postulacion) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { count: 0, peleadores: new Set() };
      byMonth[month].count += 1;
      byMonth[month].peleadores.add(row.id_peleador);
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const peleadoresEnMes = usuarios.filter(u => (u.rol === 'peleador' || u.rol === 'Peleador')).length;
      return parseFloat((safeDivide(byMonth[m].count, peleadoresEnMes)).toFixed(2));
    });

    return { labels, values, summary: `Promedio: ${avg} postulaciones/peleador`, total: avg };
  }

  /**
   * KR4 - KPI3: Tasa de Conversión de Postulación
   * (Postulaciones que terminaron en participación real / Total de postulaciones) × 100
   */
  function calcTasaConversionPostulacion(data) {
    const postulaciones = data.postulaciones || [];
    if (postulaciones.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const byMonth = {};
    postulaciones.forEach(row => {
      const month = row.fecha_postulacion ? getMonth(row.fecha_postulacion) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { confirmadas: 0, total: 0 };
      byMonth[month].total += 1;
      if (row.estatus === 'Confirmada' || row.estatus === 'Aceptada' || row.estatus === 'Confirmado') {
        byMonth[month].confirmadas += 1;
      }
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const { confirmadas, total } = byMonth[m];
      return parseFloat((safeDivide(confirmadas, total) * 100).toFixed(1));
    });

    const totalConfirmadas = postulaciones.filter(r => r.estatus === 'Confirmada' || r.estatus === 'Aceptada' || r.estatus === 'Confirmado').length;
    const total = postulaciones.length;
    const pct = parseFloat((safeDivide(totalConfirmadas, total) * 100).toFixed(1));

    return { labels, values, summary: `Tasa de conversión: ${pct}%`, total: pct };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // KR5 - USUARIOS RECURRENTES (Meta: 50%)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * KR5 - KPI1: Tasa de Usuarios Recurrentes
   * (Usuarios con al menos 2 accesos en el mes / Usuarios activos totales del mes) × 100
   */
  function calcTasaUsuariosRecurrentes(data) {
    const accesos = data.accesos_usuario || [];
    if (accesos.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const byMonth = {};
    accesos.forEach(row => {
      const month = row.mes ? getMonth(row.mes) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { recurrentes: 0, total: 0 };
      byMonth[month].total += 1;
      if (safeNum(row.total_accesos) >= 2) byMonth[month].recurrentes += 1;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const { recurrentes, total } = byMonth[m];
      return parseFloat((safeDivide(recurrentes, total) * 100).toFixed(1));
    });
    const lastVal = values[values.length - 1] || 0;

    return { labels, values, summary: `Tasa de usuarios recurrentes: ${fmt(lastVal, 1)}%`, total: lastVal };
  }

  /**
   * KR5 - KPI2: Frecuencia Promedio de Uso Mensual
   * Total de accesos del mes / Total de usuarios activos
   */
  function calcFrecuenciaPromedioUso(data) {
    const accesos = data.accesos_usuario || [];
    if (accesos.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const byMonth = {};
    accesos.forEach(row => {
      const month = row.mes ? getMonth(row.mes) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { totalAccesos: 0, totalUsuarios: 0 };
      byMonth[month].totalAccesos += safeNum(row.total_accesos);
      byMonth[month].totalUsuarios += 1;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const { totalAccesos, totalUsuarios } = byMonth[m];
      return parseFloat((safeDivide(totalAccesos, totalUsuarios)).toFixed(2));
    });

    const totalAccesos = accesos.reduce((sum, row) => sum + safeNum(row.total_accesos), 0);
    const totalUsuarios = accesos.length;
    const avg = parseFloat((safeDivide(totalAccesos, totalUsuarios)).toFixed(2));

    return { labels, values, summary: `Frecuencia promedio: ${avg} accesos/usuario`, total: avg };
  }

  /**
   * KR5 - KPI3: Tasa de Retención Mensual
   * (Usuarios activos en mes actual que también estuvieron activos el mes anterior / Usuarios activos del mes anterior) × 100
   */
  function calcTasaRetencionMensual(data) {
    const accesos = data.accesos_usuario || [];
    if (accesos.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    // Group by month and collect user IDs
    const usersByMonth = {};
    accesos.forEach(row => {
      const month = row.mes ? getMonth(row.mes) : null;
      if (!month) return;
      if (!usersByMonth[month]) usersByMonth[month] = new Set();
      usersByMonth[month].add(row.id_usuario || row.id);
    });

    const sorted = Object.keys(usersByMonth).sort();
    const labels = sorted.slice(1);
    const values = [];

    for (let i = 1; i < sorted.length; i++) {
      const currentMonth = sorted[i];
      const previousMonth = sorted[i - 1];
      const currentUsers = usersByMonth[currentMonth];
      const previousUsers = usersByMonth[previousMonth];
      
      let retained = 0;
      currentUsers.forEach(user => {
        if (previousUsers.has(user)) retained++;
      });
      
      const rate = parseFloat((safeDivide(retained, previousUsers.size) * 100).toFixed(1));
      values.push(rate);
    }

    const lastValue = values[values.length - 1] || 0;
    return { labels, values, summary: `Tasa de retención: ${fmt(lastValue, 1)}%`, total: lastValue };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // KR6 - RENTABILIDAD Y FINANZAS
  // Meta: $150,000 MXN en ingresos estimados
  // ═══════════════════════════════════════════════════════════════════════════

  // Constantes para cálculos financieros
  const VALOR_PROMEDIO_EVENTO = 15000;
  const VALOR_PROMEDIO_POSTULACION = 5000;
  const VALOR_PROMEDIO_ACCESO = 100;

  /**
   * KR6 - KPI1: Ingresos Estimados por Eventos Verificados
   * Eventos verificados × valor promedio por evento
   */
  function calcIngresosEventosVerificados(data) {
    const eventos = data.eventos || [];
    const ingresos = data.ingresos || [];
    
    if (ingresos.length > 0) {
      const byMonth = {};
      ingresos.forEach(row => {
        if (row.tipo === 'evento') {
          const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
          byMonth[month] = (byMonth[month] || 0) + safeNum(row.monto);
        }
      });

      const sorted = Object.keys(byMonth).sort();
      const labels = sorted;
      const values = sorted.map(m => byMonth[m]);
      const total = values.reduce((a, b) => a + b, 0);

      return { 
        labels, 
        values, 
        summary: `Ingresos por eventos: $${fmt(total, 0)} MXN`, 
        total,
        unit: '$MXN'
      };
    }

    const filtered = eventos.filter(r => r.estatus === 'Verificado');
    const byMonth = {};
    filtered.forEach(row => {
      const date = row.fecha_verificacion || row.fecha_publicacion;
      const month = date ? getMonth(date) : 'Sin fecha';
      byMonth[month] = (byMonth[month] || 0) + VALOR_PROMEDIO_EVENTO;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => byMonth[m]);
    const total = filtered.length * VALOR_PROMEDIO_EVENTO;

    return { 
      labels, 
      values, 
      summary: `Ingresos estimados: $${fmt(total, 0)} MXN (${filtered.length} eventos × $${VALOR_PROMEDIO_EVENTO.toLocaleString('es-MX')})`, 
      total,
      unit: '$MXN'
    };
  }

  /**
   * KR6 - KPI2: Ingresos por Participación de Peleadores
   * Postulaciones confirmadas × valor promedio por participación
   */
  function calcIngresosParticipacionPeleadores(data) {
    const postulaciones = data.postulaciones || [];
    const ingresos = data.ingresos || [];
    
    if (ingresos.length > 0) {
      const byMonth = {};
      ingresos.forEach(row => {
        if (row.tipo === 'postulacion') {
          const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
          byMonth[month] = (byMonth[month] || 0) + safeNum(row.monto);
        }
      });

      const sorted = Object.keys(byMonth).sort();
      const labels = sorted;
      const values = sorted.map(m => byMonth[m]);
      const total = values.reduce((a, b) => a + b, 0);

      return { 
        labels, 
        values, 
        summary: `Ingresos por peleador: $${fmt(total, 0)} MXN`, 
        total,
        unit: '$MXN'
      };
    }

    const confirmed = postulaciones.filter(r => 
      r.estatus === 'Confirmada' || r.estatus === 'Aceptada' || r.estatus === 'confirmada' || r.estatus === 'aceptada'
    );
    const byMonth = {};
    confirmed.forEach(row => {
      const month = row.fecha_postulacion ? getMonth(row.fecha_postulacion) : 'Sin fecha';
      byMonth[month] = (byMonth[month] || 0) + VALOR_PROMEDIO_POSTULACION;
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => byMonth[m]);
    const total = confirmed.length * VALOR_PROMEDIO_POSTULACION;

    return { 
      labels, 
      values, 
      summary: `Ingresos estimados: $${fmt(total, 0)} MXN (${confirmed.length} confirmadas × $${VALOR_PROMEDIO_POSTULACION.toLocaleString('es-MX')})`, 
      total,
      unit: '$MXN'
    };
  }

  /**
   * KR6 - KPI3: Valor de Usuario Recurrente (LTV Estimado)
   * Basado en accesos de usuarios recurrentes × valor promedio por acceso
   */
  function calcValorUsuarioRecurrente(data) {
    const accesos = data.accesos_usuario || [];
    const ingresos = data.ingresos || [];
    
    if (ingresos.length > 0) {
      const byMonth = {};
      ingresos.forEach(row => {
        if (row.tipo === 'usuario') {
          const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
          byMonth[month] = (byMonth[month] || 0) + safeNum(row.monto);
        }
      });

      const sorted = Object.keys(byMonth).sort();
      const labels = sorted;
      const values = sorted.map(m => byMonth[m]);
      const total = values.reduce((a, b) => a + b, 0);

      return { 
        labels, 
        values, 
        summary: `Valor usuarios recurrentes: $${fmt(total, 0)} MXN`, 
        total,
        unit: '$MXN'
      };
    }

    if (accesos.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const recurrentes = accesos.filter(r => safeNum(r.total_accesos) >= 2);
    const byMonth = {};
    recurrentes.forEach(row => {
      const month = row.mes ? getMonth(row.mes) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { ingresos: 0, usuarios: new Set() };
      byMonth[month].ingresos += safeNum(row.total_accesos) * VALOR_PROMEDIO_ACCESO;
      byMonth[month].usuarios.add(row.id_usuario || row.id);
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => byMonth[m].ingresos);
    const total = recurrentes.reduce((sum, r) => sum + safeNum(r.total_accesos) * VALOR_PROMEDIO_ACCESO, 0);

    return { 
      labels, 
      values, 
      summary: `LTV estimado: $${fmt(total, 0)} MXN (${recurrentes.length} usuarios recurrentes)`, 
      total,
      unit: '$MXN'
    };
  }

  /**
   * KR6 - KPI4: Runway (Meses de vida financiera)
   * Runway = Efectivo disponible / Burn Rate mensual
   * Semáforo: Verde ≥6 meses, Amarillo 3-6 meses, Rojo <3 meses
   */
  function calcRunway(data) {
    const financials = data.financials || [];
    const ingresos = data.ingresos || [];
    const gastos = data.gastos || [];
    
    let efectivo = 150000;
    let burnRate = 40000;
    
    if (financials.length > 0) {
      const ef = financials.find(f => f.concepto === 'efectivo_disponible' || f.tipo === 'efectivo');
      const br = financials.find(f => f.concepto === 'burn_rate' || f.tipo === 'gasto_mensual');
      if (ef) efectivo = safeNum(ef.monto);
      if (br) burnRate = safeNum(br.monto);
    }
    
    if (gastos.length > 0) {
      const byMonth = {};
      gastos.forEach(row => {
        const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
        byMonth[month] = (byMonth[month] || 0) + safeNum(row.monto);
      });
      const sorted = Object.keys(byMonth).sort().slice(-3);
      if (sorted.length > 0) {
        burnRate = sorted.reduce((sum, m) => sum + byMonth[m], 0) / sorted.length;
      }
    }
    
    const runway = safeDivide(efectivo, burnRate);
    const status = runway >= 6 ? 'success' : (runway >= 3 ? 'warning' : 'danger');
    
    return {
      labels: ['Efectivo', 'Burn Rate', 'Runway'],
      values: [efectivo, burnRate, runway],
      summary: `Runway: ${fmt(runway, 1)} meses (Efectivo: $${fmt(efectivo, 0)} / Burn: $${fmt(burnRate, 0)})`,
      total: runway,
      unit: 'meses',
      status: status,
      alert: status === 'danger' ? 'RUNWAY CRÍTICO: Menos de 3 meses de operación' : 
             status === 'warning' ? 'ALERTA: Runway en rango de riesgo' : null
    };
  }

  /**
   * KR6 - KPI5: Margen de Utilidad Neta
   * Margen = (Utilidad Neta / Ventas) × 100
   * Semáforo: Verde ≥20%, Amarillo 10-20%, Rojo <10%
   */
  function calcMargenUtilidadNeta(data) {
    const ingresos = data.ingresos || [];
    const gastos = data.gastos || [];
    const financials = data.financials || [];
    
    let ingresosMensuales = 120000;
    let gastosTotales = 90000;
    
    if (financials.length > 0) {
      const ing = financials.find(f => f.concepto === 'ingresos_mensuales' || f.tipo === 'ingreso');
      const gas = financials.find(f => f.concepto === 'gastos_mensuales' || f.tipo === 'gasto');
      if (ing) ingresosMensuales = safeNum(ing.monto);
      if (gas) gastosTotales = safeNum(gas.monto);
    }
    
    if (ingresos.length > 0) {
      const byMonthIngresos = {};
      ingresos.forEach(row => {
        const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
        byMonthIngresos[month] = (byMonthIngresos[month] || 0) + safeNum(row.monto);
      });
      const sorted = Object.keys(byMonthIngresos).sort().slice(-1);
      if (sorted.length > 0) {
        ingresosMensuales = byMonthIngresos[sorted[sorted.length - 1]];
      }
    }
    
    if (gastos.length > 0) {
      const byMonthGastos = {};
      gastos.forEach(row => {
        const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
        byMonthGastos[month] = (byMonthGastos[month] || 0) + safeNum(row.monto);
      });
      const sorted = Object.keys(byMonthGastos).sort().slice(-1);
      if (sorted.length > 0) {
        gastosTotales = byMonthGastos[sorted[sorted.length - 1]];
      }
    }
    
    const utilidadNeta = ingresosMensuales - gastosTotales;
    const margen = safeDivide(utilidadNeta, ingresosMensuales) * 100;
    const status = margen >= 20 ? 'success' : (margen >= 10 ? 'warning' : 'danger');
    
    return {
      labels: ['Ingresos', 'Gastos', 'Utilidad Neta'],
      values: [ingresosMensuales, gastosTotales, utilidadNeta],
      summary: `Margen: ${fmt(margen, 1)}% (Ingresos: $${fmt(ingresosMensuales, 0)} - Gastos: $${fmt(gastosTotales, 0)})`,
      total: margen,
      unit: '%',
      status: status,
      alert: status === 'danger' ? 'MARGEN CRÍTICO: Rentabilidad insuficiente' : 
             status === 'warning' ? 'ALERTA: Margen en rango moderado' : null
    };
  }

  /**
   * KR6 - KPI6: Ingresos Totales Acumulados
   * Suma de todos los ingresos registrados
   */
  function calcIngresosTotales(data) {
    const ingresos = data.ingresos || [];
    
    if (ingresos.length === 0) {
      return { labels: [], values: [], summary: 'Sin datos', total: 0 };
    }
    
    const byMonth = {};
    ingresos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      byMonth[month] = (byMonth[month] || 0) + safeNum(row.monto);
    });
    
    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => byMonth[m]);
    const total = values.reduce((a, b) => a + b, 0);
    
    return {
      labels,
      values,
      summary: `Ingresos totales: $${fmt(total, 0)} MXN`,
      total,
      unit: '$MXN'
    };
  }

  /**
   * KR6 - KPI ADICIONAL: Burn Rate Mensual
   * Gastos promedio mensual desglosado por mes
   */
  function calcBurnRateMensual(data) {
    const gastos = data.gastos || [];
    if (gastos.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const byMonth = {};
    gastos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      byMonth[month] = (byMonth[month] || 0) + safeNum(row.monto);
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => byMonth[m]);
    const avgBurnRate = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

    return {
      labels,
      values,
      summary: `Burn rate promedio: $${fmt(avgBurnRate, 0)} MXN/mes`,
      total: avgBurnRate,
      unit: '$MXN'
    };
  }

  /**
   * KR6 - KPI ADICIONAL: Flujo de Caja Neto Mensual
   * Diferencia entre ingresos y gastos por mes
   */
  function calcFlujoCajaNeto(data) {
    const ingresos = data.ingresos || [];
    const gastos = data.gastos || [];

    if (ingresos.length === 0 && gastos.length === 0) {
      return { labels: [], values: [], summary: 'Sin datos', total: 0 };
    }

    const byMonth = {};

    ingresos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { ingresos: 0, gastos: 0 };
      byMonth[month].ingresos += safeNum(row.monto);
    });

    gastos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { ingresos: 0, gastos: 0 };
      byMonth[month].gastos += safeNum(row.monto);
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => byMonth[m].ingresos - byMonth[m].gastos);

    const totalNeto = values.reduce((a, b) => a + b, 0);
    const avgNeto = values.length > 0 ? totalNeto / values.length : 0;
    const status = avgNeto >= 0 ? 'success' : 'danger';

    return {
      labels,
      values,
      summary: `Flujo neto promedio: $${fmt(avgNeto, 0)} MXN/mes`,
      total: totalNeto,
      unit: '$MXN',
      status: status
    };
  }

  /**
   * KR6 - KPI ADICIONAL: Margen de Utilidad por Mes
   * Margen de utilidad desglosado mes a mes
   */
  function calcMargenUtilidadMensual(data) {
    const ingresos = data.ingresos || [];
    const gastos = data.gastos || [];

    if (ingresos.length === 0 && gastos.length === 0) {
      return { labels: [], values: [], summary: 'Sin datos', total: 0 };
    }

    const byMonth = {};

    ingresos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { ingresos: 0, gastos: 0 };
      byMonth[month].ingresos += safeNum(row.monto);
    });

    gastos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { ingresos: 0, gastos: 0 };
      byMonth[month].gastos += safeNum(row.monto);
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const { ingresos, gastos } = byMonth[m];
      return parseFloat((safeDivide(ingresos - gastos, ingresos) * 100).toFixed(1));
    });

    const lastValue = values[values.length - 1] || 0;
    const status = lastValue >= 20 ? 'success' : (lastValue >= 10 ? 'warning' : 'danger');

    return {
      labels,
      values,
      summary: `Margen actual: ${fmt(lastValue, 1)}% (meta: ≥20%)`,
      total: lastValue,
      unit: '%',
      status: status,
      alert: status === 'danger' ? 'MARGEN CRÍTICO: Rentabilidad insuficiente' :
             status === 'warning' ? 'ALERTA: Margen en rango moderado' : null
    };
  }

  /**
   * KR6 - KPI ADICIONAL: Runway Proyectado
   * Proyección del runway basándose en tendencias de flujo de caja
   */
  function calcRunwayProyectado(data) {
    const ingresos = data.ingresos || [];
    const gastos = data.gastos || [];
    const financials = data.financials || [];

    let efectivo = 150000;
    if (financials.length > 0) {
      const ef = financials.find(f => f.concepto === 'efectivo_disponible' || f.tipo === 'efectivo');
      if (ef) efectivo = safeNum(ef.monto);
    }

    let flujoPromedio = 0;
    const byMonth = {};

    ingresos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { ingresos: 0, gastos: 0 };
      byMonth[month].ingresos += safeNum(row.monto);
    });

    gastos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { ingresos: 0, gastos: 0 };
      byMonth[month].gastos += safeNum(row.monto);
    });

    const months = Object.keys(byMonth).sort();
    if (months.length > 0) {
      const flujos = months.map(m => byMonth[m].ingresos - byMonth[m].gastos);
      flujoPromedio = flujos.reduce((a, b) => a + b, 0) / flujos.length;
    }

    const burnRate = flujoPromedio < 0 ? Math.abs(flujoPromedio) : 40000;
    const runway = safeDivide(efectivo, burnRate);

    const labels = ['Efectivo', 'Burn Rate Proy.', 'Runway Proy.'];
    const values = [efectivo, burnRate, runway];
    const status = runway >= 6 ? 'success' : (runway >= 3 ? 'warning' : 'danger');

    return {
      labels,
      values,
      summary: `Runway proyectado: ${fmt(runway, 1)} meses (basado en ${months.length} meses de datos)`,
      total: runway,
      unit: 'meses',
      status: status,
      alert: status === 'danger' ? 'RUNWAY CRÍTICO: Menos de 3 meses' :
             status === 'warning' ? 'ALERTA: Runway en riesgo' : null
    };
  }

  /**
   * KR6 - KPI ADICIONAL: Ratio Gastos/Ingresos
   * Relación entre gastos e ingresos para analizar eficiencia
   */
  function calcRatioGastosIngresos(data) {
    const ingresos = data.ingresos || [];
    const gastos = data.gastos || [];

    if (ingresos.length === 0 && gastos.length === 0) {
      return { labels: [], values: [], summary: 'Sin datos', total: 0 };
    }

    const byMonth = {};

    ingresos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { ingresos: 0, gastos: 0 };
      byMonth[month].ingresos += safeNum(row.monto);
    });

    gastos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      if (!byMonth[month]) byMonth[month] = { ingresos: 0, gastos: 0 };
      byMonth[month].gastos += safeNum(row.monto);
    });

    const sorted = Object.keys(byMonth).sort();
    const labels = sorted;
    const values = sorted.map(m => {
      const { ingresos, gastos } = byMonth[m];
      return parseFloat(safeDivide(gastos, ingresos).toFixed(2));
    });

    const lastValue = values[values.length - 1] || 0;
    const status = lastValue <= 0.8 ? 'success' : (lastValue <= 1 ? 'warning' : 'danger');

    return {
      labels,
      values,
      summary: `Ratio actual: ${fmt(lastValue * 100, 1)}% (ideal: ≤80%)`,
      total: lastValue,
      unit: '',
      status: status,
      alert: status === 'danger' ? 'RATIO ALTO: Gastos superan ingresos' :
             status === 'warning' ? 'ALERTA: Ratio moderado' : null
    };
  }

  /**
   * KR6 - KPI ADICIONAL: Gastos por Categoría
   * Desglose de gastos por categoría para análisis detallado
   */
  function calcGastosPorCategoria(data) {
    const gastos = data.gastos || [];
    if (gastos.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const byCategoria = {};
    let totalGastos = 0;

    gastos.forEach(row => {
      const categoria = row.categoria || 'Sin categoría';
      byCategoria[categoria] = (byCategoria[categoria] || 0) + safeNum(row.monto);
      totalGastos += safeNum(row.monto);
    });

    const labels = Object.keys(byCategoria).sort();
    const values = labels.map(c => byCategoria[c]);

    const categorySummary = labels.slice(0, 3).map(l => `${l}: $${fmt(byCategoria[l], 0)}`).join(', ');

    return {
      labels,
      values,
      summary: `Total: $${fmt(totalGastos, 0)} MXN (${labels.length} categorías)`,
      total: totalGastos,
      unit: '$MXN',
      breakdown: categorySummary
    };
  }

  /**
   * KR6 - KPI ADICIONAL: Tendencia de Ingresos
   * Comparación del crecimiento/decrecimiento de ingresos por mes
   */
  function calcTendenciaIngresos(data) {
    const ingresos = data.ingresos || [];
    if (ingresos.length === 0) return { labels: [], values: [], summary: 'Sin datos', total: 0 };

    const byMonth = {};
    ingresos.forEach(row => {
      const month = row.fecha ? getMonth(row.fecha) : 'Sin fecha';
      byMonth[month] = (byMonth[month] || 0) + safeNum(row.monto);
    });

    const sorted = Object.keys(byMonth).sort();
    if (sorted.length < 2) {
      return { labels: sorted, values: sorted.map(m => byMonth[m]), summary: 'Se necesitan 2+ meses', total: 0 };
    }

    const labels = sorted.slice(1);
    const values = [];
    for (let i = 1; i < sorted.length; i++) {
      const actual = byMonth[sorted[i]];
      const anterior = byMonth[sorted[i - 1]];
      const tendencia = safeDivide(actual - anterior, anterior) * 100;
      values.push(parseFloat(tendencia.toFixed(1)));
    }

    const lastValue = values[values.length - 1] || 0;
    const status = lastValue >= 0 ? 'success' : 'danger';

    return {
      labels,
      values,
      summary: `Tendencia actual: ${fmt(lastValue, 1)}% vs mes anterior`,
      total: lastValue,
      unit: '%',
      status: status
    };
  }

  // ─── KPI CONFIG REGISTRY ─────────────────────────────────────────────────────
  const KPI_REGISTRY = [
    // ═══════════════════════════════════════════════════════════════════════════
    // KR1 - CRECIMIENTO DE USUARIOS (Meta: 200 usuarios)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'usuarios_activos_registrados',
      name: 'Usuarios Activos Registrados',
      kr: 'Crecimiento de Usuarios',
      krMeta: 200,
      description: 'Usuarios con perfil completo y actividad en los últimos 30 días.',
      formula: 'COUNT(perfil_completo=true AND actividad <= 30 días)',
      chart_type: 'line',
      tables: ['usuarios'],
      schema: {
        usuarios: [
          { name: 'id_usuario', type: 'number' },
          { name: 'perfil_completo', type: 'string' },
          { name: 'ultima_actividad', type: 'date' },
          { name: 'fecha_registro', type: 'date' },
          { name: 'rol', type: 'string' }
        ]
      },
      compute: (data) => calcUsuariosActivosRegistrados(data),
      unit: 'usuarios'
    },
    {
      id: 'tasa_crecimiento_mensual',
      name: 'Tasa de Crecimiento Mensual',
      kr: 'Crecimiento de Usuarios',
      krMeta: null,
      description: 'Velocidad de adquisición de usuarios mes a mes.',
      formula: '((Usuarios actual - Usuarios anterior) / Usuarios anterior) × 100',
      chart_type: 'line',
      tables: ['usuarios'],
      schema: {
        usuarios: [
          { name: 'id_usuario', type: 'number' },
          { name: 'perfil_completo', type: 'string' },
          { name: 'fecha_registro', type: 'date' },
          { name: 'ultima_actividad', type: 'date' }
        ]
      },
      compute: (data) => calcTasaCrecimientoMensual(data),
      unit: '%'
    },
    {
      id: 'tasa_conversion_registros',
      name: 'Tasa de Conversión de Registros',
      kr: 'Crecimiento de Usuarios',
      krMeta: null,
      description: 'Porcentaje de usuarios registrados que se activan.',
      formula: '(Usuarios activos / Usuarios registrados) × 100',
      chart_type: 'line',
      tables: ['usuarios'],
      schema: {
        usuarios: [
          { name: 'id_usuario', type: 'number' },
          { name: 'perfil_completo', type: 'string' },
          { name: 'fecha_registro', type: 'date' }
        ]
      },
      compute: (data) => calcTasaConversionRegistros(data),
      unit: '%'
    },
    // ═══════════════════════════════════════════════════════════════════════════
    // KR2 - EVENTOS VERIFICADOS (Meta: 30 eventos)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'eventos_verificados',
      name: 'Eventos Verificados',
      kr: 'Eventos Verificados',
      krMeta: 30,
      description: 'Total de eventos con estatus "Verificado" publicados.',
      formula: 'COUNT(eventos WHERE estatus = Verificado)',
      chart_type: 'bar',
      tables: ['eventos'],
      schema: {
        eventos: [
          { name: 'id_evento', type: 'number' },
          { name: 'fecha_publicacion', type: 'date' },
          { name: 'fecha_verificacion', type: 'date' },
          { name: 'estatus', type: 'string' },
          { name: 'fecha_envio', type: 'date' }
        ]
      },
      compute: (data) => calcEventosVerificados(data),
      unit: 'eventos'
    },
    {
      id: 'tiempo_promedio_verificacion',
      name: 'Tiempo Promedio de Verificación',
      kr: 'Eventos Verificados',
      krMeta: null,
      description: 'Días promedio desde publicación hasta verificación.',
      formula: 'Σ(días publicación a verificación) / Total verificados',
      chart_type: 'line',
      tables: ['eventos'],
      schema: {
        eventos: [
          { name: 'id_evento', type: 'number' },
          { name: 'fecha_publicacion', type: 'date' },
          { name: 'fecha_verificacion', type: 'date' },
          { name: 'estatus', type: 'string' }
        ]
      },
      compute: (data) => calcTiempoPromedioVerificacion(data),
      unit: 'días'
    },
    {
      id: 'porcentaje_eventos_aprobados',
      name: 'Porcentaje de Eventos Aprobados',
      kr: 'Eventos Verificados',
      krMeta: null,
      description: 'Porcentaje de eventos enviados que fueron aprobados.',
      formula: '(Verificados / Enviados) × 100',
      chart_type: 'line',
      tables: ['eventos'],
      schema: {
        eventos: [
          { name: 'id_evento', type: 'number' },
          { name: 'fecha_publicacion', type: 'date' },
          { name: 'fecha_envio', type: 'date' },
          { name: 'estatus', type: 'string' }
        ]
      },
      compute: (data) => calcPorcentajeEventosAprobados(data),
      unit: '%'
    },
    // ═══════════════════════════════════════════════════════════════════════════
    // KR3 - EMPAREJAMIENTOS CONFIRMADOS (Meta: 40 matches)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'emparejamientos_confirmados',
      name: 'Emparejamientos Confirmados',
      kr: 'Emparejamientos Confirmados',
      krMeta: 40,
      description: 'Matches confirmados por ambas partes (peleador y promotor).',
      formula: 'COUNT(matches WHERE estatus = "Confirmado por ambas partes")',
      chart_type: 'bar',
      tables: ['matches'],
      schema: {
        matches: [
          { name: 'id_match', type: 'number' },
          { name: 'id_peleador', type: 'number' },
          { name: 'id_promotor', type: 'number' },
          { name: 'estatus', type: 'string' },
          { name: 'fecha_solicitud', type: 'date' },
          { name: 'fecha_confirmacion', type: 'date' }
        ]
      },
      compute: (data) => calcEmparejamientosConfirmados(data),
      unit: 'matches'
    },
    {
      id: 'tasa_cierre_emparejamientos',
      name: 'Tasa de Cierre de Emparejamientos',
      kr: 'Emparejamientos Confirmados',
      krMeta: null,
      description: 'Efectividad del sistema de conexión peleador-promotor.',
      formula: '(Confirmados / Iniciados) × 100',
      chart_type: 'line',
      tables: ['matches'],
      schema: {
        matches: [
          { name: 'id_match', type: 'number' },
          { name: 'estatus', type: 'string' },
          { name: 'fecha_solicitud', type: 'date' }
        ]
      },
      compute: (data) => calcTasaCierreEmparejamientos(data),
      unit: '%'
    },
    {
      id: 'tiempo_promedio_cierre_match',
      name: 'Tiempo Promedio de Cierre de Match',
      kr: 'Emparejamientos Confirmados',
      krMeta: null,
      description: 'Velocidad promedio de confirmación desde la solicitud.',
      formula: 'Σ(días solicitud a confirmación) / Total confirmados',
      chart_type: 'line',
      tables: ['matches'],
      schema: {
        matches: [
          { name: 'id_match', type: 'number' },
          { name: 'estatus', type: 'string' },
          { name: 'fecha_solicitud', type: 'date' },
          { name: 'fecha_confirmacion', type: 'date' }
        ]
      },
      compute: (data) => calcTiempoPromedioCierreMatch(data),
      unit: 'días'
    },
    // ═══════════════════════════════════════════════════════════════════════════
    // KR4 - PARTICIPACIÓN DE PELEADORES (Meta: 60%)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'porcentaje_peleadores_participacion',
      name: 'Porcentaje de Peleadores con Participación',
      kr: 'Participación de Peleadores',
      krMeta: 60,
      description: 'Porcentaje de peleadores activos que aplicaron a oportunidades.',
      formula: '(Peleadores con postulación / Total peleadores) × 100',
      chart_type: 'doughnut',
      tables: ['usuarios', 'postulaciones'],
      schema: {
        usuarios: [
          { name: 'id_usuario', type: 'number' },
          { name: 'rol', type: 'string' }
        ],
        postulaciones: [
          { name: 'id_peleador', type: 'number' },
          { name: 'id_oportunidad', type: 'number' },
          { name: 'estatus', type: 'string' },
          { name: 'fecha_postulacion', type: 'date' }
        ]
      },
      compute: (data) => calcPorcentajePeleadoresParticipacion(data),
      unit: '%'
    },
    {
      id: 'postulaciones_promedio_por_peleador',
      name: 'Postulaciones Promedio por Peleador',
      kr: 'Participación de Peleadores',
      krMeta: null,
      description: 'Nivel de uso real del sistema por peleador.',
      formula: 'Total postulaciones / Total peleadores',
      chart_type: 'line',
      tables: ['usuarios', 'postulaciones'],
      schema: {
        usuarios: [
          { name: 'id_usuario', type: 'number' },
          { name: 'rol', type: 'string' }
        ],
        postulaciones: [
          { name: 'id_peleador', type: 'number' },
          { name: 'fecha_postulacion', type: 'date' },
          { name: 'estatus', type: 'string' }
        ]
      },
      compute: (data) => calcPostulacionesPromedioPeleador(data),
      unit: 'postulaciones'
    },
    {
      id: 'tasa_conversion_postulacion',
      name: 'Tasa de Conversión de Postulación',
      kr: 'Participación de Peleadores',
      krMeta: null,
      description: 'Efectividad del sistema: postulaciones que resultan en participación.',
      formula: '(Postulaciones confirmadas / Total postulaciones) × 100',
      chart_type: 'line',
      tables: ['postulaciones'],
      schema: {
        postulaciones: [
          { name: 'id_postulacion', type: 'number' },
          { name: 'id_peleador', type: 'number' },
          { name: 'estatus', type: 'string' },
          { name: 'fecha_postulacion', type: 'date' }
        ]
      },
      compute: (data) => calcTasaConversionPostulacion(data),
      unit: '%'
    },
    // ═══════════════════════════════════════════════════════════════════════════
    // KR5 - USUARIOS RECURRENTES (Meta: 50%)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'tasa_usuarios_recurrentes',
      name: 'Tasa de Usuarios Recurrentes',
      kr: 'Usuarios Recurrentes',
      krMeta: 50,
      description: 'Porcentaje de usuarios con al menos 2 accesos en el mes.',
      formula: '(Usuarios con 2+ accesos / Total usuarios) × 100',
      chart_type: 'line',
      tables: ['accesos_usuario'],
      schema: {
        accesos_usuario: [
          { name: 'id_usuario', type: 'number' },
          { name: 'mes', type: 'date' },
          { name: 'total_accesos', type: 'number' }
        ]
      },
      compute: (data) => calcTasaUsuariosRecurrentes(data),
      unit: '%'
    },
    {
      id: 'frecuencia_promedio_uso',
      name: 'Frecuencia Promedio de Uso',
      kr: 'Usuarios Recurrentes',
      krMeta: null,
      description: 'Intensidad de uso: promedio de accesos por usuario.',
      formula: 'Total accesos / Total usuarios',
      chart_type: 'line',
      tables: ['accesos_usuario'],
      schema: {
        accesos_usuario: [
          { name: 'id_usuario', type: 'number' },
          { name: 'mes', type: 'date' },
          { name: 'total_accesos', type: 'number' }
        ]
      },
      compute: (data) => calcFrecuenciaPromedioUso(data),
      unit: 'accesos'
    },
    {
      id: 'tasa_retencion_mensual',
      name: 'Tasa de Retención Mensual',
      kr: 'Usuarios Recurrentes',
      krMeta: null,
      description: 'Permanencia: usuarios que vuelven mes tras mes.',
      formula: '(Retenidos mes actual / Activos mes anterior) × 100',
      chart_type: 'line',
      tables: ['accesos_usuario'],
      schema: {
        accesos_usuario: [
          { name: 'id_usuario', type: 'number' },
          { name: 'mes', type: 'date' }
        ]
      },
      compute: (data) => calcTasaRetencionMensual(data),
      unit: '%'
    },
    // ═══════════════════════════════════════════════════════════════════════════
    // KR6 - RENTABILIDAD Y FINANZAS (Meta: $150,000 MXN)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'ingresos_eventos_verificados',
      name: 'Ingresos por Eventos Verificados',
      kr: 'Rentabilidad y Finanzas',
      krMeta: 150000,
      description: 'Ingresos estimados basados en eventos verificados.',
      formula: 'Eventos verificados × $15,000 MXN (o datos reales de tabla ingresos)',
      chart_type: 'bar',
      tables: ['eventos', 'ingresos'],
      schema: {
        eventos: [
          { name: 'id_evento', type: 'number' },
          { name: 'fecha_publicacion', type: 'date' },
          { name: 'fecha_verificacion', type: 'date' },
          { name: 'estatus', type: 'string' }
        ],
        ingresos: [
          { name: 'id_ingreso', type: 'number' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcIngresosEventosVerificados(data),
      unit: '$MXN'
    },
    {
      id: 'ingresos_participacion_peleadores',
      name: 'Ingresos por Participación de Peleadores',
      kr: 'Rentabilidad y Finanzas',
      krMeta: null,
      description: 'Ingresos estimados por postulaciones confirmadas de peleadores.',
      formula: 'Postulaciones confirmadas × $5,000 MXN (o datos reales de tabla ingresos)',
      chart_type: 'bar',
      tables: ['postulaciones', 'ingresos'],
      schema: {
        postulaciones: [
          { name: 'id_postulacion', type: 'number' },
          { name: 'id_peleador', type: 'number' },
          { name: 'estatus', type: 'string' },
          { name: 'fecha_postulacion', type: 'date' }
        ],
        ingresos: [
          { name: 'id_ingreso', type: 'number' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcIngresosParticipacionPeleadores(data),
      unit: '$MXN'
    },
    {
      id: 'valor_usuario_recurrente',
      name: 'Valor de Usuario Recurrente (LTV)',
      kr: 'Rentabilidad y Finanzas',
      krMeta: null,
      description: 'Valor estimado generado por usuarios recurrentes basado en sus accesos.',
      formula: 'Accesos de usuarios recurrentes × $100 MXN (o datos reales de tabla ingresos)',
      chart_type: 'bar',
      tables: ['accesos_usuario', 'ingresos'],
      schema: {
        accesos_usuario: [
          { name: 'id_usuario', type: 'number' },
          { name: 'mes', type: 'date' },
          { name: 'total_accesos', type: 'number' }
        ],
        ingresos: [
          { name: 'id_ingreso', type: 'number' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcValorUsuarioRecurrente(data),
      unit: '$MXN'
    },
    {
      id: 'runway',
      name: 'Runway (Meses de Operación)',
      kr: 'Rentabilidad y Finanzas',
      krMeta: 6,
      description: 'Meses de operación restantes con el efectivo disponible actual.',
      formula: 'Runway = Efectivo disponible / Burn Rate mensual',
      chart_type: 'line',
      tables: ['financials', 'gastos'],
      schema: {
        financials: [
          { name: 'id', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' }
        ],
        gastos: [
          { name: 'id_gasto', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcRunway(data),
      unit: 'meses',
      alert: true
    },
    {
      id: 'margen_utilidad_neta',
      name: 'Margen de Utilidad Neta',
      kr: 'Rentabilidad y Finanzas',
      krMeta: 20,
      description: 'Porcentaje de rentabilidad sobre ingresos.',
      formula: 'Margen = ((Ingresos - Gastos) / Ingresos) × 100',
      chart_type: 'line',
      tables: ['ingresos', 'gastos', 'financials'],
      schema: {
        ingresos: [
          { name: 'id_ingreso', type: 'number' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ],
        gastos: [
          { name: 'id_gasto', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ],
        financials: [
          { name: 'id', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' }
        ]
      },
      compute: (data) => calcMargenUtilidadNeta(data),
      unit: '%',
      alert: true
    },
    {
      id: 'ingresos_totales',
      name: 'Ingresos Totales Acumulados',
      kr: 'Rentabilidad y Finanzas',
      krMeta: null,
      description: 'Suma total de todos los ingresos registrados en el sistema.',
      formula: 'SUM(ingresos.monto)',
      chart_type: 'bar',
      tables: ['ingresos'],
      schema: {
        ingresos: [
          { name: 'id_ingreso', type: 'number' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcIngresosTotales(data),
      unit: '$MXN'
    },
    {
      id: 'burn_rate_mensual',
      name: 'Burn Rate Mensual',
      kr: 'Rentabilidad y Finanzas',
      krMeta: null,
      description: 'Gastos promedio mensual desglosado por mes para análisis de runway.',
      formula: 'SUM(gastos.monto) por mes',
      chart_type: 'bar',
      tables: ['gastos'],
      schema: {
        gastos: [
          { name: 'id_gasto', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'categoria', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcBurnRateMensual(data),
      unit: '$MXN'
    },
    {
      id: 'flujo_caja_neto',
      name: 'Flujo de Caja Neto',
      kr: 'Rentabilidad y Finanzas',
      krMeta: null,
      description: 'Diferencia entre ingresos y gastos por mes. Positivo = ganancia, Negativo = pérdida.',
      formula: 'Ingresos - Gastos por mes',
      chart_type: 'bar',
      tables: ['ingresos', 'gastos'],
      schema: {
        ingresos: [
          { name: 'id_ingreso', type: 'number' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ],
        gastos: [
          { name: 'id_gasto', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcFlujoCajaNeto(data),
      unit: '$MXN',
      alert: true
    },
    {
      id: 'margen_utilidad_mensual',
      name: 'Margen de Utilidad por Mes',
      kr: 'Rentabilidad y Finanzas',
      krMeta: 20,
      description: 'Rentabilidad mensual desglosada por mes para identificar tendencias.',
      formula: '((Ingresos - Gastos) / Ingresos) × 100 por mes',
      chart_type: 'line',
      tables: ['ingresos', 'gastos'],
      schema: {
        ingresos: [
          { name: 'id_ingreso', type: 'number' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ],
        gastos: [
          { name: 'id_gasto', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcMargenUtilidadMensual(data),
      unit: '%',
      alert: true
    },
    {
      id: 'runway_proyectado',
      name: 'Runway Proyectado',
      kr: 'Rentabilidad y Finanzas',
      krMeta: 6,
      description: 'Proyección del runway basándose en tendencias de flujo de caja reales.',
      formula: 'Efectivo / |Flujo neto promedio|',
      chart_type: 'bar',
      tables: ['ingresos', 'gastos', 'financials'],
      schema: {
        ingresos: [
          { name: 'id_ingreso', type: 'number' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ],
        gastos: [
          { name: 'id_gasto', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ],
        financials: [
          { name: 'id', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' }
        ]
      },
      compute: (data) => calcRunwayProyectado(data),
      unit: 'meses',
      alert: true
    },
    {
      id: 'ratio_gastos_ingresos',
      name: 'Ratio Gastos/Ingresos',
      kr: 'Rentabilidad y Finanzas',
      krMeta: 80,
      description: 'Porcentaje de ingresos destinado a gastos. Ideal ≤80%.',
      formula: '(Gastos / Ingresos) × 100',
      chart_type: 'line',
      tables: ['ingresos', 'gastos'],
      schema: {
        ingresos: [
          { name: 'id_ingreso', type: 'number' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ],
        gastos: [
          { name: 'id_gasto', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcRatioGastosIngresos(data),
      unit: '%',
      alert: true
    },
    {
      id: 'gastos_por_categoria',
      name: 'Gastos por Categoría',
      kr: 'Rentabilidad y Finanzas',
      krMeta: null,
      description: 'Desglose de gastos por categoría para identificar áreas de oportunidad.',
      formula: 'SUM(gastos.monto) GROUP BY categoria',
      chart_type: 'doughnut',
      tables: ['gastos'],
      schema: {
        gastos: [
          { name: 'id_gasto', type: 'number' },
          { name: 'concepto', type: 'string' },
          { name: 'categoria', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcGastosPorCategoria(data),
      unit: '$MXN'
    },
    {
      id: 'tendencia_ingresos',
      name: 'Tendencia de Ingresos',
      kr: 'Rentabilidad y Finanzas',
      krMeta: null,
      description: 'Variación porcentual de ingresos mes a mes.',
      formula: '((Ingresos actual - Ingresos anterior) / Ingresos anterior) × 100',
      chart_type: 'line',
      tables: ['ingresos'],
      schema: {
        ingresos: [
          { name: 'id_ingreso', type: 'number' },
          { name: 'tipo', type: 'string' },
          { name: 'monto', type: 'number' },
          { name: 'fecha', type: 'date' }
        ]
      },
      compute: (data) => calcTendenciaIngresos(data),
      unit: '%'
    }
  ];

  function getKPI(id) {
    return KPI_REGISTRY.find(k => k.id === id);
  }

  function getAllKPIs() {
    return KPI_REGISTRY;
  }

  function getKPIsByKR(krName) {
    return KPI_REGISTRY.filter(k => k.kr === krName);
  }

  function getAllKRs() {
    const krs = new Map();
    KPI_REGISTRY.forEach(kpi => {
      if (!krs.has(kpi.kr)) {
        krs.set(kpi.kr, { name: kpi.kr, meta: kpi.krMeta, kpis: [] });
      }
      krs.get(kpi.kr).kpis.push(kpi);
    });
    return Array.from(krs.values());
  }

  // Helper: Filter table data by date range
  function filterTableByDateRange(tableData, kpi, tableName, dateRange) {
    if (!tableData || tableData.length === 0) return tableData;
    
    // Determine date field based on table name
    let dateField = null;
    const schema = kpi.schema[tableName];
    if (schema) {
      // Look for date fields in schema
      const dateColumn = schema.find(col => col.type === 'date');
      if (dateColumn) {
        dateField = dateColumn.name;
      }
    }
    
    // Default date fields by table name if schema doesn't specify
    if (!dateField) {
      const dateFieldMap = {
        'usuarios': 'fecha_registro',
        'eventos': 'fecha_publicacion',
        'matches': 'fecha_solicitud',
        'postulaciones': 'fecha_postulacion',
        'accesos_usuario': 'mes'
      };
      dateField = dateFieldMap[tableName];
    }
    
    if (!dateField) return tableData;
    
    return tableData.filter(row => {
      if (!row[dateField]) return false;
      const rowDate = new Date(row[dateField]);
      
      if (dateRange.start && rowDate < dateRange.start) {
        return false;
      }
      if (dateRange.end && rowDate > dateRange.end) {
        return false;
      }
      return true;
    });
  }

  function computeKPI(kpiId, dataManager, dateRange = null) {
    const kpi = getKPI(kpiId);
    if (!kpi) return { error: `KPI "${kpiId}" no encontrado.` };

    const data = {};
    kpi.tables.forEach(tableName => {
      let tableData = dataManager.loadTable(tableName);
      
      // Apply date filtering if dateRange is provided
      if (dateRange && (dateRange.start || dateRange.end)) {
        tableData = filterTableByDateRange(tableData, kpi, tableName, dateRange);
      }
      
      data[tableName] = tableData;
    });

    const hasData = kpi.tables.some(t => data[t] && data[t].length > 0);
    if (!hasData) {
      return {
        labels: [],
        values: [],
        summary: '⚠️ Sin datos. Sube datos en la sección de Carga.',
        total: 0,
        empty: true
      };
    }

    try {
      const result = kpi.compute(data);
      return result;
    } catch (e) {
      return { error: `Error al calcular: ${e.message}`, labels: [], values: [], total: 0 };
    }
  }

  return { getAllKPIs, getKPI, getKPIsByKR, getAllKRs, computeKPI, fmt };
})();
