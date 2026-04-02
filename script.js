// ===== 1. LÓGICA DAS FAGULHAS CAINDO =====
// Esse pedaço do código manipula a tela <canvas> igualzinho como nós pintaríamos num quadro vivo.

const canvas = document.getElementById('sparksCanvas');
const ctx = canvas.getContext('2d'); // Pegamos o "pincel" de desenho estilo 2D

let width, height;
let sparks = [];

// Função para ajustar o tamanho do nosso quadro ao tamanho exato da tela do usuário
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize(); // Chamamos uma vez no começo para configurar tudo

// A nossa 'Fagulha', que vai ser uma gotinha de solda que cai
class Spark {
    constructor() {
        this.reset();
    }

    // Função que cria/nasce uma nova fagulha
    reset() {
        // Ponto de origem: lado direito, meio/alto da tela (onde ficaria o maçarico / solda do soldador imaginário)
        this.x = width * 0.85 + (Math.random() * 20 - 10);
        this.y = height * 0.4 + (Math.random() * 20 - 10);
        
        // Empurramos a fagulha para a "Esquerda" e para "Cima" no início, simulando uma explosão
        this.vx = (Math.random() - 1.2) * (Math.random() * 8 + 3); // Velocidade Horizontal (Eixo X)
        this.vy = (Math.random() - 0.7) * (Math.random() * 8 + 3); // Velocidade Vertical (Eixo Y)
        
        this.life = Math.random() * 80 + 30; // Tempo de vida (quanto mais vida, mais demora a apagar)
        this.decay = Math.random() * 0.04 + 0.01; // Velocidade que esfria/apaga
        this.size = Math.random() * 4 + 1.5; // Tamanho inicial da bolinha incandescente
        this.gravity = 0.25; // Peso dela puxando pro chão
        
        // Novas cores: Vermelho, amarelo e laranja
        const colors = ['#ff0000', '#ff2a00', '#ff9d00', '#ffdf00'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.vy += this.gravity; // Aplica gravidade acelerando pra baixo
        this.x += this.vx; // Move pros lados
        this.y += this.vy; // Move pro chão
        
        this.life -= this.decay * 12; // Esfriando
        
        // Bateu no chão da tela?
        if (this.y > height - 5) {
            this.vy *= -0.4; // Quica (reduzindo poder)
            this.vx *= 0.7; // Desliza (reduzindo poder)
            this.y = height - 5; // Não deixa passar do rodapé
        }

        // Se esfriou a zero ou ficou menor que pó, "renasce" na solda!
        if (this.life <= 0 || this.size <= 0.1) {
            this.reset();
        }
    }

    // Desenha na tela (nossa pintura de um frame)
    draw() {
        ctx.beginPath();
        // Desenha uma bolinha cujo tamanho diminui junto com a "vida"
        ctx.arc(this.x, this.y, Math.max(0.1, this.size * (this.life / 100)), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // O truque da solda: Efeito de Brilho em volta da bolinha (Glow) ajustado para economia de GPU
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        
        ctx.fill();
        ctx.closePath();
        
        // Limpa a sombra para o próximo desenho não ter blur
        ctx.shadowBlur = 0;
    }
}

// Vamos gerar "pedacinhos" ativos de fagulhas rolando ao mesmo tempo (reduzido de 150 para 40 para acabar com o travamento)
for (let i = 0; i < 40; i++) {
    sparks.push(new Spark());
}

// O motorzinho que fica redesenhando tudo super rápido (60x por segundo)
function animate() {
    // Ao invés de apagar tudo do frame passado, cobrimos com cinza chumbo semitransparente.
    // Isso cria um rastro de "rasgo" na luz lindo atrás das fagulhas!
    ctx.fillStyle = 'rgba(43, 45, 49, 0.4)';
    ctx.fillRect(0, 0, width, height);

    // Manda atualizar a matemática e desenhar cada partícula
    sparks.forEach(spark => {
        spark.update();
        spark.draw();
    });

    // Pede ao navegador para chamar `animate` no próximo milissegundo livre
    requestAnimationFrame(animate); 
}

// Dá a partida na animação das faíscas!
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

// Força o GSAP a recalcular todas as alturas da página (Garante que os cards não sumam ao dar F5 no meio do site!)
setTimeout(() => {
    ScrollTrigger.refresh();
}, 500);
