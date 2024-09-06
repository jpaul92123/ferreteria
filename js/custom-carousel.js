document.addEventListener('DOMContentLoaded', function () {
    fetch('/data/categorias.json')
        .then(response => response.json())
        .then(data => {
            const carousel = document.getElementById('custom-carousel');

            data.forEach(item => {
                const productCard = document.createElement('div');
                productCard.className = 'card custom-carousel-item border-0';

                productCard.innerHTML = `
                    <a href="${item.url}">
                        <div class="card-header custom-carousel-img position-relative overflow-hidden bg-transparent border p-0">
                            <img class="img-fluid w-100" src="${item.imagen}" alt="${item.nombre}">
                            <div class="custom-carousel-overlay">
                                <div class="card-body border-left border-right text-center p-0 pt-4 pb-3">
                                    <h2 class="mb-3" style="color:white; text-transform:uppercase;">${item.nombre}</h2>
                                </div>
                            </div>
                        </div>
                    </a>
                `;

                carousel.appendChild(productCard);
            });

            // Inicializa el carrusel de Owl Carousel con autoplay
            const owlCarousel = $('.owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
                nav: true,
                rtl: false, // Esto permite que el carrusel se desplace hacia la izquierda
                autoplay: true, // Activa el autoplay
                autoplayTimeout: 2300, // Cambia cada 2.3 segundos
                autoplayHoverPause: true, // Pausa el autoplay al pasar el mouse
                responsive: {
                    0: {
                        items: 2 // Muestra 2 elementos en pantallas pequeñas
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 4
                    }
                }
            });
            $('.owl-carousel').on('changed.owl.carousel', function(event) {
                const activeItem = document.querySelector('.owl-item.active .custom-carousel-img');
            
                if (activeItem) {
                    // Remover la clase "hover-simulated" de todos los elementos
                    document.querySelectorAll('.custom-carousel-img').forEach(item => {
                        item.classList.remove('hover-simulated');
                    });
            
                    // Añadir la clase al slide activo
                    activeItem.classList.add('hover-simulated');
                }
            });
            

            // Simular hover cuando el slide cambie
            owlCarousel.on('changed.owl.carousel', function(event) {
                // Obtener el slide activo
                const activeItem = document.querySelector('.owl-item.active .custom-carousel-img');

                // Remover el hover simulado de otros slides
                document.querySelectorAll('.custom-carousel-img').forEach(item => {
                    item.classList.remove('hover-simulated');
                });

                // Añadir la clase que simula el hover al slide activo
                activeItem.classList.add('hover-simulated');
            });
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
});
