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

let productos = [];

// Función para cargar un archivo JSON dado su nombre y agregar los productos al array principal
function cargarJSON(nombreArchivo) {
    return fetch(`/data/${nombreArchivo}?v=1.0`)
        .then(response => response.json())
        .then(data => {
            // Agregar los productos al array principal
            productos.push(...Object.values(data).flat());
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Función para buscar productos en el array cargado
function buscarProducto() {
    const query = document.getElementById('buscador').value.toLowerCase();
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';

    if (query.trim() === '') {
        return; // Si el input está vacío, no mostrar resultados
    }

    const resultadosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query) ||
        (producto.talla && producto.talla.toLowerCase().includes(query)) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(query))
    );

    if (resultadosFiltrados.length === 0) {
        resultados.innerHTML = '<p>No se encontraron productos...</p>';
    } else {
        resultadosFiltrados.forEach(producto => {
            const nombreFormateado = encodeURIComponent(`Me interesa el producto ${producto.nombre}`);
            const whatsappLink = `https://wa.me/935909756?text=${nombreFormateado}`;

            const divProducto = document.createElement('div');
            divProducto.classList.add('producto');
            const imgElement = `<img src="${producto.imagen || 'default-image.jpg'}" alt="${producto.nombre}" onerror="imagenError(this)">`;
            divProducto.innerHTML = `
                ${imgElement}
                <div>
                    <strong>${producto.nombre}</strong>
                    <p>Talla: ${producto.talla || 'N/A'}</p>
                    <p>Descripción: ${producto.descripcion || 'N/A'}</p>
                    <strong>Precio: S/. ${producto.precio.toFixed(2)}</strong><br>
                    <a class="ver-producto whatsapp-link" href="${whatsappLink}" target="_blank">Comprar</a>
                </div>
            `;
            // Agregar evento de clic en la imagen
            divProducto.querySelector('img').addEventListener('click', function () {
                localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
                window.location.href = '/detalleProducto.html'; // Redirige a la página de detalles del producto
            });

            resultados.appendChild(divProducto);
        });
    }
}



