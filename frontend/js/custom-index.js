const API_URL = 'http://localhost:8081/api';
let chartGastos = null;

document.addEventListener("DOMContentLoaded", () => {
    configurarPerfilUsuario();
    obtenerDatosDelServidor();
});

function configurarPerfilUsuario() {
    const nombreGuardado = localStorage.getItem('usuarioNombre');
    const displayNombre = document.getElementById('display-nombre');
    const displayIniciales = document.getElementById('display-iniciales');

    if (nombreGuardado) {
        if (displayNombre) displayNombre.textContent = nombreGuardado;
        if (displayIniciales) displayIniciales.textContent = nombreGuardado.substring(0, 2).toUpperCase();
    }
}

async function obtenerDatosDelServidor() {
    try {
        const respuesta = await fetch(`${API_URL}/gastos`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!respuesta.ok) throw new Error('Error en la respuesta del servidor');

        const gastos = await respuesta.json();
        procesarDashboard(gastos);

    } catch (error) {
        console.error("Fallo de conexión:", error);
        const contenedorLista = document.getElementById('lista-movimientos');
        if (contenedorLista) {
            contenedorLista.innerHTML = '<p class="text-red-500 text-sm">Error al conectar con la base de datos.</p>';
        }
    }
}

function procesarDashboard(gastos) {
    if (!gastos || gastos.length === 0) {
        const contenedorLista = document.getElementById('lista-movimientos');
        if (contenedorLista) contenedorLista.innerHTML = '<p class="text-gray-500">No hay movimientos registrados.</p>';
        return;
    }

    const totalGastado = gastos.reduce((suma, gasto) => suma + parseFloat(gasto.cantidad), 0);
    const limitePresupuesto = 1500.00;
    const balanceRestante = limitePresupuesto - totalGastado;

    const elGastoTotal = document.getElementById('gasto-total');
    const elPresupuestoRestante = document.getElementById('presupuesto-restante');

    if (elGastoTotal) elGastoTotal.textContent = `€ ${totalGastado.toFixed(2)}`;
    if (elPresupuestoRestante) elPresupuestoRestante.textContent = `€ ${balanceRestante.toFixed(2)}`;

    actualizarSemaforo(totalGastado, limitePresupuesto);
    renderizarLista(gastos);
    generarGrafico(gastos);
}

function actualizarSemaforo(gastado, limite) {
    const porcentaje = Math.min((gastado / limite) * 100, 100);
    const barra = document.getElementById('barra-estado');
    const texto = document.getElementById('texto-estado');

    if (barra) {
        barra.style.width = `${porcentaje}%`;
        if (porcentaje < 70) {
            barra.className = 'bg-teal h-3 rounded-full';
            if (texto) texto.textContent = 'Estado óptimo. Presupuesto controlado.';
        } else if (porcentaje < 90) {
            barra.className = 'bg-yellow-400 h-3 rounded-full';
            if (texto) texto.textContent = 'Atención. Acercándose al límite de gastos.';
        } else {
            barra.className = 'bg-coral h-3 rounded-full';
            if (texto) texto.textContent = 'Alerta. Presupuesto excedido o en riesgo.';
        }
    }
}

function renderizarLista(gastos) {
    const contenedor = document.getElementById('lista-movimientos');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    const recientes = gastos.slice(-5).reverse();

    recientes.forEach(gasto => {
        const fila = document.createElement('div');
        fila.className = 'flex items-center justify-between p-3 border-b border-gray-100';
        fila.innerHTML = `
            <div>
                <p class="font-semibold text-gray-700">${gasto.concepto}</p>
                <p class="text-xs text-gray-400">${gasto.fecha_gasto}</p>
            </div>
            <div class="text-right">
                <p class="font-bold text-teal">€ ${parseFloat(gasto.cantidad).toFixed(2)}</p>
                <p class="text-xs text-gray-500">${gasto.categoria}</p>
            </div>
        `;
        contenedor.appendChild(fila);
    });
}

function generarGrafico(gastos) {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;

    const categorias = gastos.reduce((acc, gasto) => {
        acc[gasto.categoria] = (acc[gasto.categoria] || 0) + parseFloat(gasto.cantidad);
        return acc;
    }, {});

    const ctx = canvas.getContext('2d');
    if (chartGastos) chartGastos.destroy();

    chartGastos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categorias),
            datasets: [{
                data: Object.values(categorias),
                backgroundColor: ['#20B2AA', '#FF7F50', '#FACC15', '#3B82F6']
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    configurarPerfilUsuario();
    obtenerDatosDelServidor();
    configurarMenuPerfil();
});

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