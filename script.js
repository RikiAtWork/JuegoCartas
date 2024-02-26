const principal = document.querySelector(".principal");
const juego = document.querySelector(".content");
const victoria = document.getElementById('win');

document.getElementById('volver').addEventListener('click', volverJugar);
document.getElementById('volver-jugar').addEventListener('click', volverJugar);


const imgCartasFrontales = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const posicionesCartas = ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10', 'card11', 'card12', 'card13', 'card14', 'card15', 'card16', 'card17', 'card18', 'card19', 'card20', 'card21', 'card22', 'card23', 'card24'];

const estructuraJuego = Array(24).fill().map(() => ({ posicion: "posicion", imagen: "imagen", estado: "reverso" }));

let contadorAciertos = 0;
let contadorFallos = 0;

const aciertosGuardado = localStorage.getItem('contadorAciertos');
const fallosGuardado = localStorage.getItem('contadorFallos');

if (aciertosGuardado !== null) {
    contadorAciertos = parseInt(aciertosGuardado);
    document.getElementById('aciertos').textContent = 'Aciertos: ' + contadorAciertos;
}

if (fallosGuardado !== null) {
    contadorFallos = parseInt(fallosGuardado);
    document.getElementById('fallos').textContent = 'Fallos: ' + contadorFallos;
}

function comenzarJuego() {
    principal.style.display = "none";
    juego.style.display = "flex";
    document.getElementById('tablero-juego').style.display = 'flex';
    document.getElementById('content-puntos').style.display = 'flex';
    iniciar();
}

function iniciar() {
    establecerCartasAleatorias(estructuraJuego);
    agregarComportamientoCartas();

}

function agregarImagenesCartasFrontales(juego) {
    for (let i in juego) {
        juego[i].posicion = posicionesCartas[i];
    }
}

function obtenerPosicionesAleatoriasCartas(juego) {
    let cartasFrontales = [...imgCartasFrontales];
    let contador = juego.length;
    
    while (contador > 0) {
        let indice = Math.floor(Math.random() * cartasFrontales.length);
        juego[contador - 1].imagen = cartasFrontales.splice(indice, 1)[0];
        contador--;
    }
}

function establecerImagenesEnDom(juego) {
    juego.forEach(elem => {
        document.getElementById(elem.posicion).querySelector('.card-front img').src = "./jugadores/" + elem.imagen + ".png";
    });
}

function establecerCartasAleatorias(juego) {

    agregarImagenesCartasFrontales(juego);
    obtenerPosicionesAleatoriasCartas(juego);
    establecerImagenesEnDom(juego);

    localStorage.setItem('estructuraJuego', JSON.stringify(juego));
}

function agregarComportamientoCartas() {

    const juego = JSON.parse(localStorage.getItem('estructuraJuego'));

    juego.forEach(carta => {
        const cartaElemento = document.getElementById(carta.posicion);
        cartaElemento.addEventListener('click', function () {
            const cartaClickeada = juego.find(item => item.posicion === carta.posicion);

            const cartaInterior = this.querySelector('.card-inner');
            if (!cartaElemento.classList.contains('flipped')) {
                cartaInterior.style.transform = 'rotateY(180deg)';
                cartaClickeada.estado = 'frontal';
                cartaElemento.classList.add('flipped');
            } else {
                cartaInterior.style.transform = 'rotateY(0deg)';
                cartaClickeada.estado = 'reverso';
                cartaElemento.classList.remove('flipped');
            }

            let cartasVolteadas = juego.filter(carta => carta.estado === "frontal");
            if (cartasVolteadas.length === 2) {
                comprobarPares(cartasVolteadas);
                comprobarGanar(juego);
            }
        });
    });
}

function comprobarPares(cartasVolteadas) {
    const contadorAciertosGuardado = localStorage.getItem('contadorAciertos');

    if(contadorAciertosGuardado){
        contadorAciertos = parseInt(contadorAciertosGuardado);
    }

    if (cartasVolteadas[0].imagen === cartasVolteadas[1].imagen) {
        cartasVolteadas.forEach(carta => carta.estado = 'par');
        contadorAciertos += 1;

        localStorage.setItem('contadorAciertos', contadorAciertos);

        document.getElementById('aciertos').textContent = 'Aciertos: ' + contadorAciertos;
        document.getElementById('aciertoSonido').play();

         const posicionesEmparejadas = cartasVolteadas.map(carta => carta.posicion);
         const parejasAcertadas = JSON.parse(localStorage.getItem('parejasAcertadas')) || [];
         parejasAcertadas.push(posicionesEmparejadas);
         localStorage.setItem('parejasAcertadas', JSON.stringify(parejasAcertadas));

    } else {
        const contadorFallosGuardado = localStorage.getItem('contadorFallos');
        
        if(contadorFallosGuardado){
            contadorFallos = parseInt(contadorFallosGuardado);
        }
        contadorFallos += 1;
        localStorage.setItem('contadorFallos', contadorFallos);

        document.getElementById('fallos').textContent = 'Fallos: ' + contadorFallos;
        document.getElementById('falloSonido').play();

        setTimeout(() => {
            cartasVolteadas.forEach(carta => {
                carta.estado = 'reverso';
                const cartaElemento = document.getElementById(carta.posicion);
                const cartaInterior = cartaElemento.querySelector('.card-inner');
                cartaInterior.style.transform = 'rotateY(0deg)';
                cartaElemento.classList.remove('flipped');
            });
        }, 800);
    }
}

function comprobarGanar(juego) {
    if (juego.every(carta => carta.estado === 'par')) {
        document.getElementById('win').style.display = 'flex';
        document.getElementById('intentos').textContent = contadorFallos;
        document.getElementById('tablero-juego').style.display = 'none';
        document.getElementById('content-puntos').style.display = 'none';
        document.getElementById('victoria').play();

    }
}

function volverJugar() {
    victoria.style.display = "none";
    juego.style.display = "none"
    principal.style.display = "flex";

    contadorAciertos = 0;
    contadorFallos = 0;
    document.getElementById('aciertos').textContent = 'Aciertos: ' + contadorFallos;
    document.getElementById('fallos').textContent = 'Fallos: ' + contadorAciertos;
    estructuraJuego.forEach(carta => {
        carta.estado = 'reverso';
                const cartaElemento = document.getElementById(carta.posicion);
                const cartaInterior = cartaElemento.querySelector('.card-inner');
                cartaInterior.style.transform = 'rotateY(0deg)';
                cartaElemento.classList.remove('flipped');
    });
    localStorage.removeItem('contadorAciertos');
    localStorage.removeItem('contadorFallos');
    localStorage.removeItem('estructuraJuego');

    iniciar();
}