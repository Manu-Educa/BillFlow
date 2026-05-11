const API_URL = 'http://localhost:8081/api';

document.addEventListener("DOMContentLoaded", () => {
    cargarSuscripciones();
    configurarModalSuscripcion();
});

async function cargarSuscripciones() {
    try {
        const respuesta = await fetch(`${API_URL}/gastos-fijos`);
        if (!respuesta.ok) throw new Error('Fallo de red');
        const suscripciones = await respuesta.json();
        renderizarSuscripciones(suscripciones);
    } catch (error) {
        document.getElementById('contenedor-suscripciones').innerHTML = `<p class="text-red-500">Error cargando suscripciones.</p>`;
    }
}

function obtenerEnlaceExterno(concepto) {
    const nombre = concepto.toLowerCase();
    if (nombre.includes('amazon') || nombre.includes('prime')) return 'https://www.amazon.es/mc';
    if (nombre.includes('netflix')) return 'https://www.netflix.com/YourAccount';
    if (nombre.includes('spotify')) return 'https://www.spotify.com/account/overview/';
    if (nombre.includes('disney')) return 'https://www.disneyplus.com/account';
    if (nombre.includes('hbo') || nombre.includes('max')) return 'https://auth.max.com/subscription';
    if (nombre.includes('apple')) return 'https://reportaproblem.apple.com/';
    if (nombre.includes('youtube')) return 'https://www.youtube.com/paid_memberships';
    return null;
}

function renderizarSuscripciones(suscripciones) {
    const contenedor = document.getElementById('contenedor-suscripciones');
    contenedor.innerHTML = '';

    if (suscripciones.length === 0) {
        contenedor.innerHTML = '<p class="text-gray-500 col-span-3">No tienes suscripciones fijas registradas.</p>';
        return;
    }

    suscripciones.forEach(sus => {
        const alertaHTML = calcularAlertaDias(sus.diaCobro);
        const enlaceExterno = obtenerEnlaceExterno(sus.concepto);

        let botonesHTML = `<button onclick="cancelarSuscripcion(${sus.id})" class="text-sm px-4 py-2 bg-red-50 text-coral hover:bg-red-100 rounded-lg font-medium transition">Borrar de BillFlow</button>`;

        if (enlaceExterno) {
            botonesHTML = `<a href="${enlaceExterno}" target="_blank" class="text-sm px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition mr-2">Gestionar Suscripción</a>` + botonesHTML;
        }

        const div = document.createElement('div');
        div.className = 'bg-white rounded-2xl p-6 neu-shadow border border-gray-100 relative';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-bold text-gray-800">${sus.concepto}</h3>
                    <p class="text-sm text-gray-500">Se cobra el día ${sus.diaCobro} de cada mes</p>
                </div>
                <span class="text-2xl font-bold text-teal">${parseFloat(sus.importe).toFixed(2)} €</span>
            </div>
            ${alertaHTML}
            <div class="mt-6 flex justify-end">
                ${botonesHTML}
            </div>
        `;
        contenedor.appendChild(div);
    });
}

function calcularAlertaDias(diaCobro) {
    const hoy = new Date();
    const diaActual = hoy.getDate();
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    let diasRestantes;

    if (diaCobro >= diaActual) {
        diasRestantes = diaCobro - diaActual;
    } else {
        diasRestantes = (ultimoDiaMes - diaActual) + diaCobro;
    }

    if (diasRestantes <= 5) {
        const txt = diasRestantes === 0 ? '¡Hoy te cobran!' : `¡Faltan ${diasRestantes} días para el cobro!`;
        return `<div class="mt-3 bg-red-100 border border-red-200 text-red-600 text-sm font-bold px-3 py-2 rounded-lg animate-pulse flex items-center"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>${txt}</div>`;
    }
    return `<div class="mt-3 bg-green-50 text-green-600 text-sm px-3 py-2 rounded-lg">Pago lejano</div>`;
}

function configurarModalSuscripcion() {
    const modal = document.getElementById('modal-suscripcion');
    const btnNuevo = document.getElementById('btn-nueva-suscripcion');
    const btnCancelar = document.getElementById('btn-cancelar-sus');
    const form = document.getElementById('form-suscripcion');

    btnNuevo.addEventListener('click', () => modal.classList.remove('hidden'));
    btnCancelar.addEventListener('click', () => { modal.classList.add('hidden'); form.reset(); });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idUsuario = localStorage.getItem('usuarioId') || 1;
        const nuevaSus = {
            concepto: document.getElementById('sus-concepto').value,
            importe: parseFloat(document.getElementById('sus-importe').value),
            diaCobro: parseInt(document.getElementById('sus-dia').value),
            categoria: { id: parseInt(document.getElementById('sus-categoria').value) },
            usuario: { id: parseInt(idUsuario) }
        };

        try {
            const respuesta = await fetch(`${API_URL}/gastos-fijos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaSus)
            });
            if (respuesta.ok) {
                modal.classList.add('hidden');
                form.reset();
                cargarSuscripciones();
            }
        } catch (error) {
            alert('Error guardando la suscripción');
        }
    });
}

window.cancelarSuscripcion = async function(id) {
    if (!confirm('¿Seguro que quieres borrar este registro de tu BillFlow? (Ojo, esto no cancela tu servicio real)')) return;
    try {
        const respuesta = await fetch(`${API_URL}/gastos-fijos/${id}`, { method: 'DELETE' });
        if (respuesta.ok) cargarSuscripciones();
    } catch (error) {
        alert('Error al cancelar');
    }
};