let provincias = "";
try { 
    const response =  fetch ("https://apis.datos.gob.ar/georef/api/localidades");
    const data =  response.json();
    provincias = data.provincia;
} catch (error) {
    console.error ("Error al cargar API Georef", error);
    };

console.log (provincias);