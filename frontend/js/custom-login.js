document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const valorNombre = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:8081/api/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        nombre: valorNombre, 
                        password: password 
                    })
                });

                if (response.ok) {
                    // Extraemos los datos del usuario para obtener su ID
                    try {
                        const data = await response.json();
                        if (data && data.id) {
                            localStorage.setItem('usuarioId', data.id);
                        } else {
                            localStorage.setItem('usuarioId', 1); // Respaldo por seguridad
                        }
                    } catch(e) {
                        localStorage.setItem('usuarioId', 1); // Respaldo si el backend devuelve texto
                    }
                    
                    localStorage.setItem('usuarioNombre', valorNombre);
                    window.location.href = "index.html";
                } else {
                    alert("Credenciales inválidas.");
                }
            } catch (error) {
                alert("Error de conexión.");
            }
        });
    }
});