/**
 * charts.js - Fight.net Dashboard
 * Renders Chart.js charts from KPI computed results.
 */

const ChartsManager = (() => {
  const PRIMARY = '#bc2218';
  const SECONDARY = '#161614';
  const ACCENT_PALETTE = [
    '#bc2218', '#9e1c14', '#161614', '#2a2a28',
    '#8E44AD', '#2980B9', '#16A085', '#D35400',
    '#27AE60', '#F39C12'
  ];

  const chartInstances = {};

  function destroyChart(canvasId) {
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
      delete chartInstances[canvasId];
    }
  }

  function createChart(canvasId, type, labels, values, label, options = {}) {
    destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    const backgroundColors = type === 'doughnut' || type === 'pie'
      ? ACCENT_PALETTE.slice(0, values.length)
      : values.map((_, i) => i === 0 ? PRIMARY : (i % 2 === 0 ? SECONDARY : '#9e1c14'));

    const baseDataset = {
      label: label || '',
      data: values,
      backgroundColor: backgroundColors,
      borderColor: type === 'line' ? PRIMARY : backgroundColors,
      borderWidth: type === 'line' ? 2 : 1,
      fill: type === 'line' ? false : undefined,
      tension: type === 'line' ? 0.4 : undefined,
      pointBackgroundColor: type === 'line' ? PRIMARY : undefined,
      pointRadius: type === 'line' ? 4 : undefined
    };

    const config = {
      type: type,
      data: {
        labels: labels,
        datasets: [baseDataset]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: type === 'doughnut' || type === 'pie',
            position: 'bottom',
            labels: {
              color: SECONDARY,
              font: { family: 'Inter, sans-serif', size: 12 }
            }
          },
          tooltip: {
            backgroundColor: SECONDARY,
            titleFont: { family: 'Inter, sans-serif', size: 13 },
            bodyFont: { family: 'Inter, sans-serif', size: 12 },
            padding: 10,
            callbacks: {
              label: function(context) {
                const val = context.parsed.y !== undefined ? context.parsed.y : context.parsed;
                const unit = options.unit || '';
                return ` ${val}${unit ? ' ' + unit : ''}`;
              }
            }
          }
        },
        scales: (type === 'line' || type === 'bar') ? {
          x: {
            ticks: {
              color: '#555',
              font: { family: 'Inter, sans-serif', size: 11 }
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#555',
              font: { family: 'Inter, sans-serif', size: 11 }
            },
            grid: { color: 'rgba(0,0,0,0.08)' }
          }
        } : {}
      }
    };

    const chart = new Chart(ctx, config);
    chartInstances[canvasId] = chart;
    return chart;
  }

  function renderEmpty(canvasId, message) {
    destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#999';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(message || 'Sin datos disponibles', canvas.width / 2, canvas.height / 2);
  }

  function renderKPIChart(kpiConfig, result, canvasId) {
    if (!result || result.error) {
      renderEmpty(canvasId, result ? result.error : 'Error desconocido');
      return;
    }
    if (!result.labels || result.labels.length === 0 || result.empty) {
      renderEmpty(canvasId, '⚠️ Sin datos — ve a Carga de Datos');
      return;
    }

    createChart(
      canvasId,
      kpiConfig.chart_type,
      result.labels,
      result.values,
      kpiConfig.name,
      { unit: kpiConfig.unit }
    );
  }

  return { createChart, renderKPIChart, renderEmpty, destroyChart };
})();
