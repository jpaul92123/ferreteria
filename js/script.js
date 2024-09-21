(function ($) {
    "use strict";

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: {
                items: 2
            },
            576: {
                items: 3
            },
            768: {
                items: 4
            },
            992: {
                items: 5
            },
            1200: {
                items: 6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });

})(jQuery);


// CARGAR INFORMACION DEL JSON*******

let productos = []; // Lista global de productos

// Función para cargar los productos desde el JSON y unificarlos
function cargarProductos() {
    fetch('data/dbProductos.json')
        .then(response => response.json())
        .then(data => {
            // Recorrer las categorías y subcategorías para unificar todos los productos en un solo array
            Object.keys(data).forEach(categoria => {
                Object.keys(data[categoria]).forEach(subcategoria => {
                    productos = productos.concat(data[categoria][subcategoria].productos);
                });
            });
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
}

// Función para buscar productos
function buscarProducto() {
    const query = document.getElementById('buscador').value.toLowerCase();
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';

    if (query.trim() === '') {
        return; // Si el input está vacío, no mostrar resultados
    }

    // Filtrar productos que coincidan con la consulta
    const resultadosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query) ||
        (producto.tamaño && producto.tamaño.toLowerCase().includes(query)) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(query))
    );

    if (resultadosFiltrados.length === 0) {
        resultados.innerHTML = '<p>No se encontraron productos...</p>';
    } else {
        resultadosFiltrados.forEach(producto => {
            const nombreFormateado = encodeURIComponent(`Me interesa el producto ${producto.nombre}`);
            const whatsappLink = `https://wa.me/959984541?text=${nombreFormateado}`;

            const divProducto = document.createElement('div');
            divProducto.classList.add('producto');
            const imgElement = `<img src="${producto.imagen || 'default-image.jpg'}" alt="${producto.nombre}" onerror="imagenError(this)">`;
            divProducto.innerHTML = `
                ${imgElement}
                <div>
                    <strong>${producto.nombre}</strong>
                    <p>Tamaño: ${producto.tamaño || 'N/A'}</p>
                    <p>Descripción: ${producto.descripcion || 'N/A'}</p>
                    <strong>Precio: S/${producto.precio.toFixed(2)}</strong><br>
                    <a class="ver-producto whatsapp-link" href="${whatsappLink}" target="_blank">Comprar</a>
                </div>
            `;
            // Agregar evento de clic en la imagen
            divProducto.querySelector('img').addEventListener('click', function () {
                localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
                window.location.href = 'detalleProducto.html'; // Redirige a la página de detalles del producto
            });

            resultados.appendChild(divProducto);
        });
    }
}

// Cargar productos cuando se carga la página
window.onload = function () {
    cargarProductos();
};



// Función para crear el HTML de un producto
function createProductItem(product) {
    // Define el enlace de WhatsApp
    const nombreFormateado = encodeURIComponent(`Me interesa el producto ${product.nombre}`);
    const whatsappLink = `https://wa.me/959984541?text=${nombreFormateado}`;

    return `
            <div class=" gallery-item">
                <img src="${product.imagen || 'default-image.jpg'}" alt="${product.nombre}" onerror="imagenError(this)" class="img-producto" onclick="verDetalles('${encodeURIComponent(JSON.stringify(product))}')">
                <div class="">
                    <strong>${product.nombre}</strong>
                    <p>Tamaño: ${product.tamaño || 'N/A'}</p>
                    <strong style="color:red"> S/${product.precio.toFixed(2)}</strong><br>
                    <a class="ver-producto whatsapp-link" href="${whatsappLink}" target="_blank">Whatapp</a>
                </div>
            </div>
        `;
}
function verDetalles(productoEncoded) {
    const producto = JSON.parse(decodeURIComponent(productoEncoded));
    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
    window.location.href = '/detalleProducto.html'; // Redirige a la página de detalles del producto
}




/*********************************************************/

