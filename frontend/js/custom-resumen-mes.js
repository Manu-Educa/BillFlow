const API_URL = 'http://localhost:8081/api';
let todosLosGastos = [];

document.addEventListener("DOMContentLoaded", () => {
    configurarPerfilUsuario();
    configurarMenuPerfil();
    generarOpcionesMeses();
    configurarSelectorMes();
    cargarDatosDashboard();
});

function configurarPerfilUsuario() {
    const nombreGuardado = localStorage.getItem('usuarioNombre');
    const displayNombre = document.getElementById('display-nombre');
    const displayIniciales = document.getElementById('display-iniciales');

    if (nombreGuardado) {
        if (displayNombre) displayNombre.textContent = nombreGuardado;
        if (displayIniciales) displayIniciales.textContent = nombreGuardado.substring(0, 2).toUpperCase();
    } else {
        window.location.href = 'login.html';
    }
}

function configurarMenuPerfil() {
    const perfilBtn = document.getElementById('perfil-btn');
    const perfilDropdown = document.getElementById('perfil-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    if (perfilBtn && perfilDropdown) {
        perfilBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            perfilDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!perfilBtn.contains(e.target) && !perfilDropdown.contains(e.target)) {
                perfilDropdown.classList.add('hidden');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

function generarOpcionesMeses() {
    const selector = document.getElementById('filtro-mes');
    if (!selector) return;
    
    selector.innerHTML = '';
    const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const hoy = new Date();

    for (let i = 0; i < 5; i++) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        const anio = fecha.getFullYear();
        const mes = fecha.getMonth();
        const mesValor = `${anio}-${String(mes + 1).padStart(2, '0')}`;
        const mesTexto = `${mesesNombres[mes]} ${anio}`;
        
        const option = document.createElement('option');
        option.value = mesValor;
        option.textContent = mesTexto;
        selector.appendChild(option);
    }
}

function configurarSelectorMes() {
    const selector = document.getElementById('filtro-mes');
    if (selector) {
        selector.addEventListener('change', () => {
            procesarDatosVista(selector.value);
            actualizarTitulo(selector);
        });
    }
}

function actualizarTitulo(selector) {
    const titulo = document.getElementById('titulo-resumen');
    if (titulo && selector.selectedIndex >= 0) {
        titulo.textContent = `Resumen de ${selector.options[selector.selectedIndex].text}`;
    }
}

async function cargarDatosDashboard() {
    try {
        const respuesta = await fetch(`${API_URL}/gastos`);
        if (!respuesta.ok) throw new Error('Error de red');
        
        todosLosGastos = await respuesta.json();
        
        const selector = document.getElementById('filtro-mes');
        const mesActual = selector ? selector.value : (() => {
            const hoy = new Date();
            return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
        })();
        
        procesarDatosVista(mesActual);
        if (selector) actualizarTitulo(selector);
    } catch (error) {
        const contenedor = document.getElementById('lista-movimientos');
        if (contenedor) {
            contenedor.innerHTML = `<p class="text-red-500">Error al cargar datos.</p>`;
        }
    }
}

function procesarDatosVista(mesAnio) {
    const gastosFiltrados = todosLosGastos.filter(gasto => {
        if (!gasto.fecha) return false;
        return gasto.fecha.startsWith(mesAnio);
    });

    renderizarTarjetas(gastosFiltrados);
    renderizarUltimosMovimientos(gastosFiltrados);
    renderizarGrafico(gastosFiltrados);
}

function renderizarTarjetas(gastos) {
    const totalGasto = gastos.reduce((suma, gasto) => suma + (parseFloat(gasto.importe) || 0), 0);
    const presupuestoMensual = parseFloat(localStorage.getItem('limitePresupuesto')) || 1500;
    const restante = presupuestoMensual - totalGasto;
    
    document.getElementById('gasto-total').textContent = `€ ${totalGasto.toFixed(2)}`;
    document.getElementById('presupuesto-restante').textContent = `€ ${restante.toFixed(2)}`;
    
    const porcentaje = Math.min((totalGasto / presupuestoMensual) * 100, 100);
    const barraEstado = document.getElementById('barra-estado');
    const textoEstado = document.getElementById('texto-estado');
    
    if (barraEstado && textoEstado) {
        barraEstado.style.width = `${porcentaje}%`;
        if (porcentaje >= 90) {
            barraEstado.className = "bg-red-500 h-3 rounded-full";
            textoEstado.textContent = "Alerta: Presupuesto en riesgo.";
            textoEstado.classList.add("text-red-500");
        } else {
            barraEstado.className = "bg-teal h-3 rounded-full";
            textoEstado.textContent = "Presupuesto saludable.";
            textoEstado.classList.remove("text-red-500");
        }
    }
}

function renderizarUltimosMovimientos(gastos) {
    const contenedor = document.getElementById('lista-movimientos');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    if (gastos.length === 0) {
        contenedor.innerHTML = '<p class="text-gray-500">No hay movimientos este mes.</p>';
        return;
    }

    const ultimosGastos = gastos.slice().reverse();

    ultimosGastos.forEach(gasto => {
        let nombreCategoria = 'Sin Categoría';
        if (gasto.categoria) {
            nombreCategoria = typeof gasto.categoria === 'object' ? (gasto.categoria.nombre || 'Categoría') : gasto.categoria;
        }

        const div = document.createElement('div');
        div.className = 'flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 neu-shadow-sm mb-3';
        div.innerHTML = `
            <div>
                <h4 class="font-bold text-gray-700">${gasto.concepto}</h4>
                <p class="text-xs text-gray-400">${gasto.fecha}</p>
            </div>
            <div class="text-right">
                <h4 class="font-bold text-teal">€ ${parseFloat(gasto.importe).toFixed(2)}</h4>
                <p class="text-xs text-gray-400">${nombreCategoria}</p>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

function renderizarGrafico(gastos) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const gastosPorCategoria = {};
    gastos.forEach(gasto => {
        let nombreCat = gasto.categoria && gasto.categoria.nombre ? gasto.categoria.nombre : 'Otros';
        gastosPorCategoria[nombreCat] = (gastosPorCategoria[nombreCat] || 0) + parseFloat(gasto.importe);
    });

    if (window.miGrafico) {
        window.miGrafico.destroy();
    }

    window.miGrafico = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(gastosPorCategoria),
            datasets: [{
                data: Object.values(gastosPorCategoria),
                backgroundColor: ['#20B2AA', '#FF7F50', '#FFD700', '#4682B4', '#9370DB', '#808080'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
            }
        }
    });
}