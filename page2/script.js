// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Create background hearts
function createBackgroundHearts() {
    const container = document.createElement('div');
    container.className = 'bg-hearts';
    document.body.appendChild(container);

    const heartCount = 6; // Further reduced for better performance
    const colors = [
        'rgba(255, 182, 193, 0.2)',
        'rgba(255, 105, 180, 0.15)',
        'rgba(255, 192, 203, 0.2)',
        'rgba(255, 20, 147, 0.1)'
    ];
    const heartTypes = ['❤', '💗', '💓']; // Reduced variety for better performance

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.setProperty('--float-duration', `${Math.random() * 25 + 25}s`); // Slower, smoother animation
        heart.style.fontSize = `${Math.random() * 12 + 12}px`; // Reduced size range
        heart.style.opacity = Math.random() * 0.1 + 0.05; // Reduced opacity
        container.appendChild(heart);
    }
}

// Enhanced floating hearts
function createFloatingHearts() {
    const container = document.createElement('div');
    container.className = 'floating-hearts-container';
    document.body.appendChild(container);

    const colors = [
        '#ff6ec4', '#ff4e91', '#ff69b4', '#ff1493'
    ];
    const heartCount = 8; // Further reduced for better performance
    const heartTypes = ['❤', '💗', '💓']; // Reduced variety

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
        heart.style.setProperty('--heart-color', colors[Math.floor(Math.random() * colors.length)]);
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.setProperty('--float-duration', `${Math.random() * 10 + 10}s`); // Slower, smoother animation
        heart.style.animationDelay = `${Math.random() * 1.5}s`; // Reduced delay range
        heart.style.fontSize = `${Math.random() * 10 + 10}px`; // Reduced size range
        container.appendChild(heart);
    }
}

// Memory data - replace placeholder images with your actual images and add your captions
const memories = [
    {
        image: "image/OIP.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: -2,
        emoji: "🌊"
    },
    {
        image: "pic2.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: 3,
        emoji: "🌅"
    },
    {
        image: "pic3.jpg",
        caption: "baad m likha jayega",
        isGif: true,
        rotationAngle: -1,
        emoji: "🚗"
    },
    {
        image: "pic4.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: 2,
        emoji: "🍕"
    },
    {
        image: "pic5.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: -3,
        emoji: "🏕️"
    },
    {
        image: "pic7.jpg",
        caption: "baad m likha jayega",
        isGif: true,
        rotationAngle: 1,
        emoji: "🎵"
    },
    {
        image: "pic8.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: -2,
        emoji: "🏰"
    },
    {
        image: "pic9.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: 2,
        emoji: "🏖️"
    },
    {
        image: "pic6.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: -1,
        emoji: "💕"
    },
    {
        image: "pic4.jpg",
        caption: "baad m likha jayega",
        isGif: true,
        rotationAngle: 3,
        emoji: "🎂"
    }
];

