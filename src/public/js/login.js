const frmLogin = document.getElementById("frm_login");
const message = document.getElementById("message");

frmLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userName = document.getElementById("txt_nombre");
    const password = document.getElementById("txt_password");

    const data = {
        userName: userName.value, 
        password: password.value
    };

    const response = await fetch('http://localhost:8080/api/users/auth', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json'
        }
    });

    const result = await response.json();

    if(response.status !== 200) {
        message.innerHTML = 
            "<div class='alert alert-danger' role='alert'> " +
            "    ¡Nombre de usuario o contraseña incorrecto " +
            "</div>";
    } else {
        message.innerHTML = "";
        window.location.replace('/');
    }
});