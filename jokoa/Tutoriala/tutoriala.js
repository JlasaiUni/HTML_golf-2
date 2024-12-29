const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const holeRadius = 20;
let mouseX = 0;
let mouseY = 0;
let isPressing = false;
let pressTime = 0;

let kolpeak = 0; // Contador de golpes
let denboraErresten = 60; // Tiempo restante en segundos
let jokoan = true; // Estado del juego, empieza en true

const ball = {
    x: 100,
    y: 100,
    radius: 10,
    dx: 0,
    dy: 0,
    gravity: 0.7,
    friction: 0.99,
    bounce: 0.7,
    color: 'black',
    power: 0,
};
const holeX = canvas.width - 100;
const holeY = canvas.height - 100;

// Evento: Detectar clic para cargar potencia
canvas.addEventListener('mousedown', (event) => {
    if (!jokoan) return;
    mouseX = event.clientX;
    mouseY = event.clientY;
    isPressing = true;
    pressTime = Date.now();
});

// Evento: Detectar liberación para lanzar la pelota
canvas.addEventListener('mouseup', (event) => {
    if (!jokoan) return;
    isPressing = false;
    const releaseTime = Date.now();
    const deltaTime = (releaseTime - pressTime) / 100; 
    const angle = Math.atan2(mouseY - ball.y, mouseX - ball.x);
    ball.dx = deltaTime * Math.cos(angle) * 2;
    ball.dy = deltaTime * Math.sin(angle) * 2;
    kolpeak++; // Incrementar contador de golpes
});

// Función: Dibujar agujero
function drawHole() {
    ctx.beginPath();
    ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.closePath();
}

// Función: Dibujar pelota
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Función: Dibujar flecha de dirección
function drawArrow() {
    if (isPressing) {
        const releaseTime = Date.now();
        const deltaTime = (releaseTime - pressTime) / 100; 
        const angle = Math.atan2(mouseY - ball.y, mouseX - ball.x);
        const arrowLength = deltaTime * 15; // Ajustar la longitud de la flecha

        const arrowX = ball.x + arrowLength * Math.cos(angle);
        const arrowY = ball.y + arrowLength * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(arrowX, arrowY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
    }
}

// Función: Verificar colisión
function checkCollision() {
    const distX = ball.x - holeX;
    const distY = ball.y - holeY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < ball.radius + holeRadius) {
        goToNextPage();
        ball.dx = 0;
        ball.dy = 0;
        ball.x = 100; // Reiniciar posición de la pelota
        ball.y = 100;
        jokoan = false; // Terminar juego
    }
}

// Función: Dibujar HUD (marcador y temporizador)
function drawHUD() {
    ctx.font = "25px Calibri";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText(`KOLPEAK: ${kolpeak}`, 20, 30);
    ctx.fillText(`DENBORA: ${denboraErresten}s`, 500, 30);
}

// Función: Dibujar texto explicativo (tutorial)
function drawTutorial() {
    ctx.font = "20px Calibri";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    
    // Tutorial del juego
    ctx.fillText("Denbora 0 segundura heltzen bada galdu egingo duzu.", canvas.width / 3, 50);
    ctx.fillText("Kolpeen kontadore bat edukiko duzu beti pantailan", canvas.width / 70, 50);
    ctx.fillText("zure maila ikusteko.", canvas.width / 70, 70);
    ctx.fillText("Helburua: Sartu pilota zuloan", canvas.width / 3, 70);
    ctx.fillText("Egin klik eta mantendu presioa potentzia kargatzeko", canvas.width / 12, 720);
    ctx.fillText("Askatu klik pilota zulorantz jaurtitzeko", canvas.width / 12, 740);
    ctx.fillText("Pilotak hormetan errebotatuko du eta grabitateak eragina izango du", canvas.width - 3, 170);
}

// Función: Actualizar estado del juego
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTutorial(); // Mostrar el tutorial siempre

    if (jokoan) {
        drawHole();
        drawBall();
        drawArrow();
        drawHUD();
        checkCollision();
        
        // Actualización de la pelota y su movimiento
        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx * ball.bounce;
        }
        if (ball.y + ball.dy > canvas.height - ball.radius) {
            ball.dy = -ball.dy * ball.bounce;
            ball.y = canvas.height - ball.radius; // Evitar que la pelota salga del lienzo
        } else if (ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy * ball.bounce;
            ball.y = ball.radius; // Evitar que la pelota salga del lienzo
        }

        ball.dy += ball.gravity; // Aplicar la gravedad
        ball.dx *= ball.friction; // Aplicar la fricción
        ball.dy *= ball.friction; // Aplicar la fricción

        ball.x += ball.dx;
        ball.y += ball.dy;
    }
}

// Temporizador del juego
function startTimer() {
    const interval = setInterval(() => {
        if (denboraErresten > 0) {
            denboraErresten--;
        } else {
            clearInterval(interval);
            jokoan = false;
            alert("Denbora bukatu zaizu");
        }
    }, 1000);
}

// Animar el juego
function animate() {
    if (jokoan) {
        requestAnimationFrame(animate);
    }
    update();
}

// Iniciar el juego
startTimer();
animate();

// Ajustar tamaño del lienzo al redimensionar ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function goToNextPage() {
    window.location.href = '../inicio/zernahida.html'; // Aquí reemplazas con el nombre de la página a la que quieres ir
}