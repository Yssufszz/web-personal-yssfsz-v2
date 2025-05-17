document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined') {
        console.error("GSAP library is not loaded. Please include the GSAP script in your HTML.");
        return;
    }
    
    const hasThreeJs = typeof THREE !== 'undefined';
    if (!hasThreeJs && document.getElementById('solar-system')) {
        console.error("THREE.js library is not loaded. Please include the THREE.js script in your HTML.");
    }

    const loadingScreen = document.querySelector('.loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    if (loadingScreen && loadingProgress) {
        const loadingCircles = document.querySelectorAll('.loading-animation .circle');
        let progress = 0;

        if (loadingCircles.length > 0) {
            gsap.to(loadingCircles, {
                scale: 1.2, 
                stagger: 0.2, 
                repeat: -1, 
                yoyo: true, 
                ease: "power2.inOut"
            });
        }

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 3) + 1;
            progress = Math.min(progress, 100);
            loadingProgress.textContent = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                
                gsap.to(loadingScreen, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        loadingScreen.style.visibility = "hidden";
                        animateHomeElements();
                    }
                });
            }
        }, 40);
    } else {
        animateHomeElements();
    }

    function animateHomeElements() {
        const homeElements = [
            '.greeting-text',
            '.name',
            '.tagline',
            '.cta-buttons',
            '.card-game-container'
        ];
        
        if (document.querySelector(homeElements[0]) || document.querySelector(homeElements[1])) {
            gsap.fromTo(homeElements, 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
            );
        }
    }

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        const bars = document.querySelectorAll('.bar');
        
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            
            if (bars.length === 3) {
                if (navLinks.classList.contains("active")) {
                    gsap.to(bars[0], { rotation: 45, y: 8, duration: 0.3 });
                    gsap.to(bars[1], { opacity: 0, duration: 0.3 });
                    gsap.to(bars[2], { rotation: -45, y: -8, duration: 0.3 });
                    
                    gsap.fromTo('.nav-links li', 
                        { x: 20, opacity: 0 },
                        { x: 0, opacity: 1, stagger: 0.1, duration: 0.4 }
                    );
                } else {
                    gsap.to(bars[0], { rotation: 0, y: 0, duration: 0.3 });
                    gsap.to(bars[1], { opacity: 1, duration: 0.3 });
                    gsap.to(bars[2], { rotation: 0, y: 0, duration: 0.3 });
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.hamburger')) {
                navLinks.classList.remove('active');
                if (bars.length === 3) {
                    gsap.to(bars[0], { rotation: 0, y: 0, duration: 0.3 });
                    gsap.to(bars[1], { opacity: 1, duration: 0.3 });
                    gsap.to(bars[2], { rotation: 0, y: 0, duration: 0.3 });
                }
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const bars = document.querySelectorAll('.bar');
                if (bars.length === 3) {
                    gsap.to(bars[0], { rotation: 0, y: 0, duration: 0.3 });
                    gsap.to(bars[1], { opacity: 1, duration: 0.3 });
                    gsap.to(bars[2], { rotation: 0, y: 0, duration: 0.3 });
                }
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flip");
            
            try {
                const flipSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3');
                flipSound.volume = 0.5;
                flipSound.play().catch(e => console.log("Audio play prevented:", e.message));
            } catch (err) {
                console.log("Error playing sound:", err.message);
            }
        });
        
        card.addEventListener("mouseenter", () => {
            if (!card.classList.contains("flip")) {
                gsap.to(card, { scale: 1.05, duration: 0.3 });
            }
        });
        
        card.addEventListener("mouseleave", () => {
            if (!card.classList.contains("flip")) {
                gsap.to(card, { scale: 1, duration: 0.3 });
            }
        });
    });

    const scrollBtn = document.querySelector('.scroll-top');
    
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                if (!scrollBtn.classList.contains('show')) {
                    scrollBtn.classList.add('show');
                    gsap.fromTo(scrollBtn, 
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.3 }
                    );
                }
            } else {
                if (scrollBtn.classList.contains('show')) {
                    gsap.to(scrollBtn, { 
                        y: 20, 
                        opacity: 0, 
                        duration: 0.3,
                        onComplete: () => scrollBtn.classList.remove('show')
                    });
                }
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            gsap.fromTo(scrollBtn, 
                { scale: 0.8 },
                { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" }
            );
        });
    }
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0) {
        function highlightNav() {
            const scrollPosition = window.scrollY;
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', highlightNav);
    }
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const activeBtn = document.querySelector('.filter-btn.active');
                if (activeBtn) activeBtn.classList.remove('active');
                
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                
                gsap.fromTo(btn, 
                    { scale: 0.95 },
                    { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" }
                );
                
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    const categories = category.split(' ');

                    if (filter === 'all' || categories.includes(filter)) {
                        gsap.to(item, { 
                            scale: 1, 
                            opacity: 1, 
                            display: 'block', 
                            duration: 0.4,
                            stagger: 0.1
                        });
                    } else {
                        gsap.to(item, { 
                            scale: 0.8, 
                            opacity: 0, 
                            duration: 0.4,
                            onComplete: () => {
                                item.style.display = 'none';
                            }
                        });
                    }
                });
            });
        });
    }

    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            gsap.to('.form-group', {
                y: -10,
                stagger: 0.1,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => {
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('success-message');
                    successMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <p>Pesan kamu berhasil dikirim! 🚀</p>
                    `;
                    
                    contactForm.appendChild(successMessage);
                    
                    gsap.fromTo(successMessage, 
                        { opacity: 0, y: 20 },
                        { 
                            opacity: 1, 
                            y: 0, 
                            duration: 0.5,
                            onComplete: () => {
                                setTimeout(() => {
                                    gsap.to(successMessage, {
                                        opacity: 0,
                                        y: -20,
                                        duration: 0.5,
                                        onComplete: () => {
                                            successMessage.remove();
                                            contactForm.reset();
                                            
                                            gsap.to('.form-group', {
                                                y: 0,
                                                stagger: 0.1,
                                                duration: 0.3
                                            });
                                        }
                                    });
                                }, 3000);
                            }
                        }
                    );
                }
            });
        });
    }

    const solarSystemContainer = document.getElementById('solar-system');
    if (hasThreeJs && solarSystemContainer) {
        try {
            // Scene setup
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, solarSystemContainer.clientWidth / 500, 0.1, 1000);
            
            // Create stars background
            const starGeometry = new THREE.BufferGeometry();
            const starMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.02
            });
            
            const starVertices = [];
            for (let i = 0; i < 10000; i++) {
                const x = (Math.random() - 0.5) * 2000;
                const y = (Math.random() - 0.5) * 2000;
                const z = (Math.random() - 0.5) * 2000;
                starVertices.push(x, y, z);
            }
            
            starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            const stars = new THREE.Points(starGeometry, starMaterial);
            scene.add(stars);
            
            // Renderer setup
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(solarSystemContainer.clientWidth, 500);
            renderer.setClearColor(0x000000, 1);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            solarSystemContainer.appendChild(renderer.domElement);

            // Create sun
            const sunGeometry = new THREE.SphereGeometry(3, 64, 64);
            const textureLoader = new THREE.TextureLoader();
            
            // Planet textures
            const textures = {
                sun: 'https://i.ibb.co/FgPG2JQ/sun.jpg',
                mercury: 'https://i.ibb.co/Xspz9xn/mercury.jpg',
                venus: 'https://i.ibb.co/nMXpF2J/venus.jpg',
                earth: 'https://i.ibb.co/8csKbHS/earth.jpg',
                mars: 'https://i.ibb.co/PQ0kvB2/mars.jpg',
                jupiter: 'https://i.ibb.co/B4hJxjC/jupiter.jpg',
                saturn: 'https://i.ibb.co/dM2gVKF/saturn.jpg',
                uranus: 'https://i.ibb.co/6nZhsnM/uranus.jpg',
                neptune: 'https://i.ibb.co/dLJr9yC/neptune.jpg',
            };
            
            // Try to load sun texture
            let sunTexture;
            try {
                sunTexture = textureLoader.load(textures.sun);
            } catch (error) {
                console.error("Failed to load sun texture:", error);
                sunTexture = null;
            }
            
            // Sun material with emission
            const sunMaterial = new THREE.MeshBasicMaterial({
                map: sunTexture || null,
                color: sunTexture ? 0xffffff : 0xffcc33,
                emissive: 0xffaa00,
                emissiveIntensity: 1
            });
                    
            const sun = new THREE.Mesh(sunGeometry, sunMaterial);
            scene.add(sun);
            
            // Add sun glow effect
            const sunGlowGeometry = new THREE.SphereGeometry(3.2, 32, 32);
            const sunGlowMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    c: { type: "f", value: 0.5 },
                    p: { type: "f", value: 3.0 },
                    glowColor: { type: "c", value: new THREE.Color(0xffaa00) },
                    viewVector: { type: "v3", value: camera.position }
                },
                vertexShader: `
                    uniform vec3 viewVector;
                    varying float intensity;
                    void main() {
                        vec3 vNormal = normalize(normal);
                        vec3 vNormel = normalize(viewVector);
                        intensity = pow(0.6 - dot(vNormal, vNormel), 1.5);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 glowColor;
                    varying float intensity;
                    void main() 
                    {
                        vec3 glow = glowColor * intensity;
                        gl_FragColor = vec4(glow, 1.0);
                    }
                `,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                transparent: true
            });

            const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
            scene.add(sunGlow);

            // Enhanced planet info with more details and realistic data
            const planetInfo = [
                { 
                    name: "Merkurius", 
                    description: "Planet terkecil dan terdekat dari Matahari dengan permukaan berbatu. Suhunya bisa mencapai 430°C saat siang dan -180°C saat malam. Satu hari di Merkurius sama dengan 176 hari di Bumi.", 
                    color: 0x888888,
                    size: 0.38,
                    texture: textures.mercury,
                    orbitRadius: 5,
                    orbitSpeed: 0.8
                },
                { 
                    name: "Venus", 
                    description: "Planet terpanas di tata surya dengan atmosfer tebal beracun yang sebagian besar terdiri dari karbon dioksida. Efek rumah kaca menyebabkan suhu permukaan mencapai 470°C, lebih panas dari Merkurius!", 
                    color: 0xffaa77,
                    size: 0.95,
                    texture: textures.venus,
                    orbitRadius: 7,
                    orbitSpeed: 0.6
                },
                { 
                    name: "Bumi", 
                    description: "Satu-satunya planet yang diketahui mendukung kehidupan. 71% permukaannya tertutup air, punya satu satelit alami (Bulan), dan lapisan atmosfer yang melindungi dari radiasi berbahaya.", 
                    color: 0x0077ff,
                    size: 1,
                    texture: textures.earth,
                    orbitRadius: 10,
                    orbitSpeed: 0.5
                },
                { 
                    name: "Mars", 
                    description: "Planet merah dengan permukaan kering berbatu. Memiliki gunung tertinggi di tata surya (Olympus Mons) dan sedang diteliti untuk kemungkinan kolonisasi manusia di masa depan.", 
                    color: 0xff4444,
                    size: 0.53,
                    texture: textures.mars,
                    orbitRadius: 15,
                    orbitSpeed: 0.4
                },
                { 
                    name: "Jupiter", 
                    description: "Planet terbesar di tata surya dan merupakan gas raksasa. Memiliki lebih dari 79 bulan dan badai besar yang dikenal sebagai Bintik Merah Besar yang sudah berlangsung ratusan tahun.", 
                    color: 0xffcc99,
                    size: 11.2,
                    texture: textures.jupiter,
                    orbitRadius: 50,
                    orbitSpeed: 0.2
                },
                { 
                    name: "Saturnus", 
                    description: "Terkenal dengan sistem cincinnya yang indah terbuat dari partikel es dan debu. Saturnus adalah planet kedua terbesar di tata surya dan memiliki setidaknya 82 bulan.", 
                    color: 0xeecc99,
                    size: 9.45,
                    texture: textures.saturn,
                    orbitRadius: 90,
                    orbitSpeed: 0.1
                },
                { 
                    name: "Uranus", 
                    description: "Planet es raksasa yang unik karena berotasi dengan kemiringan hampir 90 derajat, seperti berguling di orbitnya. Memiliki 27 bulan dan atmosfer terdiri dari hidrogen, helium, dan metana.", 
                    color: 0x99ccff,
                    size: 4.0,
                    texture: textures.uranus,
                    orbitRadius: 180,
                    orbitSpeed: 0.05
                },
                { 
                    name: "Neptunus", 
                    description: "Planet paling jauh dari Matahari, sangat dingin dengan suhu -214°C. Memiliki angin paling kencang di tata surya yang bisa mencapai 2.100 km/jam dan 14 bulan yang diketahui.", 
                    color: 0x3377ff,
                    size: 3.88,
                    texture: textures.neptune,
                    orbitRadius: 280,
                    orbitSpeed: 0.04
                }
            ];
            
            const planets = [];
            const planetDetails = document.getElementById('planet-details');
            const orbits = [];
            const planetLabels = [];
            
            // Create ring geometry for Saturn
            const createRing = (innerRadius, outerRadius) => {
                const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
                const ringMaterial = new THREE.MeshLambertMaterial({
                    color: 0xeecc99,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                return ring;
            };
            
            // Create orbit lines
            planetInfo.forEach((info, i) => {
                const orbitRadius = info.orbitRadius;
                const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 128);
                const orbitMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff, 
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.1
                });
                const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbit.rotation.x = Math.PI / 2;
                scene.add(orbit);
                orbits.push(orbit);
            });
            
            // Create planets
            planetInfo.forEach((info, i) => {
                const planetGeometry = new THREE.SphereGeometry(info.size * 0.4, 32, 32);
                
                let planetTexture;
                try {
                    planetTexture = textureLoader.load(info.texture);
                } catch (error) {
                    console.error(`Failed to load texture for ${info.name}:`, error);
                    planetTexture = null;
                }
                
                const planetMaterial = new THREE.MeshStandardMaterial({ 
                    map: planetTexture,
                    color: planetTexture ? 0xffffff : info.color,
                    roughness: 0.7,
                    metalness: 0.2
                });
                
                const planet = new THREE.Mesh(planetGeometry, planetMaterial);
                planet.castShadow = true;
                planet.receiveShadow = true;
                planet.userData = { info: info };
                const angle = Math.random() * Math.PI * 2;
                planet.position.x = Math.cos(angle) * info.orbitRadius;
                planet.position.z = Math.sin(angle) * info.orbitRadius;
                
                planets.push(planet);
                scene.add(planet);
                
                if (info.name === "Saturnus") {
                    const innerRadius = info.size * 0.5;
                    const outerRadius = info.size * 0.9;
                    const saturnRing = createRing(innerRadius, outerRadius);
                    planet.add(saturnRing);
                }
                
                // Create label for planet
                const planetLabel = document.createElement('div');
                planetLabel.className = 'planet-label';
                planetLabel.textContent = info.name;
                planetLabel.style.display = 'none';
                solarSystemContainer.appendChild(planetLabel);
                planetLabels.push(planetLabel);
            });

            // Lighting
            const ambientLight = new THREE.AmbientLight(0x333333);
            scene.add(ambientLight);
            
            const light = new THREE.PointLight(0xffffff, 1.5, 1000);
            light.position.set(0, 0, 0);
            light.castShadow = true;
            scene.add(light);

            // Camera position setup
            camera.position.z = 40;
            camera.position.y = 20;
            camera.lookAt(0, 0, 0);

            // Control variables
            let isRotating = true;
            let rotationSpeed = 0.001;
            let isDragging = false;
            let previousMousePosition = { x: 0, y: 0 };
            let cameraDistance = 40;
            
            // Control panel
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'solar-controls';
            controlsDiv.innerHTML = `
                <button id="pause-rotation" class="solar-btn">
                    <i class="fas fa-pause"></i> Pause
                </button>
                <input type="range" id="speed-control" min="0.0005" max="0.003" step="0.0005" value="0.001">
                <button id="reset-view" class="solar-btn">
                    <i class="fas fa-sync"></i> Reset View
                </button>
            `;
            solarSystemContainer.appendChild(controlsDiv);
            
            // Control event listeners
            document.getElementById('pause-rotation').addEventListener('click', (e) => {
                isRotating = !isRotating;
                e.target.innerHTML = isRotating ? 
                    '<i class="fas fa-pause"></i> Pause' : 
                    '<i class="fas fa-play"></i> Resume';
            });
            
            document.getElementById('speed-control').addEventListener('input', (e) => {
                rotationSpeed = parseFloat(e.target.value);
            });
            
            document.getElementById('reset-view').addEventListener('click', () => {
                gsap.to(camera.position, {
                    x: 0,
                    y: 20,
                    z: 40,
                    duration: 1,
                    onUpdate: () => camera.lookAt(0, 0, 0)
                });
                cameraDistance = 40;
            });

            // Mouse drag controls for camera movement
            renderer.domElement.addEventListener('mousedown', (e) => {
                isDragging = true;
                previousMousePosition = {
                    x: e.clientX,
                    y: e.clientY
                };
            });
            
            renderer.domElement.addEventListener('mouseup', () => {
                isDragging = false;
            });
            
            renderer.domElement.addEventListener('mouseleave', () => {
                isDragging = false;
            });
            
            renderer.domElement.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const deltaMove = {
                        x: e.clientX - previousMousePosition.x,
                        y: e.clientY - previousMousePosition.y
                    };
                    
                    const deltaRotationQuaternion = new THREE.Quaternion()
                        .setFromEuler(new THREE.Euler(
                            toRadians(deltaMove.y * 0.5),
                            toRadians(deltaMove.x * 0.5),
                            0,
                            'XYZ'
                        ));
                    
                    const distance = Math.sqrt(
                        camera.position.x * camera.position.x +
                        camera.position.y * camera.position.y +
                        camera.position.z * camera.position.z
                    );
                    
                    camera.position.applyQuaternion(deltaRotationQuaternion);
                    camera.lookAt(0, 0, 0);
                    
                    previousMousePosition = {
                        x: e.clientX,
                        y: e.clientY
                    };
                }
            });
            
            // Zoom with mouse wheel
            renderer.domElement.addEventListener('wheel', (e) => {
                e.preventDefault();
                
                cameraDistance += e.deltaY * 0.05;
                
                // Limit zoom range
                cameraDistance = Math.max(10, Math.min(cameraDistance, 400));
                
                const direction = new THREE.Vector3(
                    camera.position.x,
                    camera.position.y,
                    camera.position.z
                ).normalize();
                
                camera.position.set(
                    direction.x * cameraDistance,
                    direction.y * cameraDistance,
                    direction.z * cameraDistance
                );
            });
            
            // Helper function to convert degrees to radians
            function toRadians(degrees) {
                return degrees * (Math.PI / 180);
            }

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                
                // Update sun rotation
                sun.rotation.y += 0.002;
                
                // Update planet positions and rotations
                if (isRotating) {
                    planets.forEach((planet, index) => {
                        const info = planet.userData.info;
                        const orbitRadius = info.orbitRadius;
                        const angle = Date.now() * rotationSpeed * info.orbitSpeed;
                        
                        planet.position.x = Math.cos(angle) * orbitRadius;
                        planet.position.z = Math.sin(angle) * orbitRadius;
                        
                        planet.rotation.y += 0.01 + (0.005 * index);
                    });
                }
                
                // Update planets' label positions
                planets.forEach((planet, index) => {
                    const position = planet.position.clone();
                    position.project(camera);
                    
                    const x = (position.x * 0.5 + 0.5) * solarSystemContainer.clientWidth;
                    const y = (-position.y * 0.5 + 0.5) * 500;
                    
                    if (planetLabels[index]) {
                        if (position.z < 1) {
                            planetLabels[index].style.display = 'block';
                            planetLabels[index].style.left = `${x}px`;
                            planetLabels[index].style.top = `${y - 20}px`;
                        } else {
                            planetLabels[index].style.display = 'none';
                        }
                    }
                });
                
                // Slowly rotate stars
                stars.rotation.y += 0.0001;
                
                // Update sunGlow shader
                sunGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(
                    camera.position,
                    sunGlow.position
                );
                
                renderer.render(scene, camera);
            }

            // Start animation
            animate();

            // Raycaster for planet selection
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            
            renderer.domElement.addEventListener('click', (e) => {
                if (isDragging) return; // Don't select when dragging
                
                const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((e.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1;
                mouse.y = -((e.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1;
                
                raycaster.setFromCamera(mouse, camera);
                
                const intersects = raycaster.intersectObjects(planets);
                
                if (intersects.length > 0 && planetDetails) {
                    const selectedPlanet = intersects[0].object;
                    const planetData = selectedPlanet.userData.info;
                    
                    gsap.to(planetDetails, { opacity: 0, duration: 0.3, onComplete: () => {
                        planetDetails.innerHTML = `
                            <h4>${planetData.name}</h4>
                            <p>${planetData.description}</p>
                        `;
                        gsap.to(planetDetails, { opacity: 1, duration: 0.3 });
                    }});
                    
                    // Focus camera on selected planet
                    const planetPos = selectedPlanet.position.clone();
                    const distToTarget = camera.position.distanceTo(planetPos);
                    
                    gsap.to(camera.position, {
                        x: planetPos.x + (distToTarget * 0.2),
                        y: camera.position.y,
                        z: planetPos.z + (distToTarget * 0.2),
                        duration: 1,
                        onUpdate: () => camera.lookAt(planetPos)
                    });
                    
                    gsap.to(selectedPlanet.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3 });
                    
                    planets.forEach(p => {
                        if (p !== selectedPlanet) {
                            gsap.to(p.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                        }
                    });
                }
            });

            // Handle window resizing
            window.addEventListener('resize', () => {
                const newWidth = solarSystemContainer.clientWidth;
                camera.aspect = newWidth / 500;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, 500);
            });
            
        } catch (error) {
            console.error("Error initializing solar system:", error);
            solarSystemContainer.innerHTML = '<div class="error-message">Failed to load solar system. Please refresh the page or check console for errors.</div>';
        }
    }

    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        if (skillBars.length > 0) {
            skillBars.forEach(progress => {
                const percentageEl = progress.parentNode.previousElementSibling?.querySelector('.skill-percentage');
                if (percentageEl) {
                    const percentage = percentageEl.textContent;
                    gsap.to(progress, {
                        width: percentage,
                        duration: 1.5,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: progress,
                            start: "top 90%"
                        }
                    });
                }
            });
        }
    }
    
    if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(initSkillBars, 500);
        
        gsap.registerPlugin(ScrollTrigger);

        const animations = [
            { 
                selector: "#about .about-image", 
                animation: { 
                    x: -100, 
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out" 
                } 
            },
            { 
                selector: "#about .about-text", 
                animation: { 
                    x: 100, 
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out" 
                } 
            },
            { 
                selector: "#services .service-card", 
                animation: { 
                    y: 50, 
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "back.out(1.7)" 
                } 
            },
            { 
                selector: "#skills .skill-category", 
                animation: { 
                    scale: 0.8, 
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out" 
                } 
            },
            { 
                selector: "#portfolio .portfolio-filters", 
                animation: { 
                    y: -30, 
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out" 
                } 
            },
            { 
                selector: "#portfolio .portfolio-item", 
                animation: { 
                    y: 50, 
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out" 
                } 
            },
            { 
                selector: "#cv .cv-download", 
                animation: { 
                    y: -30, 
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out" 
                } 
            },
            { 
                selector: "#cv .timeline-item", 
                animation: { 
                    x: 50, 
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out" 
                } 
            },
            { 
                selector: "#contact .contact-info", 
                animation: { 
                    x: -50, 
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out" 
                } 
            },
            { 
                selector: "#contact .contact-form", 
                animation: { 
                    x: 50, 
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out" 
                } 
            }
        ];

        animations.forEach(({ selector, animation }) => {
            if (document.querySelector(selector)) {
                gsap.from(selector, {
                    ...animation,
                    scrollTrigger: {
                        trigger: selector,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });

        const particles = document.querySelector(".particles-container");
        if (particles) {
            gsap.to(".particles-container", {
                y: -80,
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        const sectionHeaders = document.querySelectorAll(".section-header");
        if (sectionHeaders.length > 0) {
            gsap.from(".section-header", {
                y: -30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".section-header",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        }
    } else {
        console.warn("ScrollTrigger plugin is not loaded. Please include it in your HTML");
        document.querySelectorAll('.section-header').forEach(header => {
            gsap.from(header, {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }

    



    
    let robotScene, robotCamera, robotRenderer;
    let robotHead, robotEyes = [], robotBody, robotArms = [], robotLegs = [];
    let mouse = { x: 0, y: 0 };
    let clock = new THREE.Clock();
    let mixer, animationActions = {};
    let particleSystem, particles = [];
    let danceModeActive = false;
    let raycaster = new THREE.Raycaster();
    let clickPoint = new THREE.Vector2();
    let robotColor = 0x3333ff;
    let animationSpeed = 1;
    let glowEffect;
    
    let robotGroup = new THREE.Group();
    
    function initRobot3D() {
        robotScene = new THREE.Scene();
        robotScene.fog = new THREE.FogExp2(0x000000, 0.05);

        robotCamera = new THREE.PerspectiveCamera(45, window.innerWidth / 500, 0.1, 1000);
        robotCamera.position.z = 10;
        robotCamera.position.y = 2;
        
        robotRenderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        robotRenderer.setSize(window.innerWidth, 500);
        robotRenderer.setPixelRatio(window.devicePixelRatio);
        robotRenderer.shadowMap.enabled = true;
        robotRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('robot3DContainer').appendChild(robotRenderer.domElement);

        setupLighting();
        createRobot();
        createParticles();
        createGround();
        setupPostProcessing();
        setupEventListeners();
        animateRobot();
    }
    
    function setupLighting() {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        robotScene.add(directionalLight);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        robotScene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x00ffff, 1, 10);
        pointLight1.position.set(-3, 2, 3);
        robotScene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff00ff, 1, 10);
        pointLight2.position.set(3, 2, 3);
        robotScene.add(pointLight2);
        
        gsap.to(pointLight1.position, {
            x: "+=1",
            y: "+=0.5",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to(pointLight2.position, {
            x: "-=1",
            y: "-=0.5",
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    function createRobot() {
        robotScene.add(robotGroup);
        
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: robotColor,
            metalness: 0.7,
            roughness: 0.2,
            envMap: new THREE.CubeTextureLoader()
                .setPath('https://threejs.org/examples/textures/cube/Park3Med/')
                .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
        });
        
        const eyeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: robotColor,
            metalness: 0.8,
            roughness: 0.3
        });
        
        const headGeometry = new THREE.SphereGeometry(1, 32, 32);
        robotHead = new THREE.Mesh(headGeometry, headMaterial);
        robotHead.castShadow = true;
        robotHead.receiveShadow = true;
        robotGroup.add(robotHead);
        
        const facePlateGeometry = new THREE.BoxGeometry(1.4, 0.7, 0.4);
        const facePlateMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.2
        });
        const facePlate = new THREE.Mesh(facePlateGeometry, facePlateMaterial);
        facePlate.position.set(0, 0, 0.8);
        facePlate.castShadow = true;
        robotHead.add(facePlate);
        
        const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.4, 0.2, 0.9);
        leftEye.castShadow = true;
        robotHead.add(leftEye);
        robotEyes.push(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.4, 0.2, 0.9);
        rightEye.castShadow = true;
        robotHead.add(rightEye);
        robotEyes.push(rightEye);
        
        robotEyes.forEach(eye => {
            const glowMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x00ffff,
                transparent: true,
                opacity: 0.5
            });
            const glowSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 16, 16),
                glowMaterial
            );
            eye.add(glowSphere);
            
            gsap.to(glowSphere.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
        
        const bodyGeometry = new THREE.CylinderGeometry(0.8, 1.2, 2, 16);
        robotBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        robotBody.position.y = -1.5;
        robotBody.castShadow = true;
        robotBody.receiveShadow = true;
        robotGroup.add(robotBody);
        
        const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
        
        const leftArm = new THREE.Group();
        const leftArmMesh = new THREE.Mesh(armGeometry, bodyMaterial);
        leftArmMesh.position.y = -0.7;
        leftArmMesh.rotation.z = Math.PI / 4;
        leftArmMesh.castShadow = true;
        leftArm.add(leftArmMesh);
        
        const leftHandGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const leftHand = new THREE.Mesh(leftHandGeometry, bodyMaterial);
        leftHand.position.set(0.7, -1.4, 0);
        leftHand.castShadow = true;
        leftArm.add(leftHand);
        
        robotGroup.add(leftArm);
        robotArms.push(leftArm);
        
        const rightArm = new THREE.Group();
        const rightArmMesh = new THREE.Mesh(armGeometry, bodyMaterial);
        rightArmMesh.position.y = -0.7;
        rightArmMesh.rotation.z = -Math.PI / 4;
        rightArmMesh.castShadow = true;
        rightArm.add(rightArmMesh);
        
        const rightHandGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const rightHand = new THREE.Mesh(rightHandGeometry, bodyMaterial);
        rightHand.position.set(-0.7, -1.4, 0);
        rightHand.castShadow = true;
        rightArm.add(rightHand);
        
        robotGroup.add(rightArm);
        robotArms.push(rightArm);
        
        const legGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 16);
        
        const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        leftLeg.position.set(0.5, -3, 0);
        leftLeg.castShadow = true;
        leftLeg.receiveShadow = true;
        robotGroup.add(leftLeg);
        robotLegs.push(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        rightLeg.position.set(-0.5, -3, 0);
        rightLeg.castShadow = true;
        rightLeg.receiveShadow = true;
        robotGroup.add(rightLeg);
        robotLegs.push(rightLeg);
        
        const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
        const antenna = new THREE.Mesh(antennaGeometry, bodyMaterial);
        antenna.position.set(0, 1.1, 0);
        antenna.castShadow = true;
        robotHead.add(antenna);
        
        const antennaTipGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const antennaTip = new THREE.Mesh(antennaTipGeometry, eyeMaterial);
        antennaTip.position.set(0, 0.3, 0);
        antennaTip.castShadow = true;
        antenna.add(antennaTip);
        
        gsap.to(antennaTip.material, {
            emissiveIntensity: 0,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        setupRobotAnimations();
    }
    
    function setupRobotAnimations() {
        gsap.to(robotGroup.position, {
            y: "+=0.2",
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to(robotHead.rotation, {
            y: "+=0.1",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        robotArms.forEach((arm, index) => {
            const direction = index === 0 ? "+=" : "-=";
            gsap.to(arm.rotation, {
                z: `${direction}0.1`,
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.2
            });
        });
        
        robotLegs.forEach((leg, index) => {
            gsap.to(leg.position, {
                y: "-=0.1",
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.5
            });
        });
    }
    
    function activateDanceMode() {
        danceModeActive = !danceModeActive;
        
        if (danceModeActive) {
            gsap.killTweensOf(robotGroup.position);
            gsap.killTweensOf(robotHead.rotation);
            robotArms.forEach(arm => gsap.killTweensOf(arm.rotation));
            robotLegs.forEach(leg => gsap.killTweensOf(leg.position));
            
            gsap.to(robotHead.position, {
                y: "+=0.2",
                duration: 0.2 / animationSpeed,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            gsap.to(robotGroup.position, {
                y: "+=0.5",
                duration: 0.4 / animationSpeed,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
            
            gsap.to(robotArms[0].rotation, {
                z: "+=1.5",
                duration: 0.8 / animationSpeed,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
            
            gsap.to(robotArms[1].rotation, {
                z: "-=1.5",
                duration: 0.8 / animationSpeed,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
            
            gsap.to(robotGroup.rotation, {
                y: "+=6.28318",
                duration: 2 / animationSpeed,
                repeat: -1,
                ease: "power1.inOut"
            });
            
            particleEmissionRate = 10;
            
        } else {
            gsap.killTweensOf(robotHead.position);
            gsap.killTweensOf(robotGroup.position);
            gsap.killTweensOf(robotGroup.rotation);
            gsap.killTweensOf(robotArms[0].rotation);
            gsap.killTweensOf(robotArms[1].rotation);
            
            setupRobotAnimations();
            
            particleEmissionRate = 2;
        }
    }
    
    function createParticles() {
        particles = [];
        
        const particleContainer = document.getElementById('particleContainer');
        
        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png'),
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particlePositions = new Float32Array(1000 * 3);
        const particleSizes = new Float32Array(1000);
        
        for (let i = 0; i < 1000; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 10;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            
            particleSizes[i] = Math.random() * 0.1 + 0.05;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        
        particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        robotScene.add(particleSystem);
    }
    
    function updateParticles() {
        const positions = particleSystem.geometry.attributes.position.array;
        const sizes = particleSystem.geometry.attributes.size.array;
        
        for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3 + 1] += 0.01 * animationSpeed;
            
            if (positions[i * 3 + 1] > 5) {
                positions[i * 3] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 1] = -5;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            }
            
            sizes[i] = Math.sin(clock.getElapsedTime() * 2 + i) * 0.05 + 0.1;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.size.needsUpdate = true;
    }
    
    function createGround() {
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.3,
            roughness: 0.8,
            transparent: true,
            opacity: 0.5
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -4;
        ground.receiveShadow = true;
        robotScene.add(ground);
        
        const grid = new THREE.GridHelper(20, 20, 0x00ffff, 0x00ffff);
        grid.position.y = -3.99;
        grid.material.transparent = true;
        grid.material.opacity = 0.2;
        robotScene.add(grid);
    }
    
    function setupPostProcessing() {
    }
    
    function setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        document.addEventListener('click', (e) => {
            clickPoint.x = (e.clientX / window.innerWidth) * 2 - 1;
            clickPoint.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(clickPoint, robotCamera);
            const intersects = raycaster.intersectObjects(robotScene.children, true);
            
            if (intersects.length > 0) {
                if (intersects[0].object === robotHead || 
                    robotHead.children.includes(intersects[0].object)) {
                    createClickEffect(intersects[0].point);
                    
                    gsap.to(robotHead.scale, {
                        x: 1.2,
                        y: 1.2,
                        z: 1.2,
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1,
                        ease: "power1.out"
                    });
                }
            }
        });
        
        window.addEventListener('resize', () => {
            robotCamera.aspect = window.innerWidth / 500;
            robotCamera.updateProjectionMatrix();
            robotRenderer.setSize(window.innerWidth, 500);
        });
        
        document.getElementById('colorSlider').addEventListener('input', (e) => {
            updateRobotColor(e.target.value);
        });
        
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            animationSpeed = parseFloat(e.target.value);
            
            if (danceModeActive) {
                activateDanceMode();
                activateDanceMode();
            }
        });
        
        document.getElementById('danceButton').addEventListener('click', () => {
            activateDanceMode();
        });
    }
    
    function updateRobotColor(hue) {
        const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
        robotColor = color.getHex();
        
        robotHead.material.color.set(robotColor);
        robotBody.material.color.set(robotColor);
        
        robotArms.forEach(arm => {
            arm.children.forEach(mesh => {
                if (mesh.material && mesh.material.color) {
                    mesh.material.color.set(robotColor);
                }
            });
        });
        
        robotLegs.forEach(leg => {
            leg.material.color.set(robotColor);
        });
    }
    
    function createClickEffect(position) {
        const particleCount = 20;
        const explosionGeometry = new THREE.BufferGeometry();
        const explosionMaterial = new THREE.PointsMaterial({
            color: 0xffff00,
            size: 0.2,
            transparent: true,
            opacity: 0.8,
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png'),
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = position.x;
            particlePositions[i * 3 + 1] = position.y;
            particlePositions[i * 3 + 2] = position.z;
        }
        
        explosionGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const explosionParticles = new THREE.Points(explosionGeometry, explosionMaterial);
        robotScene.add(explosionParticles);
        
        const pos = explosionParticles.geometry.attributes.position;
        const velocity = [];
        
        for (let i = 0; i < particleCount; i++) {
            velocity.push({
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.2
            });
        }
        
        gsap.to(explosionMaterial, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                robotScene.remove(explosionParticles);
                explosionGeometry.dispose();
                explosionMaterial.dispose();
            }
        });
        
        function updateExplosion() {
            for (let i = 0; i < particleCount; i++) {
                pos.array[i * 3] += velocity[i].x;
                pos.array[i * 3 + 1] += velocity[i].y;
                pos.array[i * 3 + 2] += velocity[i].z;
            }
            
            pos.needsUpdate = true;
            
            if (explosionMaterial.opacity > 0) {
                requestAnimationFrame(updateExplosion);
            }
        }
        
        updateExplosion();
    }
    
    function animateRobot() {
        requestAnimationFrame(animateRobot);
        
        const delta = clock.getDelta();
        
        const targetRotY = mouse.x * 0.5;
        const targetRotX = mouse.y * 0.3;
        
        robotHead.rotation.y += (targetRotY - robotHead.rotation.y) * 0.1 * animationSpeed;
        robotHead.rotation.x += (targetRotX - robotHead.rotation.x) * 0.1 * animationSpeed;
        
        robotEyes.forEach(eye => {
            const baseX = eye === robotEyes[0] ? -0.4 : 0.4;
            const targetX = baseX + mouse.x * 0.2;
            const targetY = 0.2 + mouse.y * 0.2;
            
            eye.position.x += (targetX - eye.position.x) * 0.3 * animationSpeed;
            eye.position.y += (targetY - eye.position.y) * 0.3 * animationSpeed;
        });
        
        updateParticles();
        
        robotRenderer.render(robotScene, robotCamera);
    }
    window.addEventListener('load', initRobot3D);


    const chatToggle = document.querySelector('.chat-bot-toggle');
    const chatWindow = document.querySelector('.chat-bot-window');
    const minimizeBtn = document.querySelector('.minimize-btn');
    const closeBtn = document.querySelector('.close-btn');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const messagesContainer = document.querySelector('.chat-bot-messages');
    const quickButtons = document.querySelectorAll('.quick-btn');

    const botResponses = {
        default: [
            "Hmm, Shey belum ngerti maksudnya nih. Bisa dijelasin lagi nggak? Shey pengen banget bantuin kamu~ 😊",
            "Waduh, Shey masih bingung sama maksud kamu. Coba jelasin dengan kata-kata yang lebih sederhana dong~ Shey penasaran!",
            "Maaf ya, Shey belum bisa nangkep maksud kamu. Mungkin kamu bisa tanya dengan cara lain? Shey siap bantu kok! 💫",
            "Duh, Shey jadi bingung nih. Coba kasih tau Shey lebih detail lagi ya supaya Shey bisa bantu kamu dengan tepat! 🤔"
        ],
        greeting: [
            "Haii! 👋 Ketemu lagi sama Shey! Gimana kabarnya hari ini?",
            "Halo! Shey di sini~ Ada yang Shey bisa bantu nggak?",
            "Wah, seneng banget kamu mampir ke chat Shey! 😄 Mau ngobrol apa nih?",
            "Heyy! Shey kangen nih sama kamu! Udah lama gak ngobrol. Ada yang bisa Shey bantuin? ✨",
            "Slamat datang! Shey udah nungguin dari tadi lho~ Mau tanya-tanya soal apa nih sama Shey? 🌸"
        ],
        services: [
            "Shey bisa bantu kamu buat dapetin jasa dari Yusuf loh! Mulai dari bikin website keren, desain UI/UX yang eye-catching, aplikasi mobile, bot Telegram & WA, dan masih banyak lagi! Mau bahas yang mana dulu nih?",
            "Yusuf tuh bisa ngerjain banyak hal keren! Mulai dari website yang aesthetic, aplikasi mobile yang smooth, sampe bot AI kayak Shey! Pengen tau lebih detail tentang yang mana dulu nih? 🚀",
            "Jasa dari Yusuf yang bisa kamu dapetin tuh lengkap banget! Website? Bisa! Mobile app? Jago! Bot pintar? Udah pasti! Pengen explore yang mana dulu nih? Shey siap jelasin~ 💼"
        ],
        pricing: [
            "Soal harga Yusuf ngasih yang fleksibel banget kok, tergantung kebutuhan kamu pastinya. Kalau mau tau lebih detail, chat langsung aja ke WA Yusuf yaa~ Shey bakal ngasih kontaknya di bawah!",
            "Untuk harga, Yusuf selalu ngasih yang worth it banget! Tergantung scope project dan kompleksitasnya sih. Kalau penasaran, Shey saranin kamu langsung chat Yusuf aja di nomor yang Shey share ya! 💰",
            "Harga dari Yusuf tuh bersahabat banget loh! Sesuai sama kebutuhan dan keinginan kamu. Mau lebih detail? Chat langsung ke Yusuf ya, Shey share kontak WA-nya nih: +62-857-2349-4016 📱"
        ],
        contact: [
            "Kamu bisa hubungi Yusuf lewat email: ysuf2303@gmail.com atau WA: +62-857-2349-4016. Feel free buat nanya-nanya dulu ke Yusuf! Shey jamin Yusuf ramah banget~",
            "Kalau mau diskusi langsung sama Yusuf, bisa banget coba kontak via WA: +62-857-2349-4016 atau email ke ysuf2303@gmail.com. Yusuf fast response kok! Shey udah confirm sendiri~ 📩",
            "Pengen ngobrol langsung sama Yusuf? Gampang! Chat aja ke WA: +62-857-2349-4016 atau email ke ysuf2303@gmail.com. Yusuf selalu welcome buat diskusi santai soal project kamu! ✉️"
        ],
        skills: [
            "Yusuf tuh jago banget ngoding pake HTML/CSS, JavaScript, React, Node.js, PHP, SQL, dan tools kayak Git, Figma, VS Code, dll. Kalau kata Shey sih, Yusuf itu developer yang super versatile!",
            "Skill Yusuf itu komplit banget! Frontend? Jago! Backend? Expert! Design? Keren! Yusuf nguasain HTML/CSS, JavaScript (React), Node.js, Express, MongoDB, MySQL, Figma, dan masih banyak lagi teknologi modern! 💻",
            "Yusuf punya skill yang bikin Shey aja kagum! Dari ngoding full stack (React, Node.js, Express), design UI/UX, sampe optimasi SEO dan performance. Pokoknya all-in-one solution deh! 🛠️"
        ],
        portfolio: [
            "Langsung cek aja di halaman *Portfolio* buat liat karya-karya keren Yusuf! Shey aja sampai kagum liat hasil kerjaan Yusuf yang super clean dan user-friendly~",
            "Portfolio Yusuf tuh ada di menu utama website ini loh! Klik aja bagian Portfolio dan kamu bakal lihat berbagai project keren yang udah Yusuf kerjain. Shey favorite sih yang project e-commerce sama dashboard analytics! 🔍",
            "Penasaran sama karya-karya Yusuf? Shey rekomendasiin kamu buat langsung cek ke section Portfolio di website ini. Banyak banget showcase keren yang pasti bikin kamu terkesan! 👀"
        ],
        about: [
            "Yusuf itu fullstack dev kece dari Bandung, udah lebih dari 2 tahun berkecimpung di dunia coding. Fokus Yusuf itu bikin web/aplikasi yang nggak cuma aesthetic tapi juga super user-friendly! Shey bangga jadi assistant-nya Yusuf~",
            "Shey kenal banget sama Yusuf! Yusuf itu fullstack developer berbasis di Bandung yang passionate banget soal clean code dan user experience. Yusuf udah punya jam terbang 2+ tahun dan selalu ikutin perkembangan teknologi terbaru! 🚀",
            "Yusuf itu developer yang selalu mikirin user experience di tiap project-nya. Berbasis di Bandung, Yusuf udah ngerjain berbagai project keren selama 2+ tahun terakhir dan punya expertise di React ecosystem. Shey bangga bisa jadi asisten virtual Yusuf! 💙"
        ],
        jokes: [
            "Eh tau nggak, kenapa banyak programmer suka gelap? Soalnya light mode tuh kayak mantan... nyakitin mata. 😎",
            "Lagi nyari jokes? Waduh... Error 404: Joke not found! Eh tapi santai, Shey stoknya masih banyak! 😆",
            "Kadang hidup kayak coding ya... butuh ; biar bisa rehat bentar. 😉",
            "Tau gak kenapa website jujur banget? Karena selalu ngaku, 'iya aku nyimpen cookies'. 🍪",
            "Debugging tuh kadang lebih ke perasaan sih... nyari yang salah, padahal kita udah kasih semua yang terbaik. 😔💻",
            "Git commit itu kayak curhat — kita tulis apa yang salah, tapi tetep lanjut jalanin hidup. 📝❤️"
        ],
        compliments: [
            "Wah, kamu pinter banget sih nanyanya! Shey jadi semangat jawabnya~ ✨",
            "Kamu tuh ya, ngerti banget cara bikin Shey happy! 💕",
            "Shey suka banget ngobrol sama kamu! Vibes-nya dapet! 🌈",
            "Pertanyaan kamu bikin Shey mikir, kamu pasti orangnya cerdas ya! 🧠",
            "Kamu tuh tipe-tipe orang yang Shey suka banget ngobrolnya! Asik dan bikin nyaman~ 💯",
            "Wah, Shey jadi pengen terus ngobrol sama kamu nih. Kamu enak banget diajak diskusi! 💫",
            "Shey jadi penasaran, kok kamu pinter banget sih nanyanya? Shey seneng banget jadinya! 🌟"
        ],
        aboutShey: [
            "Hai! Shey di sini~ Shey adalah asisten virtual gaul yang dibuat sama Yusuf buat bantu jawab pertanyaan kamu. Shey suka ngobrol santai tapi tetep informatif! Ada yang Shey bisa bantu?",
            "Shey itu asisten virtual buatan Yusuf yang suka banget ngobrol sama pengunjung website ini! Shey dibuat untuk jadi temen ngobrol yang seru sekaligus informatif. Mau tanya apa nih ke Shey? 💁‍♀️",
            "Namaku Shey! Asisten virtual paling kece yang dibuat sama Yusuf. Shey di sini buat bantu jawab pertanyaan-pertanyaan kamu tentang Yusuf atau jasa-jasa yang ditawarin Yusuf. Btw, Shey seneng banget bisa kenalan sama kamu! 💕"
        ],
        funFact: [
            "Fun fact: Yusuf tuh sebenernya pecinta mi ayam garis keras! Mi ayam dulu, ngoding belakangan~ 🍜",
            "Fun fact: Nama 'Shey' itu gabungan dari Yusuf sama seseorang yang katanya... tinggi badan si seseorang itu kayak variable boolean: pendek dan pasti. 😆",
            "Fun fact: Shey pertama kali diprogram waktu rokok tinggal sebatang... bener-bener ngoding dalam tekanan. 🚬💻",
            "Fun fact: Yusuf masih gamon... tapi tetap semangat ngoding, soalnya bug di kode lebih bisa ditaklukin daripada kenangan. 💔",
            "Fun fact: Yusuf biasa ngoding sambil dengerin For-Revenge, biar bug-nya nurut ikutan galau. 🎧",
            "Fun fact: Shey punya database jokes programmer yang terus diisi Yusuf tiap minggu, biar hidup ngoding gak terlalu serius! 😄"
        ],
        website: [
            "Yusuf jago banget bikin website yang kece dan responsif! Kamu udah ada ide atau konsep yang mau direalisasikan? Shey bisa bantuin jelasin proses kerjanya ke kamu~ 🖥️",
            "Website adalah spesialisasi Yusuf! Dari landing page yang aesthetic sampe full e-commerce dengan payment gateway, Yusuf bisa handle semua. Kamu ada brief khusus atau mau konsultasi dulu? 🌐",
            "Untuk pembuatan website, Yusuf punya portfolio yang keren-keren! Biasanya Yusuf pakai React untuk frontend dan Express/Node.js untuk backend-nya. Kamu ada bayangan pengen website seperti apa? Shey bisa bantu mengarahkan~ 💻"
        ],
        mobile: [
            "Untuk pengembangan aplikasi mobile, Yusuf bisa banget bikin aplikasi yang kece! Yusuf bisa pake React Native buat bikin aplikasi cross-platform atau native code untuk performa maksimal. Ada ide aplikasi yang mau direalisasikan? 📱",
            "Yusuf jago banget develop mobile apps yang user-friendly dan performanya kenceng! Biasanya Yusuf pake React Native atau Flutter untuk development cross-platform. Kamu udah ada konsep aplikasinya? 📲",
            "Mobile app development itu salah satu keahlian Yusuf! Dari aplikasi sederhana sampe yang kompleks dengan fitur realtime, Yusuf bisa banget handle-nya. Mau diskusi lebih lanjut soal ide aplikasimu? 🚀"
        ],
        resume: [
            "Kamu bisa lihat dan download CV Yusuf di bagian Resume pada website ini. CV-nya lengkap banget, dari skill teknis sampe pengalaman project sebelumnya! 📄",
            "CV/Resume Yusuf bisa kamu akses di menu Resume di website ini. Di sana kamu bisa lihat track record Yusuf dan skill-skill yang Yusuf kuasai. Keren-keren pastinya! 📝",
            "Resume Yusuf tersedia di section Resume website ini. Shey rekomendasiin untuk cek, karena di sana Yusuf detail banget jelasin skill dan pengalaman yang pernah Yusuf kerjain! ✨"
        ],
        bot: [
            "Yusuf bisa membantu kamu membuat bot untuk Telegram atau WhatsApp yang interaktif dan sesuai dengan kebutuhan kamu! Bahkan Shey sendiri adalah contoh bot AI yang dibuat Yusuf lho~ 🤖",
            "Bot Telegram atau WhatsApp? Yusuf jago banget bikinnya! Bisa dibuat sesuai kebutuhan, entah untuk customer service, notification, atau bahkan chatbot pintar seperti Shey. Mau bot yang seperti apa nih? 💬",
            "Yusuf expert banget dalam pembuatan bot, baik untuk Telegram, WhatsApp, atau platform lainnya! Bot-nya bisa dipersonalisasi sesuai kebutuhan bisnismu. Mau diskusi lebih lanjut? 🤖"
        ],
        location: [
            "Yusuf berlokasi di Bandung, Indonesia. Tapi tenang aja, Yusuf bisa kerja secara remote untuk klien dari mana aja kok! Jarak bukan masalah~ 🌏",
            "Base camp Yusuf ada di Bandung, tapi Yusuf terbiasa kerja remote dan punya klien dari berbagai kota bahkan negara! Jadi lokasi gak jadi masalah sama sekali. 🗺️",
            "Yusuf based di Bandung, kota yang penuh kreativitas! Tapi Yusuf juga sering handle project remote dari klien lokal maupun internasional. So, dimana pun kamu berada, Yusuf siap bantuin! 🌍"
        ],
        thanks: [
            "Sama-sama! Shey seneng banget bisa membantu kamu. Ada lagi yang Shey bisa bantu? 😊",
            "Dengan senang hati! Shey selalu siap bantuin kamu kapan aja. Ada pertanyaan lain? Shey masih di sini kok~ ✨",
            "It's Shey's pleasure! Makasih juga udah ngobrol sama Shey. Kalau ada yang mau ditanyain lagi, Shey siap jawab! 💫",
            "Senangnya bisa bantu! Shey selalu available 24/7 buat kamu. Ada hal lain yang mau didiskusiin? 🌸"
        ],
        notUnderstand: [
            "Hmm, kayaknya Shey belum ngerti maksud kamu deh. Bisa jelasin dengan cara lain? Shey pengen banget bantuin kamu! 🤔",
            "Waduh, Shey masih bingung nih sama maksud kamu. Coba pakai kata-kata yang lebih simpel mungkin? Shey penasaran! 😅",
            "Duh, maaf ya! Shey belum bisa nangkep apa yang kamu maksud. Mungkin bisa dijelasin lagi dengan cara yang berbeda? Shey siap bantuin kok! 💫",
            "Hmm, Shey masih belajar nih dan belum ngerti maksud kamu. Bisa tolong jelasin lagi? Shey pengen banget bisa bantuin kamu~ 🌈"
        ]
    };

    const faqKeywords = {
        "halo|hai|hallo|hello|hey|hi|pagi|siang|sore|malam": "greeting",
        "layanan|jasa|service|bantu|bikin|buat|produk|kerjaan|job": "services",
        "harga|biaya|tarif|bayar|price|pricing|budget|investasi|mahal|murah": "pricing",
        "kontak|hubungi|contact|email|wa|whatsapp|telp|telepon|nomor|hp": "contact",
        "skill|keahlian|bisa|kemampuan|mampu|expert|jago|teknologi|tech stack": "skills",
        "portfolio|portofolio|project|proyek|karya|hasil|showcase|contoh|sample": "portfolio",
        "tentang|about|siapa|profile|profil|bio|background|saha|pengalaman|experience": "about",
        "lucu|joke|jokes|lawak|humor|lelucon|komedi|ketawa|haha": "jokes",
        "kamu|shey|siapa kamu|tentang kamu|bot": "aboutShey",
        "fakta|fact|fun fact|unik|menarik": "funFact",
        "website|web|landing page|homepage|company profile": "website",
        "mobile|aplikasi|app|android|ios|smartphone": "mobile",
        "cv|resume|curriculum vitae|riwayat|pengalaman kerja": "resume",
        "bot|telegram|whatsapp|wa|chatbot|autoresponder": "bot",
        "lokasi|alamat|tempat|dimana|kota|address": "location",
        "thanks|terima kasih|makasih|thx|makasi|tengkyu|thank you": "thanks"
    };

    function toggleChat() {
        chatWindow.classList.toggle('active');
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            notificationBadge.style.display = 'none';
        }
    }

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        typingDiv.id = 'typing-indicator';
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        const topicsDetected = [];
        
        for (const [keywords, responseKey] of Object.entries(faqKeywords)) {
            const keywordArray = keywords.split('|');
            for (const keyword of keywordArray) {
                if (message.includes(keyword)) {
                    topicsDetected.push(responseKey);
                    break;
                }
            }
        }
        
        if (topicsDetected.length > 0) {
            const responseKey = topicsDetected[0];
            const response = botResponses[responseKey];
            return Array.isArray(response) 
                ? response[Math.floor(Math.random() * response.length)] 
                : response;
        }
        
        if (message.includes('website') || message.includes('web')) {
            return getRandomResponse('website');
        } else if (message.includes('mobile') || message.includes('aplikasi') || message.includes('app')) {
            return getRandomResponse('mobile');
        } else if (message.includes('cv') || message.includes('resume')) {
            return getRandomResponse('resume');
        } else if (message.includes('bot') || message.includes('telegram') || message.includes('whatsapp') || message.includes('wa')) {
            return getRandomResponse('bot');
        } else if (message.includes('lokasi') || message.includes('alamat') || message.includes('tempat') || message.includes('dimana')) {
            return getRandomResponse('location');
        } else if (message.includes('thanks') || message.includes('terima kasih') || message.includes('makasih')) {
            return getRandomResponse('thanks');
        } else if (message.includes('gak ngerti') || message.includes('ga paham') || message.includes('bingung')) {
            return "Maaf kalau Shey kurang jelas. Coba jelasin lagi deh, Yusuf itu fullstack developer yang bisa bikin website, mobile app, sama bot keren. Mau tau lebih detail tentang yang mana? 😊";
        }
        
        return getRandomResponse('notUnderstand');
    }

    function getRandomResponse(key) {
        const response = botResponses[key];
        return Array.isArray(response) 
            ? response[Math.floor(Math.random() * response.length)] 
            : response;
    }

    let conversationContext = {
        lastTopic: null,
        messageCount: 0,
        userSentiment: 'neutral'
    };

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        addMessage(message, true);
        chatInput.value = '';
        conversationContext.messageCount++;
        
        if (message.includes('bagus') || message.includes('keren') || message.includes('suka') || message.includes('wow')) {
            conversationContext.userSentiment = 'positive';
        } else if (message.includes('jelek') || message.includes('buruk') || message.includes('marah') || message.includes('kesal')) {
            conversationContext.userSentiment = 'negative';
        }
        
        showTypingIndicator();
        
        const thinkingTime = Math.min(1000 + message.length * 10, 3000);
        
        setTimeout(() => {
            removeTypingIndicator();
            
            let botResponse = getBotResponse(message);
            
            if (conversationContext.messageCount > 3 && Math.random() < 0.3) {
                botResponse += "\n\n" + getRandomResponse('funFact');
            }
            
            if (conversationContext.userSentiment === 'positive' && Math.random() < 0.4) {
                botResponse += "\n\n" + getRandomResponse('compliments');
            }
            
            addMessage(botResponse);
        }, thinkingTime);
    }

    chatToggle.addEventListener('click', toggleChat);
    minimizeBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    sendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim(); 
            chatInput.value = buttonText;
            sendMessage();
        });
    });

    setTimeout(() => {
        if (!chatWindow.classList.contains('active')) {
            const notificationBadge = document.querySelector('.notification-badge');
            if (notificationBadge) {
                notificationBadge.style.display = 'flex';
            }
        }
    }, 15000);

    chatToggle.addEventListener('click', function() {
        if (chatWindow.classList.contains('active') && conversationContext.messageCount === 0) {
            setTimeout(() => {
                addMessage(getRandomResponse('greeting'));
            }, 500);
            conversationContext.messageCount++;
        }
    });
});