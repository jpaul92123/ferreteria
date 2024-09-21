fetch('data/dbProductos.json')
  .then(response => response.json())
  .then(data => {
    const menuPrincipal = document.getElementById('menuPrincipal');
    const menuPrincipal2 = document.getElementById('menuPrincipal2');

    // Función para crear el menú
    function crearMenu(menuElement) {
      // Crear las categorías y subcategorías
      Object.keys(data).forEach(categoria => {
        const li = document.createElement('li');
        li.classList.add('dropdown-submenu', 'position-relative');

        const a = document.createElement('a');
        a.classList.add('dropdown-item');
        a.href = "#";
        a.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        li.appendChild(a);

        const ulSub = document.createElement('ul');
        ulSub.classList.add('dropdown-menu');

        // Agregar subcategorías
        Object.keys(data[categoria]).forEach(subcategoria => {
          const liSub = document.createElement('li');
          const aSub = document.createElement('a');
          aSub.classList.add('dropdown-item');
          aSub.href = "#";
          aSub.textContent = "- " + subcategoria.charAt(0).toUpperCase() + subcategoria.slice(1);

          // Asignar el evento de clic con referencia directa a la subcategoría
          aSub.addEventListener('click', function (event) {
            event.preventDefault();
            // Guardar categoría y subcategoría en localStorage
            localStorage.setItem('categoriaSeleccionada', categoria);
            localStorage.setItem('subcategoriaSeleccionada', subcategoria);

            // Redirigir a categoriasProductos.html
            window.location.href = 'categoriasProductos.html';
          });

          liSub.appendChild(aSub);
          ulSub.appendChild(liSub);
        });

        li.appendChild(ulSub);
        menuElement.appendChild(li);
      });
    }

    // Crear ambos menús
    crearMenu(menuPrincipal);
    crearMenu(menuPrincipal2);
  })
  .catch(error => console.error('Error al cargar el JSON:', error));



////////////////////////////////////////////
/////////CARGAR LA CATEGORIA para categoriaProductos.html////////////////

document.addEventListener('DOMContentLoaded', function () {
  const categoriaSeleccionada = localStorage.getItem('categoriaSeleccionada');
  const subcategoriaSeleccionada = localStorage.getItem('subcategoriaSeleccionada');

  if (categoriaSeleccionada && subcategoriaSeleccionada) {
    // Mostrar los nombres de la categoría y subcategoría
    document.getElementById('tituloCategoria').textContent = categoriaSeleccionada.charAt(0).toUpperCase() + categoriaSeleccionada.slice(1);
    document.getElementById('tituloSubcategoria').textContent = '"' + subcategoriaSeleccionada.charAt(0).toUpperCase() + subcategoriaSeleccionada.slice(1) + '"';

    // Cargar el JSON y mostrar los productos
    fetch('data/dbProductos.json')
      .then(response => response.json())
      .then(data => {
        const galeriaProductos = document.getElementById('galeriaProductos');
        const productos = data[categoriaSeleccionada][subcategoriaSeleccionada].productos;

        productos.forEach(producto => {
          const col = document.createElement('div');
          col.classList.add('col-md-4');
          col.classList.add('col-sm-6');
          col.classList.add('col-sm-sm');
          col.innerHTML = `
            <div class="card">
              <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="cursor: pointer;" data-producto='${JSON.stringify(producto)}'>
              <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p><strong>Precio: </strong>S/${producto.precio}</p>
              </div>
            </div>
          `;
          col.querySelector('img').addEventListener('click', function () {
            localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
            window.location.href = 'detalleProducto.html';
          });
          galeriaProductos.appendChild(col);
        });
      })
      .catch(error => console.error('Error al cargar el JSON:', error));
  }
});
////////////////////////////////////////////
/////////CARGAR LA CATEGORIA para Productostotales.html////////////////
document.addEventListener('DOMContentLoaded', () => {
  // Obtener la categoría seleccionada desde localStorage
  const categoriaSeleccionada = localStorage.getItem('categoriaSeleccionada');

  if (!categoriaSeleccionada) {
    console.error('No se seleccionó ninguna categoría.');
    return;
  }

  // Mostrar el nombre de la categoría seleccionada
  document.getElementById('categoriaTitulo').textContent = categoriaSeleccionada.charAt(0).toUpperCase() + categoriaSeleccionada.slice(1);

  // Cargar los productos desde dbProductos.json
  fetch('/data/dbProductos.json')
    .then(response => response.json())
    .then(data => {
      const productsContainer = document.getElementById('products-container');
      productsContainer.innerHTML = ''; // Limpiar el contenedor

      // Verificar si la categoría seleccionada existe en el JSON
      const categoriaData = data[categoriaSeleccionada];

      if (categoriaData) {
        // Iterar sobre las subcategorías dentro de la categoría seleccionada
        Object.keys(categoriaData).forEach(subcategoria => {
          console.log(`Procesando subcategoría: ${subcategoria}`);

          const productos = categoriaData[subcategoria].productos;

          if (productos && productos.length > 0) {
            // Iterar sobre cada producto en la subcategoría
            productos.forEach(product => {
              const productDiv = document.createElement('div');
              productDiv.classList.add('product-item');
              productDiv.innerHTML = `
                              <img src="${product.imagen}" alt="${product.nombre}" class="product-img" style="cursor: pointer;">
                              <h3>${product.nombre}</h3>
                              <p>Precio: S/${product.precio}</p>
                          `;

              // Agregar evento click a la imagen del producto
              productDiv.querySelector('.product-img').addEventListener('click', () => {
                // Guardar el producto seleccionado en localStorage
                localStorage.setItem('productoSeleccionado', JSON.stringify(product));

                // Redirigir a la página de detalles del producto
                window.location.href = 'detalleProducto.html';
              });

              productsContainer.appendChild(productDiv);
            });
          } else {
            console.warn(`No se encontraron productos en la subcategoría: ${subcategoria}`);
          }
        });
      } else {
        console.error('La categoría seleccionada no existe en el archivo JSON.');
      }
    })
    .catch(error => console.error('Error al cargar los productos:', error));
});

