// Three.js 3D Background Scene
class ThreeBackground {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometries = [];
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };

        this.init();
        this.createGeometries();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    createGeometries() {
        // Create multiple geometric shapes
        const shapes = [
            // Torus
            {
                geometry: new THREE.TorusGeometry(5, 1.5, 16, 100),
                color: 0x6C63FF,
                position: { x: -15, y: 10, z: -10 },
                rotation: { x: 0, y: 0, z: 0 }
            },
            // Icosahedron
            {
                geometry: new THREE.IcosahedronGeometry(4, 0),
                color: 0xFF6584,
                position: { x: 15, y: -8, z: -15 },
                rotation: { x: 0, y: 0, z: 0 }
            },
            // Octahedron
            {
                geometry: new THREE.OctahedronGeometry(3.5, 0),
                color: 0x00F5FF,
                position: { x: -10, y: -12, z: -8 },
                rotation: { x: 0, y: 0, z: 0 }
            },
            // Torus Knot
            {
                geometry: new THREE.TorusKnotGeometry(3, 1, 100, 16),
                color: 0x9D4EDD,
                position: { x: 18, y: 15, z: -20 },
                rotation: { x: 0, y: 0, z: 0 }
            },
            // Dodecahedron
            {
                geometry: new THREE.DodecahedronGeometry(3, 0),
                color: 0xF72585,
                position: { x: 0, y: 18, z: -12 },
                rotation: { x: 0, y: 0, z: 0 }
            },
            // Sphere with wireframe
            {
                geometry: new THREE.SphereGeometry(4, 32, 32),
                color: 0x4CC9F0,
                position: { x: -20, y: -5, z: -18 },
                rotation: { x: 0, y: 0, z: 0 },
                wireframe: true
            },
            // Box
            {
                geometry: new THREE.BoxGeometry(5, 5, 5),
                color: 0x7209B7,
                position: { x: 12, y: 5, z: -8 },
                rotation: { x: 0, y: 0, z: 0 }
            },
            // Cone
            {
                geometry: new THREE.ConeGeometry(3, 6, 32),
                color: 0x560BAD,
                position: { x: 5, y: -15, z: -12 },
                rotation: { x: 0, y: 0, z: 0 }
            }
        ];

        shapes.forEach((shape, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: shape.color,
                wireframe: shape.wireframe || false,
                transparent: true,
                opacity: 0.7,
                shininess: 100
            });

            const mesh = new THREE.Mesh(shape.geometry, material);
            mesh.position.set(shape.position.x, shape.position.y, shape.position.z);
            mesh.rotation.set(shape.rotation.x, shape.rotation.y, shape.rotation.z);

            // Store original position for animation
            mesh.userData = {
                originalPosition: { ...shape.position },
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: 0.001 + Math.random() * 0.002,
                floatOffset: Math.random() * Math.PI * 2
            };

            this.geometries.push(mesh);
            this.scene.add(mesh);
        });

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0x6C63FF, 0.8);
        directionalLight1.position.set(10, 10, 10);
        this.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xFF6584, 0.6);
        directionalLight2.position.set(-10, -10, -10);
        this.scene.add(directionalLight2);

        const pointLight = new THREE.PointLight(0x00F5FF, 1, 100);
        pointLight.position.set(0, 0, 20);
        this.scene.add(pointLight);
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            // Normalize mouse coordinates to -1 to 1
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            // Calculate target rotation based on mouse position
            this.targetRotation.x = this.mouse.y * 0.3;
            this.targetRotation.y = this.mouse.x * 0.3;
        });

        window.addEventListener('resize', () => {
            // Update camera
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            // Update renderer
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth interpolation for camera rotation
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;

        // Apply rotation to entire scene
        this.scene.rotation.x = this.currentRotation.x;
        this.scene.rotation.y = this.currentRotation.y;

        // Animate individual geometries
        const time = Date.now() * 0.001;

        this.geometries.forEach((mesh, index) => {
            // Auto rotation
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;

            // Floating animation
            const floatOffset = mesh.userData.floatOffset;
            const floatSpeed = mesh.userData.floatSpeed;
            mesh.position.y = mesh.userData.originalPosition.y +
                             Math.sin(time * floatSpeed + floatOffset) * 2;

            // Slight horizontal drift
            mesh.position.x = mesh.userData.originalPosition.x +
                             Math.cos(time * floatSpeed * 0.5 + floatOffset) * 1;

            // Pulsing opacity
            mesh.material.opacity = 0.5 + Math.sin(time + index) * 0.2;

            // Mouse interaction - slight movement towards mouse
            const mouseInfluence = 0.5;
            mesh.position.x += this.mouse.x * mouseInfluence;
            mesh.position.y += this.mouse.y * mouseInfluence;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Particle Animation
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouse = { x: null, y: null, radius: 150 };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 1,
                speedY: (Math.random() - 0.5) * 1,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = ['#6C63FF', '#FF6584', '#00F5FF', '#ffffff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(108, 99, 255, ${1 - distance / 150})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius && this.mouse.x !== null) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x -= Math.cos(angle) * force * 3;
                particle.y -= Math.sin(angle) * force * 3;
            }

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(particle.x, this.canvas.width));
            particle.y = Math.max(0, Math.min(particle.y, this.canvas.height));
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawParticles();
        this.connectParticles();
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// Smooth Scroll
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Animated Counter
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const increment = target / speed;
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        if (target < 10) {
                            counter.textContent = current.toFixed(1);
                        } else {
                            counter.textContent = Math.ceil(current).toLocaleString();
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        if (target < 10) {
                            counter.textContent = target.toFixed(1);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Scroll Animations
function scrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.classList.add('visible');
                // Don't override transform as it's handled by repulsion effect
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .stat-card, .contact-card').forEach(element => {
        element.style.opacity = '0';
        element.classList.add('scroll-animate');
        observer.observe(element);
    });
}

// Navbar Scroll Effect
function navbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.padding = '1.5rem 0';
            navbar.style.background = 'rgba(10, 10, 15, 0.9)';
        }

        lastScroll = currentScroll;
    });
}

