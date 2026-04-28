const API_URL = 'http://localhost:8081/api';

document.addEventListener("DOMContentLoaded", () => {
    configurarPerfilUsuario();
    configurarMenuPerfil();
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

async function cargarDatosDashboard() {
    try {
        const respuesta = await fetch(`${API_URL}/gastos`);
        if (!respuesta.ok) throw new Error('Error al obtener gastos');
        
        const gastos = await respuesta.json();
        
        renderizarTarjetas(gastos);
        renderizarUltimosMovimientos(gastos);
        renderizarGrafico(gastos);
    } catch (error) {
        const contenedor = document.getElementById('lista-movimientos');
        if (contenedor) {
            contenedor.innerHTML = `<p class="text-red-500">Error al cargar los datos del servidor.</p>`;
        }
    }
}

function renderizarTarjetas(gastos) {
    // Calcular el total sumando el 'importe' de cada gasto
    const totalGasto = gastos.reduce((suma, gasto) => suma + (parseFloat(gasto.importe) || 0), 0);
    
    // Supongamos un presupuesto fijo para el ejemplo (luego lo puedes traer de la BD)
    const presupuestoMensual = 1500;
    const restante = presupuestoMensual - totalGasto;
    
    // Actualizar HTML
    document.getElementById('gasto-total').textContent = `€ ${totalGasto.toFixed(2)}`;
    document.getElementById('presupuesto-restante').textContent = `€ ${restante.toFixed(2)}`;
    
    // Barra de estado
    const porcentaje = Math.min((totalGasto / presupuestoMensual) * 100, 100);
    const barraEstado = document.getElementById('barra-estado');
    const textoEstado = document.getElementById('texto-estado');
    
    barraEstado.style.width = `${porcentaje}%`;
    
    if (porcentaje >= 90) {
        barraEstado.className = "bg-red-500 h-3 rounded-full";
        textoEstado.textContent = "Alerta: Presupuesto en riesgo o excedido.";
        textoEstado.classList.add("text-red-500");
    } else {
        barraEstado.className = "bg-teal h-3 rounded-full";
        textoEstado.textContent = "Presupuesto saludable.";
        textoEstado.classList.remove("text-red-500");
    }
}

function renderizarUltimosMovimientos(gastos) {
    const contenedor = document.getElementById('lista-movimientos');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';

    if (gastos.length === 0) {
        contenedor.innerHTML = '<p class="text-gray-500">No hay movimientos registrados.</p>';
        return;
    }

    // Tomar solo los últimos 5 gastos
    const ultimosGastos = gastos.slice().reverse().slice(0, 5);

    ultimosGastos.forEach(gasto => {
        // Extraer el nombre de la categoría evitando el [object Object]
        let nombreCategoria = 'Sin Categoría';
        if (gasto.categoria) {
            nombreCategoria = typeof gasto.categoria === 'object' ? (gasto.categoria.nombre || 'Categoría') : gasto.categoria;
        }

        const div = document.createElement('div');
        div.className = 'flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 neu-shadow-sm mb-3';
        div.innerHTML = `
            <div>
                <h4 class="font-bold text-gray-700">${gasto.concepto}</h4>
                <p class="text-xs text-gray-400">${gasto.fecha || new Date().toLocaleDateString()}</p>
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

    // Agrupar los gastos por nombre de categoría
    const gastosPorCategoria = {};
    gastos.forEach(gasto => {
        let nombreCat = gasto.categoria && gasto.categoria.nombre ? gasto.categoria.nombre : 'Otros';
        gastosPorCategoria[nombreCat] = (gastosPorCategoria[nombreCat] || 0) + parseFloat(gasto.importe);
    });

    // Destruir el gráfico anterior si existe para que no se superpongan al recargar
    if (window.miGrafico) {
        window.miGrafico.destroy();
    }

    window.miGrafico = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(gastosPorCategoria),
            datasets: [{
                data: Object.values(gastosPorCategoria),
                backgroundColor: [
                    '#20B2AA', // teal
                    '#FF7F50', // coral
                    '#FFD700', // yellow
                    '#4682B4', // blue
                    '#9370DB', // purple
                    '#808080'  // gray
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { size: 10 } }
                }
            }
        }
    });
}