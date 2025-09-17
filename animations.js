// Inicialización de todas las animaciones y efectos avanzados
document.addEventListener('DOMContentLoaded', function() {
  initializeAdvancedAnimations();
  initializeSwiper();
  initializeTypedText();
  initializeFlatpickr();
  initializeGSAPAnimations();
  initializeFloatingControls();
  initializeThreeJSBackground();
  hideMainLoader();
});

// Inicializar animaciones avanzadas
function initializeAdvancedAnimations() {
  // Inicializar AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out-cubic',
    once: true,
    offset: 100,
    delay: 0,
    anchorPlacement: 'top-bottom'
  });

  // Efecto parallax suave
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    const parallaxElements = document.querySelectorAll('.floating-elements');
    parallaxElements.forEach(element => {
      element.style.transform = `translateY(${rate}px)`;
    });
  });
}

// Inicializar Swiper para carruseles
function initializeSwiper() {
  // Swiper para servicios
  if (document.querySelector('.servicesSwiper')) {
    const servicesSwiper = new Swiper('.servicesSwiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      }
    });
  }

  // Swiper para testimonios
  if (document.querySelector('.testimonialsSwiper')) {
    const testimonialsSwiper = new Swiper('.testimonialsSwiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      }
    });
  }
}

// Inicializar texto typed
function initializeTypedText() {
  const typedElement = document.getElementById('typed-title');
  if (typedElement && typeof Typed !== 'undefined') {
    new Typed('#typed-title', {
      strings: [
        'Salón de Bienestar',
        'Tu Refugio de Paz',
        'Centro Mindfulness',
        'Espacio de Sanación'
      ],
      typeSpeed: 0,
      backSpeed: 0,
      backDelay: 3000,
      startDelay: 1000,
      loop: true,
      showCursor: false,
      autoInsertCss: true,
    });
  }
}

// Inicializar Flatpickr para fechas
function initializeFlatpickr() {
  const dateInputs = document.querySelectorAll('.date-picker');
  if (dateInputs.length > 0 && typeof flatpickr !== 'undefined') {
    dateInputs.forEach(input => {
      flatpickr(input, {
        dateFormat: "Y-m-d",
        minDate: "today",
        locale: "es",
        theme: "material_blue",
        disable: [
          function(date) {
            // Deshabilitar domingos (0 = domingo)
            return (date.getDay() === 0);
          }
        ],
        onChange: function(selectedDates, dateStr, instance) {
          console.log('Fecha seleccionada:', dateStr);
        }
      });
    });
  }
}

// Inicializar animaciones GSAP
function initializeGSAPAnimations() {
  if (typeof gsap !== 'undefined') {
    // Animación del logo/símbolo zen
    gsap.to('.zen-symbol', {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    });

    // Animación de entrada para cards (solo si existen)
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
      gsap.from('.service-card', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        delay: 0.5
      });
    }

    // Animación para botones
    const buttons = document.querySelectorAll('.btn, .nav-btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }
}

// Inicializar controles flotantes
function initializeFloatingControls() {
  // Control de música
  const musicToggle = document.getElementById('musicToggle');
  if (musicToggle) {
    let isPlaying = false;
    musicToggle.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        musicToggle.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
        showNotification('Música activada 🎵', 'success');
      } else {
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        musicToggle.style.background = 'linear-gradient(45deg, var(--mindful-green), var(--mindful-blue))';
        showNotification('Música pausada', 'info');
      }
    });
  }

  // Control de tema
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    let isDarkTheme = localStorage.getItem('darkTheme') === 'true';

    // Aplicar tema guardado
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.body.classList.remove('dark-theme');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
      isDarkTheme = !isDarkTheme;
      localStorage.setItem('darkTheme', isDarkTheme);

      if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      } else {
        document.body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }

      // Animación suave de transición
      gsap.to(document.body, {
        duration: 0.5,
        ease: 'power2.inOut'
      });
    });
  }
}

// Inicializar fondo Three.js
function initializeThreeJSBackground() {
  if (typeof THREE !== 'undefined') {
    // Crear escena Three.js minimalista
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1';
    renderer.domElement.style.pointerEvents = 'none';

    document.body.appendChild(renderer.domElement);

    // Crear geometría simple
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.1
    });

    const spheres = [];
    for (let i = 0; i < 5; i++) {
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      scene.add(sphere);
      spheres.push(sphere);
    }

    camera.position.z = 5;

    // Animación
    function animate() {
      requestAnimationFrame(animate);

      spheres.forEach(sphere => {
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    }

    animate();

    // Responsive
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}

// Ocultar loader principal
function hideMainLoader() {
  const mainLoader = document.getElementById('mainLoader');
  if (mainLoader) {
    setTimeout(() => {
      gsap.to(mainLoader, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          mainLoader.style.display = 'none';
        }
      });
    }, 2000);
  }
}

// Función auxiliar para mostrar notificaciones (definida en script.js)