// Parallax Effect
function parallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-card');

        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Form Submission
function handleFormSubmission() {
    const form = document.querySelector('.contact-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Create success message
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Message sent successfully! We\'ll get back to you soon.';
        successMessage.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(108, 99, 255, 0.5);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
        `;

        document.body.appendChild(successMessage);

        // Reset form
        form.reset();

        // Remove message after 3 seconds
        setTimeout(() => {
            successMessage.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => successMessage.remove(), 500);
        }, 3000);
    });
}

// Newsletter Subscription
function handleNewsletterSubscription() {
    const newsletterForm = document.querySelector('.newsletter');
    const button = newsletterForm.querySelector('button');

    button.addEventListener('click', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');

        if (input.value) {
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Thanks for subscribing!';
            successMessage.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(108, 99, 255, 0.5);
                z-index: 10000;
                animation: slideInUp 0.5s ease;
            `;

            document.body.appendChild(successMessage);

            // Reset input
            input.value = '';

            // Remove message after 3 seconds
            setTimeout(() => {
                successMessage.style.animation = 'slideOutDown 0.5s ease';
                setTimeout(() => successMessage.remove(), 500);
            }, 3000);
        }
    });
}

// Button Click Effects
function addButtonEffects() {
    document.querySelectorAll('button, .btn-primary, .btn-large, .btn-outline').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                animation: ripple 0.6s ease;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Cursor Trail Effect
function createCursorTrail() {
    const trail = [];
    const trailLength = 20;

    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY });

        if (trail.length > trailLength) {
            trail.shift();
        }
    });

    function drawTrail() {
        const existingTrails = document.querySelectorAll('.cursor-trail');
        existingTrails.forEach(t => t.remove());

        trail.forEach((point, index) => {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: rgba(108, 99, 255, ${index / trailLength});
                pointer-events: none;
                z-index: 9999;
                left: ${point.x}px;
                top: ${point.y}px;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(dot);
        });

        requestAnimationFrame(drawTrail);
    }

    drawTrail();
}

