//#######################################################################//
//#######################################################################//
//                              DATOS                                    //
//#######################################################################//
//#######################################################################//
var data;
var arrayPalabrasDiccionario = {};
var tablero, longitudes, soluciones, origen;
var soluciones_completas;
//var diccionario = false;

//#######################################################################//
//#######################################################################//
//                              FUNCIONES                                //
//#######################################################################//
//#######################################################################//

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function cargarDiccionario(sizes){
    //let url = "https://ordenalfabetix.unileon.es/aw/diccionario.txt";
    let url = "https://diccionario.casasoladerueda.es/diccionario.txt";
    fetch(url)
        .then(response => response.text())
        .then((response) => {
            almacenarPalabras(response, sizes);
        })
        .catch(function(){
            e => console.log(`Error :  ${e}`)
        });
    console.log('Diccionario cargado');
}

function almacenarPalabras(texto, sizes){
    let palabras = texto.split("\n");
    palabras.forEach(function(elemento, _indice, _array) {
        sizes.forEach(function(size, _indice, _array){
            if(elemento.length == size){
                if(!arrayPalabrasDiccionario.hasOwnProperty(size)){
                    arrayPalabrasDiccionario[size] = [];
                }
                arrayPalabrasDiccionario[size].push(removeAccents(elemento));
            }
        });
    });
    /*document.getElementById("botonResolver").disabled = false;
    document.getElementById("botonResolver").enabled = true;*/

    //PALABRAS NO INCLUIDAS
    arrayPalabrasDiccionario[5].push("coman");
    arrayPalabrasDiccionario[5].push("toman");
    arrayPalabrasDiccionario[5].push("manto");
    arrayPalabrasDiccionario[5].push("copos");
    arrayPalabrasDiccionario[5].push("copas");
    arrayPalabrasDiccionario[5].push("pocos");
    console.log('Palabras recogidas');
    console.log(arrayPalabrasDiccionario);
    //diccionario = true;
}

/*function return_specific_data(number){

}*/

function resolverTablero(data){
    let palabra = "";
    let anterior = null;
    let filasCorrectas = [];
    let filasValidas = [];
    var error = false;
    let key;

    data.forEach(function(elemento, indice, _array){
        elemento.forEach(function(elemento, _indice, _array){
            palabra += elemento;
        });
        key = ""+(indice+1)+"";
        if(error){
            //console.log("Entro porque hay error");
            console.log(palabra +" - es erronea");
            if(key in soluciones) error = false;
            //filasErroneas.push(indice);
        }else{
            //console.log("No entro porque no hay error");
            if(palabra.length>0 && validarFila(palabra,indice,anterior)){
                filasCorrectas.push(indice);
                //console.log(palabra +" - es correcta");
            }else if(palabra.length>0 && existe(palabra)){
                filasValidas.push(indice);
                //console.log(palabra +" - es valida");
            }else{
                error = true;
                //console.log(palabra +" - es erronea");
            }
            //console.log(error);
        }
        anterior = palabra;
        palabra = "";
    });
    let filas = {};
    filas['validas'] = filasValidas;
    filas['correctas'] = filasCorrectas;
    return filas;
}

function validarFila(palabra, indice, anterior){
    let solucion = null;
    palabra = palabra.toLowerCase();
    let resultado;
    if(soluciones.hasOwnProperty(indice)){
        solucion = soluciones[indice];
        return solucion==palabra?true:false;
    }else{
        if(existe(palabra)){
            resultado = validarCambio(palabra,anterior,indice)?true:false;
        }else{
            //console.log("No existe");
            resultado = false;
        }
    }
    /*if(resultado & (indice == 4 | indice == 10)){
        resultado = validarCambio(soluciones[indice+1],palabra,indice+1);
    }*/
    //console.log("palabra ->" + resultado);
    return resultado;
}

function existe(palabra){
    palabra = palabra.toLowerCase();
    //let existe = false;

    /*console.log(palabra);
    console.log(palabra.length);
    console.log("buscando en: ");
    console.log(arrayPalabrasDiccionario[palabra.length]);
    console.log(arrayPalabrasDiccionario[palabra.length].includes(palabra))*/

    return arrayPalabrasDiccionario[palabra.length].includes(palabra);

    /*longitudes.forEach(function(elemento, index, _array){
        console.log(palabra + " existe: " + palabra.length + "?= " +elemento);
        if(palabra.length == elemento){
            existe = arrayPalabrasDiccionario[elemento].includes(palabra);
        }
        console.log(existe);
        
    });*/
    //return existe;
    
    /*if(palabra.length == longitudes[0]){
        return arrayPalabrasDiccionario[longitudes[0]].includes(palabra);
    }else if(palabra.length == longitudes[1]){
        return arrayPalabrasDiccionario[longitudes[1]].includes(palabra);
    }else{
        return false;
    }*/
}

