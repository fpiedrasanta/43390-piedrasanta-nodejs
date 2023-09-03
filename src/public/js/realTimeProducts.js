const socket = io();

socket.emit('loaded', { success: true });

socket.on ('new_product', data => {
    let productList = document.getElementById("product_list");
    
    const file = `
        <tr id=product_${data._id}>
            <td style="vertical-align: middle;">${data.title}</td>
            <td style="vertical-align: middle;">${data.description}</td>
            <td style="vertical-align: middle;">$${data.price}</td>
            <td>
                <button  onclick="deleteProduct(${data._id})" class="btn btn-danger eliminar"><i class="fa fa-trash"></i></button>
                <button class="btn btn-primary editar"><i class="fa fa-pencil"></i></button>
            </td>
        </tr>
    `;
    
    $("#product_list").append(file);

    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmationButton: false,
        timer: 2000,
        title: `Se agregó el producto ${data.title}, con un precio de $${data.price}.`,
        icon:'success'
    });
});

socket.on ('edit_product', data => {
    let product = document.getElementById("product_" + data._id);
    
    product.innerHTML = `
        <td style="vertical-align: middle;">${data.title}</td>
        <td style="vertical-align: middle;">${data.description}</td>
        <td style="vertical-align: middle;">$${data.price}</td>
        <td>
            <button class="btn btn-danger eliminar"><i class="fa fa-trash"></i></button>
            <button class="btn btn-primary editar"><i class="fa fa-pencil"></i></button>
        </td>`;

    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmationButton: false,
        timer: 2000,
        title: `Se editó el producto ${data.title}, con un precio de $${data.price}.`,
        icon:'success'
    });
});

socket.on ('delete_product', data => {
    let productList = document.getElementById("product_list");
    let product = document.getElementById("product_" + data._id);
    
    productList.removeChild(product);

    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmationButton: false,
        timer: 2000,
        title: `El producto se eliminó con éxito`,
        icon:'success'
    });
});

function deleteProduct(id) {
    socket.emit('delete_product', { _id: id });
}