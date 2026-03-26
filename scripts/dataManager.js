/**
 * dataManager.js - Fight.net Dashboard
 * Manages data persistence via localStorage and CSV import/export.
 * No eval(), no backend, fully portable.
 */

const DataManager = (() => {
  const PREFIX = 'fightnet_';

  // --- Core Storage ---
  function saveTable(tableName, rows) {
    if (!Array.isArray(rows)) return false;
    try {
      localStorage.setItem(PREFIX + tableName, JSON.stringify(rows));
      return true;
    } catch (e) {
      console.error('Save error:', e);
      return false;
    }
  }

  function loadTable(tableName) {
    try {
      const raw = localStorage.getItem(PREFIX + tableName);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function appendRows(tableName, newRows) {
    const existing = loadTable(tableName);
    const merged = existing.concat(newRows);
    return saveTable(tableName, merged);
  }

  function clearTable(tableName) {
    localStorage.removeItem(PREFIX + tableName);
  }

  function clearAll() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  }

  // --- Validation ---
  function validateRow(row, schema) {
    const errors = [];
    schema.forEach(col => {
      const val = row[col.name];
      if (val === undefined || val === null || val === '') {
        errors.push(`Campo requerido faltante: "${col.name}"`);
        return;
      }
      if (col.type === 'number') {
        if (isNaN(parseFloat(val))) errors.push(`"${col.name}" debe ser número. Recibido: "${val}"`);
      }
      if (col.type === 'date') {
        if (isNaN(Date.parse(val))) errors.push(`"${col.name}" debe ser fecha válida (YYYY-MM-DD). Recibido: "${val}"`);
      }
    });
    return errors;
  }

  // --- CSV Import ---
  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return { headers: [], rows: [], error: 'CSV debe tener encabezados y al menos una fila.' };
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = splitCSVLine(lines[i]);
      if (cells.length !== headers.length) continue;
      const row = {};
      headers.forEach((h, idx) => { row[h] = cells[idx].replace(/^"|"$/g, '').trim(); });
      rows.push(row);
    }
    return { headers, rows, error: null };
  }

  function splitCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { result.push(current); current = ''; continue; }
      current += ch;
    }
    result.push(current);
    return result;
  }

  function importCSV(tableName, csvText, schema, mode = 'append') {
    const { rows, error } = parseCSV(csvText);
    if (error) return { success: false, message: error, imported: 0 };
    
    const validRows = [];
    const allErrors = [];
    rows.forEach((row, idx) => {
      const errs = validateRow(row, schema);
      if (errs.length > 0) {
        allErrors.push(`Fila ${idx + 2}: ${errs.join('; ')}`);
      } else {
        validRows.push(row);
      }
    });

    if (validRows.length === 0) return { success: false, message: `Sin filas válidas. Errores:\n${allErrors.join('\n')}`, imported: 0 };

    if (mode === 'replace') {
      saveTable(tableName, validRows);
    } else {
      appendRows(tableName, validRows);
    }

    return {
      success: true,
      message: `${validRows.length} filas importadas correctamente.${allErrors.length > 0 ? ` (${allErrors.length} filas con errores omitidas)` : ''}`,
      imported: validRows.length,
      errors: allErrors
    };
  }

  // --- CSV Export ---
  function exportCSV(tableName, schema) {
    const rows = loadTable(tableName);
    if (rows.length === 0) return null;
    const headers = schema.map(c => c.name);
    const csvLines = [headers.join(',')];
    rows.forEach(row => {
      const line = headers.map(h => {
        const v = row[h] !== undefined ? String(row[h]) : '';
        return v.includes(',') ? `"${v}"` : v;
      });
      csvLines.push(line.join(','));
    });
    return csvLines.join('\n');
  }

  function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Template CSV ---
  function downloadTemplate(schema, filename) {
    const headers = schema.map(c => c.name).join(',');
    downloadCSV(headers + '\n', filename);
  }

  // --- Example Data Loader ---
  function loadExampleData() {
    const examples = {
      usuarios: [
        { id_usuario: '1', perfil_completo: 'true', ultima_actividad: '2026-02-25', rol: 'peleador', fecha_registro: '2025-09-10' },
        { id_usuario: '2', perfil_completo: 'true', ultima_actividad: '2026-02-26', rol: 'promotor', fecha_registro: '2025-09-15' },
        { id_usuario: '3', perfil_completo: 'true', ultima_actividad: '2026-02-24', rol: 'peleador', fecha_registro: '2025-09-20' },
        { id_usuario: '4', perfil_completo: 'true', ultima_actividad: '2026-02-23', rol: 'peleador', fecha_registro: '2025-10-05' },
        { id_usuario: '5', perfil_completo: 'true', ultima_actividad: '2026-02-26', rol: 'promotor', fecha_registro: '2025-10-12' },
        { id_usuario: '6', perfil_completo: 'true', ultima_actividad: '2026-02-25', rol: 'peleador', fecha_registro: '2025-10-18' },
        { id_usuario: '7', perfil_completo: 'true', ultima_actividad: '2026-02-24', rol: 'peleador', fecha_registro: '2025-10-25' },
        { id_usuario: '8', perfil_completo: 'true', ultima_actividad: '2026-02-26', rol: 'admin', fecha_registro: '2025-11-05' },
        { id_usuario: '9', perfil_completo: 'true', ultima_actividad: '2026-02-25', rol: 'peleador', fecha_registro: '2025-11-12' },
        { id_usuario: '10', perfil_completo: 'true', ultima_actividad: '2026-02-24', rol: 'promotor', fecha_registro: '2025-11-20' },
        { id_usuario: '11', perfil_completo: 'true', ultima_actividad: '2026-02-23', rol: 'peleador', fecha_registro: '2025-12-01' },
        { id_usuario: '12', perfil_completo: 'true', ultima_actividad: '2026-02-26', rol: 'peleador', fecha_registro: '2025-12-08' },
        { id_usuario: '13', perfil_completo: 'true', ultima_actividad: '2026-02-25', rol: 'peleador', fecha_registro: '2025-12-15' },
        { id_usuario: '14', perfil_completo: 'true', ultima_actividad: '2026-02-24', rol: 'promotor', fecha_registro: '2025-12-22' },
        { id_usuario: '15', perfil_completo: 'true', ultima_actividad: '2026-02-23', rol: 'peleador', fecha_registro: '2026-01-05' },
        { id_usuario: '16', perfil_completo: 'true', ultima_actividad: '2026-02-26', rol: 'peleador', fecha_registro: '2026-01-10' },
        { id_usuario: '17', perfil_completo: 'true', ultima_actividad: '2026-02-25', rol: 'promotor', fecha_registro: '2026-01-15' },
        { id_usuario: '18', perfil_completo: 'true', ultima_actividad: '2026-02-24', rol: 'peleador', fecha_registro: '2026-01-22' },
        { id_usuario: '19', perfil_completo: 'true', ultima_actividad: '2026-02-23', rol: 'peleador', fecha_registro: '2026-02-01' },
        { id_usuario: '20', perfil_completo: 'true', ultima_actividad: '2026-02-26', rol: 'admin', fecha_registro: '2026-02-08' }
      ],
      eventos: [
        { id_evento: '1', fecha_publicacion: '2025-11-20', fecha_verificacion: '2025-11-22', estatus: 'Verificado' },
        { id_evento: '2', fecha_publicacion: '2025-12-05', fecha_verificacion: '', estatus: 'Pendiente' },
        { id_evento: '3', fecha_publicacion: '2025-12-14', fecha_verificacion: '2025-12-15', estatus: 'Verificado' },
        { id_evento: '4', fecha_publicacion: '2026-01-10', fecha_verificacion: '2026-01-12', estatus: 'Verificado' },
        { id_evento: '5', fecha_publicacion: '2026-01-22', fecha_verificacion: '', estatus: 'Rechazado' },
        { id_evento: '6', fecha_publicacion: '2026-02-10', fecha_verificacion: '2026-02-12', estatus: 'Verificado' },
        { id_evento: '7', fecha_publicacion: '2026-02-20', fecha_verificacion: '', estatus: 'Enviado' }
      ],
      matches: [
        { id_match: '1', id_peleador: '1', id_promotor: '2', estatus: 'Confirmado por ambas partes', fecha_solicitud: '2025-11-15', fecha_confirmacion: '2025-11-25' },
        { id_match: '2', id_peleador: '4', id_promotor: '2', estatus: 'Pendiente', fecha_solicitud: '2025-12-10', fecha_confirmacion: '' },
        { id_match: '3', id_peleador: '6', id_promotor: '5', estatus: 'Confirmado por ambas partes', fecha_solicitud: '2026-01-20', fecha_confirmacion: '2026-02-05' },
        { id_match: '4', id_peleador: '7', id_promotor: '5', estatus: 'Confirmado por ambas partes', fecha_solicitud: '2026-02-01', fecha_confirmacion: '2026-02-10' },
        { id_match: '5', id_peleador: '1', id_promotor: '5', estatus: 'Cancelado', fecha_solicitud: '2026-01-15', fecha_confirmacion: '' }
      ],
      postulaciones: [
        { id_peleador: '1', id_oportunidad: '101', estatus: 'confirmada', fecha_postulacion: '2025-12-01' },
        { id_peleador: '4', id_oportunidad: '101', estatus: 'confirmada', fecha_postulacion: '2025-12-05' },
        { id_peleador: '6', id_oportunidad: '102', estatus: 'postulada', fecha_postulacion: '2026-01-20' },
        { id_peleador: '7', id_oportunidad: '103', estatus: 'confirmada', fecha_postulacion: '2026-02-10' },
        { id_peleador: '1', id_oportunidad: '104', estatus: 'postulada', fecha_postulacion: '2026-02-15' },
        { id_peleador: '4', id_oportunidad: '105', estatus: 'rechazada', fecha_postulacion: '2026-02-20' }
      ],
      accesos_usuario: [
        { id_usuario: '1', mes: '2025-09-01', total_accesos: '8' },
        { id_usuario: '2', mes: '2025-09-01', total_accesos: '5' },
        { id_usuario: '3', mes: '2025-09-01', total_accesos: '6' },
        { id_usuario: '1', mes: '2025-10-01', total_accesos: '7' },
        { id_usuario: '2', mes: '2025-10-01', total_accesos: '4' },
        { id_usuario: '3', mes: '2025-10-01', total_accesos: '5' },
        { id_usuario: '4', mes: '2025-10-01', total_accesos: '6' },
        { id_usuario: '5', mes: '2025-10-01', total_accesos: '3' },
        { id_usuario: '6', mes: '2025-10-01', total_accesos: '4' },
        { id_usuario: '1', mes: '2025-11-01', total_accesos: '9' },
        { id_usuario: '2', mes: '2025-11-01', total_accesos: '6' },
        { id_usuario: '4', mes: '2025-11-01', total_accesos: '7' },
        { id_usuario: '5', mes: '2025-11-01', total_accesos: '5' },
        { id_usuario: '7', mes: '2025-11-01', total_accesos: '4' },
        { id_usuario: '8', mes: '2025-11-01', total_accesos: '3' },
        { id_usuario: '1', mes: '2025-12-01', total_accesos: '10' },
        { id_usuario: '2', mes: '2025-12-01', total_accesos: '7' },
        { id_usuario: '4', mes: '2025-12-01', total_accesos: '8' },
        { id_usuario: '6', mes: '2025-12-01', total_accesos: '6' },
        { id_usuario: '8', mes: '2025-12-01', total_accesos: '5' },
        { id_usuario: '9', mes: '2025-12-01', total_accesos: '4' },
        { id_usuario: '10', mes: '2025-12-01', total_accesos: '3' },
        { id_usuario: '1', mes: '2026-01-01', total_accesos: '8' },
        { id_usuario: '4', mes: '2026-01-01', total_accesos: '6' },
        { id_usuario: '6', mes: '2026-01-01', total_accesos: '7' },
        { id_usuario: '8', mes: '2026-01-01', total_accesos: '5' },
        { id_usuario: '11', mes: '2026-01-01', total_accesos: '4' },
        { id_usuario: '12', mes: '2026-01-01', total_accesos: '6' },
        { id_usuario: '13', mes: '2026-01-01', total_accesos: '5' },
        { id_usuario: '14', mes: '2026-01-01', total_accesos: '3' },
        { id_usuario: '1', mes: '2026-02-01', total_accesos: '12' },
        { id_usuario: '2', mes: '2026-02-01', total_accesos: '8' },
        { id_usuario: '4', mes: '2026-02-01', total_accesos: '9' },
        { id_usuario: '6', mes: '2026-02-01', total_accesos: '7' },
        { id_usuario: '8', mes: '2026-02-01', total_accesos: '6' },
        { id_usuario: '12', mes: '2026-02-01', total_accesos: '8' },
        { id_usuario: '15', mes: '2026-02-01', total_accesos: '5' },
        { id_usuario: '16', mes: '2026-02-01', total_accesos: '7' },
        { id_usuario: '17', mes: '2026-02-01', total_accesos: '4' },
        { id_usuario: '18', mes: '2026-02-01', total_accesos: '6' },
        { id_usuario: '19', mes: '2026-02-01', total_accesos: '5' },
        { id_usuario: '20', mes: '2026-02-01', total_accesos: '8' }
      ],
      ingresos: [
        { id_ingreso: '1', tipo: 'evento', monto: '15000', fecha: '2025-11-22' },
        { id_ingreso: '2', tipo: 'evento', monto: '15000', fecha: '2025-12-15' },
        { id_ingreso: '3', tipo: 'evento', monto: '15000', fecha: '2026-01-12' },
        { id_ingreso: '4', tipo: 'evento', monto: '15000', fecha: '2026-02-12' },
        { id_ingreso: '5', tipo: 'postulacion', monto: '5000', fecha: '2025-12-01' },
        { id_ingreso: '6', tipo: 'postulacion', monto: '5000', fecha: '2025-12-05' },
        { id_ingreso: '7', tipo: 'postulacion', monto: '5000', fecha: '2026-02-10' },
        { id_ingreso: '8', tipo: 'usuario', monto: '800', fecha: '2025-09-01' },
        { id_ingreso: '9', tipo: 'usuario', monto: '500', fecha: '2025-10-01' },
        { id_ingreso: '10', tipo: 'usuario', monto: '900', fecha: '2025-11-01' },
        { id_ingreso: '11', tipo: 'usuario', monto: '1000', fecha: '2025-12-01' },
        { id_ingreso: '12', tipo: 'usuario', monto: '800', fecha: '2026-01-01' },
        { id_ingreso: '13', tipo: 'usuario', monto: '1200', fecha: '2026-02-01' }
      ],
      gastos: [
        { id_gasto: '1', concepto: 'Servidores y hosting', categoria: 'operativo', monto: '15000', fecha: '2025-11-01' },
        { id_gasto: '2', concepto: 'Servidores y hosting', categoria: 'operativo', monto: '15000', fecha: '2025-12-01' },
        { id_gasto: '3', concepto: 'Servidores y hosting', categoria: 'operativo', monto: '15000', fecha: '2026-01-01' },
        { id_gasto: '4', concepto: 'Servidores y hosting', categoria: 'operativo', monto: '15000', fecha: '2026-02-01' },
        { id_gasto: '5', concepto: 'Marketing digital', categoria: 'marketing', monto: '10000', fecha: '2025-11-15' },
        { id_gasto: '6', concepto: 'Marketing digital', categoria: 'marketing', monto: '12000', fecha: '2025-12-15' },
        { id_gasto: '7', concepto: 'Marketing digital', categoria: 'marketing', monto: '10000', fecha: '2026-01-15' },
        { id_gasto: '8', concepto: 'Marketing digital', categoria: 'marketing', monto: '8000', fecha: '2026-02-15' },
        { id_gasto: '9', concepto: 'Nómina desarrolladores', categoria: 'desarrollo', monto: '25000', fecha: '2025-11-30' },
        { id_gasto: '10', concepto: 'Nómina desarrolladores', categoria: 'desarrollo', monto: '25000', fecha: '2025-12-31' },
        { id_gasto: '11', concepto: 'Nómina desarrolladores', categoria: 'desarrollo', monto: '25000', fecha: '2026-01-31' },
        { id_gasto: '12', concepto: 'Nómina desarrolladores', categoria: 'desarrollo', monto: '25000', fecha: '2026-02-28' },
        { id_gasto: '13', concepto: 'Servicios.cloud', categoria: 'servicios', monto: '3000', fecha: '2025-11-01' },
        { id_gasto: '14', concepto: 'Servicios.cloud', categoria: 'servicios', monto: '3000', fecha: '2025-12-01' },
        { id_gasto: '15', concepto: 'Servicios.cloud', categoria: 'servicios', monto: '3500', fecha: '2026-01-01' },
        { id_gasto: '16', concepto: 'Servicios.cloud', categoria: 'servicios', monto: '3500', fecha: '2026-02-01' }
      ],
      financials: [
        { id: '1', concepto: 'efectivo_disponible', tipo: 'efectivo', monto: '150000', fecha_actualizacion: '2026-02-28' },
        { id: '2', concepto: 'burn_rate', tipo: 'gasto', monto: '40000', fecha_actualizacion: '2026-02-28' },
        { id: '3', concepto: 'ingresos_mensuales', tipo: 'ingreso', monto: '120000', fecha_actualizacion: '2026-02-28' },
        { id: '4', concepto: 'gastos_mensuales', tipo: 'gasto', monto: '90000', fecha_actualizacion: '2026-02-28' }
      ]
    };

    Object.entries(examples).forEach(([table, rows]) => {
      saveTable(table, rows);
    });
    return true;
  }

  return {
    saveTable, loadTable, appendRows, clearTable, clearAll,
    validateRow, importCSV, exportCSV, downloadCSV, downloadTemplate,
    loadExampleData, parseCSV
  };
})();