// MENU DESPLEGABLE PARA DE LAS CATEGORIAS CUANDO SE HACE SCROL
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.querySelector('.menu');
    const submenuToggle = document.querySelector('.has-submenu > a');
    const navbar = document.getElementById('navbar-scrol');
    let scrollCount = 0;
    let lastScrollY = 0;

    // Mostrar el navbar después de hacer scroll dos veces
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50 && window.innerWidth <= 976) {
            scrollCount++;
            if (scrollCount >= 2) {
                navbar.classList.add('show-navbar');
            }
        } else if (window.scrollY === 0) {
            navbar.classList.remove('show-navbar');
            scrollCount = 0;
        }

        // Cierra el menú si se hace scroll hacia arriba
        if (window.scrollY < lastScrollY && menu.classList.contains('showm')) {
            menu.classList.remove('showm');
        }

        lastScrollY = window.scrollY;
    });

    // Mostrar/ocultar el menú al hacer clic en el botón
    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('showm');
    });


});



// Función para cargar el JSON y aplicar la configuración del ícono
async function loadIcon() {
    const response = await fetch('/data/icono.json');
    const data = await response.json();
    const icono = data.icono;

    // Aplicar la imagen al ícono flotante
    document.getElementById('whatsapp-img').src = icono.imagen;

    // Configurar el evento de clic para redireccionar a WhatsApp
    document.getElementById('whatsapp-icon').onclick = function () {
        window.location.href = `https://wa.me/${icono.numero}`;
    };
}

// Llamar a la función al cargar la página
loadIcon();

//*************************************************** */
//
document.addEventListener('DOMContentLoaded', function () {
    fetch('/data/icono.json') // Asegúrate de que la ruta sea correcta
        .then(response => response.json())
        .then(data => {
            // Actualiza los elementos con la información del JSON
            const direccionSpan = document.getElementById('direccion');
            const correoSpan = document.getElementById('correo2');
            // const iconoImagen = document.getElementById('icono-imagen');
            const iconoNumero = document.getElementById('telefono');

            // Obtén el objeto icono del JSON
            const iconoData = data.icono;

            // Asigna los datos al HTML
            direccionSpan.textContent = iconoData.direccion;
            correoSpan.textContent = iconoData.correo;
            // iconoImagen.src = iconoData.imagen;
            iconoNumero.textContent = iconoData.telefono;
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
});



document.addEventListener('DOMContentLoaded', function () {
    buscarProducto();
    const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));


    if (producto) {
        // // Verifica que whatsappLink esté definido
        // const whatsappLink = producto.whatsappLink;
        // console.log('whatsappLink:', whatsappLink);

        // Cargar las imágenes del producto
        const carouselInner = document.getElementById('carousel-inner');
        carouselInner.innerHTML = `
            <div class="carousel-item active">
                <img class="w-100 h-100" src="${producto.imagen || 'default-image.jpg'}" alt="${producto.nombre}">
            </div>    
        `;

        // Cargar los detalles del producto
        const detalleProducto = document.getElementById('detalle-producto');
        detalleProducto.innerHTML = `
            <h3 class="font-weight-semi-bold" style="color:black">${producto.nombre}</h3>
            <div class="d-flex mb-3">
                <div class="text-primary mr-2">
                    <small class="fas fa-star"></small>
                    <small class="fas fa-star"></small>
                    <small class="fas fa-star"></small>
                    <small class="fas fa-star-half-alt"></small>
                    <small class="far fa-star"></small>
                </div>
                <small class="pt-1">(50 Reviews)</small>
            </div>
            <h3 class="font-weight-semi-bold mb-4" style="color:red"> S/${producto.precio.toFixed(2)}</h3>
            <p>Tamaño: ${producto.tamaño || 'N/A'}</p>
            <p class="mb-4">Descripción: ${producto.descripcion || 'No hay descripción disponible'}</p>

            <div class="d-flex align-items-center mb-4 pt-2"><i class="fa fa-shopping-cart mr-1"></i>
                <a href="#" id="btn-whatsapp" class="btn btn-primary px-3" target="_blank"></a>
            </div>
        `;
    } else {
        // Si no hay producto en localStorage, redirigir al inicio o mostrar un mensaje
        // window.location.href = '/index.html';
    }
});



// FETCH A TODO EL PROMOCION.JSON

