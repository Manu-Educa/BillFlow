const API_URL = 'http://localhost:8081/api';

document.addEventListener("DOMContentLoaded", () => {
    configurarPerfilUsuario();
    configurarMenuPerfil();
    cargarGastos();
    configurarModal();
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

async function cargarGastos() {
    try {
        const respuesta = await fetch(`${API_URL}/gastos`);
        if (!respuesta.ok) throw new Error('Error al obtener gastos');
        
        const gastos = await respuesta.json();
        renderizarTablaGastos(gastos);
    } catch (error) {
        const tabla = document.getElementById('tabla-gastos');
        if (tabla) {
            tabla.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-500">Error conectando con la base de datos</td></tr>`;
        }
    }
}

function renderizarTablaGastos(gastos) {
    const tabla = document.getElementById('tabla-gastos');
    if (!tabla) return;
    tabla.innerHTML = '';

    if (gastos.length === 0) {
        tabla.innerHTML = `<tr><td colspan="5" class="text-center p-8 text-gray-500">No hay gastos registrados.</td></tr>`;
        return;
    }

    gastos.reverse().forEach(gasto => {
        let nombreCategoria = 'Sin Categoría';
        if (gasto.categoria) {
            nombreCategoria = typeof gasto.categoria === 'object' ? (gasto.categoria.nombre || 'Categoría') : gasto.categoria;
        }

        const fila = document.createElement('tr');
        fila.className = 'hover:bg-gray-50 transition';
        fila.innerHTML = `
            <td class="p-4 font-semibold text-gray-700">${gasto.concepto}</td>
            <td class="p-4"><span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">${nombreCategoria}</span></td>
            <td class="p-4 text-sm text-gray-500">${gasto.fecha || new Date().toLocaleDateString()}</td>
            <td class="p-4 text-right font-bold text-teal">€ ${parseFloat(gasto.importe).toFixed(2)}</td>
            <td class="p-4 text-center">
                <button class="text-coral hover:text-red-600 transition p-1" onclick="eliminarGasto(${gasto.id})">
                    <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function configurarModal() {
    const modal = document.getElementById('modal-gasto');
    const btnNuevo = document.getElementById('btn-nuevo-gasto');
    const btnCancelar = document.getElementById('btn-cancelar');
    const form = document.getElementById('form-gasto');

    if (!modal || !btnNuevo || !btnCancelar || !form) return;

    btnNuevo.addEventListener('click', () => {
        document.getElementById('gasto-fecha').valueAsDate = new Date();
        modal.classList.remove('hidden');
    });

    btnCancelar.addEventListener('click', () => {
        modal.classList.add('hidden');
        form.reset();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const idUsuario = localStorage.getItem('usuarioId') || 1;

        const nuevoGasto = {
            concepto: document.getElementById('gasto-concepto').value,
            importe: parseFloat(document.getElementById('gasto-cantidad').value),
            fecha: document.getElementById('gasto-fecha').value,
            categoria: {
                id: parseInt(document.getElementById('gasto-categoria').value)
            },
            usuario: {
                id: parseInt(idUsuario)
            }
        };

        try {
            const respuesta = await fetch(`${API_URL}/gastos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoGasto)
            });

            if (respuesta.ok) {
                modal.classList.add('hidden');
                form.reset();
                cargarGastos();
            } else {
                alert('Error al guardar el gasto en la base de datos.');
            }
        } catch (error) {
            alert('Error de conexión con el servidor.');
        }
    });
}

async function eliminarGasto(id) {
    if (!confirm('¿Seguro que quieres eliminar este gasto?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/gastos/${id}`, {
            method: 'DELETE'
        });

        if (respuesta.ok) {
            cargarGastos();
        } else {
            alert('Error al eliminar');
        }
    } catch (error) {
        alert('Error de conexión');
    }
}