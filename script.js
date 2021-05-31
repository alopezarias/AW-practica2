var casillas = [];
var valorCasillas = [];
var letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
var guardarDatos = false;
var pistas = 3;
var infoPasatiempo = {'valores': '', 'pistas': ''};
var colores = {'verde':'#A7F270', 'rojo':'#E66852', 'azul':'#7ab6da'};
var contador = 0;

var tablero;
var origen;
var longitudes;

var elements = [];
var id;

function eleccionPasatiempo(){
    elements[0] = document.getElementById("section");
    elements[1] = document.getElementById("barra");
    elements[2] = document.getElementById("section_eleccion");
    elements[3] = document.getElementById("botonSolucion")
    elements[0].style.display = "none";
    elements[1].style.display = "none";
    elements[2].style.display = "block";
    elements[3].style.display = "none";
}

function cargarDatosPasatiempo(id_pasatiempo){
    id = id_pasatiempo;
    elements[0].style.display = "flex";
    elements[1].style.display = "block";
    elements[2].style.display = "none";
    //let id_pasatiempo = "uno";
    $.post("http://localhost:8000/data", {id: id_pasatiempo}, function(result){    
        //console.log(result);
        cargarPistas(result.infoPalabras);
        setearValores(result);
        setearTablero.then(crearTabla(),cargarInfoGuardada(id_pasatiempo));
        //metodo para setear el tablero, las pistas y el origen de coordenadas
    });
    /*$.post("http://localhost:8000/diccionario", {parametro: "nulo"}, function(result){    
        //poner la comprobacion de que el server ya ha cargado la info del diccionario
        while(result!=true){}
        document.getElementById("botonResolver").disabled = false;
        document.getElementById("botonResolver").enabled = true;
    });*/
    setTimeout(() => {
        document.getElementById("botonResolver").disabled = false;
        document.getElementById("botonResolver").enabled = true;
    }, 5000);
    
}

function mostrarBotonSolucion(){
    elements[3].style.display = "inline-block";
}

function mostrarSolucion(){
    $.post("http://localhost:8000/solucion", {id: id}, function(result){    
        rellenarTablero(result);
    });
}

function rellenarTablero(soluciones){
    let anteriores = valorCasillas;
    cargarValoresCasillas(soluciones);
    valorCasillas = anteriores;
}

function volverValoresAnteriores(){
    cargarValoresCasillas(valorCasillas);
}

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/*FUNCIONES DE LA CARGA DEL DICCIONARIO Y ESTRUCTURAS DE DATOS INICIALES */

function cargarInfoGuardada(id){
    inicializarValorCasillas();
    if (typeof(Storage) !== "undefined") {
        let info = localStorage.getItem("pasatiempo_" + id);
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
                let coordenadas = [i-origen[0], j-origen[1]];
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
        if(fila.length != 0) valorCasillas.push(fila);
    }
    console.log(valorCasillas);
}

/*FUNCIONES ENCARGADAS DEL GUARDADO DE INFORMACIÓN EN EL ALMACENAMIENTO */

function cambioAlmacenamiento(){
    let valor = document.getElementById("guardar");
    let guardarDatos = valor.checked;
    if(guardarDatos){
        alert("SE GUARDARÁ EL PROGRESO");
        guardarTodoEnMemoria();
    }else{
        localStorage.removeItem("pasatiempo_" + id);
        alert("EL PROGRESO NO SE GUARDARÁ");
    }
}

function guardarTodoEnMemoria(){
    guardarValorCasillas();
    infoPasatiempo.valores = valorCasillas;
    infoPasatiempo.pistas = pistas;
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("pasatiempo_" + id, JSON.stringify(infoPasatiempo));
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function guardarCasillasEnMemoria(){
    infoPasatiempo.valores = valorCasillas;
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("pasatiempo_" + id, JSON.stringify(infoPasatiempo));
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function guardarPistasEnMemoria(){
    infoPasatiempo.pistas = pistas;
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("pasatiempo_" + id, JSON.stringify(infoPasatiempo));
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
                let coordenadas = [i-origen[0], j-origen[1]];
                valorCasillas[coordenadas[0]][coordenadas[1]] = casillas[coordenadas[0]][coordenadas[1]].value;
            }
        }
    }
}

/*FUNCIONES DE PISTAS DE PALABRAS*/

