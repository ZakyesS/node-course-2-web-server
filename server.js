const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000; // process.env --> rutas donde estan todos los procesos, incluidos los del sistema y PORT el puerto que .
//app es una instancia de express.
let app = express();
hbs.registerPartials(__dirname + '/views/partials'); //va a usar el directorio donde esten todos los handlebars partial.

app.set('view engine', 'hbs'); //se le pasa una key y un valor(primero lo que se va a usar y 2º el valor).

app.use((req, res, next) => { //next dice cuando ha acabado el middleware.
    let now = new Date().toString(); //toString formatea a lenguaje humano.
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log');
        }     
    });
    next(); //si se llama, se acaba el middleware y sigue ejecutandose lo que viene a continuación.
});

/*app.use((req, res, next) => {
    res.render('maintance.hbs', {
        title: req.path,
    });
    
    /* Si no llamamos al next(), se seguirá ejecutando y por
     lo tanto a lo que esté por debajo del middleware le afectará éste.
     En este caso, las páginas que estén por debajo, incluso directorios les
     afectará el estado de mantenimiento de la web. En cada sitio renderizará
     la maintance.hbs.
    */
//});
// para usar una ruta estática, se usa el __dirname(que significa en la misma ruta principal + 'ruta que se quiera').
app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', ()=> { //usa 2 param, el 1º el nombre que se le da, el 2º una función para que haga lo que se quiere.
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text)=> { //toUpperCase --> convierte en mayusculas un texto.
    return text.toUpperCase();
});



// app.get --> deja preparar un manejador de request http(obtener una solicitud http).
/* Se le pasan dos argumentos, el primero es un url(que será a la ruta a la que se acceda un 
    usuario por ejemplo y le aparezca un mensaje de prohibido el paso) y el segundo, una  
    función que le dice a express loe que le envía de vuelta a la persona que hace la solicitud o
    petición(se le pasan dos parám, request y response).

    - request --> contiene información sobre la url y
    - response --> contiene métds a usar para por ejemplo devolver los datos que se quieran.

    - req (solicitud) y res (respuesta) son exactamente los mismos objetos que proporciona Node, 
    por lo que puede invocar req.pipe(), req.on('data', callback) y cualquier otro objeto que 
    invocaría sin estar Express implicado. --> expresjs.com*/
app.get('/', (req, res) => {
    res.render('home.hbs', {  //renderiza un template.
        pageTitle: 'Home Page',
        greeting: 'Wellcome to my WebSite',
    }); 
    
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {  //renderiza un template.
        pageTitle: 'About Page',
    }); 
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request!.',
    });
});
app.get('/beautifully', (req, res) => {
    res.render('beautifully.hbs', {
        pageTitle: 'Beautifully Page',
        greeting: 'Wellcome to the most beautiful webpage!!',
    });
});

app.listen(port, () => {
    console.log(`Sever is up on port ${port}`);
}); //puerto usado para escuchar.
