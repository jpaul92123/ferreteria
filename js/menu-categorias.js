document.addEventListener('DOMContentLoaded', function () {
    fetch('/data/categorias.json')
        .then(response => response.json())
        .then(data => {
            const menuIds = ['menu-categorias', 'menu-categorias2'];

            menuIds.forEach(menuId => {
                const menu = document.getElementById(menuId);
                data.forEach(item => {
                    const menuItem = document.createElement('li');
                    menuItem.innerHTML = `<a href="${item.url}">├ ${item.nombre}</a>`;
                    menu.appendChild(menuItem);
                });
            });
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
});


// esto es para mostrar el nombre de la categoria  como referenia para las galerias 
document.addEventListener('DOMContentLoaded', function () {
    fetch('/data/categorias.json')
        .then(response => response.json())
        .then(data => {
            const spanCategoria = document.getElementById('nombre-categoria');
            const spanCategoria2 = document.getElementById('nombre-categoria2');
            const currentUrl = window.location.pathname; // Obtiene la URL actual de la página

            const categoria = data.find(item => item.url === currentUrl);

            if (categoria) {
                spanCategoria.textContent = categoria.nombre;
                spanCategoria2.textContent = categoria.nombre;
            } else {
                console.error('Categoría no encontrada para la URL:', currentUrl);
            }
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
});
