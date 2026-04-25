document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const valorNombre = document.getElementById('regUser').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPass').value;
            const confirmPassword = document.getElementById('regPassConfirm').value;

            if (password !== confirmPassword) {
                alert("Error: Las contraseñas no coinciden.");
                return;
            }

            const datosUsuario = {
                nombre: valorNombre,
                email: email,
                password: password,
                apellidos: "",
                rol: "USUARIO",
                telefono: "",
                nomina: 0,
                id_grupo: null
            };

            try {
                const response = await fetch('http://localhost:8081/api/usuarios/registrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosUsuario)
                });

                if (response.ok) {
                    alert("Usuario registrado correctamente.");
                    window.location.href = "login.html";
                } else {
                    const errorMsg = await response.text();
                    alert("Error en el servidor: " + errorMsg);
                }
            } catch (error) {
                alert("Error de conexión con el servidor.");
            }
        });
    }
});