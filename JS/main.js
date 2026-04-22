// ===== SCROLL SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(enlace => {
  enlace.addEventListener('click', function(e) {
    e.preventDefault();
    const destino = document.querySelector(this.getAttribute('href'));
    if (destino) destino.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== MENÚ HAMBURGUESA =====
const hamburguesa = document.getElementById('hamburguesa');
const navLinks    = document.getElementById('nav-links');
const overlay     = document.getElementById('nav-overlay');

function abrirMenu() {
  hamburguesa.classList.add('abierto');
  navLinks.classList.add('abierto');
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden'; // evita scroll detrás
}

function cerrarMenu() {
  hamburguesa.classList.remove('abierto');
  navLinks.classList.remove('abierto');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

hamburguesa.addEventListener('click', () => {
  navLinks.classList.contains('abierto') ? cerrarMenu() : abrirMenu();
});

// Cerrar al hacer clic en el overlay
overlay.addEventListener('click', cerrarMenu);

// Cerrar al hacer clic en un enlace del menú
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', cerrarMenu);
});

// Cerrar con tecla Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrarMenu();
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.tarjeta, .persona-card, .local-card, .vacante-card, .sobre-contenido, .sobre-imagen'
).forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ===== REGISTRO DEL SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registro => {
        console.log('Service Worker registrado correctamente:', registro.scope);
      })
      .catch(error => {
        console.log('Error al registrar Service Worker:', error);
      });
  });
}