/**
 * tutorial.js - Fight.net Dashboard
 * Manages the step-by-step interactive tutorial on index.html
 */

/**
 * tutorial.js - Fight.net Dashboard
 * Guide Tour con modales interactivos
 */

const Tutorial = (() => {
  const STEPS = [
    {
      title: '👋 Bienvenido a Fight.net Dashboard',
      content: `Este sistema te permite monitorear los <strong>Indicadores Clave de Rendimiento (KPIs)</strong> 
        de Fight.net en Aguascalientes. No necesitas internet ni instalaciones — todo funciona en tu navegador.
        <br><br>En los siguientes pasos aprenderás a cargar datos y ver tus métricas.`,
      icon: '🥊'
    },
    {
      title: 'Paso 1: Estructura del Dashboard',
      content: `El sistema tiene <strong>3 páginas principales</strong>:<br><br>
        <div class="step-list">
          <div class="step-item"><span class="step-badge">1</span> <strong>Inicio (aquí)</strong> — Tutorial e introducción</div>
          <div class="step-item"><span class="step-badge">2</span> <strong>Carga de Datos</strong> — Agrega datos manualmente o por CSV</div>
          <div class="step-item"><span class="step-badge">3</span> <strong>Dashboard</strong> — Visualiza tus KPIs en gráficas</div>
        </div>`,
      icon: '📐'
    },
    {
      title: 'Paso 2: Cargar Datos',
      content: `En la página de <strong>Carga de Datos</strong> puedes:<br><br>
        <div class="step-list">
          <div class="step-item">📋 Seleccionar el KPI que quieres alimentar</div>
          <div class="step-item">✏️ Ingresar datos manualmente fila por fila</div>
          <div class="step-item">📂 Subir un archivo CSV con múltiples registros</div>
          <div class="step-item">⬇️ Descargar una plantilla CSV para llenar</div>
        </div>
        <br>Los datos se guardan en tu navegador (localStorage) — sin internet requerido.`,
      icon: '📊'
    },
    {
      title: 'Paso 3: Formato de Fechas',
      content: `Las fechas deben escribirse en formato <strong>YYYY-MM-DD</strong>:<br><br>
        <div class="example-box">
          ✅ Correcto: <code>2025-03-15</code><br>
          ❌ Incorrecto: <code>15/03/2025</code> o <code>marzo 15</code>
        </div>
        <br>Los números deben usar punto decimal:<br>
        <div class="example-box">
          ✅ Correcto: <code>1500.50</code><br>
          ❌ Incorrecto: <code>1,500.50</code>
        </div>`,
      icon: '📅'
    },
    {
      title: 'Paso 4: Importar CSV',
      content: `Para importar desde Excel o Google Sheets:<br><br>
        <div class="step-list">
          <div class="step-item">1. Descarga la plantilla CSV desde la página de carga</div>
          <div class="step-item">2. Ábrela en Excel o Google Sheets</div>
          <div class="step-item">3. Llena tus datos (¡respeta las columnas!)</div>
          <div class="step-item">4. Guarda como <strong>CSV (UTF-8)</strong></div>
          <div class="step-item">5. Sube el archivo en la página de carga</div>
        </div>`,
      icon: '📁'
    },
    {
      title: '¡Listo para comenzar!',
      content: `Tienes dos opciones para empezar:<br><br>
        <div class="step-list">
          <div class="step-item">🎯 <strong>Datos de Ejemplo</strong> — Carga datos ficticios para explorar el dashboard de inmediato</div>
          <div class="step-item">📝 <strong>Tus propios datos</strong> — Ve a "Carga de Datos" e ingresa información real</div>
        </div>
        <br>Puedes reiniciar todo en cualquier momento con el botón <strong>"Borrar Todos los Datos"</strong>.<br><br>
        <div style="text-align: center; padding: 1rem; background: linear-gradient(135deg, rgba(192,57,43,0.1), rgba(44,62,80,0.1)); border-radius: 10px; margin-top: 1rem;">
          <strong>🎉 ¡Empecemos!</strong>
        </div>`,
      icon: '🚀'
    }
  ];

  let currentStep = 0;
  let isOpen = false;

  function init() {
    // Setup keyboard navigation
    document.addEventListener('keydown', handleKeydown);
    // Setup overlay click to close
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) {
      overlay.addEventListener('click', close);
    }
  }

  function handleKeydown(e) {
    if (!isOpen) return;
    
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowRight') {
      next();
    } else if (e.key === 'ArrowLeft') {
      prev();
    }
  }

  function start() {
    currentStep = 0;
    open();
    renderStep();
  }

  function open() {
    isOpen = true;
    const overlay = document.getElementById('tutorial-overlay');
    const modal = document.getElementById('tutorial-modal');
    
    if (overlay) overlay.classList.add('active');
    if (modal) modal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    renderStep();
  }

  function close() {
    isOpen = false;
    const overlay = document.getElementById('tutorial-overlay');
    const modal = document.getElementById('tutorial-modal');
    
    if (overlay) overlay.classList.remove('active');
    if (modal) modal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Mark tutorial as done
    localStorage.setItem('fightnet_tutorial_done', 'true');
    
    // Update UI - show restart link instead of big button
    const tourTrigger = document.getElementById('tour-trigger');
    const restartLink = document.getElementById('restart-tour-link');
    if (tourTrigger) tourTrigger.style.display = 'none';
    if (restartLink) restartLink.style.display = 'block';
  }

  function updateProgress() {
    const progressBar = document.getElementById('tutorial-progress');
    if (progressBar) {
      const progress = ((currentStep + 1) / STEPS.length) * 100;
      progressBar.style.width = progress + '%';
    }
  }

  function renderStep() {
    const step = STEPS[currentStep];
    const titleEl = document.getElementById('tutorial-title');
    const contentEl = document.getElementById('tutorial-content');
    const iconEl = document.getElementById('tutorial-icon');
    const counterEl = document.getElementById('tutorial-counter');
    const prevBtn = document.getElementById('tutorial-prev');
    const nextBtn = document.getElementById('tutorial-next');

    if (!titleEl) return;

    titleEl.textContent = step.title;
    contentEl.innerHTML = step.content;
    if (iconEl) iconEl.textContent = step.icon;
    if (counterEl) counterEl.textContent = `${currentStep + 1} / ${STEPS.length}`;
    if (prevBtn) prevBtn.disabled = currentStep === 0;
    if (nextBtn) {
      if (currentStep === STEPS.length - 1) {
        nextBtn.textContent = '✅ Finalizar';
        nextBtn.onclick = () => {
          close();
        };
      } else {
        nextBtn.textContent = 'Siguiente →';
        nextBtn.onclick = next;
      }
    }
    renderDots();
    updateProgress();
  }

  function renderDots() {
    const dotsEl = document.getElementById('tutorial-dots');
    if (!dotsEl) return;
    dotsEl.innerHTML = STEPS.map((_, i) =>
      `<span class="dot ${i === currentStep ? 'active' : ''}" onclick="Tutorial.goTo(${i})" title="Paso ${i + 1}"></span>`
    ).join('');
  }

  function next() {
    if (currentStep < STEPS.length - 1) {
      currentStep++;
      renderStep();
    }
  }

  function prev() {
    if (currentStep > 0) {
      currentStep--;
      renderStep();
    }
  }

  function goTo(i) {
    if (i >= 0 && i < STEPS.length) {
      currentStep = i;
      renderStep();
    }
  }

  function restart() {
    currentStep = 0;
    start();
  }

  return { init, start, open, close, next, prev, goTo, restart };
})();
