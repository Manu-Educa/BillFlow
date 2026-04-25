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