document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. EFECTO MECANÓGRAFO (TYPEWRITER EFFECT)
    // ==========================================================================
    const typewriterSpan = document.querySelector(".typewriter");
    const phrases = ["Desarrollador Web", "Programador Frontend", "Tecnólogo en Software"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // Pausa al terminar de escribir la frase completa
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pausa antes de comenzar la siguiente frase
        }

        setTimeout(type, typingSpeed);
    }

    if (typewriterSpan) {
        type();
    }


    // ==========================================================================
    // 2. ANIMACIÓN AL HACER SCROLL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Detiene la observación una vez animado
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // ==========================================================================
    // 3. SISTEMA DE VENTANA FLOTANTE (MODAL) CON CARRUSEL DE IMÁGENES
    // ==========================================================================
    const portafolioData = {
        "hamburguesas": {
            titulo: "Sistema de Pedidos Burger & Co.",
            imagenes: ["image (1).png", "image (1.2).png", "image (1.3).png"], 
            tecnologias: ["JavaScript", "Google Sheets API", "WhatsApp API", "CSS Grid"],
            descripcion: "Plataforma digital para la gestión de órdenes. Los datos se almacenan dinámicamente mediante hojas de cálculo, y el carrito de compras se integra directamente con WhatsApp para enviar los pedidos de forma automatizada.",
            linkWeb: "https://brayanmercadogg-hash.github.io/mipagina/", 
            linkRepo: null 
        },
        "Disquera": {
            titulo: "Plataforma Web - Sello Discográfico",
            imagenes: ["image (2).png", "image (2.2).png", "image (2.3).png"], 
            tecnologias: ["HTML5", "CSS Variables", "JavaScript", "Audio API", "UX/UI"],
            descripcion: "Aplicación web moderna e interactiva desarrollada para la promoción de artistas y lanzamientos musicales. Cuenta con un catálogo digital dinámico, perfiles individuales para los músicos y una interfaz visualmente inmersiva.",
            linkWeb: "https://brayanmercadogg-hash.github.io/C-C-RECORDS/", 
            linkRepo: null 
        },
        "laureles": {
            titulo: "Web Institucional IED Los Laureles",
            imagenes: ["image.png", "image (3.2).png", "image (3.3).png"], 
            tecnologias: ["Desarrollo Frontend", "Diseño Accesible", "Arquitectura de Información"],
            descripcion: "Portal educativo profesional estructurado para garantizar la transparencia institucional. Presenta de manera accesible la historia, misión, visión y los requerimientos educativos del colegio para la comunidad.",
            linkWeb: null, 
            linkRepo: null 
        }
    };

    // Elementos del DOM de la ventana flotante
    const modal = document.getElementById("projectModal");
    const closeModalBtn = document.getElementById("closeModal");
    const btnsVerMas = document.querySelectorAll(".btn-ver-mas");

    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalTech = document.getElementById("modalTech");
    const modalWebBtn = document.getElementById("modalWebBtn");
    const modalRepoBtn = document.getElementById("modalRepoBtn");

    // Elementos del Carrusel
    const carouselTrack = document.getElementById("modalCarouselTrack");
    const carouselDots = document.getElementById("modalCarouselDots");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");

    let currentImages = [];
    let currentImageIndex = 0;

    // Función para desplazar el riel del carrusel y actualizar los indicadores
    function moveCarousel() {
        if (currentImages.length === 0) return;
        carouselTrack.style.transform = `translateX(-${currentImageIndex * 100}%)`;
        
        const dots = carouselDots.querySelectorAll(".carousel-dot");
        dots.forEach((dot, idx) => {
            if (idx === currentImageIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    // Apertura del modal y configuración dinámica de los datos
    btnsVerMas.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute("data-id");
            const data = portafolioData[projectId];

            if (data) {
                modalTitle.textContent = data.titulo;
                modalDesc.textContent = data.descripcion;
                
                // Limpiar e inyectar imágenes en el contenedor del carrusel
                carouselTrack.innerHTML = "";
                currentImages = data.imagenes || [];
                currentImageIndex = 0;

                currentImages.forEach(src => {
                    const img = document.createElement("img");
                    img.src = src;
                    img.alt = data.titulo;
                    carouselTrack.appendChild(img);
                });

                // Renderizar los puntos de control (Dots) basados en la cantidad de imágenes
                carouselDots.innerHTML = "";
                if (currentImages.length > 1) {
                    prevBtn.style.display = "flex";
                    nextBtn.style.display = "flex";
                    carouselDots.style.display = "flex";

                    currentImages.forEach((_, idx) => {
                        const dot = document.createElement("button");
                        dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
                        dot.setAttribute("aria-label", `Ver imagen ${idx + 1}`);
                        dot.addEventListener("click", () => {
                            currentImageIndex = idx;
                            moveCarousel();
                        });
                        carouselDots.appendChild(dot);
                    });
                } else {
                    // Ocultar elementos de navegación si solo existe una imagen
                    prevBtn.style.display = "none";
                    nextBtn.style.display = "none";
                    carouselDots.style.display = "none";
                }

                // Cargar tecnologías empleadas
                modalTech.innerHTML = "";
                data.tecnologias.forEach(tech => {
                    const span = document.createElement("span");
                    span.className = "skill-tag"; 
                    span.textContent = tech;
                    modalTech.appendChild(span);
                });

                // Validación y visualización de enlaces de producción y repositorio
                if (data.linkWeb && data.linkWeb !== "#" && data.linkWeb !== "") {
                    modalWebBtn.href = data.linkWeb;
                    modalWebBtn.style.display = "inline-flex";
                } else {
                    modalWebBtn.style.display = "none";
                }

                if (data.linkRepo && data.linkRepo !== "#" && data.linkRepo !== "") {
                    modalRepoBtn.href = data.linkRepo;
                    modalRepoBtn.style.display = "inline-flex";
                } else {
                    modalRepoBtn.style.display = "none";
                }

                // Mostrar modal con transición fluida
                modal.style.display = "flex";
                setTimeout(() => modal.classList.add("modal--show"), 10);
                document.body.style.overflow = "hidden";
                
                moveCarousel();
            }
        });
    });

    // Control de navegación: Siguiente
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentImages.length > 0) {
                currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                moveCarousel();
            }
        });
    }

    // Control de navegación: Anterior
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentImages.length > 0) {
                currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
                moveCarousel();
            }
        });
    }

    // Lógica de cierre del modal
    const cerrarModal = () => {
        modal.classList.remove("modal--show");
        setTimeout(() => {
            modal.style.display = "none";
            document.body.style.overflow = "";
        }, 300);
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", cerrarModal);
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) cerrarModal();
    });

    // Accesibilidad por teclado (Teclas Escape y Flechas de dirección)
    document.body.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("modal--show")) {
            cerrarModal();
        }
        
        if (modal.classList.contains("modal--show") && currentImages.length > 1) {
            if (e.key === "ArrowRight") {
                currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                moveCarousel();
            }
            if (e.key === "ArrowLeft") {
                currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
                moveCarousel();
            }
        }
    });

});