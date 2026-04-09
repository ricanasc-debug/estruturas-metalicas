document.addEventListener('DOMContentLoaded', () => {
    // ===== 1. LÓGICA DAS FAGULHAS CAINDO =====
    const canvas = document.getElementById('sparksCanvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let sparks = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // Debounce no resize para evitar reflow forçado excessivo
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 200);
    });
    resize();

    class Spark {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = width * 0.85 + (Math.random() * 20 - 10);
            this.y = height * 0.4 + (Math.random() * 20 - 10);
            this.vx = (Math.random() - 1.2) * (Math.random() * 8 + 3);
            this.vy = (Math.random() - 0.7) * (Math.random() * 8 + 3);
            this.life = Math.random() * 80 + 30;
            this.decay = Math.random() * 0.04 + 0.01;
            this.size = Math.random() * 4 + 1.5;
            this.gravity = 0.25;
            const colors = ['#ff0000', '#ff2a00', '#ff9d00', '#ffdf00'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay * 12;
            
            if (this.y > height - 5) {
                this.vy *= -0.4;
                this.vx *= 0.7;
                this.y = height - 5;
            }

            if (this.life <= 0 || this.size <= 0.1) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.1, this.size * (this.life / 100)), 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            
            // Otimização de Performance: Só aplica sombra se a partícula for grande/quente
            if (this.life > 50) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = this.color;
            }
            
            ctx.fill();
            ctx.closePath();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < 40; i++) {
        sparks.push(new Spark());
    }

    function animate() {
        ctx.fillStyle = 'rgba(43, 45, 49, 0.4)';
        ctx.fillRect(0, 0, width, height);

        sparks.forEach(spark => {
            spark.update();
            spark.draw();
        });

        requestAnimationFrame(animate); 
    }

    animate();


// ===== 2. GSAP: ANIMAÇÕES DE ENTRADA SUAVES DO TEXTO =====
// Aqui não criamos fagulhas, aqui apenas fazemos os textos aparecerem rolandinhos bem moderno.

// O Cabeçalho (nav) vem empurrando de cima pra baixo
gsap.from('.navbar', { 
    y: -80, 
    opacity: 0, 
    duration: 1.2, 
    ease: 'power3.out' 
});

// Os textos do banner vêm empurrando da esquerda para a direita
gsap.from('.hero-content h1', { 
    x: -80, 
    opacity: 0, 
    duration: 1.2, 
    delay: 0.3, 
    ease: 'power3.out' 
});

gsap.from('.hero-content p', { 
    x: -50, 
    opacity: 0, 
    duration: 1, 
    delay: 0.5, 
    ease: 'power3.out' 
});

gsap.from('.btn-hero', { 
    y: 40, 
    opacity: 0, 
    duration: 1, 
    delay: 0.8, 
    ease: 'power3.out' 
});

// ===== 3. GSAP: ANIMAÇÕES DE SCROLL (QUEM SOMOS) =====
gsap.registerPlugin(ScrollTrigger);

// Anima o texto entrando pela esquerda
gsap.from('.about-text', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top 80%' // Começa a animação quando o topo da seção chega em 80% da tela
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// Anima a foto entrando pela direita
gsap.from('.about-image', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top 80%'
    },
    x: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.3
});

// Anima os cards de serviços (especialidades) com FROMTO para garantir visibilidade
gsap.fromTo('.service-card', 
    { y: 50, opacity: 0 },
    {
        scrollTrigger: {
            trigger: '.services',
            start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    }
);

// Anima o carrossel inteiro subindo na rolagem
gsap.from('.testimonials-swiper', {
    scrollTrigger: {
        trigger: '.testimonials',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
});

// ===== 5. CARROSSEL DE DEPOIMENTOS (SWIPER) =====
const swiper = new Swiper('.testimonials-swiper', {
    loop: true,                 // Loop infinito
    grabCursor: true,           // Mostra a mãozinha de arrastar
    slidesPerView: "auto",      // Adapta a quantidade de cartões que cabem na tela
    spaceBetween: 30,           // Espaço entre cartões
    autoplay: {
        delay: 3500,            // Roda a cada 3.5 segundos sozinhos!
        disableOnInteraction: false, // Continua rodando mesmo se clicar
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    }
});

// ===== 4. EFEITO 3D NOS CARTÕES (VANILLA TILT) =====
// Isso faz com que os cartões se movam de acordo com a posição do mouse neles, criando um efeito 3D com brilho de vidro!
VanillaTilt.init(document.querySelectorAll(".service-card, .test-card, .benefit-card"), {
    max: 12,        // Rotação máxima em graus
    speed: 400,     // Velocidade da reação ao mouse
    glare: true,    // Adiciona um reflexo de luz na superfície 
    "max-glare": 0.15, // Intensidade do reflexo
    scale: 1.05     // Dá um leve zoom assim que o mouse entra!
});

// Anima os cards de Mezaninos
gsap.from('.mez-card', {
    scrollTrigger: {
        trigger: '.mezaninos',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// Anima a listinha de lugares "Onde Aplicar" pingando da esquerda pra direita
gsap.from('.mezaninos-applications li', {
    scrollTrigger: {
        trigger: '.mezaninos-applications',
        start: 'top 85%'
    },
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
});

// Anima os cards de Coberturas
gsap.from('.cob-card', {
    scrollTrigger: {
        trigger: '.coberturas',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// Anima a listinha de atributos "Soluções Especiais" pinçando da esquerda
gsap.from('.cob-applications li', {
    scrollTrigger: {
        trigger: '.cob-applications',
        start: 'top 85%'
    },
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
});

// Anima os cards de Escadas
gsap.from('.esc-card', {
    scrollTrigger: {
        trigger: '.escadas',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// Anima a listinha de Modelos de Escadas pingando da esquerda
gsap.from('.esc-applications li', {
    scrollTrigger: {
        trigger: '.esc-applications',
        start: 'top 85%'
    },
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
});

// Anima os cards de Portões
gsap.from('.port-card', {
    scrollTrigger: {
        trigger: '.portoes',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// Anima as listinhas do Portão
gsap.from('.port-applications li', {
    scrollTrigger: {
        trigger: '.port-applications',
        start: 'top 85%'
    },
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
});

// Anima os cards de Telhados/Drenagem
gsap.from('.tel-card', {
    scrollTrigger: {
        trigger: '.telhados',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// Anima a listinha de telhados
gsap.from('.tel-applications li', {
    scrollTrigger: {
        trigger: '.tel-applications',
        start: 'top 85%'
    },
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
});

// Efeito de Revelação do Rodapé 
gsap.from('.footer-container > div', {
    scrollTrigger: {
        trigger: '.footer-section',
        start: 'top 80%'
    },
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: 'power3.out'
});

// Inicializa os ícones vetoriais em alta qualidade SVG de todo o site (Galpões, Mezaninos, Coberturas, Telhados, Rodapé)
lucide.createIcons();

    // Força o GSAP a recalcular todas as alturas da página
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
});
