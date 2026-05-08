// Data
const symptomsList = [
    "fever", "cough", "headache", "vomiting", 
    "stomach_pain", "cold", "sneezing"
];

let currentUser = "";
let currentMode = ""; // 'forward' or 'backward'

// DOM Elements
const views = {
    registration: document.getElementById('view-registration'),
    modeSelection: document.getElementById('view-mode-selection'),
    forward: document.getElementById('view-forward'),
    backward: document.getElementById('view-backward'),
    results: document.getElementById('view-results')
};

function switchView(viewName) {
    Object.values(views).forEach(view => view.classList.remove('active'));
    if (views[viewName]) {
        views[viewName].classList.add('active');
    }
}

function initializeSymptoms() {
    const forwardContainer = document.getElementById('forward-symptoms');
    const backwardContainer = document.getElementById('backward-symptoms');
    
    const generateHTML = (prefix) => {
        return symptomsList.map(sym => `
            <label class="symptom-item">
                <input type="checkbox" value="${sym}" id="${prefix}-${sym}">
                <div class="symptom-label">${sym.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
            </label>
        `).join('');
    };

    if (forwardContainer) forwardContainer.innerHTML = generateHTML('f');
    if (backwardContainer) backwardContainer.innerHTML = generateHTML('b');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeSymptoms();
    initCanvasContext();

    // Registration
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            const nameInput = document.getElementById('patient-name').value.trim();
            if (nameInput) {
                currentUser = nameInput;
                document.getElementById('report-patient-name').innerText = currentUser;
                switchView('modeSelection');
            } else {
                alert("Please enter a patient name.");
            }
        });
    }

    // Handle Enter key on patient name
    const patientNameInput = document.getElementById('patient-name');
    if (patientNameInput) {
        patientNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') document.getElementById('btn-start').click();
        });
    }

    // Mode Selection
    const btnModeForward = document.getElementById('btn-mode-forward');
    if (btnModeForward) {
        btnModeForward.addEventListener('click', () => {
            currentMode = 'forward';
            switchView('forward');
        });
    }

    const btnModeBackward = document.getElementById('btn-mode-backward');
    if (btnModeBackward) {
        btnModeBackward.addEventListener('click', () => {
            currentMode = 'backward';
            switchView('backward');
        });
    }

    // Back buttons
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView('modeSelection');
        });
    });

    // Start Over
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            document.getElementById('patient-name').value = '';
            currentUser = '';
            
            // Uncheck all
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.getElementById('target-disease').value = '';
            
            switchView('registration');
        });
    }

    // API Calls
    const loadingOverlay = document.getElementById('loading-overlay');
    const reportContainer = document.getElementById('full-report-container');
    const finalMessage = document.getElementById('final-diagnosis-message');

    const showLoading = () => loadingOverlay.classList.remove('hidden');
    const hideLoading = () => loadingOverlay.classList.add('hidden');

    function showResult(text, reportLines = [], isError = false) {
        reportContainer.innerHTML = '';
        if (reportLines && reportLines.length > 0) {
            reportLines.forEach(line => {
                const div = document.createElement('div');
                div.className = 'report-line';
                div.innerText = line;
                reportContainer.appendChild(div);
            });
        }

        finalMessage.innerText = text;
        if (isError || text.includes('❌') || String(text).toLowerCase().includes('unknown disease')) {
            finalMessage.className = 'final-message final-message-error';
        } else {
            finalMessage.className = 'final-message final-message-success';
        }
        switchView('results');
    }

    // Forward Diagnose
    const btnDiagnose = document.getElementById('btn-diagnose');
    if(btnDiagnose) {
        btnDiagnose.addEventListener('click', async () => {
            const selected = Array.from(document.querySelectorAll('#forward-symptoms input:checked')).map(cb => cb.value);
            if(selected.length === 0) {
                alert("Please select at least one symptom.");
                return;
            }

            showLoading();
            try {
                const response = await fetch('/api/forward', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: currentUser,
                        symptoms: selected
                    })
                });
                const data = await response.json();
                showResult(`Diagnosis: ${data.diagnosis}`, data.report);
            } catch (error) {
                console.error(error);
                showResult("Error connecting to server", [], true);
            } finally {
                hideLoading();
            }
        });
    }

    // Backward Verify
    const btnVerify = document.getElementById('btn-verify');
    if(btnVerify) {
        btnVerify.addEventListener('click', async () => {
            const disease = document.getElementById('target-disease').value.trim();
            if (!disease) {
                alert("Please enter a target disease.");
                return;
            }

            const selected = Array.from(document.querySelectorAll('#backward-symptoms input:checked')).map(cb => cb.value);

            showLoading();
            try {
                const response = await fetch('/api/backward', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: currentUser,
                        symptoms: selected,
                        disease: disease
                    })
                });
                const data = await response.json();
                showResult(data.result, data.report);
            } catch (error) {
                console.error(error);
                showResult("Error connecting to server", [], true);
            } finally {
                hideLoading();
            }
        });
    }
});

// Canvas Background Logic (Interactive Gravity/Physics)
function initCanvasContext() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: width / 2, y: height / 2 };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    const icons = [];
    const numIcons = 40;

    class MedicalIcon {
        constructor() {
            this.reset();
            this.y = Math.random() * height; // Random initial y instead of top
        }

        reset() {
            this.type = Math.floor(Math.random() * 4); // 0: cross, 1: pill, 2: circle (cell), 3: dna-like wave
            this.size = Math.random() * 15 + 10;
            this.x = Math.random() * width;
            this.y = -this.size - (Math.random() * 100);
            this.speedY = Math.random() * 0.8 + 0.3; // slower fall
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
            this.opacity = Math.random() * 0.1 + 0.05; // 5% to 15%
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;

            // Mouse interaction (Repulsion)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = 150;
            let force = (maxDistance - distance) / maxDistance;

            if (distance < maxDistance) {
                this.x -= forceDirectionX * force * 1.5;
                this.y -= forceDirectionY * force * 1.5;
            }

            // Gently float back to center if pushed completely off horizontally by mouse
            if (this.x < 0) this.x += 1;
            if (this.x > width) this.x -= 1;

            if (this.y > height + this.size) {
                this.reset();
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
            ctx.strokeStyle = `rgba(14, 165, 233, ${this.opacity})`;
            ctx.lineWidth = 2;

            ctx.beginPath();
            if (this.type === 0) { // Medical Cross
                let s = this.size / 3;
                ctx.rect(-s/2, -s*1.5, s, s*3);
                ctx.rect(-s*1.5, -s/2, s*3, s);
                ctx.fill();
            } else if (this.type === 1) { // Pill/Capsule
                ctx.roundRect(-this.size/2, -this.size, this.size, this.size*2, this.size/2);
                ctx.stroke();
                // Half filled
                ctx.beginPath();
                ctx.roundRect(-this.size/2, 0, this.size, this.size, this.size/2);
                ctx.fill();
            } else if (this.type === 2) { // Circle (Cell)
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 3) { // Wave (DNA-ish fragment)
                ctx.moveTo(-this.size, 0);
                ctx.quadraticCurveTo(0, -this.size, this.size, 0);
                ctx.quadraticCurveTo(this.size*2, this.size, this.size*3, 0);
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < numIcons; i++) {
        icons.push(new MedicalIcon());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        icons.forEach(icon => {
            icon.update();
            icon.draw(ctx);
        });
        requestAnimationFrame(animate);
    }

    animate();
}
