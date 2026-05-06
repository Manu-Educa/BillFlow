document.addEventListener("DOMContentLoaded", () => {
    cargarPresupuestoActual();
    cargarFamilia();
    configurarEventos();
});

function configurarEventos() {
    const formPresupuesto = document.getElementById('form-presupuesto');
    const formIngreso = document.getElementById('form-ingreso');

    if (formPresupuesto) {
        formPresupuesto.addEventListener('submit', (e) => {
            e.preventDefault();
            const limite = document.getElementById('input-limite').value;
            localStorage.setItem('limitePresupuesto', limite);
            alert('Presupuesto familiar actualizado.');
        });
    }

    if (formIngreso) {
        formIngreso.addEventListener('submit', (e) => {
            e.preventDefault();
            const miembro = document.getElementById('input-miembro').value;
            const nomina = document.getElementById('input-nomina').value;
            
            const familia = JSON.parse(localStorage.getItem('familiaBillFlow')) || [];
            familia.push({ nombre: miembro, nomina: parseFloat(nomina) });
            localStorage.setItem('familiaBillFlow', JSON.stringify(familia));
            
            formIngreso.reset();
            cargarFamilia();
        });
    }
}

function cargarPresupuestoActual() {
    const limiteGuardado = localStorage.getItem('limitePresupuesto');
    if (limiteGuardado) {
        document.getElementById('input-limite').value = limiteGuardado;
    }
}

function cargarFamilia() {
    const contenedor = document.getElementById('lista-familia');
    const totalElement = document.getElementById('total-ingresos');
    const familia = JSON.parse(localStorage.getItem('familiaBillFlow')) || [];
    
    contenedor.innerHTML = '';
    let total = 0;

    if (familia.length === 0) {
        contenedor.innerHTML = '<p class="text-sm text-gray-400">Aún no hay ingresos familiares registrados.</p>';
    } else {
        familia.forEach((miembro, index) => {
            total += miembro.nomina;
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
            div.innerHTML = `
                <span class="font-medium text-gray-700">${miembro.nombre}</span>
                <div class="flex items-center space-x-4">
                    <span class="font-bold text-teal">€ ${miembro.nomina.toFixed(2)}</span>
                    <button onclick="eliminarMiembro(${index})" class="text-red-400 hover:text-red-600">✕</button>
                </div>
            `;
            contenedor.appendChild(div);
        });
    }
    
    totalElement.textContent = `€ ${total.toFixed(2)}`;
}

window.eliminarMiembro = function(index) {
    const familia = JSON.parse(localStorage.getItem('familiaBillFlow')) || [];
    familia.splice(index, 1);
    localStorage.setItem('familiaBillFlow', JSON.stringify(familia));
    cargarFamilia();
}