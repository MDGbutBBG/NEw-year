// --- GEMINI API CONFIG ---
const apiKey = ""; // Runtime Environment will provide this

// --- DATA ---
const messages = [
    "ยินดีต้อนรับ<br>ไม่ว่าจะเปิดลิงก์นี้ในช่วงเวลาไหนของปี<br>ขอให้คุณได้พักใจอยู่ตรงนี้สักหน่อย",
    "เราอาจจะรู้จักกันดี<br>หรืออาจแค่ผ่านกันในโลกออนไลน์<br>แค่อยากให้รู้ว่าในช่วงเวลานี้<br>คุณไม่ได้อยู่ตรงนี้คนเดียว",
    "ปีที่ผ่านมานี้<br>คุณพยายามมากกว่าที่ใครหลายคนเห็น<br>แม้บางวันจะไม่มั่นใจ<br>แม้บางอย่างจะยังไม่สำเร็จ",
    "ขอให้เป้าหมายในชีวิตชัดเจน<br>และก้าวไปถึงได้ในแบบที่คุณต้องการ",
    "ขอให้ความรัก<br>ของคุณเบ่งบาน<br>ขอให้มันเป็นพื้นที่ปลอดภัย<br>ไม่ว่าจะมาจากใครก็ตาม",
    "หากปีนี้คุณยังไปไม่ถึงจุดที่หวัง<br>นั่นไม่ได้แปลว่าคุณล้มเหลว<br>แต่มันแปลว่าคุณยังมีชีวิตอยู่และยังทำมันต่อไป",
    "ขอให้ความพยายามทั้งหมด<br>ไม่หายไปกับกาลเวลา<br>แต่กลายเป็นแรงเล็กๆ<br>ที่พาคุณไปต่อ",
    "ขอให้ให้ส่งต่อความพยายามนั้น",
    "ไปถึงวันพรุ่งนี้",
    "สุขสันต์วันปีใหม่<br>ขอให้ปีนี้ใจดีกับคุณ<br>ในแบบที่ปีที่แล้วทำไม่ได้"
];

// --- STATE MANAGEMENT ---
let currentIndex = 0;
let isAnimating = false;
let isFinale = false;
const totalMessages = messages.length;
let isAIModalOpen = false;

// --- DOM ELEMENTS ---
const messageBox = document.getElementById('message-box');
const textContent = document.getElementById('text-content');
const hintText = document.getElementById('hint-text');
const clickArea = document.getElementById('click-area');
const finaleBox = document.getElementById('finale-box');
const yearText = document.getElementById('year-text');

const btnContainer = document.getElementById('btn-container');
const restartBtn = document.getElementById('restart-btn');
const aiWishBtn = document.getElementById('ai-wish-btn');

const aiModal = document.getElementById('ai-modal');
const userFeelingInput = document.getElementById('user-feeling');
const generateBtn = document.getElementById('generate-btn');
const closeModalBtn = document.getElementById('close-modal');
const spinner = document.getElementById('spinner');

// Set next year dynamically
yearText.innerText = "2026";

// --- CORE FUNCTIONS ---

function init() {
    textContent.innerHTML = messages[0];
    setTimeout(() => {
        messageBox.classList.add('visible');
    }, 500);
}

function showNextMessage() {
    if (isAnimating || isFinale || isAIModalOpen) return;
    
    isAnimating = true;

    // 1. Hide current message
    messageBox.classList.remove('visible');
    messageBox.classList.add('fade-out');

    if (!hintText.classList.contains('hidden')) {
        hintText.classList.add('hidden');
    }

    // 2. Wait for transition
    setTimeout(() => {
        // Check if we just finished the last message
        if (currentIndex >= totalMessages - 1) {
           startFinale();
           isAnimating = false;
           return;
        }

        currentIndex++;
        textContent.innerHTML = messages[currentIndex];
        
        messageBox.classList.remove('fade-out');
        void messageBox.offsetWidth; 
        messageBox.classList.add('visible');
        isAnimating = false;
    }, 1200); 
}

function startFinale() {
    isFinale = true;
    messageBox.style.display = 'none';
    finaleBox.classList.add('visible');
    enableFireworks = true;

    setTimeout(() => {
        btnContainer.classList.add('active');
        restartBtn.classList.add('visible');
        aiWishBtn.classList.add('visible');
    }, 3000);
}