function validarCambio(palabra, anterior, indice){
    anterior = anterior.toLowerCase();
    var longitud = palabra.length;
    let palabraMod, todasLetras, ant, numCoincidencias = 0;
    let lastSol = getLastSol(indice);
    if((indice-lastSol)%2==1){ //cambio letra
        for(var i=0; i<longitud; i++){
            ant = anterior;
            palabraMod = eliminarCaracter(palabra, palabra.charAt(i));
            todasLetras = true
            for(var j=0; j<longitud-1; j++){
                if(!ant.includes(palabraMod[j])){
                    todasLetras = false;
                }else{
                    ant = eliminarCaracter(ant, palabraMod[j]);
                }
            }
            if(todasLetras) numCoincidencias++;
        }
        todasLetras = numCoincidencias>0 & numCoincidencias<longitud?true:false; //PARA COMPROBAR QUE NO HAN COINCIDIDO EN TODAS LAS LETRAS
                                                                   //DE SER ASÍ, SE TRATARIA DE LA MISMA PALABRA, Y ES ALGO QUE NO QUEREMOS
    }else{ //cambio orden
        todasLetras = true
        for(var i=0; i<longitud && todasLetras; i++){
            if(!anterior.includes(palabra[i])){
                todasLetras = false;
            }else{
                anterior = eliminarCaracter(anterior, palabra[i]);
            }
        }
    }
    return todasLetras;   
}

function eliminarCaracter(palabra, car){
    let final = "";
    let indice = palabra.indexOf(car);
    final = final + palabra.slice(0,indice);
    if(indice+1 < palabra.length){
        final = final + palabra.slice(indice+1, palabra.length);
    }
    return final;
}

function getLastSol(indice){
    let indiceSolucion = indice-1;
    while(!soluciones.hasOwnProperty(indiceSolucion)){
        indiceSolucion--;
    }
    return indiceSolucion;
}

function getBasicParameters(id){
    let parametros = {'tablero': '',
                      'origen': '',
                      'infoPalabras': '',
                      'longitudes' : ''}
    parametros.tablero = data.tableros[id];
    tablero = data.tableros[id];
    parametros.origen = data.origenes[id];
    origen = data.origenes[id];
    parametros.infoPalabras = data.info_palabras_fijas[id];
    parametros.longitudes = data.longitudes[id];
    longitudes = data.longitudes[id];
    console.log(parametros);
    return parametros;
}

function setSolution(id){
    soluciones = data.palabras_fijas[id];
    soluciones_completas = data.soluciones_completas[id];
    console.log(soluciones);
}

function cargarDatosJuego(){
    let ruta = "./data.json";
    const json = require(ruta);
    data = json;
}

function otorgarPista(letras){
    var palabras = [];
    var palabra = "";
    var coincide;

    longitudes.forEach(function(tamanio, index, _array){
        arrayPalabrasDiccionario[tamanio].forEach(function(elemento, _indice, _array){
            coincide = true;
            palabra = elemento;
            for(var i=0; i<letras.length; i++){
                if(coincide && !palabra.includes(letras[i])){
                    coincide = false;
                }else{
                    palabra = eliminarCaracter(palabra,letras[i]);
                }
            }
            if(coincide) palabras.push(elemento);        
        });
        
    });
    var texto = "";
    palabras.forEach(function(elemento, indice, array){
        texto += elemento + "\t";
    });
    return texto;
}

//#######################################################################//
//#######################################################################//
//                              SERVER                                   //
//#######################################################################//
//#######################################################################//

// server.js
'use strict';

//parameters for configuring the server
const fetch = require('node-fetch');
const express = require("express");
const app = express();
const port = 8000;


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    next();
});

// POST -> Corregir Pasatiempo
app.post('/check', function(request, response){
    const valores = request.body.valorCasillas;
    let data = resolverTablero(valores);
    /*let data = [];
    data.push(validas);
    data.push(correctas);*/
    response.send(data);
});

// POST -> Setear Datos Pasatiempo
app.post('/data', function(request, response){
    let id = request.body.id;
    let parametros = getBasicParameters(id);
    setSolution(id);
    cargarDiccionario(longitudes);
    response.send(parametros);
    //NECESITO -> id del tablero
    //devolver el tablero que se está usando
    //devolver las coordenadas
    //devolver las pistas
    //devolver la info de las palabras fijas
    //setear la solución con la que trabajar
    //response.send("PARAMETROS TABLERO");
});

// POST -> Cargar diccionario
app.post('/solucion', function(request, response){
    response.send(soluciones_completas);
});


//TODO
// POST -> Otorgar pistas al navegador
app.post('/clue', function(request, response){
    const letras = request.body.letras;
    let arrayPistas = otorgarPista(letras);
    response.send(arrayPistas);
});

app.listen(port, () => {
    cargarDatosJuego();
    console.log("Server listening at "+`http://localhost:${port}`);
});

