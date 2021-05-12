var arrayPalabras4 = [];
var arrayPalabras6 = [];
var casillas = [];
var valorCasillas = [];
var filasErroneas = [];
var letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
var guardarDatos = false;
var pistas = 3;
var infoPasatiempo = {'valores': '', 'pistas': ''};
var soluciones = {'0': 'clan', '5':'pena', '6':'remato', '11':'torero'};
var colores = {'verde':'#A7F270', 'rojo':'#E66852'};

var tablero = [
    [" "," "," "," "," "," "," "," "," "],
    [" "," ","I","I","I","I","1"," "," "],
    [" "," ","I","I","I","I"," "," "," "],
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
];
var origenes = [1,2];

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

/*FUNCIONES DE LA CARGA DEL DICCIONARIO Y ESTRUCTURAS DE DATOS INICIALES */

function cargarDiccionario(){
    let url = "https://ordenalfabetix.unileon.es/aw/diccionario.txt";
    //let url = "https://diccionario.casasoladerueda.es/diccionario.txt";
    fetch(url)
        .then(response => response.text())
        .then((response) => {
            almacenarPalabras(response);
        })
        .catch(function(){
            e => console.log(`Error :  ${e}`)
        });
}

function almacenarPalabras(texto){
    let palabras = texto.split("\n");
    palabras.forEach(function(elemento, _indice, _array) {
        if(elemento.length == 4){
            arrayPalabras4.push(removeAccents(elemento));
        }else if(elemento.length == 6){
            arrayPalabras6.push(removeAccents(elemento));
        }
    });
    document.getElementById("botonResolver").disabled = false;
    document.getElementById("botonResolver").enabled = true;
}

