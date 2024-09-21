document.addEventListener('DOMContentLoaded', () => {
    // Cargar el archivo dbProductos.json
    fetch('/data/dbProductos.json')
        .then(response => response.json())
        .then(data => {
            // Cargar el archivo imagenCategoria.json
            fetch('/data/imagenCategoria.json')
                .then(response => response.json())
                .then(imagenData => {
                    const container = document.getElementById('categories-carousel');

                    // Iterar sobre las categorías en dbProductos.json
                    Object.keys(data).forEach((categoria) => {
                        const categoryData = data[categoria];

                        // Verificar si la categoría tiene una imagen en imagenCategoria.json
                        const imagenCategoria = imagenData[categoria]?.imagen || '/img/default.webp'; // Imagen por defecto si no hay coincidencia

                        // Crear el div de cada categoría
                        const categoryDiv = document.createElement('div');
                        categoryDiv.classList.add('category-item');
                        categoryDiv.innerHTML = `
                            <a class="custom-carousel-item" href="#" data-category="${categoria}">
                                <img class="custom-carousel-item" src="${imagenCategoria}" alt="${categoria}">
                                <h2>${categoria}</h2>
                            </a>
                        `;
                        container.appendChild(categoryDiv);
                    });

                    // Inicializar el carrusel de Owl Carousel
                    $('.owl-carousel').owlCarousel({
                        loop: true,
                        margin: 10,
                        nav: true,
                        rtl: false,
                        autoplay: true,
                        autoplayTimeout: 1500,
                        autoplayHoverPause: true,
                        responsive: {
                            0: {
                                items: 2
                            },
                            600: {
                                items: 3
                            },
                            1000: {
                                items: 4
                            }
                        }
                    });

                    // Evento de click en las categorías
                    document.querySelectorAll('.custom-carousel-item').forEach(item => {
                        item.addEventListener('click', function(event) {
                            event.preventDefault();
                            const categoria = this.getAttribute('data-category');
                            // Guardar la categoría seleccionada en localStorage
                            localStorage.setItem('categoriaSeleccionada', categoria);
                            // Redirigir a productosTotales.html
                            window.location.href = 'productosTotales.html';
                        });
                    });
                })
                .catch(error => console.error('Error al cargar imagenCategoria.json:', error));
        })
        .catch(error => console.error('Error al cargar dbProductos.json:', error));
});