// Función para crear el HTML de un producto
    function createProductItem(product) {
        // Define el enlace de WhatsApp
        const nombreFormateado = encodeURIComponent(`Me interesa el producto ${product.nombre}`);
        const whatsappLink = `https://wa.me/935909756?text=${nombreFormateado}`;
    
        return `
            <div class=" gallery-item">
                <img src="${product.imagen || 'default-image.jpg'}" alt="${product.nombre}" onerror="imagenError(this)" class="img-producto" onclick="verDetalles('${encodeURIComponent(JSON.stringify(product))}')">
                <div class="">
                    <strong>${product.nombre}</strong>
                    <p>Talla: ${product.talla || 'N/A'}</p>
                    <strong style="color:red">S/. ${product.precio.toFixed(2)}</strong><br>
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
    
    

// Función para cargar la galería de productos desde un archivo JSON específico
function cargarGaleria(nombreArchivo) {
    return fetch(`/data/${nombreArchivo}?v=1.0`)
        .then(response => response.json())
        .then(products => {
            const subcat1Gallery = document.getElementById('subcat1-gallery');
            const subcat2Gallery = document.getElementById('subcat2-gallery');
            const subcat3Gallery = document.getElementById('subcat3-gallery');

            // Limpiar el contenido actual de las galerías
            if (subcat1Gallery) subcat1Gallery.innerHTML = '';
            if (subcat2Gallery) subcat2Gallery.innerHTML = '';
            if (subcat3Gallery) subcat3Gallery.innerHTML = '';

            // Llenar la galería de cada categoría si existen en el JSON
            if (products.subcat1) {
                products.subcat1.forEach(product => {
                    subcat1Gallery.innerHTML += createProductItem(product);
                });
            }

            if (products.subcat2) {
                products.subcat2.forEach(product => {
                    subcat2Gallery.innerHTML += createProductItem(product);
                });
            }

            if (products.subcat3) {
                products.subcat3.forEach(product => {
                    subcat3Gallery.innerHTML += createProductItem(product);
                });
            }
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
}

// Determina el archivo JSON a cargar según el archivo HTML
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el nombre del archivo HTML actual y agregar la extensión si no está presente
    let htmlFileName = window.location.pathname.split('/').pop();
    if (!htmlFileName.endsWith('.html')) {
        htmlFileName += '.html';
    }

    // Determinar el archivo JSON según el archivo HTML
    let jsonFileName = '';

    switch (htmlFileName) {
        case 'cat1.html':
            jsonFileName = 'cat1.json';
            break;
        case 'cat2.html':
            jsonFileName = 'cat2.json';
            break;
        case 'cat3.html':
            jsonFileName = 'cat3.json';
            break;
        case 'cat4.html':
            jsonFileName = 'cat4.json';
            break;
        case 'cat5.html':
            jsonFileName = 'cat5.json';
            break;
        case 'cat6.html':
            jsonFileName = 'cat6.json';
            break;
        default:
            console.error('No se encontró un archivo JSON correspondiente para este HTML.');
            return;
    }

    // Cargar el JSON y la galería correspondiente
    cargarGaleria(jsonFileName);
});

// Cargar todos los archivos JSON antes de habilitar el buscador
Promise.all([
    cargarJSON('cat1.json'),
    cargarJSON('cat2.json'),
    cargarJSON('cat3.json'),
    cargarJSON('cat4.json'),
    cargarJSON('cat5.json'),
    cargarJSON('cat6.json')
    // cargarJSON('cat#.json'); // Descomentar si necesitas cargar otro archivo

]).then(() => {
    // Los productos están cargados, ahora se puede buscar
    console.log('Todos los productos han sido cargados');
    // Aquí podrías habilitar el buscador o notificar al usuario que puede buscar productos
});


if (window.location.pathname.endsWith('stock.html')) {

    // Función para cargar la galería de productos desde un archivo JSON específico
    function cargarGaleria(nombreArchivo) {
        return fetch(`/data/${nombreArchivo}?v=1.0`) // Ruta relativa a stock.html
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar el archivo ${nombreArchivo}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(products => {
                const subcat1Gallery = document.getElementById('subcat1-gallery');
                const subcat2Gallery = document.getElementById('subcat2-gallery');
                const subcat3Gallery = document.getElementById('subcat3-gallery');

                if (subcat1Gallery && products.subcat1) {
                    products.subcat1.forEach(product => {
                        subcat1Gallery.innerHTML += createProductItem(product);
                    });
                }

                if (subcat2Gallery && products.subcat2) {
                    products.subcat2.forEach(product => {
                        subcat2Gallery.innerHTML += createProductItem(product);
                    });
                }

                if (subcat3Gallery && products.subcat3) {
                    products.subcat3.forEach(product => {
                        subcat3Gallery.innerHTML += createProductItem(product);
                    });
                }
            })
            .catch(error => console.error('Error al cargar el JSON:', error));
    }

    // Cargar las galerías
    cargarGaleria('cat1.json');
    cargarGaleria('cat2.json');
    cargarGaleria('cat3.json');
    cargarGaleria('cat4.json');
    cargarGaleria('cat5.json');
    cargarGaleria('cat6.json');
    // cargarGaleria('cat#.json'); // Descomentar si necesitas cargar otro archivo

}

// MENU CATEGORIA DE PRODUCTOS ********


// PRIMERO:::::::::::::::::::::::::

function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// SEGUNDO::::::::::::::::::::::

function openPage2(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent2, tablinks2;
    tabcontent2 = document.getElementsByClassName("tabcontent2");
    for (i = 0; i < tabcontent2.length; i++) {
        tabcontent2[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks2 = document.getElementsByClassName("tablink2");
    for (i = 0; i < tablinks2.length; i++) {
        tablinks2[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
}


// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

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

    // Mostrar/ocultar el submenú en pantallas pequeñas
    submenuToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const submenu = submenuToggle.nextElementSibling;
        submenu.classList.toggle('showm');
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



document.addEventListener('DOMContentLoaded', function() {
    buscarProducto();
    const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));


    if (producto) {
        // Verifica que whatsappLink esté definido
        const whatsappLink = producto.whatsappLink;
        console.log('whatsappLink:', whatsappLink);

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
            <h3 class="font-weight-semi-bold mb-4" style="color:red">S/. ${producto.precio.toFixed(2)}</h3>
            <p>Talla: ${producto.talla || 'N/A'}</p>
            <p class="mb-4">Descripción: ${producto.descripcion || 'No hay descripción disponible'}</p>

            <div class="d-flex align-items-center mb-4 pt-2">
                <a href="https://wa.me/935909756?" class="btn btn-primary px-3"><i class="fa fa-shopping-cart mr-1"></i>Pedir en Whatsapp</a>
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
  document.getElementById('slide1').src = data.slide1;
  document.getElementById('slide2').src = data.slide2;
  document.getElementById('slide3').src = data.slide3;
  document.getElementById('oferta1').src = data.oferta1;
  document.getElementById('oferta2').src = data.oferta2;
//   document.getElementById('').src = data.slide3;

})
.catch(error => console.error('Error al cargar el JSON:', error));

//Añadir mas codigo aca de bajo sobre promocion.json
// Cargar el JSON
// Función para procesar un archivo JSON y extraer el objeto en el índice 1 de subcat1
function procesarArchivo(jsonUrl, nombreId, tallaId, precioId, imagenId, descripcionId) {
    fetch(jsonUrl)
      .then(response => response.json())
      .then(data => {
        // Acceder al objeto en el índice 1 de subcat1 (segundo objeto)
        const producto = data.subcat1[1]; // índice 1 es el segundo objeto
  
        // Acceder a cada propiedad del producto de manera independiente
        const nombre = producto.nombre;
        const talla = producto.talla;
        const precio = producto.precio.toString(); // Convertir el precio a string
        const imagen = producto.imagen;
        const descripcion = producto.descripcion;
  
        // Insertar los valores en el HTML en los IDs proporcionados
        document.getElementById(nombreId).textContent = nombre;
        document.getElementById(tallaId).textContent = talla ? `Talla: ${talla}` : 'Talla no disponible';
        document.getElementById(precioId).textContent = `S/.${precio}`; // Usar precio ya como string
        document.getElementById(imagenId).src = imagen;
        // document.getElementById(descripcionId).textContent = descripcion;
  
        // Configurar el clic en la imagen para redirigir a la página de detalles
        document.getElementById(imagenId).onclick = function () {
          localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
          window.location.href = '/detalleProducto.html';
        };
      })
      .catch(error => console.error('Error al cargar el JSON:', error));
  }
  
  // Llamar a la función para los 4 archivos JSON, pasando el URL del archivo y los IDs correspondientes
  procesarArchivo('/data/cat1.json', 'nombre1', 'talla1', 'precio1', 'imagen1', );
  procesarArchivo('/data/cat2.json', 'nombre2', 'talla2', 'precio2', 'imagen2', 'descripcion2');
  procesarArchivo('/data/cat3.json', 'nombre3', 'talla3', 'precio3', 'imagen3', 'descripcion3');
  procesarArchivo('/data/cat4.json', 'nombre4', 'talla4', 'precio4', 'imagen4', 'descripcion4');
  

/////////////////////////////////////////////////////////////////////