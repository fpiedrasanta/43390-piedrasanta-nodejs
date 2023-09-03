const socket = io(); // Conexión con el servidor

document.getElementById('product_form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const _id = document.getElementById('_id').value;

    const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value
    };

    if(_id == 0) {
        socket.emit('new_product', data);
    } else {
        data._id = _id;
        socket.emit('edit_product', data);
    }
});

socket.on('new_product_success', data => {
    document.getElementById('_id').value = "0";
    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
    document.getElementById('price').value = "0";
    document.getElementById('thumbnail').value = "";
    document.getElementById('code').value = "";
    document.getElementById('stock').value = "1";

    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmationButton: false,
        timer: 2000,
        title: `El producto se guardó con éxito. Puede cargar uno nuevo`,
        icon:'success'
    });
});

socket.on('edit_product_success', data => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmationButton: false,
        timer: 2000,
        title: `El producto se editó con éxito. Puede continuar editandolo.`,
        icon:'success'
    });
});