// Cargar el JSON
fetch('/data/promocion.json')
    .then(response => response.json())
    .then(data => {
        // Insertar la frase1 en el <span> con id="frase1"
        document.getElementById('frase1').textContent = data.frase1;
        document.getElementById('frase2').textContent = data.frase2;
        document.getElementById('frase3').textContent = data.frase3;
        document.getElementById('frase4').textContent = data.frase4;
        document.getElementById('slide1').src = data.slide1;
        document.getElementById('slide2').src = data.slide2;
        document.getElementById('slide3').src = data.slide3;
        document.getElementById('oferta1').src = data.oferta1;
        document.getElementById('oferta2').src = data.oferta2;
        document.getElementById('logo1').src = data.logo1;
        document.getElementById('logo2').src = data.logo2;
        //   document.getElementById('').src = data.slide3;

    })
    .catch(error => console.error('Error al cargar el JSON:', error));

//Añadir mas codigo aca de bajo sobre promocion.json




/////////////////ASIGANAR EVENTO DE REDIRECCIONADO A LAS OFERTAS//////////////////////
fetch('data/dbProductos.json')
    .then(response => response.json())
    .then(productosJSON => {
        // Asignar eventos a los botones después de cargar el JSON
        document.getElementById('btn-agregados').addEventListener('click', function (e) {
            e.preventDefault(); // Evitar el comportamiento por defecto del enlace
            guardarYRedirigir('HERRAMIENTAS', productosJSON);
        });

        document.getElementById('btn-construccion').addEventListener('click', function (e) {
            e.preventDefault(); // Evitar el comportamiento por defecto del enlace
            guardarYRedirigir('CONSTRUCCION', productosJSON);
        });
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
    });

// // Función que guarda los productos en localStorage y redirige
function guardarYRedirigir(categoria, productosJSON) {
    //     // Obtener los productos de la categoría seleccionada
    const productos = productosJSON[categoria];

    if (productos) {
        // Guardar los productos en localStorage
        localStorage.setItem('productos', JSON.stringify(productos));
        localStorage.setItem('categoriaSeleccionada', categoria); // Guardar la categoría seleccionada

        // Redirigir a la página de productosTotales
        window.location.href = 'productosTotales.html';
    } else {
        console.error('No se encontraron productos para la categoría:', categoria);
    }
}



///////////////////////////PRODUCTOS TRAIDOS PARA EL FILTO DE STORE.HTML//////////////////////////////////////////
let products = [];
let currentPage = 1;
const productsPerPage = 16; // Número de productos por página

// Load products from JSON
fetch('data/dbProductos.json')
    .then(response => response.json())
    .then(data => {
        // Create categories and subcategories
        Object.keys(data).forEach(categoria => {
            Object.keys(data[categoria]).forEach(subcategoria => {
                const subcatProducts = data[categoria][subcategoria].productos;
                subcatProducts.forEach(product => {
                    product.category = categoria; // Add category to product
                    product.subcategory = subcategoria; // Add subcategory to product
                    products.push(product);
                });
            });
        });
        shuffleArray(products); // Mezclar el arreglo de productos
        displayProducts(products);
        populateSubcategoryFilter(products);
        setupPagination(products);
    })
    .catch(error => console.error('Error loading JSON:', error));

// Function to shuffle the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
    }
}

