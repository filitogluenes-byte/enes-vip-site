// Menü Geçiş Fonksiyonu
function showSection(name) {
    document.getElementById('chat-section').style.display = name === 'chat' ? 'block' : 'none';
    document.getElementById('games-section').style.display = name === 'games' ? 'block' : 'none';
    if(name === 'games') { startCamera(); } // Eğlenceye girince kamerayı aç
}

// Basit Giriş/Kayıt Simülasyonu
function handleLogin() {
    const user = document.getElementById('username').value;
    if(user) {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('menu-screen').style.display = 'flex';
        document.getElementById('welcome-user').innerText = "Merhaba, " + user;
    }
}

// El Algılama ve KONFETİ EFEKTİ
function onResults(results) {
    const canvasElement = document.getElementById('output_canvas');
    const canvasCtx = canvasElement.getContext('2d');
    const welcomeMsg = document.getElementById('welcome-msg');

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            const isFist = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y;
            if(isFist) {
                welcomeMsg.style.display = 'block';
                // KONFETİ PATLAT!
                confetti({ particleCount: 10, spread: 70, origin: { y: 0.6 }, colors: ['#00ffff', '#ffffff'] });
            } else {
                welcomeMsg.style.display = 'none';
            }
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FFFF', lineWidth: 2});
        }
    }
    canvasCtx.restore();
}

// Kamera Başlatma
let cameraActive = false;
function startCamera() {
    if(cameraActive) return;
    const hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
    hands.onResults(onResults);
    const camera = new Camera(document.getElementById('input_video'), {
        onFrame: async () => { await hands.send({image: document.getElementById('input_video')}); },
        width: 640, height: 480
    });
    camera.start();
    cameraActive = true;
}