function restart() {
    if (isAnimating) return;
    isAnimating = true;
    
    finaleBox.classList.remove('visible');
    restartBtn.classList.remove('visible');
    aiWishBtn.classList.remove('visible');
    btnContainer.classList.remove('active');
    
    setTimeout(() => {
        isFinale = false;
        enableFireworks = false;
        fireworks = [];
        sparks = [];
        currentIndex = 0;
        
        messageBox.style.display = 'block';
        textContent.innerHTML = messages[currentIndex];
        messageBox.classList.remove('fade-out');
        void messageBox.offsetWidth; 
        messageBox.classList.add('visible');
        isAnimating = false;
    }, 1500);
}

// --- GEMINI AI FUNCTIONALITY ---

function openAIModal() {
    isAIModalOpen = true;
    aiModal.classList.add('visible');
    userFeelingInput.value = '';
    userFeelingInput.focus();
}

function closeAIModal() {
    isAIModalOpen = false;
    aiModal.classList.remove('visible');
}

async function generateAIWish() {
    const input = userFeelingInput.value.trim();
    if (!input) return;

    // UI Loading State
    generateBtn.disabled = true;
    spinner.style.display = 'inline-block';
    generateBtn.childNodes[2].textContent = ' กำลังฟังเสียงดวงดาว...'; // Change text safely

    try {
        // Construct the prompt
        const prompt = `You are a gentle, emotional poet. Write a short, encouraging New Year greeting in Thai language for someone who is feeling or hoping for: "${input}". 
        
        Rules:
        1. Length: 3 to 4 lines maximum.
        2. Tone: Warm, hopeful, elegant, emotional (similar to "healing" quotes).
        3. Format: Use <br> tags for line breaks. Do NOT use markdown. Do NOT use quotes.
        4. Content: Acknowledge their feeling gently and offer hope for the new year.`;

        // Call Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;

        // Success! Close modal and show text
        closeAIModal();
        displayCustomMessage(aiText);

    } catch (error) {
        console.error(error);
        alert("ขออภัย ดวงดาวสื่อสารขัดข้อง ลองใหม่อีกครั้งนะ");
    } finally {
        // Reset UI
        generateBtn.disabled = false;
        spinner.style.display = 'none';
        generateBtn.childNodes[2].textContent = 'รับคำอวยพร';
    }
}

function displayCustomMessage(text) {
    // Hide finale elements temporarily
    finaleBox.classList.remove('visible');
    restartBtn.classList.remove('visible');
    aiWishBtn.classList.remove('visible');
    btnContainer.classList.remove('active');
    enableFireworks = false; // Pause fireworks focus

    // Show message box with AI text
    setTimeout(() => {
        messageBox.style.display = 'block';
        textContent.innerHTML = text;
        messageBox.classList.remove('fade-out');
        void messageBox.offsetWidth;
        messageBox.classList.add('visible');
    }, 1000);

    // After reading (e.g., 8 seconds), go back to finale
    setTimeout(() => {
        messageBox.classList.remove('visible');
        messageBox.classList.add('fade-out');
        
        setTimeout(() => {
            messageBox.style.display = 'none';
            finaleBox.classList.add('visible');
            enableFireworks = true;
            btnContainer.classList.add('active');
            restartBtn.classList.add('visible');
            aiWishBtn.classList.add('visible');
        }, 1200);
    }, 8000);
}


// --- EVENT LISTENERS ---

// Global Click Effect (Capture phase to ensure it runs everywhere, even if propagation is stopped)
window.addEventListener('click', (e) => {
    // Avoid effects when clicking inside the modal input area to keep it clean
    if (!e.target.closest('.ai-content')) {
        createExplosion(e.clientX, e.clientY, Math.floor(Math.random() * 360));
    }
}, true);

document.body.addEventListener('click', (e) => {
    // Check if click is inside modal or buttons, ignore main click flow
    if (isAIModalOpen || e.target.closest('.action-btn')) return;
    showNextMessage();
});

document.body.addEventListener('keydown', (e) => {
    if (isAIModalOpen) return;
    if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'Enter') {
        showNextMessage();
    }
});

restartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    restart();
});

aiWishBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openAIModal();
});

closeModalBtn.addEventListener('click', closeAIModal);

generateBtn.addEventListener('click', generateAIWish);

userFeelingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') generateAIWish();
});

window.onload = init;


// --- ANIMATION SYSTEM (Stars + Fireworks) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let fireworks = [];
let sparks = [];
let enableFireworks = false;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

// --- STAR CLASS ---
class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2; 
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2;
        this.opacity = Math.random() * 0.5;
        this.fadeSpeed = 0.005 + Math.random() * 0.01;
        this.fadingIn = true;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
        if (this.fadingIn) {
            this.opacity += this.fadeSpeed;
            if (this.opacity >= 0.8) this.fadingIn = false;
        } else {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0.1) this.fadingIn = true;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// --- FIREWORK CLASSES ---