// Create confetti elements with enhanced colors and shapes
function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#ff6ec4', '#ff4e91', '#ff69b4', '#ff1493'];
    const shapes = ['circle', 'heart'];
    
    for (let i = 0; i < 80; i++) { // Reduced count
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.classList.add(`confetti-${shape}`);
        
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.width = Math.random() * 8 + 4 + 'px'; // Reduced size range
        confetti.style.height = Math.random() * 8 + 4 + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const duration = Math.random() * 5 + 5; // Slower animation
        const delay = Math.random() * 2; // Reduced delay range
        
        confetti.style.animation = `floatDown ${duration}s ease-in ${delay}s infinite`;
        confetti.style.opacity = Math.random() * 0.3 + 0.2; // Reduced opacity range
        
        confettiContainer.appendChild(confetti);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createConfetti();
    createFloatingHearts();
    createBackgroundHearts();
    
    const galleryElement = document.getElementById('memoryGallery');
    const startSlideshowBtn = document.getElementById('startSlideshow');
    const pauseSlideshowBtn = document.getElementById('pauseSlideshow');
    const backButton = document.getElementById('backButton');
    const nextButton = document.getElementById('nextButton');
    
    let slideshowInterval;
    let currentSlide = 0;
    let loadedImages = 0;
    const totalImages = memories.length;

    // Generate memory cards with lazy loading and optimized animations
    memories.forEach((memory, index) => {
        const memoryCard = document.createElement('div');
        memoryCard.className = 'memory-card';
        memoryCard.style.setProperty('--rotate', `${memory.rotationAngle}deg`);
        
        const tapeElement = document.createElement('div');
        tapeElement.className = 'card-tape';
        tapeElement.style.setProperty('--rotate', `${memory.rotationAngle * 2}deg`);
        
        const imgElement = document.createElement('img');
        imgElement.className = 'memory-img';
        imgElement.alt = `Memory ${index + 1}`;
        imgElement.loading = 'lazy';
        
        // Lazy load image with optimized loading
        const img = new Image();
        img.onload = () => {
            imgElement.src = memory.image;
            loadedImages++;
            if (loadedImages === totalImages) {
                document.querySelector('.slideshow-controls').style.opacity = '1';
            }
        };
        img.src = memory.image;
        
        const captionElement = document.createElement('div');
        captionElement.className = 'memory-caption';
        captionElement.textContent = memory.caption;
        
        const stickerElement = document.createElement('div');
        stickerElement.className = 'card-sticker';
        stickerElement.innerHTML = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#ff6ec4" />
            <text x="50" y="65" font-family="Arial" font-size="40" text-anchor="middle" fill="white">${memory.emoji}</text>
        </svg>`;
        
        memoryCard.appendChild(tapeElement);
        memoryCard.appendChild(imgElement);
        memoryCard.appendChild(captionElement);
        memoryCard.appendChild(stickerElement);
        galleryElement.appendChild(memoryCard);
    });

    // Optimized Intersection Observer with reduced threshold
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 }); // Further reduced threshold

    // Observe all memory cards with optimized delays
    document.querySelectorAll('.memory-card').forEach((card, index) => {
        observer.observe(card);
        card.style.animationDelay = `${0.03 * index}s`; // Reduced delay between cards
    });

    // Optimized slideshow functionality
    function startSlideshow() {
        startSlideshowBtn.style.display = 'none';
        pauseSlideshowBtn.style.display = 'flex';
        
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
        
        slideshowInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % memories.length;
            
            const cards = galleryElement.querySelectorAll('.memory-card');
            if (cards && cards.length > 0 && cards[currentSlide]) {
                gsap.to(galleryElement, {
                    scrollTo: {
                        x: cards[currentSlide],
                        offsetX: 0
                    },
                    duration: 0.4, // Reduced duration
                    ease: 'power2.out' // Smoother easing
                });
            }
        }, 3500); // Increased interval for smoother transitions
    }

    function pauseSlideshow() {
        pauseSlideshowBtn.style.display = 'none';
        startSlideshowBtn.style.display = 'flex';
        
        // Clear interval to stop slideshow
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    }

    // Event listeners for slideshow controls
    startSlideshowBtn.addEventListener('click', startSlideshow);
    pauseSlideshowBtn.addEventListener('click', pauseSlideshow);

    // Event listeners for navigation buttons
    backButton.addEventListener('click', function() {
        window.location.href = 'index.html'; // Adjust this to your welcome page URL
    });

    nextButton.addEventListener('click', function() {
        window.location.href = 'cake.html'; // Adjust this to your next surprise page URL
    });

    // Scroll animations with GSAP
    gsap.from('.header', {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: 'back.out(1.7)'
    });

    gsap.from('.navigation-buttons', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.5,
        ease: 'power3.out'
    });

    // Add animation to stickers
    gsap.utils.toArray('.sticker').forEach(sticker => {
        gsap.to(sticker, {
            rotation: 'random(-20, 20)',
            duration: 'random(2, 4)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });

    // Enhanced hover effect for memory cards
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.08,
                boxShadow: '0 20px 40px rgba(255, 105, 180, 0.6)',
                duration: 0.4,
                ease: 'power2.out'
            });

            // Create heart burst effect
            createHeartBurst(this);
            
            // Add sparkle effect
            addSparkleEffect(this);
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                boxShadow: '0 10px 25px rgba(255, 105, 180, 0.3)',
                duration: 0.3,
                ease: 'power2.in'
            });
        });

        // Add click animation
        card.addEventListener('click', function(e) {
            // Prevent default behavior
            e.preventDefault();

            // Create explosive heart burst
            createExplosiveHeartBurst(this);
            
            // Create circular sparkle wave
            createSparkleWave(this);
            
            // Zoom effect with GSAP
            gsap.timeline()
                .to(this, {
                    scale: 1.15,
                    duration: 0.3,
                    ease: 'power2.out'
                })
                .to(this, {
                    scale: 1,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });

            // Add floating hearts around the card
            createFloatingHeartsAround(this);
        });
    });

    // Enhanced heart burst effect
    function createHeartBurst(element) {
        const rect = element.getBoundingClientRect();
        const burstCount = 12;
        const heartTypes = ['❤', '💗', '💓', '💕'];
        
        for (let i = 0; i < burstCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'mini-heart';
            heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
            heart.style.left = rect.left + rect.width / 2 + 'px';
            heart.style.top = rect.top + rect.height / 2 + 'px';
            heart.style.fontSize = `${Math.random() * 10 + 15}px`;
            
            const angle = (i / burstCount) * Math.PI * 2;
            const velocity = Math.random() * 100 + 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            gsap.to(heart, {
                x: vx,
                y: vy,
                scale: 0,
                opacity: 0,
                duration: Math.random() * 0.5 + 0.5,
                ease: 'power2.out',
                onComplete: () => heart.remove()
            });
            
            document.body.appendChild(heart);
        }
    }

    // Enhanced sparkle effect
    function addSparkleEffect(element) {
        const sparkleCount = 3;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-effect';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.animationDelay = `${i * 0.2}s`;
            element.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1500);
        }
    }

    // Function to create explosive heart burst
    function createExplosiveHeartBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const burstCount = 24;
        const heartTypes = ['❤', '💗', '💓', '💕', '💖', '💘', '💝'];
        const colors = ['#ff6ec4', '#ff4e91', '#ff69b4', '#ff1493', '#ff8da1', '#ffb6c1'];

        for (let i = 0; i < burstCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'explosion-heart';
            heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.left = centerX + 'px';
            heart.style.top = centerY + 'px';
            heart.style.fontSize = `${Math.random() * 15 + 20}px`;
            heart.style.textShadow = '0 0 10px rgba(255, 105, 180, 0.7)';
            
            const angle = (i / burstCount) * Math.PI * 2;
            const velocity = Math.random() * 200 + 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            gsap.to(heart, {
                x: vx,
                y: vy,
                scale: 0,
                opacity: 0,
                rotation: Math.random() * 360,
                duration: 1.5,
                ease: 'power2.out',
                onComplete: () => heart.remove()
            });
            
            document.body.appendChild(heart);
        }
    }

    // Function to create sparkle wave
    function createSparkleWave(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const wave = document.createElement('div');
        wave.className = 'sparkle-wave';
        wave.style.left = centerX + 'px';
        wave.style.top = centerY + 'px';
        
        document.body.appendChild(wave);
        
        gsap.to(wave, {
            scale: 2,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => wave.remove()
        });

        // Create multiple waves
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const delayedWave = document.createElement('div');
                delayedWave.className = 'sparkle-wave';
                delayedWave.style.left = centerX + 'px';
                delayedWave.style.top = centerY + 'px';
                
                document.body.appendChild(delayedWave);
                
                gsap.to(delayedWave, {
                    scale: 2,
                    opacity: 0,
                    duration: 1,
                    delay: i * 0.2,
                    ease: 'power2.out',
                    onComplete: () => delayedWave.remove()
                });
            }, i * 200);
        }
    }

    // Function to create floating hearts around clicked card
    function createFloatingHeartsAround(element) {
        const rect = element.getBoundingClientRect();
        const heartCount = 8;
        const heartTypes = ['❤', '💗', '💓', '💕', '💖'];
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-click-heart';
            heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
            
            const angle = (i / heartCount) * Math.PI * 2;
            const radius = Math.random() * 30 + 80;
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            heart.style.left = startX + 'px';
            heart.style.top = startY + 'px';
            
            document.body.appendChild(heart);
            
            gsap.to(heart, {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                scale: Math.random() * 0.5 + 0.5,
                rotation: Math.random() * 360,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.to(heart, {
                        y: -100,
                        opacity: 0,
                        duration: 0.8,
                        delay: Math.random() * 0.5,
                        ease: 'power2.in',
                        onComplete: () => heart.remove()
                    });
                }
            });
        }
    }

    // Auto scroll to show the gallery
    setTimeout(() => {
        const galleryContainer = document.querySelector('.gallery-container');
        galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2000);
});