// Repulsion Effect for All Components
class RepulsionEffect {
    constructor() {
        this.mouse = { x: null, y: null };
        this.elements = [];
        this.repulsionRadius = 200;
        this.repulsionStrength = 30;
        this.initialized = false;

        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Select all elements that should have repulsion effect
        const selectors = [
            '.feature-card',
            '.stat-card',
            '.contact-card',
            '.floating-card',
            '.about-card',
            '.hero-text',
            '.nav-menu li',
            '.social-links a',
            '.form-group'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // Store original position
                const rect = element.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

                this.elements.push({
                    element: element,
                    originalX: 0,
                    originalY: 0,
                    currentX: 0,
                    currentY: 0
                });

                // Add smooth transition
                element.style.transition = 'transform 0.3s ease-out';
            });
        });

        this.setupEventListeners();
        this.animate();
        this.initialized = true;
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
            this.resetAllElements();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateElementPositions();
        });

        // Handle scroll
        window.addEventListener('scroll', () => {
            this.updateElementPositions();
        });
    }

    updateElementPositions() {
        this.elements.forEach(item => {
            item.originalX = 0;
            item.originalY = 0;
        });
    }

    calculateRepulsion(element) {
        const rect = element.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        if (this.mouse.x === null || this.mouse.y === null) {
            return { x: 0, y: 0 };
        }

        const dx = elementCenterX - this.mouse.x;
        const dy = elementCenterY - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.repulsionRadius) {
            const force = (this.repulsionRadius - distance) / this.repulsionRadius;
            const angle = Math.atan2(dy, dx);

            const repulsionX = Math.cos(angle) * force * this.repulsionStrength;
            const repulsionY = Math.sin(angle) * force * this.repulsionStrength;

            return { x: repulsionX, y: repulsionY };
        }

        return { x: 0, y: 0 };
    }

    resetAllElements() {
        this.elements.forEach(item => {
            item.currentX = 0;
            item.currentY = 0;
            item.element.style.transform = `translate(0px, 0px)`;
        });
    }

    animate() {
        this.elements.forEach(item => {
            const repulsion = this.calculateRepulsion(item.element);

            // Smooth interpolation
            item.currentX += (repulsion.x - item.currentX) * 0.1;
            item.currentY += (repulsion.y - item.currentY) * 0.1;

            // Apply transform
            const existingTransform = item.element.style.transform;

            // Check if element has specific animations (like floating cards)
            if (item.element.classList.contains('floating-card')) {
                // Preserve the float animation by combining transforms
                const floatMatch = existingTransform.match(/translateY\(([^)]+)\)/);
                const floatY = floatMatch ? floatMatch[1] : '0px';
                item.element.style.transform = `translate(${item.currentX}px, ${floatY}) translateX(0px)`;
            } else if (item.element.classList.contains('about-card')) {
                // Preserve rotation for about card
                const rotateMatch = existingTransform.match(/rotateY\(([^)]+)\)/);
                const rotation = rotateMatch ? rotateMatch[1] : '0deg';
                item.element.style.transform = `translate(${item.currentX}px, ${item.currentY}px) rotateY(${rotation})`;
            } else {
                // Standard repulsion
                item.element.style.transform = `translate(${item.currentX}px, ${item.currentY}px)`;
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Enhanced Floating Cards with Repulsion
function enhanceFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');

    cards.forEach((card, index) => {
        // Store original animation
        let startTime = Date.now();
        const delay = index * 500;
        const duration = 3000;

        function animateFloat() {
            const elapsed = Date.now() - startTime;
            const progress = ((elapsed + delay) % duration) / duration;
            const y = Math.sin(progress * Math.PI * 2) * 20;

            // Get current repulsion transform
            const currentTransform = card.style.transform;
            const translateMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);

            if (translateMatch) {
                const repulsionX = translateMatch[1];
                card.style.transform = `translate(${repulsionX}, ${y}px)`;
            } else {
                card.style.transform = `translateY(${y}px)`;
            }

            requestAnimationFrame(animateFloat);
        }

        animateFloat();
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js 3D background
    if (typeof THREE !== 'undefined') {
        new ThreeBackground();
        console.log('✨ Three.js 3D background initialized!');
    }

    // Initialize particle system
    new ParticleSystem();

    // Initialize repulsion effect
    new RepulsionEffect();

    // Initialize all features
    smoothScroll();
    animateCounters();
    scrollAnimations();
    navbarScrollEffect();
    parallaxEffect();
    handleFormSubmission();
    handleNewsletterSubscription();
    addButtonEffects();
    createCursorTrail();
    enhanceFloatingCards();

    console.log('🚀 Landing page loaded successfully with 3D effects and repulsion!');
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
