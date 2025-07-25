document.addEventListener('DOMContentLoaded', () => {
    // Animation des éléments au scroll
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    animateElements.forEach(el => observer.observe(el));

    // Effet parallax pour la section hero
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const hero = document.querySelector('#home');
        if (hero) {
            hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
    });

    // Effet de frappe du terminal avec animation séquentielle
    const terminalLines = document.querySelectorAll('.terminal-line');
    async function typeLines() {
        for (let i = 0; i < terminalLines.length; i++) {
            const line = terminalLines[i];
            const text = line.dataset.text || '';
            line.textContent = '';
            line.classList.add('visible');
            const speed = 20 + Math.random() * 10;

            for (let j = 0; j < text.length; j++) {
                line.textContent = text.substring(0, j + 1);
                const charDelay = Math.random() * 50;
                await new Promise(resolve => setTimeout(resolve, speed + charDelay));
                if (j > 0 && j % 15 === 0 && Math.random() > 0.8) {
                    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));
                }
            }

            if (i > 0) {
                terminalLines[i-1].style.borderRight = 'none';
            }
            await new Promise(resolve => setTimeout(resolve, i === terminalLines.length - 1 ? 800 : 300));
        }
    }
    setTimeout(typeLines, 300);

    // Fonctionnalité de la modal des projets
    const projectButtons = document.querySelectorAll('.project-card button');
    const modal = document.getElementById('project-modal');
    const closeModal = document.getElementById('close-modal');

    // Données des projets
    const projects = [
        {
            title: "FlappIA",
            subtitle: "Un clone de Flappy Bird où l'IA apprend à jouer",
            description: "Projet utilisant l'apprentissage par renforcement pour entraîner une IA à jouer à Flappy Bird. L'algorithme évolue à travers des générations successives pour améliorer ses performances.",
            technologies: ["Python", "PyGame", "NEAT Algorithm"],
            image: "https://via.placeholder.com/600x400",
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "Snake AI",
            subtitle: "Un Snake contrôlé par un agent intelligent",
            description: "Implémentation d'un jeu Snake avec une IA utilisant des algorithmes de recherche de chemin comme A* pour maximiser son score. Le serpent apprend à éviter les obstacles et à collecter les fruits efficacement.",
            technologies: ["Python", "A* Algorithm", "PyGame"],
            image: "https://via.placeholder.com/600x400",
            demoLink: "#",
            codeLink: "#"
        },
        {
            title: "CNCpanneau",
            subtitle: "Application Java pour gérer les coupes dans un panneau CNC",
            description: "Outil d'optimisation des coupes pour machines CNC permettant de minimiser les pertes de matière. L'application calcule la disposition optimale des pièces à découper sur un panneau donné.",
            technologies: ["Java", "Swing", "Algorithmes d'optimisation"],
            image: "https://via.placeholder.com/600x400",
            demoLink: "#",
            codeLink: "#"
        }
    ];

    // Gestion des événements de la modal
    projectButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const project = projects[index];
            document.getElementById('modal-title').textContent = project.title;
            document.getElementById('modal-subtitle').textContent = project.subtitle;
            document.getElementById('modal-description').textContent = project.description;
            document.getElementById('modal-image').src = project.image;
            document.getElementById('modal-link').href = project.demoLink;
            document.getElementById('modal-code').href = project.codeLink;

            const techContainer = document.getElementById('modal-technologies');
            techContainer.innerHTML = '';
            project.technologies.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'skill-tag bg-gray-700 text-blue-400 px-3 py-1 rounded-full text-sm';
                tag.textContent = tech;
                techContainer.appendChild(tag);
            });

            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    // Fermeture de la modal
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });

    // Menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Configuration du carrousel
    const carousel = {
        container: document.querySelector('.carousel-container'),
        slides: document.querySelectorAll('.project-card'),
        prevButton: document.querySelector('.carousel-button.prev'),
        nextButton: document.querySelector('.carousel-button.next'),
        indicators: document.querySelectorAll('.carousel-indicator'),
        currentSlide: 0,
        slideWidth: 0,
        autoPlayInterval: null,
        isMoving: false,
        isPaused: false,
        baseSpeed: 1.5, // Vitesse de défilement en pixels par frame
    };

    // Initialisation du carrousel
    function initCarousel() {
        if (!carousel.container) return;

        // Calculer la largeur des slides
        carousel.slideWidth = carousel.container.offsetWidth / 3;

        // Cloner les slides pour un défilement infini
        const originalSlides = Array.from(carousel.slides);
        originalSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            carousel.container.appendChild(clone);
        });

        // Mettre à jour la taille des slides
        const allSlides = carousel.container.querySelectorAll('.project-card');
        allSlides.forEach(slide => {
            slide.style.flex = `0 0 ${carousel.slideWidth}px`;
        });

        // Position initiale
        updateCarousel();

        // Démarrer l'animation
        startAutoScroll();

        // Événements des boutons
        carousel.prevButton.addEventListener('click', () => {
            carousel.currentSlide = Math.max(carousel.currentSlide - 1, 0);
            smoothScrollTo(-carousel.currentSlide * carousel.slideWidth);
        });

        carousel.nextButton.addEventListener('click', () => {
            carousel.currentSlide = (carousel.currentSlide + 1) % carousel.slides.length;
            smoothScrollTo(-carousel.currentSlide * carousel.slideWidth);
        });

        // Pause au survol
        carousel.container.addEventListener('mouseenter', () => {
            carousel.isPaused = true;
        });

        carousel.container.addEventListener('mouseleave', () => {
            carousel.isPaused = false;
        });
    }

    // Animation fluide
    function startAutoScroll() {
        let offset = 0;
        let microPauseCounter = 0;
        const microPauseInterval = 180; // Frames entre chaque micro-pause
        const microPauseDuration = 30; // Durée de la micro-pause en frames

        function animate() {
            if (!carousel.isPaused) {
                microPauseCounter++;

                // Créer des micro-pauses périodiques
                if (microPauseCounter % microPauseInterval !== 0 || microPauseCounter % (microPauseInterval + microPauseDuration) === 0) {
                    offset -= carousel.baseSpeed;

                    // Reset quand tous les slides originaux sont passés
                    if (Math.abs(offset) >= carousel.slideWidth * carousel.slides.length) {
                        offset = 0;
                    }

                    carousel.container.style.transform = `translateX(${offset}px)`;
                }
            }
            requestAnimationFrame(animate);
        }

        animate();
    }

    // Fonction pour un défilement fluide
    function smoothScrollTo(targetOffset) {
        const startOffset = parseFloat(carousel.container.style.transform.replace('translateX(', '').replace('px)', '') || 0);
        const distance = targetOffset - startOffset;
        const duration = 500; // ms
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Fonction d'easing
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const currentOffset = startOffset + (distance * easeProgress);
            carousel.container.style.transform = `translateX(${currentOffset}px)`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Mettre à jour l'affichage du carrousel
    function updateCarousel() {
        const offset = -carousel.currentSlide * carousel.slideWidth;
        carousel.container.style.transform = `translateX(${offset}px)`;

        // Mettre à jour les indicateurs
        carousel.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === carousel.currentSlide);
        });
    }

    // Initialiser le carrousel au chargement de la page
    window.addEventListener('load', initCarousel);
    window.addEventListener('resize', initCarousel);
});