function cargarInfoGuardada(){
    inicializarValorCasillas();
    if (typeof(Storage) !== "undefined") {
        let info = localStorage.getItem("pasatiempo");
        if(info !== null){
            infoPasatiempo = JSON.parse(info);
            document.getElementById("guardar").checked = true;
            guardarDatos = true;
            if(infoPasatiempo.valores.length > 0)
                cargarValoresCasillas(infoPasatiempo.valores);
            this.pistas = parseInt(infoPasatiempo.pistas);
            actualizarPistas();
        }else{
            document.getElementById("guardar").checked = false;
            alert("No se ha podido recuperar la información guardada")
        }
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function cargarValoresCasillas(valores){
    valorCasillas = valores;
    for(let i=0; i<tablero.length; i++){
        for(let j=0; j<tablero[0].length; j++){
            if(tablero[i][j] == "I"){
                let coordenadas = [i-origenes[0], j-origenes[1]];
                casillas[coordenadas[0]][coordenadas[1]].value = valorCasillas[coordenadas[0]][coordenadas[1]];
            }
        }
    }
}

function inicializarValorCasillas(){
    valorCasillas = [];
    for(let i=0; i<tablero.length; i++){
        fila = [];
        for(let j=0; j<tablero[0].length; j++){
            if(tablero[i][j] == "I"){
                fila.push("");
            }
        }
        valorCasillas.push(fila);
    }
}

/*FUNCIONES ENCARGADAS DEL GUARDADO DE INFORMACIÓN EN EL ALMACENAMIENTO */

function cambioAlmacenamiento(){
    let valor = document.getElementById("guardar");
    let guardarDatos = valor.checked;
    if(guardarDatos){
        alert("SE GUARDARÁ EL PROGRESO");
        guardarTodoEnMemoria();
    }else{
        localStorage.removeItem("pasatiempo");
        alert("EL PROGRESO NO SE GUARDARÁ");
    }
}

function guardarTodoEnMemoria(){
    guardarValorCasillas();
    infoPasatiempo.valores = valorCasillas;
    infoPasatiempo.pistas = pistas;
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("pasatiempo", JSON.stringify(infoPasatiempo));
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function guardarCasillasEnMemoria(){
    infoPasatiempo.valores = valorCasillas;
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("pasatiempo", JSON.stringify(infoPasatiempo));
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function guardarPistasEnMemoria(){
    infoPasatiempo.pistas = pistas;
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("pasatiempo", JSON.stringify(infoPasatiempo));
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function guardarCasilla(x,y){
    let cambio = guardarValorCasilla(x,y);
    if(guardarDatos && cambio){
        guardarCasillasEnMemoria();
    }
}

function guardarValorCasilla(x,y){
    let haCambiado = valorCasillas[x][y]==casillas[x][y].value ? false:true; //si no ha cambiado, no guardamos nada
    valorCasillas[x][y] = haCambiado?casillas[x][y].value:valorCasillas[x][y];
    return haCambiado;
}

function guardarValorCasillas(){
    for(let i=0; i<tablero.length; i++){
        for(let j=0; j<tablero[0].length; j++){
            if(tablero[i][j] == "I"){
                let coordenadas = [i-origenes[0], j-origenes[1]];
                valorCasillas[coordenadas[0]][coordenadas[1]] = casillas[coordenadas[0]][coordenadas[1]].value;
            }
        }
    }
}

/*FUNCIONES DE PISTAS DE PALABRAS*/

function otorgarPista(){
    if(pistas>0){
        var letras = document.getElementById("letrasPista").value.toLowerCase();
        //letras = letras.toLowerCase();
        var palabras = [];
        var palabra = "";
        var coincide;

        arrayPalabras4.forEach(function(elemento, _indice, _array){
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
        arrayPalabras6.forEach(function(elemento, indice, array){
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
        var texto = "";
        palabras.forEach(function(elemento, indice, array){
            texto += elemento + "\t";
        });
        document.getElementById("pista").value = texto;
        this.pistas--;
        actualizarPistas();
    }else{
        alert("NO HAY MÁS PISTAS DISPONIBLES");
    }
    guardarPistasEnMemoria();
}

function actualizarPistas(){
    let texto = document.getElementById("botonPista").innerText;
    let nuevo = "";
    nuevo = nuevo + texto.slice(0, 13) + pistas + ")";
    document.getElementById("botonPista").innerText = nuevo;
    if(pistas<1){
        document.getElementById("botonPista").enabled = false;
        document.getElementById("botonPista").disabled = true;
    }
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

/*FUNCIONES DE RESOLUCIÓN DEL TABLERO */

function resolverPasatiempo(){
    let palabra = "";
    let anterior = null;
    filasErroneas = [];
    var error = false;

    valorCasillas.forEach(function(elemento, indice, _array){
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
    corregirTablero();
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
            resultado = false;
        }
    }
    if(resultado & (indice == 4 | indice == 10)){
        resultado = validarCambio(soluciones[indice+1],palabra,indice+1);
    }
    return resultado;
}

function existe(palabra){
    if(palabra.length == 4){
        return arrayPalabras4.includes(palabra);
    }else if(palabra.length == 6){
        return arrayPalabras6.includes(palabra);
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

function corregirTablero(){
    casillas.forEach(function(elemento, indice, _array){
        var funcion = pintarVerde;
        if(filasErroneas.includes(indice))
            funcion = pintarRojo;
        elemento.forEach(function(elemento, _indice, _array){
            funcion(elemento);
        });
    });
}

function pintarVerde(elemento){
    elemento.style.backgroundColor=colores.verde;
}

function pintarRojo(elemento){
    elemento.style.backgroundColor=colores.rojo;
}

/*FUNCIONES DE LA CREACIÓN DEL TABLERO DE JUEGO DEL PASATIEMPO*/
function crearTabla(){
    let tabla = document.getElementById("tabla");
    let tbody = document.createElement("tbody");
    
    for(let i=0; i<tablero.length; i++){
        let fila = document.createElement("tr");
        let refFila = [];
        for(let j=0; j<tablero[0].length; j++){
            let valor = tablero[i][j];
            let columna, celda;
            if(valor == " "){
                columna = createEmptyColumn();
            }else if(valor == "I"){
                let indices = [i-origenes[0], j-origenes[1]];
                let coordenadas = "celda"+letras[indices[0]]+indices[1];
                celda = createInputCell(coordenadas,indices);
                columna = createInputColumn(celda);
                refFila.push(celda);
            }else{
                columna = createNumberColumn(valor);
            }
            fila.appendChild(columna);
        }
        if(refFila.length > 0){
            casillas.push(refFila);
        }
        refFila = [];
        tbody.appendChild(fila);
    }
    tabla.appendChild(tbody);
}

function createEmptyColumn(){
    let columna = document.createElement("td");
    columna.setAttribute("class","columna_vacio");
    columna.setAttribute("colspan","1");

    let empty = document.createElement("p");
    empty.innerHTML = "";

    columna.appendChild(empty);
    return columna;
}

function createInputColumn(celda){
    let columna = document.createElement("td");
    columna.setAttribute("class","columna_input");
    columna.setAttribute("colspan","1");
    columna.appendChild(celda);
    return columna;
}

function createInputCell(id, indices){
    let celda = document.createElement("input");
    celda.setAttribute("id",id);
    celda.setAttribute("class","celda");
    celda.setAttribute("type","text");
    celda.setAttribute("size","1");
    celda.setAttribute("maxlength","1");
    celda.setAttribute("onblur","guardarCasilla("+indices+")");
    return celda;
}

function createNumberColumn(num){
    let columna = document.createElement("td");
    columna.setAttribute("class","columna_num");
    columna.setAttribute("colspan","1");

    let texto = document.createElement("a");
    texto.setAttribute("class", "texto");
    texto.innerHTML = num;

    columna.appendChild(texto);
    return columna;
}