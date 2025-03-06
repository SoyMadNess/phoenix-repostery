// Validación de los formularios
(function () {
    'use strict'

    var forms = document.querySelectorAll('.needs-validation')

    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
})();

// Función para verificar si el usuario está autenticado
function isUserLoggedIn() {
    return !!localStorage.getItem('user');
}

// Lógica del carrito
let cart = [];
let cartCount = 0;

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        // Verificar si el usuario está autenticado
        if (!isUserLoggedIn()) {
            Swal.fire({
                icon: 'warning',
                title: 'Inicia sesión',
                text: 'Debes iniciar sesión para agregar productos al carrito.',
                confirmButtonText: 'Iniciar Sesión',
                showCancelButton: true,
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'login.html';
                }
            });
            return;
        }

        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price'));

        Swal.fire({
            title: 'Cantidad',
            input: 'number',
            inputAttributes: {
                min: 1,
                step: 1
            },
            inputValue: 1,
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const quantity = parseInt(result.value);
                const existingProduct = cart.find(item => item.name === productName);
                if (existingProduct) {
                    existingProduct.quantity = quantity; // Mantener la cantidad definida por el usuario
                } else {
                    cart.push({ name: productName, price: productPrice, quantity: quantity });
                }

                cartCount = cart.length;
                updateCartUI();
            }
        });
    });
});

document.getElementById('logout-btn')?.addEventListener('click', function () {
    Cookies.remove('user', { path: '/' }); // Elimina la cookie
    Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión exitosamente.',
    }).then(() => {
        window.location.replace('index.html'); // Redirigir al inicio
    });
    cart = []; // Vaciar el carrito al cerrar sesión
    updateCartUI();
});

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total-amount');

    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-2');
        cartItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    cartCountElement.textContent = cart.length;
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'Tu carrito está vacío. Agrega productos antes de reservar.',
        });
        return;
    }

    if (!isUserLoggedIn()) {
        Swal.fire({
            icon: 'warning',
            title: 'Inicia sesión',
            text: 'Debes iniciar sesión para realizar una reserva.',
            confirmButtonText: 'Iniciar Sesión',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'login.html';
            }
        });
        return;
    }

    window.location.href = '#reservas';
    document.getElementById('fecha').focus();
});

document.getElementById('registroForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombreRegistro').value;
    const email = document.getElementById('emailRegistro').value;
    const password = document.getElementById('passwordRegistro').value;
    const confirmPassword = document.getElementById('confirmPasswordRegistro').value;

    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden.',
        });
        return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe tener al menos 6 caracteres, una letra y un número.',
        });
        return;
    }

    const userData = { nombre, email, password };
    localStorage.setItem('user', JSON.stringify(userData));

    Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión.',
    }).then(() => {
        window.location.replace('login.html');
    });
});

document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;

    const userCookie = localStorage.getItem('user');
    if (!userCookie) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay usuarios registrados.',
        });
        return;
    }

    const userData = JSON.parse(userCookie);

    if (userData.email === email && userData.password === password) {
        Cookies.set('user', JSON.stringify(userData), { expires: 7, path: '/' });
        Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: 'Bienvenido de nuevo.',
        }).then(() => {
            window.location.replace('index.html'); // Redirigir al inicio
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Email o contraseña incorrectos.',
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const products = [
        { name: "Pastel de Chocolate", price: 20 },
        { name: "Cupcakes", price: 15 },
        { name: "Galletas Caseras", price: 10 },
        { name: "Tarta de Frutas", price: 25 },
        { name: "Muffins", price: 12 },
        { name: "Pastel de Fresa", price: 22 },
        { name: "Brownies", price: 18 },
        { name: "Tarta de Queso", price: 20 },
        { name: "Macarrones", price: 15 },
        { name: "Tarta de Limón", price: 23 }
    ];

    const tipoPostreSelect = document.getElementById('tipoPostre');
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name; // Solo mostrar el nombre del producto
        tipoPostreSelect.appendChild(option);
    });

    const navLogin = document.getElementById("nav-login");
    const navRegister = document.getElementById("nav-register");
    const navUser = document.getElementById("nav-user");
    const logoutBtn = document.getElementById("logout-btn");
    const responsiveAuth = document.getElementById("responsive-auth");
    const responsiveUser = document.getElementById("responsive-user");
    const responsiveUsername = document.getElementById("responsive-username");
    const responsiveLogoutBtn = document.getElementById("responsive-logout-btn");

    // Verificar sesión mediante cookies
    const userCookie = Cookies.get('user');
    const usuario = userCookie ? JSON.parse(userCookie).nombre : null;

    if (usuario) {
        navLogin.style.display = "none";
        navRegister.style.display = "none";
        navUser.style.display = "block";
        document.getElementById("username").textContent = usuario;

        // Show user in responsive version
        responsiveAuth.querySelector("a[href='login.html']").classList.add("d-none");
        responsiveAuth.querySelector("a[href='registro.html']").classList.add("d-none");
        responsiveUser.classList.remove("d-none");
        responsiveUsername.textContent = usuario;
    } else {
        navLogin.style.display = "block";
        navRegister.style.display = "block";
        navUser.style.display = "none";

        // Show login/register in responsive version
        responsiveAuth.querySelector("a[href='login.html']").classList.remove("d-none");
        responsiveAuth.querySelector("a[href='registro.html']").classList.remove("d-none");
        responsiveUser.classList.add("d-none");
    }

    // Evento para cerrar sesión (mantiene datos en localStorage)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            Cookies.remove('user', { path: '/' }); // Elimina la cookie
            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión exitosamente.',
            }).then(() => {
                window.location.replace('index.html'); // Redirigir al inicio
            });
            cart = []; // Vaciar el carrito al cerrar sesión
            updateCartUI();
        });
    }

    if (responsiveLogoutBtn) {
        responsiveLogoutBtn.addEventListener("click", function () {
            Cookies.remove('user', { path: '/' }); // Elimina la cookie
            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión exitosamente.',
            }).then(() => {
                window.location.replace('index.html'); // Redirigir al inicio
            });
            cart = []; // Vaciar el carrito al cerrar sesión
            updateCartUI();
        });
    }

    // No se podrá agendar una fecha anterior a la actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha')?.setAttribute('min', today);
    document.getElementById('fechaEntrega')?.setAttribute('min', today);
});