function otorgarPista(){
    if(pistas>0){
        var letras = document.getElementById("letrasPista").value.toLowerCase();
        $.post("http://localhost:8000/clue", {letras: letras}, function(result){
            console.log('FIN PISTAS');
            mostrarPistas(result);
        });
    }else{
        alert("NO HAY MÁS PISTAS DISPONIBLES");
    }
}

function mostrarPistas(texto){
        document.getElementById("pista").value = texto;
        pistas--;
        actualizarPistas();
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
    if(contador < 5){
        contador++;
    }else{
        mostrarBotonSolucion();
    }
    console.log(this.valorCasillas);
    $.post("http://localhost:8000/check", {valorCasillas: this.valorCasillas}, function(result){
        console.log('FIN COMPROBACIÓN');
        console.log(result);
        corregirTablero(result.validas, result.correctas);
    });
}

function corregirTablero(filasValidas, filasCorrectas){
    casillas.forEach(function(elemento, indice, _array){
        var funcion = pintarRojo;
        if(filasValidas!=null && filasValidas.includes(indice))
            funcion = pintarVerde;
        else if(filasCorrectas!=null && filasCorrectas.includes(indice))
            funcion = pintarAzul;
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

function pintarAzul(elemento){
    elemento.style.backgroundColor=colores.azul;
}

/*FUNCIONES DE LA CREACIÓN DEL TABLERO DE JUEGO DEL PASATIEMPO*/
function crearTabla(){
    let tabla = document.getElementById("tabla");
    let tbody = document.createElement("tbody");

    let header = document.createElement("th");
    let h2 = document.createElement("h2");
    h2.innerHTML = "TABLERO DEL PASATIEMPO";
    header.appendChild(h2);
    header.setAttribute("colspan",9);
    tbody.appendChild(header);
    
    for(let i=0; i<tablero.length; i++){
        let fila = document.createElement("tr");
        let refFila = [];
        for(let j=0; j<tablero[0].length; j++){
            let valor = tablero[i][j];
            let columna, celda;
            if(valor == " "){
                columna = createEmptyColumn();
            }else if(valor == "I"){
                let indices = [i-origen[0], j-origen[1]];
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
    tbody.setAttribute("id","tbody_tablero");
    tabla.appendChild(tbody);
    console.log(casillas);
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

function cargarLeyenda(){
    let tabla = document.getElementById("tabla_leyenda");
    let tbleyenda = document.createElement("tbody");

    let header = document.createElement("th");
    let h2 = document.createElement("h4");
    h2.innerHTML = "LEYENDA DEL TABLERO";
    header.appendChild(h2);
    header.setAttribute("colspan",2);
    tbleyenda.appendChild(header);
    
    let colores = ['#A7F270','#E66852','#7ab6da'];
    let leyendas = ['Palabra válida','Palabra errónea','Palabra correcta'];

    for(let i=0; i<3; i++){
        let fila = document.createElement("tr");
        let col0 = createLeyendaColumn(colores[i])
        let col1 = document.createElement("td");
        col1.innerHTML = leyendas[i];
        fila.appendChild(col0);
        fila.appendChild(col1);
        tbleyenda.appendChild(fila);
    }

    tbleyenda.setAttribute("id","tbody_leyenda");
    tabla.appendChild(tbleyenda);
}

function createLeyendaColumn(color){
    let celda = document.createElement("input");
    celda.setAttribute("class","celda");
    celda.setAttribute("type","text");
    celda.setAttribute("size","1");
    celda.setAttribute("maxlength","1");
    celda.setAttribute("readonly","true");
    celda.setAttribute("focusable","false");
    celda.style.backgroundColor=color;
    let columna = document.createElement("td");
    columna.setAttribute("class","columna_input");
    columna.setAttribute("colspan","1");
    columna.appendChild(celda);
    return columna;
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

/*function cargarPistas(pistas){
    let pista;
    for(const [key, value] of Object.entries(pistas)){
        pista = document.getElementById("pista"+(key));
        pista.innerHTML = value;
    }
}*/

function setearValores(array){
    tablero = array.tablero;
    longitudes = array.longitudes;
    origen = array.origen;
}

var setearTablero = new Promise(function(resolve, reject){
    while(tablero == 'undefined'){}
    resolve();
});
    
function cargarPistas(pistas){
    let lista = document.getElementById("informacion_palabras");
    let pista;
    for(const [key, value] of Object.entries(pistas)){
        pista = document.createElement('li');
        pista.setAttribute("id","pista"+key);
        pista.innerHTML = value;
        lista.appendChild(pista);
    }
}