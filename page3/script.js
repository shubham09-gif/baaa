// Global variables
let candlesBlown = 0;
const totalCandles = 5;
let allCandlesBlown = false;
let audioContext;
let hasInteracted = false;
let isLoading = true;
let loadingProgress = 0;
let bgMusic = null;
let isMusicPlaying = false;

// Initialize the page when it loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initializeLoadingScreen();
    
    // Initialize music
    initializeMusic();
    
    // Add a class to enable page entry animation
    document.body.classList.add('page-enter');
    
    // Add plate element
    addPlate();
    
    // Create elements
    createCandles();
    createBalloons();
    createConfetti();
    createDecorations();
    createFrostingDrips();
    
    // Setup audio context for sound effects
    setupAudio();
    
    // Add event listeners for candle interaction
    document.querySelectorAll('.candle').forEach((candle, index) => {
        // Add custom sway animation with delay per candle
        candle.style.setProperty('--sway-delay', `${index * 0.3}s`);
        
        candle.addEventListener('click', function(e) {
            startAudioContextIfNeeded();
            blowOutCandle.call(this, e);
        });
        
        candle.addEventListener('touchstart', function(e) {
            startAudioContextIfNeeded();
            blowOutCandle.call(this, e);
            e.preventDefault(); // Prevent default touch behavior
        });
        
        // Use a touch-friendly approach
        candle.addEventListener('mouseover', function(e) {
            if (e.buttons === 1) { // Only trigger when mouse is down (dragging over)
                startAudioContextIfNeeded();
                blowOutCandle.call(this, e);
            }
        });
    });
    
    // For better mobile experience with touch
    document.addEventListener('touchmove', function(e) {
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains('candle') && !element.classList.contains('blown')) {
            startAudioContextIfNeeded();
            blowOutCandle.call(element, e);
        }
    });
    
    // Optional: Listen for keyboard input 
    document.addEventListener('keypress', function(e) {
        if (e.key === 'b' || e.key === 'B') { // Press 'b' to simulate blowing
            startAudioContextIfNeeded();
            blowRandomCandle();
        } else if (e.key === ' ' || e.key === 'Enter') { // Space or Enter to blow all candles
            startAudioContextIfNeeded();
            blowAllCandles();
        }
    });
    
    // Add event listeners for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            playButtonHoverSound();
        });
        
        btn.addEventListener('click', function() {
            playButtonClickSound();
        });
    });
    
    // Add cake wobble effect on hover
    const cakeContainer = document.querySelector('.cake-container');
    if (cakeContainer) {
        cakeContainer.addEventListener('mouseenter', function() {
            this.style.animation = 'cakeWobble 0.5s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    }
    
    // Setup wish message close button
    const closeButton = document.querySelector('.close-wish');
    if (closeButton) {
        closeButton.addEventListener('click', closeWishMessage);
    }
    
    // Create cake layers appearance sequence
    animateCakeAppearance();
    
    // Create background animation container
    const bgContainer = document.createElement('div');
    bgContainer.className = 'background-animation';
    document.body.appendChild(bgContainer);
    
    // Initialize background animations
    createBackgroundCrackers();
    createFloatingText();
    createBackgroundStars();
    
    initializePartyEffects();
    setInterval(createPartyText, 4000);
    
    initializeHeartAnimations();
});

// Initialize loading screen
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('loadingProgress');
    
    // Simulate loading progress
    const interval = setInterval(() => {
        loadingProgress += Math.random() * 15;
        progressBar.style.width = `${Math.min(loadingProgress, 100)}%`;
        
        if (loadingProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    isLoading = false;
                }, 500);
            }, 500);
        }
    }, 100);
}

// Initialize music controls
function initializeMusic() {
    bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('toggleMusic');
    
    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.play();
            musicBtn.classList.add('playing');
        }
        isMusicPlaying = !isMusicPlaying;
    });
    
    // Handle audio loading errors
    bgMusic.addEventListener('error', () => {
        musicBtn.style.display = 'none';
    });
}

// Setup audio context for sound effects
function setupAudio() {
    // We'll initialize this on first user interaction to comply with autoplay policies
    audioContext = null;
}

