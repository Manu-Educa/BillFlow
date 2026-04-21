const API_URL = 'http://localhost:8081/api';
let chartGastos = null;

document.addEventListener("DOMContentLoaded", () => {
    obtenerDatosDelServidor();
});

async function obtenerDatosDelServidor() {
    try {
        const respuesta = await fetch(`${API_URL}/gastos`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!respuesta.ok) throw new Error('Error en la respuesta del servidor');

        const gastos = await respuesta.json();
        procesarDashboard(gastos);

    } catch (error) {
        console.error("Fallo de conexión:", error);
        document.getElementById('lista-movimientos').innerHTML =
            '<p class="text-red-500 text-sm">Error al conectar con la base de datos. Verifique que el backend esté en ejecución.</p>';
    }
}

function procesarDashboard(gastos) {
    if (!gastos || gastos.length === 0) {
        document.getElementById('lista-movimientos').innerHTML = '<p class="text-gray-500">No hay movimientos registrados.</p>';
        return;
    }

    const totalGastado = gastos.reduce((suma, gasto) => suma + parseFloat(gasto.cantidad), 0);
    const limitePresupuesto = 1500.00;
    const balanceRestante = limitePresupuesto - totalGastado;

    document.getElementById('gasto-total').textContent = `€ ${totalGastado.toFixed(2)}`;
    document.getElementById('presupuesto-restante').textContent = `€ ${balanceRestante.toFixed(2)}`;

    actualizarSemaforo(totalGastado, limitePresupuesto);
    renderizarLista(gastos);
    generarGrafico(gastos);
}

function actualizarSemaforo(gastado, limite) {
    const porcentaje = Math.min((gastado / limite) * 100, 100);
    const barra = document.getElementById('barra-estado');
    const texto = document.getElementById('texto-estado');

    barra.style.width = `${porcentaje}%`;

    if (porcentaje < 70) {
        barra.className = 'bg-teal h-3 rounded-full';
        texto.textContent = 'Estado óptimo. Presupuesto controlado.';
    } else if (porcentaje < 90) {
        barra.className = 'bg-yellow-400 h-3 rounded-full';
        texto.textContent = 'Atención. Acercándose al límite de gastos.';
    } else {
        barra.className = 'bg-coral h-3 rounded-full';
        texto.textContent = 'Alerta. Presupuesto excedido o en riesgo.';
    }
}

function renderizarLista(gastos) {
    const contenedor = document.getElementById('lista-movimientos');
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
    const categorias = gastos.reduce((acc, gasto) => {
        acc[gasto.categoria] = (acc[gasto.categoria] || 0) + parseFloat(gasto.cantidad);
        return acc;
    }, {});

    const ctx = document.getElementById('categoryChart').getContext('2d');

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