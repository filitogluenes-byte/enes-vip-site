const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const welcomeMsg = document.getElementById('welcome-msg');

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            // Yumruk Kontrolü
            const isFist = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y;
            welcomeMsg.style.display = isFist ? 'block' : 'none';
            
            // 5 Parmak Çizgisi
            canvasCtx.strokeStyle = "#00FFFF";
            canvasCtx.lineWidth = 4;
            [4, 8, 12, 16, 20].forEach(tip => {
                canvasCtx.beginPath();
                canvasCtx.moveTo(landmarks[0].x * canvasElement.width, landmarks[0].y * canvasElement.height);
                canvasCtx.lineTo(landmarks[tip].x * canvasElement.width, landmarks[tip].y * canvasElement.height);
                canvasCtx.stroke();
            });
        }
    }
    canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
        await hands.send({image: videoElement});
    }
});

// Açılış animasyonundan sonra kamerayı başlat
setTimeout(() => {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    camera.start();
}, 4000);
