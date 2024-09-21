let modalProducts = [];
let modalCurrentPage = 1;
const modalProductsPerPage = 6; // Número de productos por página

// Cargar productos desde JSON para el modal
fetch('data/dbProductos.json')
    .then(response => response.json())
    .then(data => {
        // Crear categorías y subcategorías para el modal
        Object.keys(data).forEach(categoria => {
            Object.keys(data[categoria]).forEach(subcategoria => {
                const subcatProducts = data[categoria][subcategoria].productos;
                subcatProducts.forEach(product => {
                    product.category = categoria; // Añadir categoría al producto
                    product.subcategory = subcategoria; // Añadir subcategoría al producto
                    modalProducts.push(product);
                });
            });
        });
        shuffleArray(modalProducts); // Mezclar productos
        populateModalSubcategoryFilter(); // Llenar el select de subcategorías
    })
    .catch(error => console.error('Error cargando JSON:', error));

// Función para mezclar productos (puede ser compartida con el código de store)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
    }
}

// Llenar el filtro de subcategoría en el modal
function populateModalSubcategoryFilter() {
    const modalSubcategoryFilter = document.getElementById('modalSubcategoryFilter');
    modalSubcategoryFilter.innerHTML = ''; // Limpiar opciones
    const subcategorySet = new Set(modalProducts.map(product => product.subcategory));

    subcategorySet.forEach(subcategoria => {
        const option = document.createElement('option');
        option.value = subcategoria;
        option.textContent = subcategoria.charAt(0).toUpperCase() + subcategoria.slice(1);
        modalSubcategoryFilter.appendChild(option);
    });
}

// Mostrar productos en el modal
function displayModalProducts(productArray) {
    const modalProductList = document.getElementById('modalProductList'); // Lista de productos en el modal
    modalProductList.innerHTML = ''; // Limpiar lista

    productArray.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}" width="100" style="cursor: pointer;" data-product='${JSON.stringify(product)}'>
            <h5>${product.nombre}</h5>
            <p>Precio: S/.${product.precio}</p>
            <p>${product.category}</p>
            <p>${product.subcategory}</p>
        `;
        // Agregar evento de clic para redirigir a detalleProducto.html
        productElement.querySelector('img').addEventListener('click', function () {
            localStorage.setItem('productoSeleccionado', JSON.stringify(product));
            window.location.href = 'detalleProducto.html';
        });
        modalProductList.appendChild(productElement);
    });
}

// Configurar la paginación del modal
function setupModalPagination(productArray) {
    const modalPagination = document.getElementById('modalPagination');
    modalPagination.innerHTML = '';

    const pageCount = Math.ceil(productArray.length / modalProductsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = function () {
            modalCurrentPage = i;
            displayModalProducts(productArray);
        };
        modalPagination.appendChild(button);
    }
}

// Referencias a elementos del modal
const filterButton = document.getElementById('filterButton');
const filterModal = document.getElementById('filterModal');
const modalSubcategoryFilter = document.getElementById('modalSubcategoryFilter');
const closeModalButton = document.getElementById('closeModal');
const applyFilterButton = document.getElementById('applyFilter');

// Mostrar el modal al hacer clic en el botón de filtrar
filterButton.addEventListener('click', () => {
    populateModalSubcategoryFilter(); // Llenar el select cada vez que se abre el modal
    filterModal.style.display = 'block'; // Mostrar modal
});

// Cerrar el modal
closeModalButton.addEventListener('click', () => {
    filterModal.style.display = 'none';
});

// Aplicar filtro
applyFilterButton.addEventListener('click', () => {
    const selectedSubcategory = modalSubcategoryFilter.value;
    let filteredModalProducts;

    if (selectedSubcategory) {
        filteredModalProducts = modalProducts.filter(product => product.subcategory === selectedSubcategory);
    } else {
        filteredModalProducts = modalProducts; // Si no se selecciona ninguna subcategoría, mostrar todos los productos
    }

    displayModalProducts(filteredModalProducts); // Mostrar productos filtrados en el modal
});
