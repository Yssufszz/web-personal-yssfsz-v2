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
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, solarSystemContainer.clientWidth / 500, 0.1, 1000);
            
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
            
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(solarSystemContainer.clientWidth, 500);
            renderer.setClearColor(0x000000, 0);
            solarSystemContainer.appendChild(renderer.domElement);

            const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
            const textureLoader = new THREE.TextureLoader();
            
            let sunTexture;
            try {
                sunTexture = textureLoader.load('https://images.pexels.com/photos/87611/sun-solar-flare-sunlight-flare-87611.jpeg');
            } catch (error) {
                console.error("Failed to load sun texture:", error);
                sunTexture = null;
            }
            
            const sunMaterial = sunTexture ? 
                new THREE.MeshBasicMaterial({ map: sunTexture }) : 
                new THREE.MeshBasicMaterial({ color: 0xffcc00 });
                
            const sun = new THREE.Mesh(sunGeometry, sunMaterial);
            scene.add(sun);
            
            const sunGlow = new THREE.Mesh(
                new THREE.SphereGeometry(3.2, 32, 32),
                new THREE.MeshBasicMaterial({
                    color: 0xffcc00,
                    transparent: true,
                    opacity: 0.5
                })
            );
            scene.add(sunGlow);

            const planetInfo = [
                { name: "Merkurius", description: "Planet terkecil dan terdekat dari Matahari, punya permukaan berbatu dan suhu ekstrem.", color: 0x888888 },
                { name: "Venus", description: "Kembaran Bumi dalam ukuran, tapi atmosfernya panas banget dan beracun karena penuh karbon dioksida.", color: 0xffaa77 },
                { name: "Bumi", description: "Tempat kita tinggal ini, Satu-satunya planet yang diketahui mendukung kehidupan, dengan air, oksigen, dan atmosfer yang seimbang.", color: 0x0077ff },
                { name: "Mars", description: "Disebut 'Planet Merah' karena permukaannya penuh debu besi, punya gunung tertinggi dan sedang diteliti untuk kemungkinan tempat tinggal manusia.", color: 0xff4444 }
            ];

            const planets = [];
            const planetDetails = document.getElementById('planet-details');
            const orbits = [];
            
            for (let i = 0; i < 4; i++) {
                const orbitRadius = (i + 1) * 5;
                const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 64);
                const orbitMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff, 
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.2
                });
                const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbit.rotation.x = Math.PI / 2;
                scene.add(orbit);
                orbits.push(orbit);
                
                const planetGeometry = new THREE.SphereGeometry(0.6, 32, 32);
                const planetMaterial = new THREE.MeshStandardMaterial({ 
                    color: planetInfo[i].color,
                    roughness: 0.7,
                    metalness: 0.2
                });
                const planet = new THREE.Mesh(planetGeometry, planetMaterial);
                planet.userData = { info: planetInfo[i] };
                planets.push(planet);
                scene.add(planet);
            }

            const ambientLight = new THREE.AmbientLight(0x333333);
            scene.add(ambientLight);
            
            const light = new THREE.PointLight(0xffffff, 2);
            light.position.set(0, 0, 0);
            scene.add(light);

            camera.position.z = 22;

            let isRotating = true;
            let rotationSpeed = 0.001;
            
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
                camera.position.set(0, 0, 22);
                camera.lookAt(0, 0, 0);
            });

            function animate() {
                requestAnimationFrame(animate);
                
                sun.rotation.y += 0.002;
                sunGlow.rotation.y -= 0.001;
                
                if (isRotating) {
                    planets.forEach((planet, index) => {
                        const orbitRadius = (index + 1) * 5;
                        const angle = Date.now() * rotationSpeed * (1 / (index + 1));
                        
                        planet.position.x = Math.cos(angle) * orbitRadius;
                        planet.position.z = Math.sin(angle) * orbitRadius;
                        
                        planet.rotation.y += 0.01 + (index * 0.002);
                    });
                }
                
                stars.rotation.y += 0.0001;
                
                renderer.render(scene, camera);
            }

            animate();

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            
            renderer.domElement.addEventListener('click', (e) => {
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
                    
                    gsap.to(selectedPlanet.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3 });
                    
                    planets.forEach(p => {
                        if (p !== selectedPlanet) {
                            gsap.to(p.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                        }
                    });
                }
            });

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
});