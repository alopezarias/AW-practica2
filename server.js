//#######################################################################//
//#######################################################################//
//                              DATOS                                    //
//#######################################################################//
//#######################################################################//
var longitudes = [4, 6];
var arrayPalabrasDiccionario = {};
var tableros = {
    '1': [
        [" "," "," "," "," "," "," "," "," "],
        [" "," ","I","I","I","I","1"," "," "],
        [" "," ","I","I","I","I","1"," "," "],
        [" "," ","I","I","I","I"," "," "," "],
        [" "," ","I","I","I","I"," "," "," "],
        [" "," ","I","I","I","I"," "," "," "],
        [" "," ","I","I","I","I","2"," "," "],
        [" ","3","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" ","4","I","I","I","I","I","I"," "],
        [" "," "," "," "," "," "," "," "," "]
    ],
    '2': [
        [" "," "," "," "," "," "," "," "," "],
        [" "," ","I","I","I","I","1"," "," "],
        [" "," ","I","I","I","I","2"," "," "],
        [" "," ","I","I","I","I"," "," "," "],
        [" "," ","I","I","I","I"," "," "," "],
        [" "," ","I","I","I","I"," "," "," "],
        [" "," ","I","I","I","I","2"," "," "],
        [" ","3","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" ","4","I","I","I","I","I","I"," "],
        [" "," "," "," "," "," "," "," "," "]
    ],'3': [
        [" "," "," "," "," "," "," "," "," "],
        [" "," ","I","I","I","I","1"," "," "],
        [" "," ","I","I","I","I","3"," "," "],
        [" "," ","I","I","I","I"," "," "," "],
        [" "," ","I","I","I","I"," "," "," "],
        [" "," ","I","I","I","I"," "," "," "],
        [" "," ","I","I","I","I","2"," "," "],
        [" ","3","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" "," ","I","I","I","I","I","I"," "],
        [" ","4","I","I","I","I","I","I"," "],
        [" "," "," "," "," "," "," "," "," "]
    ] 
};
var origenes = {
    '1': [1,2],
    '2': [1,2],
    '3': [1,2]
};
var soluciones = {
    '1': {
        '0': 'clan',
        '5':'pena',
        '6':'remato',
        '11':'torero'
    },
    '2': {
        '0': 'clan',
        '5':'pena',
        '6':'remato',
        '11':'torero'
    },
    '3': {
        '0': 'clan',
        '5':'pena',
        '6':'remato',
        '11':'torero'
    }
}
var solucionFijas = soluciones['1'];

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
    console.log('Palabras recogidas');
    console.log(arrayPalabrasDiccionario);
}

/*function return_specific_data(number){

}*/

function resolverTablero(data){

    let palabra = "";
    let anterior = null;
    filasErroneas = [];
    var error = false;

    data.forEach(function(elemento, indice, _array){
        elemento.forEach(function(elemento, _indice, _array){
            palabra += elemento;
        });
        if(indice<6){
            if(error & indice!=5){
                if(indice == 4) error = false;
                filasErroneas.push(indice);
            }else{
                if(!validarFila(palabra,indice,anterior)){
                    filasErroneas.push(indice);
                    error = true;
                }
            }
        }else{
            if(error & indice != 11){
                if(indice == 10) error = false;
                filasErroneas.push(indice);
            }else{
                if(!validarFila(palabra,indice,anterior)){
                    filasErroneas.push(indice);
                    error = true;
                }
            }
        }
        anterior = palabra;
        palabra = "";
    });
    return filasErroneas;
}

function validarFila(palabra, indice, anterior){
    let solucion = null;
    palabra = palabra.toLowerCase();
    let resultado;
    if(solucionFijas.hasOwnProperty(indice)){
        solucion = solucionFijas[indice];
        return solucion==palabra?true:false;
    }else{
        if(existe(palabra)){
            resultado = validarCambio(palabra,anterior,indice)?true:false;
        }else{
            resultado = false;
        }
    }
    if(resultado & (indice == 4 | indice == 10)){
        resultado = validarCambio(solucionFijas[indice+1],palabra,indice+1);
    }
    return resultado;
}

function existe(palabra){
    if(palabra.length == 4){
        return arrayPalabrasDiccionario['4'].includes(palabra);
    }else if(palabra.length == 6){
        return arrayPalabrasDiccionario['6'].includes(palabra);
    }else{
        return false;
    }
}

function validarCambio(palabra, anterior, indice){
    anterior = anterior.toLowerCase();
    var longitud = palabra.length;
    let palabraMod, todasLetras, ant, numCoincidencias = 0;
    if(indice%2==1){ //cambio letra
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

/*function otorgarPista(letras){

}*/

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

// POST -> Datos del pasatiempo escogido
app.post('/server.js', function(request, response){
    const valores = request.body.valorCasillas;
    let vector = resolverTablero(valores);
    response.send(vector);
    /*let data = return_specific_data(parametros);
    response.send(data);*/
});

app.post('/data', function(request, response){
    const valor = request.body.valor;
    console.log(valor);
    console.log("holaaaa");
    response.send("holaaaaa");
});

// POST -> Comprobación del tablero
/*app.post('/server.js/data', function(request, response){
    const received = request.body;
    let vectorErrores = corregirTablero(received);
    response.send(vectorErrores);
});*/

// POST -> Para dar las pistas
/*app.post('/clues.js', function(request, response){
    const received = request.body.vector;
    let arrayPistas = otorgarPista(received);
    response.send(arrayPistas);
});*/

app.listen(port, () => {
    cargarDiccionario([4,6]);
    console.log("Example app listening at "+`http://localhost:${port}`);
});