class Firework {
    constructor() {
        this.x = Math.random() * width;
        this.y = height;
        this.targetY = height * 0.1 + Math.random() * (height * 0.4);
        this.speed = 3 + Math.random() * 3;
        this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.2;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.hue = Math.floor(Math.random() * 360);
        this.trail = [];
        this.dead = false;
    }
    update() {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 5) this.trail.shift();
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.02;
        if (this.y <= this.targetY || this.vy >= 0) {
            this.dead = true;
            createExplosion(this.x, this.y, this.hue);
        }
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for(let point of this.trail) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.stroke();
    }
}

class Spark {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.hue = hue;
        this.alpha = 1;
        this.decay = 0.01 + Math.random() * 0.015;
        this.gravity = 0.05;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
        this.vx *= 0.96;
        this.vy *= 0.96;
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function createExplosion(x, y, hue) {
    const particleCount = 30 + Math.random() * 30;
    for (let i = 0; i < particleCount; i++) {
        sparks.push(new Spark(x, y, hue));
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.floor((width * height) / 10000); 
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.fillStyle = isFinale ? 'rgba(15, 23, 42, 0.2)' : 'rgba(15, 23, 42, 1)';
    ctx.fillRect(0, 0, width, height);

    if (!isFinale) {
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    particles.forEach(p => { p.update(); p.draw(); });

    if (enableFireworks) {
        if (Math.random() < 0.05) fireworks.push(new Firework());
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update(); fireworks[i].draw();
            if (fireworks[i].dead) fireworks.splice(i, 1);
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update(); sparks[i].draw();
            if (sparks[i].alpha <= 0) sparks.splice(i, 1);
        }
    }
    requestAnimationFrame(animate);
}

function openAIModal() {
            isAIModalOpen = true;
            aiModal.classList.add('visible');
            userFeelingInput.value = '';
            userFeelingInput.focus();
        }

        function closeAIModal() {
            isAIModalOpen = false;
            aiModal.classList.remove('visible');
        }

        async function generateAIWish() {
            const input = userFeelingInput.value.trim();
            if (!input) return;

            // UI Loading State
            generateBtn.disabled = true;
            spinner.style.display = 'inline-block';
            generateBtn.childNodes[2].textContent = ' กำลังฟังเสียงดวงดาว...'; // Change text safely

            try {
                // Construct the prompt
                const prompt = `You are a gentle, emotional poet. Write a short, encouraging New Year greeting in Thai language for someone who is feeling or hoping for: "${input}". 
                
                Rules:
                1. Length: 3 to 4 lines maximum.
                2. Tone: Warm, hopeful, elegant, emotional (similar to "healing" quotes).
                3. Format: Use <br> tags for line breaks. Do NOT use markdown. Do NOT use quotes.
                4. Content: Acknowledge their feeling gently and offer hope for the new year.`;

                // Call Gemini API
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }]
                    })
                });

                if (!response.ok) throw new Error('API Error');

                const data = await response.json();
                const aiText = data.candidates[0].content.parts[0].text;

                // Success! Close modal and show text
                closeAIModal();
                displayCustomMessage(aiText);

            } catch (error) {
                console.error(error);
                alert("ขออภัย ดวงดาวสื่อสารขัดข้อง ลองใหม่อีกครั้งนะ");
            } finally {
                // Reset UI
                generateBtn.disabled = false;
                spinner.style.display = 'none';
                generateBtn.childNodes[2].textContent = 'รับคำอวยพร';
            }
        }

        function displayCustomMessage(text) {
            // Hide finale elements temporarily
            finaleBox.classList.remove('visible');
            restartBtn.classList.remove('visible');
            aiWishBtn.classList.remove('visible');
            btnContainer.classList.remove('active');
            enableFireworks = false; // Pause fireworks focus

            // Show message box with AI text
            setTimeout(() => {
                messageBox.style.display = 'block';
                textContent.innerHTML = text;
                messageBox.classList.remove('fade-out');
                void messageBox.offsetWidth;
                messageBox.classList.add('visible');
            }, 1000);

            // After reading (e.g., 8 seconds), go back to finale
            setTimeout(() => {
                messageBox.classList.remove('visible');
                messageBox.classList.add('fade-out');
                
                setTimeout(() => {
                    messageBox.style.display = 'none';
                    finaleBox.classList.add('visible');
                    enableFireworks = true;
                    btnContainer.classList.add('active');
                    restartBtn.classList.add('visible');
                    aiWishBtn.classList.add('visible');
                }, 1200);
            }, 8000);
        }

window.addEventListener('resize', () => { resize(); initParticles(); });
resize(); initParticles(); animate();
