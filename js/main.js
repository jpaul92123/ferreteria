// ESTE CODIGO ES SOLAMENTE PARA QUE EL STOCK.HTML CARGUE TODOS LOS PRODUCTOS SEGUN SUCATEGORIA


// Determina el archivo JSON a cargar según el archivo HTML
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el nombre del archivo HTML actual y agregar la extensión si no está presente
    let htmlFileName = window.location.pathname.split('/').pop();
    if (!htmlFileName.endsWith('.html')) {
        htmlFileName += '.html';
    }

    // Determinar el archivo JSON según el archivo HTML
    let jsonFiles = [];

    switch (htmlFileName) {
        case 'cat.html':
            jsonFiles = ['cat1.json'];
            break;
        case 'cat2.html':
            jsonFiles = ['cat2.json'];
            break;
        case 'cat3.html':
            jsonFiles = ['cat3.json'];
            break;
        case 'cat4.html':
            jsonFiles = ['cat4.json'];
            break;
        case 'cat5.html':
            jsonFiles = ['cat5.json'];
            break;
        case 'cat6.html':
            jsonFiles = ['cat6.json'];
            break;
        case 'stock.html':
            jsonFiles = ['cat1.json','cat2.json','cat3.json','cat4.json','cat5.json','cat6.json'];
            break;
        default:
            console.error('No se encontró un archivo JSON correspondiente para este HTML.');
            return;
    }

    // Cargar el JSON y la galería correspondiente
    if (jsonFiles.length > 1) {
        // Cargar y combinar JSON si hay más de un archivo
        cargarYCombinarGaleria(jsonFiles);
    } else {
        // Cargar un solo JSON
        cargarGaleria(jsonFiles[0]);
    }
});

function cargarYCombinarGaleria(jsonFiles) {
    // Cargar todos los archivos JSON y combinarlos
    Promise.all(jsonFiles.map(file => cargarJSON(file)))
        .then(dataArrays => {
            const combinedData = [].concat(...dataArrays);
            console.log('Datos combinados:', combinedData);
            // Aquí puedes proceder a usar combinedData para renderizar la galería
            renderizarGaleria(combinedData);
        })
        .catch(error => {
            console.error('Error al cargar los archivos JSON:', error);
        });
}

function cargarJSON(jsonFileName) {
    return fetch(`/data/${jsonFileName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar ${jsonFileName}: ${response.statusText}`);
            }
            return response.json();
        });
}

function cargarGaleria(jsonFileName) {
    cargarJSON(jsonFileName)
        .then(data => {
            console.log('Datos cargados:', data);
            // Aquí puedes proceder a usar data para renderizar la galería
            renderizarGaleria(data);
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });
}

function renderizarGaleria(data) {
    // Implementar la lógica para renderizar la galería de productos
    console.log('Renderizando galería con los siguientes datos:', data);
    // Aquí puedes agregar la lógica que renderiza la galería de productos en la página
}






