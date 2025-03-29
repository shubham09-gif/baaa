// Handle background music
const bgMusic = document.getElementById('bgMusic');
const toggleMusic = document.getElementById('toggleMusic');
let musicPlaying = true;

// Autoplay music when page loads
window.addEventListener('load', function() {
    try {
        bgMusic.play().catch(error => {
            console.log('Autoplay prevented. Please interact with the page first.');
            musicPlaying = false;
            toggleMusic.textContent = '🔇';
        });
    } catch (e) {
        console.log('Audio playback error:', e);
        musicPlaying = false;
        toggleMusic.textContent = '🔇';
    }
});

toggleMusic.addEventListener('click', function() {
    if (musicPlaying) {
        bgMusic.pause();
        toggleMusic.textContent = '🔇';
        musicPlaying = false;
    } else {
        bgMusic.play();
        toggleMusic.textContent = '🔊';
        musicPlaying = true;
    }
});

// Enhanced cursor effects with trail
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');
const trailContainer = document.getElementById('cursor-trail-container');

let mouseX = 0;
let mouseY = 0;
let cursorDotX = 0;
let cursorDotY = 0;
const trailElements = [];
const maxTrailElements = 15;
let lastTrailTime = 0;
const trailDelay = 25; // ms between trail elements

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Set main cursor position instantly
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Create trail elements with a delay
    const now = Date.now();
    if (now - lastTrailTime > trailDelay) {
        createTrailElement(mouseX, mouseY);
        lastTrailTime = now;
    }
});

function createTrailElement(x, y) {
    const trailElement = document.createElement('div');
    trailElement.className = 'cursor-trail';
    trailElement.style.left = x + 'px';
    trailElement.style.top = y + 'px';
    trailContainer.appendChild(trailElement);
    
    // Add animation
    trailElement.style.animation = 'cursorTrail 0.8s forwards';
    
    // Add to array and remove oldest if needed
    trailElements.push(trailElement);
    if (trailElements.length > maxTrailElements) {
        const oldestElement = trailElements.shift();
        if (oldestElement.parentNode) {
            oldestElement.parentNode.removeChild(oldestElement);
        }
    }
    
    // Auto-remove after animation completes
    setTimeout(() => {
        if (trailElement.parentNode) {
            trailElement.parentNode.removeChild(trailElement);
        }
        const index = trailElements.indexOf(trailElement);
        if (index > -1) {
            trailElements.splice(index, 1);
        }
    }, 800);
}

// Smooth follow for cursor dot with easing
function animateCursorDot() {
    // Calculate the distance between mouse and dot
    const dx = mouseX - cursorDotX;
    const dy = mouseY - cursorDotY;
    
    // Move cursor dot with easing (0.2 = 20% of the distance each frame)
    cursorDotX += dx * 0.2;
    cursorDotY += dy * 0.2;
    
    // Apply position
    cursorDot.style.left = cursorDotX + 'px';
    cursorDot.style.top = cursorDotY + 'px';
    
    // Continue animation
    requestAnimationFrame(animateCursorDot);
}

// Start cursor dot animation
cursorDotX = mouseX;
cursorDotY = mouseY;
animateCursorDot();

document.addEventListener('mousedown', () => {
    cursor.style.width = '25px';
    cursor.style.height = '25px';
    cursor.style.backgroundColor = 'rgba(255, 64, 129, 0.2)';
});

document.addEventListener('mouseup', () => {
    cursor.style.width = '30px';
    cursor.style.height = '30px';
    cursor.style.backgroundColor = 'transparent';
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('button, .emoji');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.width = '50px';
        cursor.style.height = '50px';
        cursor.style.backgroundColor = 'rgba(255, 64, 129, 0.1)';
        cursor.style.animationDuration = '0.8s';
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.width = '30px';
        cursor.style.height = '30px';
        cursor.style.backgroundColor = 'transparent';
        cursor.style.animationDuration = '1.5s';
    });
});

// Create falling sister-themed items
const fallingItems = document.getElementById('fallingItems');
const sisterItems = ['🎀', '👯‍♀️', '💝', '🌸', '🦋', '💐', '💕', '✨'];

function createFallingItem() {
    const item = document.createElement('div');
    item.className = 'falling-item';
    item.textContent = sisterItems[Math.floor(Math.random() * sisterItems.length)];
    item.style.left = Math.random() * 100 + 'vw';
    item.style.fontSize = (Math.random() * 20 + 10) + 'px';
    item.style.setProperty('--dir', Math.random() * 10 - 5);
    item.style.setProperty('--rot', Math.random() * 2);
    item.style.animationDuration = (Math.random() * 5 + 3) + 's';
    fallingItems.appendChild(item);
    
    // Remove after animation completes
    setTimeout(() => {
        item.remove();
    }, 8000);
}

// Create items periodically
setInterval(createFallingItem, 300);

// Make emojis interactive
const emojis = document.querySelectorAll('.emoji');
emojis.forEach(emoji => {
    emoji.addEventListener('click', function() {
        // Create a burst of the clicked emoji
        for (let i = 0; i < 8; i++) {
            const burst = document.createElement('div');
            burst.className = 'falling-item';
            burst.textContent = this.textContent;
            burst.style.left = (Math.random() * 60 + 20) + 'vw';
            burst.style.fontSize = (Math.random() * 20 + 15) + 'px';
            burst.style.setProperty('--dir', Math.random() * 10 - 5);
            burst.style.setProperty('--rot', Math.random() * 2);
            burst.style.animationDuration = (Math.random() * 2 + 1) + 's';
            fallingItems.appendChild(burst);
            
            setTimeout(() => {
                burst.remove();
            }, 3000);
        }
    });
});