document.getElementById('reservaForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
    
    if (!isUserLoggedIn()) {
        Swal.fire({
            icon: 'warning',
            title: 'Inicia sesión',
            text: 'Debes iniciar sesión para realizar una reserva.',
            confirmButtonText: 'Iniciar Sesión',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'login.html';
            }
        });
        return;
    }

    if (cart.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'Tu carrito está vacío. Agrega productos antes de reservar.',
        });
        return;
    }

    if (!this.checkValidity()) {
        event.stopPropagation();
        this.classList.add('was-validated');
        return;
    }

    const telefono = document.getElementById('telefonoReserva').value;
    const fecha = document.getElementById('fecha').value;
    const comentarios = document.getElementById('comentariosReserva').value;

    // Validate the year
    const currentYear = new Date().getFullYear();
    const selectedYear = new Date(fecha).getFullYear();
    if (selectedYear < currentYear || selectedYear > currentYear + 2) {
        Swal.fire({
            icon: 'error',
            title: 'Fecha inválida',
            text: 'La fecha de entrega debe estar dentro de los próximos 2 años.',
        });
        return;
    }

    // Get user details
    const user = JSON.parse(localStorage.getItem('user'));
    const nombreUsuario = user.nombre;
    const emailUsuario = user.email;

    // Show reservation details in the modal
    document.getElementById('modalTelefono').textContent = telefono;
    document.getElementById('modalFecha').textContent = fecha;
    document.getElementById('modalComentarios').textContent = comentarios;
    document.getElementById('modalUserName').textContent = nombreUsuario;
    document.getElementById('modalUserEmail').textContent = emailUsuario;

    const modalProductos = document.getElementById('modalProductos');
    modalProductos.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;
        modalProductos.appendChild(li);
        total += item.price * item.quantity;
    });
    document.getElementById('modalTotal').textContent = total.toFixed(2);

    const reservationModal = new bootstrap.Modal(document.getElementById('reservationModal'));
    reservationModal.show();

    Swal.fire({
        icon: 'success',
        title: 'Reserva Confirmada',
        text: 'Tu reserva ha sido confirmada exitosamente.',
    }).then(() => {
        this.reset();
        this.classList.remove('was-validated');
    });
});

document.getElementById('pedidoForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        event.stopPropagation();
        this.classList.add('was-validated');
        return;
    }

    const tipoPostre = document.getElementById('tipoPostre').value;
    const saborPostre = document.getElementById('saborPostre').value;
    const decoracion = document.getElementById('decoracion').value;
    const fechaEntrega = document.getElementById('fechaEntrega').value;
    const direccionEntrega = document.getElementById('direccionEntrega').value;
    const telefonoContacto = document.getElementById('telefonoContacto').value;

    Swal.fire({
        icon: 'success',
        title: 'Solicitud Enviada',
        text: 'Tu solicitud de pedido personalizado ha sido enviada exitosamente.',
    }).then(() => {
        this.reset();
        this.classList.remove('was-validated');
    });
});

document.getElementById('contactoForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        event.stopPropagation();
        this.classList.add('was-validated');
        return;
    }

    const nombreContacto = document.getElementById('nombreContacto').value;
    const emailContacto = document.getElementById('emailContacto').value;
    const asunto = document.getElementById('asunto').value;
    const mensaje = document.getElementById('mensaje').value;

    Swal.fire({
        icon: 'success',
        title: 'Mensaje Enviado',
        text: 'Tu mensaje ha sido enviado exitosamente.',
    }).then(() => {
        this.reset();
        this.classList.remove('was-validated');
    });
});

document.getElementById('telefonoReserva')?.addEventListener('input', function (event) {
    const input = event.target;
    const formattedValue = input.value.replace(/\D/g, '').replace(/(\d{4})(\d{4})/, '$1-$2');
    input.value = formattedValue;
    if (input.value.length !== 9) {
        input.setCustomValidity('Número de teléfono inválido. Debe contener exactamente 8 dígitos.');
    } else {
        input.setCustomValidity('');
    }
});

document.getElementById('telefonoContacto')?.addEventListener('input', function (event) {
    const input = event.target;
    const formattedValue = input.value.replace(/\D/g, '').replace(/(\d{4})(\d{4})/, '$1-$2');
    input.value = formattedValue;
    if (input.value.length !== 9) {
        input.setCustomValidity('Número de teléfono inválido. Debe contener exactamente 8 dígitos.');
    } else {
        input.setCustomValidity('');
    }
});

window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 1000);
});