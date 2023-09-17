const frmRegister = document.getElementById("frm_register");
const message = document.getElementById("message");

frmRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("txt_nombre");
    const apellido = document.getElementById("txt_apellido");
    const edad = document.getElementById("txt_edad");
    const email = document.getElementById("txt_email");
    const password = document.getElementById("txt_password");

    const data = {
        firstName: nombre.value, 
        lastName: apellido.value,
        email: email.value,
        age: edad.value,
        password: password.value
    };

    const response = await fetch('http://localhost:8080/api/users', {
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
            "    Algunos datos no son válidos " +
            "</div>";
    } else {
        window.location.replace('/');
    }
});