// Display products
function displayProducts(productArray) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = productArray.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
        <img src="${product.imagen}" alt="${product.nombre}" width="100" style="cursor: pointer;" data-product='${JSON.stringify(product)}'>
        <h5>${product.nombre}</h5>
        <p>Precio: S/${product.precio}</p>
        <p clas="categoria">${product.category}</p>
       <p>${product.subcategory}</p>
    `;
        productElement.querySelector('img').addEventListener('click', function () {
            localStorage.setItem('productoSeleccionado', JSON.stringify(product));
            window.location.href = 'detalleProducto.html';
        });
        productList.appendChild(productElement);
    });
}

// Populate subcategory filter
function populateSubcategoryFilter(products) {
    const subcategorySet = new Set(products.map(product => product.subcategory));
    const subcategoryFilter = document.getElementById('subcategoryFilter');

    subcategorySet.forEach(subcategoria => {
        const option = document.createElement('option');
        option.value = subcategoria;
        option.textContent = subcategoria.charAt(0).toUpperCase() + subcategoria.slice(1);
        subcategoryFilter.appendChild(option);
    });
}

// Filter products by subcategory
function filterProducts() {
    const subcategoryFilter = document.getElementById('subcategoryFilter').value;
    let filteredProducts = products;

    if (subcategoryFilter) {
        filteredProducts = filteredProducts.filter(product => product.subcategory === subcategoryFilter);
    }

    currentPage = 1; // Reset to the first page after filtering
    displayProducts(filteredProducts);
    setupPagination(filteredProducts);
}

// Setup pagination
function setupPagination(productArray) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const pageCount = Math.ceil(productArray.length / productsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = function () {
            currentPage = i;
            displayProducts(productArray);
        };
        pagination.appendChild(button);
    }
}

//////CODIGO PARA EL CARGADO DEL GOOGLE MASP///
// Código para el mapa
function initMap() {
    const localCoords = { lat: -12.063435114146921, lng: -77.05397263585367 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: localCoords,
    });

    const localMarker = new google.maps.Marker({
        position: localCoords,
        map: map,
        title: "Nuestra tienda",
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                const userMarker = new google.maps.Marker({
                    position: userCoords,
                    map: map,
                    title: "Tu ubicación",
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                });

                const bounds = new google.maps.LatLngBounds();
                bounds.extend(localCoords);
                bounds.extend(userCoords);
                map.fitBounds(bounds);
            },
            function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Usuario denegó el acceso a la geolocalización.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("La ubicación no está disponible.");
                        break;
                    case error.TIMEOUT:
                        alert("La solicitud de geolocalización expiró.");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("Ocurrió un error desconocido.");
                        break;
                }
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
}

// Código para buscar productos
function buscarProducto() {
    const query = document.getElementById('buscador').value.toLowerCase();
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';

    if (query.trim() === '') {
        return;
    }

    const resultadosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query) ||
        (producto.tamaño && producto.tamaño.toLowerCase().includes(query)) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(query))
    );

    if (resultadosFiltrados.length === 0) {
        resultados.innerHTML = '<p>No se encontraron productos...</p>';
    } else {
        resultadosFiltrados.forEach(producto => {
            const nombreFormateado = encodeURIComponent(`Me interesa el producto ${producto.nombre}`);
            const whatsappLink = `https://wa.me/959984541?text=${nombreFormateado}`;

            const divProducto = document.createElement('div');
            divProducto.classList.add('producto');
            const imgElement = `<img src="${producto.imagen || 'default-image.jpg'}" alt="${producto.nombre}" onerror="imagenError(this)">`;
            divProducto.innerHTML = `
                ${imgElement}
                <div>
                    <strong>${producto.nombre}</strong>
                    <p>Tamaño: ${producto.tamaño || 'N/A'}</p>
                    <p>Descripción: ${producto.descripcion || 'N/A'}</p>
                    <strong>Precio: S/${producto.precio.toFixed(2)}</strong><br>
                    <a class="ver-producto whatsapp-link" href="${whatsappLink}" target="_blank">Comprar</a>
                </div>
            `;

            divProducto.querySelector('img').addEventListener('click', function () {
                localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
                window.location.href = 'detalleProducto.html';
            });

            resultados.appendChild(divProducto);
        });
    }
}

// Cargar productos cuando se carga la página
window.addEventListener('load', function () {
    cargarProductos();
});

// Iniciar el mapa cuando se carga la página
window.addEventListener('load', initMap);

//////////////////////parametros //////////////////////////////

// Función para procesar parámetros de la URL
function procesarParametrosURL(callback) {
    // Obtener todos los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Convertir los parámetros a un objeto simple
    const parametros = {};
    for (const [key, value] of urlParams.entries()) {
        parametros[key] = value;
    }
    
    // Ejecutar la función callback, pasando los parámetros
    callback(parametros);
}






///////////////////////