// Start audio context on user interaction to comply with browser policies
function startAudioContextIfNeeded() {
    if (!hasInteracted) {
        hasInteracted = true;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play candle blow sound
function playBlowSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Play sparkle sound
function playSparkleSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Play firework sound
function playFireworkSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Play button hover sound
function playButtonHoverSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Play button click sound
function playButtonClickSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Add plate under the cake
function addPlate() {
    const cakeContainer = document.querySelector('.cake-container');
    const plate = document.createElement('div');
    plate.className = 'plate';
    cakeContainer.appendChild(plate);
}

// Create frosting drips
function createFrostingDrips() {
    const cake = document.querySelector('.cake');
    const numDrips = 8;
    
    for (let i = 0; i < numDrips; i++) {
        const drip = document.createElement('div');
        drip.className = 'frosting-drip';
        
        // Position drips along the top edge of the cake
        drip.style.left = `${10 + (i * 80 / numDrips)}%`;
        drip.style.top = '-70px';
        
        // Vary the height of each drip
        const height = 10 + Math.random() * 15;
        drip.style.setProperty('--drip-height', `${height}px`);
        
        cake.appendChild(drip);
    }
}

// Create enhanced cake animations
function animateCakeAppearance() {
    const cake = document.querySelector('.cake');
    const cakeContainer = document.querySelector('.cake-container');
    
    // Add gentle floating animation
    if (cake) {
        cake.style.animation = 'gentleFloat 3s infinite ease-in-out';
    }
    
    // Add 3D hover effect with smoother transition
    if (cakeContainer) {
        cakeContainer.addEventListener('mousemove', (e) => {
            const rect = cakeContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angleX = (e.clientY - centerY) / 30;
            const angleY = (centerX - e.clientX) / 30;
            
            cake.style.transform = `
                translateX(-50%)
                rotateX(${angleX}deg)
                rotateY(${angleY}deg)
                translateZ(10px)
            `;
        });
        
        cakeContainer.addEventListener('mouseleave', () => {
            cake.style.transform = 'translateX(-50%) rotateX(0) rotateY(0) translateZ(0)';
        });
    }
}

// Enhanced candle creation
function createCandles() {
    const candleContainer = document.getElementById('candleContainer') || createCandleContainer();
    
    for (let i = 0; i < totalCandles; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        
        // Randomize candle properties for more natural look
        const height = 30 + Math.random() * 8;
        const lean = -1 + Math.random() * 2;
        candle.style.height = `${height}px`;
        candle.style.transform = `rotate(${lean}deg)`;
        
        // Add staggered animation delay
        candle.style.animationDelay = `${i * 0.2}s`;
        
        const flame = document.createElement('div');
        flame.className = 'flame';
        flame.style.animationDelay = `${i * 0.1}s`;
        
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        
        candle.appendChild(flame);
        candle.appendChild(smoke);
        candleContainer.appendChild(candle);
    }
}

// Create candle container if it doesn't exist
function createCandleContainer() {
    const cakeContainer = document.querySelector('.cake-container');
    const candleContainer = document.createElement('div');
    candleContainer.id = 'candleContainer';
    candleContainer.className = 'candle-container';
    cakeContainer.appendChild(candleContainer);
    return candleContainer;
}

// Create floating balloons with improved variety
function createBalloons() {
    const colors = ['#ff66b3', '#66ccff', '#ff9966', '#99ff66', '#cc99ff', '#ffcc00'];
    const numBalloons = 15;
    
    for (let i = 0; i < numBalloons; i++) {
        const balloonContainer = document.createElement('div');
        balloonContainer.className = 'balloon-container';
        
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const string = document.createElement('div');
        string.className = 'balloon-string';
        
        // Random float path
        balloon.style.setProperty('--float-x', `${-100 + Math.random() * 200}px`);
        balloon.style.setProperty('--rotation', `${-30 + Math.random() * 60}deg`);
        
        balloonContainer.style.left = `${Math.random() * 100}%`;
        balloonContainer.style.animationDelay = `${Math.random() * 15}s`;
        
        balloonContainer.appendChild(balloon);
        balloonContainer.appendChild(string);
        document.body.appendChild(balloonContainer);
    }
}

// Create confetti pieces with improved variety
function createConfetti() {
    const colors = ['#ffcc00', '#ff66b3', '#66ccff', '#ff9966', '#99ff66', '#cc99ff'];
    const numConfetti = 80;
    
    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = '❤';
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random properties
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.fontSize = `${8 + Math.random() * 8}px`;
        confetti.style.animationDelay = `${Math.random() * 15}s`;
        confetti.style.opacity = '0';
        
        document.body.appendChild(confetti);
    }
}

// Create cake decorations with animation
function createDecorations() {
    const cake = document.querySelector('.cake');
    const colors = ['#ff3366', '#ffcc00', '#66ccff', '#ff9966', '#99ff66'];
    const numDecorations = 15;
    
    for (let i = 0; i < numDecorations; i++) {
        const decoration = document.createElement('div');
        decoration.className = 'decoration';
        
        // Generate varied decoration styles
        const size = 8 + Math.random() * 7;
        decoration.style.setProperty('--deco-size', `${size}px`);
        decoration.style.setProperty('--deco-color', colors[Math.floor(Math.random() * colors.length)]);
        decoration.style.setProperty('--pop-delay', `${0.1 + i * 0.1}s`);
        
        decoration.style.top = `${-20 - Math.random() * 50}px`;
        decoration.style.left = `${Math.random() * 100}%`;
        
        // Randomly use square decorations sometimes
        if (Math.random() > 0.7) {
            decoration.style.borderRadius = '2px';
        }
        
        cake.appendChild(decoration);
    }
}

// Enhanced blowOutCandle function
function blowOutCandle(e) {
    if (this.classList.contains('blown')) return;
    
    // Create blow ripple effect
    createBlowRipple(e);
    
    // Add blown class and remove flame
    this.classList.add('blown');
    const flame = this.querySelector('.flame');
    if (flame) {
        flame.style.display = 'none';
    }
    
    // Create smoke effect
    const smoke = document.createElement('div');
    smoke.className = 'smoke';
    this.appendChild(smoke);
    
    // Play blow sound
    playBlowSound();
    
    // Create sparkle effect
    createSparkleEffect(this);
    
    // Increment counter
    candlesBlown++;
    
    // Check if all candles are blown
    if (candlesBlown === totalCandles) {
        allCandlesBlown = true;
        setTimeout(showWishMessage, 1000);
    }
}

// Create a visual ripple effect when blowing out candles
function createBlowRipple(e) {
    const ripple = document.createElement('div');
    ripple.className = 'blow-ripple';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.zIndex = '50';
    
    // Position ripple near pointer/touch
    if (e && e.clientX) {
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
    } else {
        // Default position if no event coordinates
        const candles = document.querySelector('.candle-container');
        const rect = candles.getBoundingClientRect();
        ripple.style.left = `${rect.left + rect.width/2}px`;
        ripple.style.top = `${rect.top}px`;
    }
    
    // Animate ripple
    ripple.style.animation = 'ripple 0.6s linear forwards';
    document.body.appendChild(ripple);
    
    // Create ripple animation if not already defined
    if (!document.querySelector('style#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(20); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Simulate blowing a random candle
function blowRandomCandle() {
    const unblownCandles = Array.from(document.querySelectorAll('.candle:not(.blown)'));
    if (unblownCandles.length > 0) {
        const randomCandle = unblownCandles[Math.floor(Math.random() * unblownCandles.length)];
        blowOutCandle.call(randomCandle);
    }
}

// Blow out all candles at once
function blowAllCandles() {
    const unblownCandles = Array.from(document.querySelectorAll('.candle:not(.blown)'));
    let delay = 0;
    
    unblownCandles.forEach(candle => {
        setTimeout(() => {
            blowOutCandle.call(candle);
        }, delay);
        delay += 200; // Stagger the effect
    });
}

// Enhanced createSparkleEffect function
function createSparkleEffect(candle) {
    const numSparkles = 8;
    for (let i = 0; i < numSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Random position around the candle
        const angle = (i / numSparkles) * Math.PI * 2;
        const distance = 30;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        candle.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// Enhanced showWishMessage function
function showWishMessage() {
    const wishMessage = document.getElementById('wishMessage');
    if (wishMessage) {
        wishMessage.style.display = 'block';
        wishMessage.classList.add('show');
        
        // Create fireworks
        createFireworks();
        
        // Play celebration sound
        playCelebrationSound();
    }
}

// New function for celebration sound
function playCelebrationSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Create wish message if it doesn't exist
function createWishMessage() {
    const wishMessage = document.createElement('div');
    wishMessage.id = 'wishMessage';
    wishMessage.className = 'wish-message';
    
    const heading = document.createElement('h2');
    heading.textContent = "Happy Birthday!";
    
    const message = document.createElement('p');
    message.textContent = "May all your wishes come true! This special day is all about you. Enjoy every moment and have a wonderful year ahead!";
    
    const closeButton = document.createElement('button');
    closeButton.className = 'btn close-wish';
    closeButton.textContent = "Thank You!";
    closeButton.addEventListener('click', closeWishMessage);
    
    wishMessage.appendChild(heading);
    wishMessage.appendChild(message);
    wishMessage.appendChild(closeButton);
    
    document.body.appendChild(wishMessage);
    return wishMessage;
}

// Close the wish message
function closeWishMessage() {
    document.getElementById('wishMessage').classList.remove('show');
}

// Enhanced fireworks effect
function createFireworks() {
    const numFireworks = 15;
    const colors = ['#ff99cc', '#ffcc99', '#99ccff', '#ffff99', '#ff99ff'];
    
    for (let i = 0; i < numFireworks; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 4 + Math.random() * 4;
            
            firework.style.left = `${20 + Math.random() * 60}%`;
            firework.style.top = `${20 + Math.random() * 40}%`;
            firework.style.width = `${size}px`;
            firework.style.height = `${size}px`;
            firework.style.backgroundColor = color;
            
            // Create particle burst effect
            const particles = 12;
            for (let j = 0; j < particles; j++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.backgroundColor = color;
                particle.style.width = `${size/2}px`;
                particle.style.height = `${size/2}px`;
                
                const angle = (j / particles) * Math.PI * 2;
                const distance = 40 + Math.random() * 40;
                
                particle.style.animation = `
                    fireworkParticle ${1.2 + Math.random() * 0.4}s forwards cubic-bezier(0.45, 0, 0.55, 1)
                `;
                particle.style.transform = `rotate(${angle}rad) translateY(${distance}px)`;
                
                firework.appendChild(particle);
            }
            
            document.body.appendChild(firework);
            setTimeout(() => firework.remove(), 2000);
        }, i * 200);
    }
}

// Navigation functions with transition effects
function goBack() {
    playButtonClickSound();
    
    // Add page exit animation
    document.body.classList.add('page-exit');
    
    // Wait for animation before navigating
    setTimeout(() => {
        window.location.href = 'memory-lane.html';
    }, 500);
}

function goNext() {
    playButtonClickSound();
    
    // Add page exit animation
    document.body.classList.add('page-exit');
    
    // Wait for animation before navigating
    setTimeout(() => {
        window.location.href = 'letter.html';
    }, 500);
}

// Add page exit animation if not already defined
if (!document.querySelector('style#exit-style')) {
    const style = document.createElement('style');
    style.id = 'exit-style';
    style.textContent = `
        .page-exit {
            animation: fadeOut 0.5s forwards;
        }
        @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        
        @keyframes cakeWobble {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
            100% { transform: rotate(0deg); }
        }
    `;
    document.head.appendChild(style);
}

// Create background crackers
function createBackgroundCrackers() {
    const container = document.querySelector('.background-animation');
    const numCrackers = 10;
    
    function createCracker() {
        const cracker = document.createElement('div');
        cracker.className = 'cracker';
        
        // Random position
        cracker.style.left = `${Math.random() * 100}%`;
        cracker.style.top = `${Math.random() * 100}%`;
        
        // Random rotation
        cracker.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(cracker);
        
        // Create particles for the cracker
        createCrackerParticles(cracker);
        
        // Remove after animation
        setTimeout(() => {
            cracker.remove();
        }, 1500);
    }
    
    // Create crackers periodically
    setInterval(() => {
        if (container.querySelectorAll('.cracker').length < numCrackers) {
            createCracker();
        }
    }, 2000);
}

// Create particles for crackers
function createCrackerParticles(cracker) {
    const numParticles = 12;
    const colors = ['#ff3366', '#ffcc00', '#66ccff', '#ff9966', '#99ff66'];
    
    const rect = cracker.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'cracker-particle';
        particle.textContent = '❤';
        
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.fontSize = `${8 + Math.random() * 6}px`;
        
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        const angle = (i / numParticles) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Create floating birthday text
function createFloatingText() {
    const container = document.querySelector('.background-animation');
    const messages = [
        '🎉 Happy Birthday! 🎉',
        '🎂 Make a Wish! 🎂',
        '✨ Special Day! ✨',
        '🎈 Party Time! 🎈',
        '🎁 Celebrate! 🎁'
    ];
    
    function createText() {
        const text = document.createElement('div');
        text.className = 'birthday-text';
        text.textContent = messages[Math.floor(Math.random() * messages.length)];
        
        // Random position
        text.style.left = `${Math.random() * 80 + 10}%`;
        
        container.appendChild(text);
        
        // Remove after animation
        setTimeout(() => {
            text.remove();
        }, 4000);
    }
    
    // Create floating text periodically
    setInterval(createText, 3000);
}

// Create background stars
function createBackgroundStars() {
    const container = document.querySelector('.background-animation');
    const numStars = 20;
    
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size
        const size = 10 + Math.random() * 10;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        container.appendChild(star);
        
        // Remove after animation
        setTimeout(() => {
            star.remove();
        }, 2000);
    }
    
    // Create stars periodically
    setInterval(() => {
        if (container.querySelectorAll('.star').length < numStars) {
            createStar();
        }
    }, 1000);
}

// Enhanced Party Animation Functions
function initializePartyEffects() {
    createPartyCrackers();
    createPartyPoppers();
    initializeSparkleBackground();
    startPeriodicConfetti();
}

function createPartyCrackers() {
    const container = document.querySelector('.background-animation');
    const numCrackers = 5;
    const positions = [
        { x: '10%', y: '20%' },
        { x: '85%', y: '15%' },
        { x: '20%', y: '75%' },
        { x: '75%', y: '80%' },
        { x: '50%', y: '40%' }
    ];

    positions.forEach((pos, index) => {
        const cracker = document.createElement('div');
        cracker.className = 'party-cracker';
        cracker.style.left = pos.x;
        cracker.style.top = pos.y;
        cracker.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        cracker.addEventListener('click', () => {
            popCracker(cracker);
        });
        
        container.appendChild(cracker);
    });
}

function popCracker(cracker) {
    if (cracker.classList.contains('pop')) return;
    
    cracker.classList.add('pop');
    createCrackerSparks(cracker);
    createPartyRibbons(cracker);
    playPopSound();
    
    setTimeout(() => {
        cracker.classList.remove('pop');
    }, 1000);
}

function createCrackerSparks(cracker) {
    const numSparks = 20;
    const colors = ['#ff3366', '#ffcc00', '#66ccff', '#ff9966', '#99ff66', '#ff66b3'];
    
    const rect = cracker.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < numSparks; i++) {
        const spark = document.createElement('div');
        spark.className = 'cracker-spark';
        spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        spark.style.left = `${centerX}px`;
        spark.style.top = `${centerY}px`;
        
        const angle = (i / numSparks) * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        spark.style.setProperty('--travel-x', `${tx}px`);
        spark.style.setProperty('--travel-y', `${ty}px`);
        spark.style.animation = 'sparkFly 1s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 1000);
    }
}

function createPartyRibbons(cracker) {
    const numRibbons = 10;
    const colors = [
        ['#ff3366', '#ff66b3'],
        ['#ffcc00', '#ffdb4d'],
        ['#66ccff', '#99ddff'],
        ['#ff9966', '#ffb366'],
        ['#99ff66', '#b3ff80']
    ];
    
    const rect = cracker.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    for (let i = 0; i < numRibbons; i++) {
        const ribbon = document.createElement('div');
        ribbon.className = 'party-ribbon';
        
        const colorPair = colors[Math.floor(Math.random() * colors.length)];
        ribbon.style.setProperty('--ribbon-color-1', colorPair[0]);
        ribbon.style.setProperty('--ribbon-color-2', colorPair[1]);
        
        ribbon.style.left = `${startX + (Math.random() - 0.5) * 40}px`;
        ribbon.style.top = `${startY}px`;
        ribbon.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        document.body.appendChild(ribbon);
        setTimeout(() => ribbon.remove(), 2000);
    }
}

function createPartyConfetti() {
    const container = document.querySelector('.background-animation');
    const numConfetti = 30;
    const colors = [
        ['#ff3366', '#ff66b3'],
        ['#ffcc00', '#ffdb4d'],
        ['#66ccff', '#99ddff'],
        ['#ff9966', '#ffb366'],
        ['#99ff66', '#b3ff80']
    ];
    const shapes = [
        'polygon(50% 0%, 0% 100%, 100% 100%)',
        'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        'circle(50% at 50% 50%)',
        'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    ];

    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'party-confetti';
        
        const colorPair = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.setProperty('--confetti-color-1', colorPair[0]);
        confetti.style.setProperty('--confetti-color-2', colorPair[1]);
        confetti.style.setProperty('--confetti-shape', shapes[Math.floor(Math.random() * shapes.length)]);
        confetti.style.setProperty('--fall-duration', `${2 + Math.random() * 2}s`);
        confetti.style.setProperty('--sway-amount', `${-50 + Math.random() * 100}px`);
        
        confetti.style.left = `${Math.random() * 100}%`;
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

function startPeriodicConfetti() {
    setInterval(createPartyConfetti, 3000);
}

function createPartyText() {
    const container = document.querySelector('.background-animation');
    const messages = [
        '🎉 Party Time! 🎉',
        '🎈 Celebrate! 🎈',
        '✨ Woohoo! ✨',
        '🎊 Let\'s Party! 🎊',
        '🎂 Happy Day! 🎂'
    ];
    
    const text = document.createElement('div');
    text.className = 'party-text';
    text.textContent = messages[Math.floor(Math.random() * messages.length)];
    text.style.left = `${10 + Math.random() * 80}%`;
    
    container.appendChild(text);
    setTimeout(() => text.remove(), 4000);
}

function initializeSparkleBackground() {
    const sparkleBackground = document.createElement('div');
    sparkleBackground.className = 'sparkle-bg';
    document.body.appendChild(sparkleBackground);
    
    document.addEventListener('mousemove', (e) => {
        sparkleBackground.style.setProperty('--mouse-x', `${e.clientX}px`);
        sparkleBackground.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
}

function playPopSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Heart Animation Functions
function initializeHeartAnimations() {
    createFloatingHearts();
    createPulsingHearts();
    initializeHeartTrail();
    createHeartBursts();
}

function createFloatingHearts() {
    const container = document.querySelector('.background-animation');
    const colors = [
        '#ff3366', '#ff66b3', '#ff99cc', 
        '#ff6666', '#ff3399', '#ff0066'
    ];
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '❤';
        
        // Random properties
        heart.style.setProperty('--heart-size', `${15 + Math.random() * 20}px`);
        heart.style.setProperty('--heart-color', colors[Math.floor(Math.random() * colors.length)]);
        heart.style.setProperty('--float-duration', `${3 + Math.random() * 4}s`);
        heart.style.setProperty('--end-x', `${-200 + Math.random() * 400}px`);
        heart.style.setProperty('--rotation', `${Math.random() * 720}deg`);
        
        heart.style.left = `${Math.random() * 100}%`;
        container.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => heart.remove(), parseFloat(getComputedStyle(heart).getPropertyValue('--float-duration')) * 1000);
    }
    
    // Create hearts periodically
    setInterval(createHeart, 300);
}

function createPulsingHearts() {
    const container = document.querySelector('.background-animation');
    const colors = ['#ff3366', '#ff66b3', '#ff99cc'];
    
    function createPulsingHeart() {
        const heart = document.createElement('div');
        heart.className = 'pulsing-heart';
        heart.textContent = '❤';
        
        heart.style.setProperty('--heart-size', `${20 + Math.random() * 30}px`);
        heart.style.setProperty('--heart-color', colors[Math.floor(Math.random() * colors.length)]);
        
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    }
    
    setInterval(createPulsingHeart, 500);
}

function initializeHeartTrail() {
    const colors = ['#ff3366', '#ff66b3', '#ff99cc', '#ff6666'];
    let trail = document.createElement('div');
    trail.className = 'heart-trail';
    document.body.appendChild(trail);
    
    function createTrailHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'trail-heart';
        heart.textContent = '❤';
        
        heart.style.setProperty('--heart-color', colors[Math.floor(Math.random() * colors.length)]);
        heart.style.setProperty('--rotation', `${Math.random() * 360}deg`);
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        trail.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
    
    let lastX = 0;
    let lastY = 0;
    
    document.addEventListener('mousemove', (e) => {
        const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if (distance > 20) {
            createTrailHeart(e.clientX, e.clientY);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });
}

function createHeartBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'heart-burst';
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    
    const colors = ['#ff3366', '#ff66b3', '#ff99cc', '#ff6666'];
    const numHearts = 12;
    
    for (let i = 0; i < numHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'burst-heart';
        heart.textContent = '❤';
        
        const angle = (i / numHearts) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        heart.style.setProperty('--heart-color', colors[Math.floor(Math.random() * colors.length)]);
        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);
        
        burst.appendChild(heart);
    }
    
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1000);
}

function createHeartBursts() {
    document.addEventListener('click', (e) => {
        createHeartBurst(e.clientX, e.clientY);
    });
    
    // Create random bursts periodically
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        createHeartBurst(x, y);
    }, 2000);
}