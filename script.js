// Configuración del Backend
const API_BASE_URL = 'http://localhost:3001/api';

// Variables globales
let appInitialized = false;
let currentSection = 'home';
let servicesCache = [];
let isConnectedToBackend = false;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', async () => {
  console.info('🌸 Iniciando Salón de Bienestar...');

  await initializeApp();
  setupEventListeners();
  createFloatingElements();

  // Inicializar calendario fijo
  setTimeout(() => {
    initializeCalendar();
  }, 1000);

  // Cargar servicios inmediatamente
  loadServicesIntoForm();

  showSection('reservations');

  appInitialized = true;
  console.info('✅ Aplicación lista para usar');
});

// Inicialización de la aplicación
async function initializeApp() {
  try {
    showLoader();
    console.info('Conectando con el backend...');

    // Verificar conexión con el servidor
    const connected = await testBackendConnection();
    if (connected) {
      // Inicializar Google Sheets desde el backend
      await initializeBackend();
      isConnectedToBackend = true;
      console.info('✅ Conectado al backend y Google Sheets');
      showNotification('¡Aplicación conectada exitosamente!', 'success');
    } else {
      throw new Error('Servidor backend no disponible');
    }

    hideLoader();
  } catch (error) {
    console.error('Error initializing app:', error);
    hideLoader();

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Conexión no disponible',
        text: 'La aplicación funciona en modo offline',
        icon: 'warning',
        confirmButtonText: 'Continuar'
      });
    } else {
      showNotification('Error: Servidor backend no disponible', 'error');
    }
  }
}

// Funciones del Backend

// Probar conexión con el backend
async function testBackendConnection() {
  try {
    console.info('Probando conexión con backend...');

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.info('Resultado de conexión:', result);

    return result.success;
  } catch (error) {
    console.error('Error en test de conexión:', error);
    return false;
  }
}

// Inicializar backend (y Google Sheets)
async function initializeBackend() {
  try {
    console.info('Inicializando backend y Google Sheets...');

    const response = await fetch(`${API_BASE_URL}/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.info('Resultado de inicialización:', result);

    if (result.success) {
      console.info('✅ Backend y Google Sheets inicializados correctamente');
      return true;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error inicializando backend:', error);
    throw error;
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Navegación
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const section = e.target.dataset.section;
      console.log(`🔄 Cambiando a sección: ${section}`);
      showSection(section);
      
      // Asegurar que los pétalos sigan cayendo
      ensurePetalAnimation();
    });
  });

  // Cargar servicios en el formulario después de la inicialización
  setTimeout(() => {
    loadServicesIntoForm();
  }, 2000);
}

// Asegurar que los pétalos sigan cayendo
function ensurePetalAnimation() {
  const petalCount = document.querySelectorAll('.sunflower-petal').length;
  console.log(`🌻 Verificando pétalos: ${petalCount} actuales`);
  
  if (petalCount < 5) {
    console.log('🌻 Creando pétalos adicionales...');
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        createSunflowerPetal();
      }, i * 100);
    }
  }
}

// Mostrar sección
function showSection(sectionName) {
  // Ocultar todas las secciones
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  // Remover clase active de todos los botones
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Mostrar la sección seleccionada
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Activar el botón correspondiente
  const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  currentSection = sectionName;

  // Cargar contenido específico de la sección
  if (sectionName === 'reservations') {
    loadReservations();
  }
}

// Cargar servicios en cualquier selector
async function loadServicesIntoSelect(selectId, errorMessage = 'Error cargando servicios') {
  try {
    const serviceSelect = document.getElementById(selectId);
    if (!serviceSelect) {
      console.warn(`Campo de servicios ${selectId} no encontrado`);
      return;
    }

    console.info(`Cargando servicios en ${selectId}...`);

    // Obtener servicios desde el backend
    const services = await getServicesFromBackend();

    if (!services || services.length === 0) {
      serviceSelect.innerHTML = '<option value="">No hay servicios disponibles</option>';
      console.warn('No se encontraron servicios');
      return;
    }

    serviceSelect.innerHTML = '<option value="">Selecciona un servicio</option>';

    services.forEach(service => {
      const option = document.createElement('option');
      option.value = service.nombre;
      option.textContent = `${service.nombre} - ${service.duracion} - ${service.precio}`;
      serviceSelect.appendChild(option);
    });

    console.info(`✅ Cargados ${services.length} servicios en ${selectId}`);
  } catch (error) {
    console.error(`Error loading services in ${selectId}:`, error);
    
    const serviceSelect = document.getElementById(selectId);
    if (serviceSelect) {
      serviceSelect.innerHTML = '<option value="">Error cargando servicios</option>';
    }
    
    showNotification(errorMessage, 'error');
  }
}

// Cargar servicios en el formulario de reservas
async function loadServicesIntoForm() {
  await loadServicesIntoSelect('service', 'Error cargando servicios en el formulario');
}


// Servicios por defecto
const DEFAULT_SERVICES = [
  {
    id: '1',
    nombre: 'Meditación Mindfulness',
    descripcion: 'Sesión de meditación guiada para encontrar la paz interior',
    duracion: '60 min',
    precio: '$50',
    activo: true
  },
  {
    id: '2',
    nombre: 'Yoga Restaurativo',
    descripcion: 'Práctica suave de yoga para relajación profunda',
    duracion: '90 min',
    precio: '$70',
    activo: true
  },
  {
    id: '3',
    nombre: 'Terapia de Sonido',
    descripcion: 'Sanación a través de cuencos tibetanos y frecuencias',
    duracion: '75 min',
    precio: '$80',
    activo: true
  },
  {
    id: '4',
    nombre: 'Aromaterapia',
    descripcion: 'Relajación con aceites esenciales y masaje suave',
    duracion: '60 min',
    precio: '$65',
    activo: true
  },
  {
    id: '5',
    nombre: 'Círculo de Sanación',
    descripcion: 'Sesión grupal de sanación energética',
    duracion: '120 min',
    precio: '$40',
    activo: true
  }
];

// Obtener servicios desde el backend
async function getServicesFromBackend() {
  try {
    if (!isConnectedToBackend) {
      console.warn('Backend no conectado, usando servicios por defecto');
      return DEFAULT_SERVICES;
    }

    console.info('Haciendo petición a:', `${API_BASE_URL}/services`);

    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.info('Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.info('Resultado completo de servicios:', result);

    if (result.success && result.data && result.data.length > 0) {
      servicesCache = result.data;
      console.info(`Servicios obtenidos: ${servicesCache.length}`, servicesCache);
      return result.data;
    } else {
      console.warn('No hay servicios en el backend, usando servicios por defecto');
      return DEFAULT_SERVICES;
    }
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    // Fallback a servicios en caché o por defecto
    if (servicesCache.length > 0) {
      console.info('Usando servicios en caché:', servicesCache);
      return servicesCache;
    }
    console.warn('Usando servicios por defecto');
    return DEFAULT_SERVICES;
  }
}


// Crear reserva en el backend
async function createReservationInBackend(reservation) {
  try {
    if (!isConnectedToBackend) {
      throw new Error('No conectado al backend');
    }

    console.info('Creando reserva en backend:', reservation);

    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.info('Resultado crear reserva:', result);

    if (result.success) {
      console.info('✅ Reserva creada exitosamente en Google Sheets');
      return true;
    } else {
      throw new Error(result.message || 'Error desconocido');
    }

  } catch (error) {
    console.error('Error creando reserva:', error);
    throw error;
  }
}

// Cargar reservas
async function loadReservations() {
  try {
    const reservationsContainer = document.getElementById('reservationsList');
    if (!reservationsContainer) return;

    showLoader();

    // Obtener reservas desde el backend
    const reservations = await getReservationsFromBackend();

    if (reservations.length === 0) {
      reservationsContainer.innerHTML = `
        <div class="no-reservations" data-aos="fade-up">
          <i class="fas fa-calendar-times"></i>
          <p>No hay reservas registradas aún.</p>
          <p class="small">Las reservas aparecerán aquí una vez que se creen.</p>
        </div>
      `;
    } else {
      reservationsContainer.innerHTML = reservations.map((reservation, index) => {
        return `
          <div class="reservation-card" data-aos="zoom-in" data-aos-delay="${index * 100}">
            <div class="reservation-header">
              <h4><i class="fas fa-user"></i> ${reservation.nombre}</h4>
              <span class="status-badge ${(reservation.estado || 'pendiente').toLowerCase()}">
                ${reservation.estado || 'Pendiente'}
              </span>
            </div>
            <div class="reservation-details">
              <p><i class="fas fa-spa"></i> <strong>Servicio:</strong> ${reservation.servicio}</p>
              <p><i class="fas fa-calendar"></i> <strong>Fecha:</strong> ${reservation.fecha}</p>
              <p><i class="fas fa-clock"></i> <strong>Hora:</strong> ${reservation.hora}</p>
              <p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${reservation.email}</p>
              <p><i class="fas fa-phone"></i> <strong>Teléfono:</strong> ${reservation.telefono}</p>
              ${reservation.comentarios ? `<p><i class="fas fa-comment"></i> <strong>Comentarios:</strong> ${reservation.comentarios}</p>` : ''}
              <p class="small"><i class="fas fa-clock"></i> <strong>Creada:</strong> ${new Date(reservation.fecha_creacion).toLocaleDateString()}</p>
            </div>
          </div>
        `;
      }).join('');

      // Reinicializar AOS para nuevos elementos
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }

    hideLoader();
    console.info(`Mostrando ${reservations.length} reservas`);
  } catch (error) {
    console.error('Error loading reservations:', error);
    hideLoader();
    showNotification('Error cargando reservas', 'error');
  }
}

// Obtener reservas desde el backend
async function getReservationsFromBackend(email = null) {
  try {
    if (!isConnectedToBackend) {
      throw new Error('No conectado al backend');
    }

    console.info('Obteniendo reservas desde backend...');

    let url = `${API_BASE_URL}/reservations`;
    if (email) {
      url += `?email=${encodeURIComponent(email)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.info('Resultado obtener reservas:', result);

    if (result.success) {
      return result.data || [];
    } else {
      throw new Error(result.message || 'Error obteniendo reservas');
    }

  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    throw error;
  }
}

// Crear pétalos de girasol cayendo
function createFloatingElements() {
  console.log('🌻 Iniciando creación de pétalos de girasol...');
  
  // Crear pétalos iniciales inmediatamente
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      createSunflowerPetal();
    }, i * 100);
  }
  
  // Crear pétalos continuamente
  setInterval(() => {
    const currentPetalCount = document.querySelectorAll('.sunflower-petal').length;
    if (currentPetalCount < 20) {
      createSunflowerPetal();
      console.log(`🌻 Pétalo creado. Total: ${currentPetalCount + 1}`);
    }
  }, 1000); // Cada 1 segundo
}

// Crear un pétalo individual
function createSunflowerPetal() {
  try {
  const petal = document.createElement('div');
  petal.className = 'sunflower-petal';

  // Posición aleatoria en la parte superior
    petal.style.left = (Math.random() * 100) + 'vw'; // Entre 0vw y 100vw
    petal.style.top = '-50px'; // Empezar arriba de la pantalla

  // Duración y retraso aleatorios
    const duration = (Math.random() * 6 + 8) + 's'; // Entre 8 y 14 segundos
    const delay = Math.random() * 1 + 's';

  petal.style.setProperty('--fall-duration', duration);
  petal.style.setProperty('--delay', delay);

    // Tamaño y rotación aleatorios
    const size = Math.random() * 0.6 + 0.6; // Entre 0.6 y 1.2
    const rotation = Math.random() * 360;
    petal.style.transform = `scale(${size}) rotate(${rotation}deg)`;

    // Opacidad
    const opacity = Math.random() * 0.4 + 0.4; // Entre 0.4 y 0.8
    petal.style.opacity = opacity;

    // Movimiento horizontal
    const horizontalDrift = (Math.random() - 0.5) * 40; // Entre -20 y 20
    petal.style.setProperty('--horizontal-drift', horizontalDrift + 'px');

    // Agregar al body
  document.body.appendChild(petal);
    console.log('🌻 Pétalo agregado al DOM');

    // Remover el pétalo después de la animación
  setTimeout(() => {
      if (petal && petal.parentNode) {
      petal.remove();
        console.log('🌻 Pétalo removido');
      }
    }, parseFloat(duration) * 1000 + parseFloat(delay) * 1000 + 2000);

  } catch (error) {
    console.error('Error creando pétalo:', error);
  }
}

// Funciones de utilidad
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

function showLoader() {
  let loader = document.querySelector('.loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.className = 'loader';
    document.body.appendChild(loader);
  }
  loader.style.display = 'block';
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

// Configurar fecha mínima en el formulario
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
});

// ================================
// FUNCIONES DEL CALENDARIO
// ================================

let currentCalendarDate = new Date();
let calendarReservations = [];

// Inicializar calendario cuando se muestre la sección
function initializeCalendar() {
  setupCalendarEventListeners();
  loadCalendarReservations();
  renderCalendar();
}

// Configurar event listeners del calendario
function setupCalendarEventListeners() {
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
      renderCalendar();
    });
  }
}

// Cargar reservas para el calendario
async function loadCalendarReservations() {
  if (!isConnectedToBackend) {
    console.warn('Backend no disponible para cargar reservas del calendario');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      calendarReservations = result.data || [];
      renderCalendar();
    }
  } catch (error) {
    console.error('Error cargando reservas del calendario:', error);
  }
}

// Renderizar calendario
function renderCalendar() {
  const monthElement = document.getElementById('currentMonth');
  const daysContainer = document.getElementById('calendarDays');

  if (!monthElement || !daysContainer) return;

  // Configurar mes actual
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  monthElement.textContent = `${months[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;

  // Calcular días del mes
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // Limpiar días anteriores
  daysContainer.innerHTML = '';

  // Generar 42 días (6 semanas)
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = currentDate.getDate();

    // Clases para diferentes estados
    if (currentDate.getMonth() !== month) {
      dayElement.classList.add('other-month');
    }

    // Marcar día actual
    const today = new Date();
    if (currentDate.toDateString() === today.toDateString()) {
      dayElement.classList.add('today');
    }

    // Contar reservas para este día
    const dateString = currentDate.toISOString().split('T')[0];
    const dayReservations = calendarReservations.filter(reservation =>
      reservation.fecha === dateString
    );

    if (dayReservations.length > 0) {
      dayElement.classList.add('has-reservations');

      // Agregar contador de reservas
      const countElement = document.createElement('div');
      countElement.className = 'reservation-count';
      countElement.textContent = dayReservations.length;
      dayElement.appendChild(countElement);

      // Agregar tooltip con horarios ocupados
      const tooltip = document.createElement('div');
      tooltip.className = 'reservation-tooltip';
      tooltip.innerHTML = dayReservations.map(r => 
        `<div class="reservation-time">${r.hora} - ${r.servicio}</div>`
      ).join('');
      dayElement.appendChild(tooltip);
    }

    // Event listener para mostrar reservas del día
    dayElement.addEventListener('click', () => {
      selectCalendarDay(currentDate, dayReservations);
    });

    daysContainer.appendChild(dayElement);
  }
}

// Seleccionar día en el calendario
function selectCalendarDay(date, reservations) {
  // Remover selección anterior
  document.querySelectorAll('.calendar-day').forEach(day => {
    day.classList.remove('selected');
  });

  // Agregar selección al día clickeado
  event.target.classList.add('selected');

  // Mostrar modal para crear reserva
  showReservationModal(date);
}

// Mostrar reservas del día seleccionado
function showDayReservations(date, reservations) {
  const detailsContainer = document.getElementById('reservationDetails');
  const reservationsContainer = document.getElementById('dayReservations');

  if (!detailsContainer || !reservationsContainer) return;

  const dateString = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Mostrar el contenedor
  detailsContainer.style.display = 'block';
  detailsContainer.querySelector('h3').textContent = `Reservas del ${dateString}`;

  // Limpiar reservas anteriores
  reservationsContainer.innerHTML = '';

  if (reservations.length === 0) {
    reservationsContainer.innerHTML = `
      <div class="no-reservations">
        <i class="fas fa-calendar-check"></i>
        <p>No hay reservas para este día</p>
      </div>
    `;
    return;
  }

  // Crear tarjetas de reservas
  reservations.forEach(reservation => {
    const card = document.createElement('div');
    card.className = 'day-reservation-card';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h4 style="margin: 0; color: var(--mindful-purple);">${reservation.servicio}</h4>
        <span class="status-badge ${reservation.estado.toLowerCase()}">${reservation.estado}</span>
      </div>
      <p><i class="fas fa-clock"></i> ${reservation.hora}</p>
      <p><i class="fas fa-user"></i> ${reservation.nombre}</p>
      <p><i class="fas fa-envelope"></i> ${reservation.email}</p>
      <p><i class="fas fa-phone"></i> ${reservation.telefono}</p>
      ${reservation.comentarios ? `<p><i class="fas fa-comment"></i> ${reservation.comentarios}</p>` : ''}
    `;
    reservationsContainer.appendChild(card);
  });
}

// Mostrar modal de reserva
function showReservationModal(date) {
  const modal = document.getElementById('reservationModal');
  const modalDate = document.getElementById('modalDate');
  const modalTime = document.getElementById('modalTime');

  if (modal && modalDate && modalTime) {
    // Establecer la fecha seleccionada
    const dateString = date.toISOString().split('T')[0];
    modalDate.value = dateString;

    // Obtener reservas del día seleccionado
    const dayReservations = calendarReservations.filter(reservation =>
      reservation.fecha === dateString
    );

    // Obtener horarios ocupados
    const occupiedTimes = dayReservations.map(r => r.hora);

    // Limpiar opciones de hora
    modalTime.innerHTML = '<option value="">Selecciona una hora</option>';

    // Horarios disponibles
    const availableTimes = [
      { value: '09:00', label: '09:00 AM' },
      { value: '10:00', label: '10:00 AM' },
      { value: '11:00', label: '11:00 AM' },
      { value: '12:00', label: '12:00 PM' },
      { value: '14:00', label: '02:00 PM' },
      { value: '15:00', label: '03:00 PM' },
      { value: '16:00', label: '04:00 PM' },
      { value: '17:00', label: '05:00 PM' }
    ];

    // Agregar solo horarios disponibles
    availableTimes.forEach(time => {
      const option = document.createElement('option');
      option.value = time.value;
      option.textContent = time.label;
      
      if (occupiedTimes.includes(time.value)) {
        option.textContent += ' (Ocupado)';
        option.disabled = true;
        option.style.color = '#999';
      }
      
      modalTime.appendChild(option);
    });

    // Mostrar el modal
    modal.style.display = 'flex';

    // Cargar servicios en el modal después de un pequeño delay
    setTimeout(() => {
      loadServicesIntoModal();
    }, 500);

    // Configurar event listeners del modal
    setupModalEventListeners();
  }
}

// Cerrar modal
function closeReservationModal() {
  const modal = document.getElementById('reservationModal');
  if (modal) {
    modal.style.display = 'none';
    // Limpiar formulario
    document.getElementById('modalReservationForm').reset();
  }
}

// Cargar servicios en el modal
async function loadServicesIntoModal() {
  await loadServicesIntoSelect('modalService', 'Error cargando servicios en el modal');
}

// Configurar event listeners del modal
function setupModalEventListeners() {
  // Cerrar modal
  const closeBtn = document.getElementById('closeModal');
  const modal = document.getElementById('reservationModal');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeReservationModal);
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeReservationModal();
      }
    });
  }
  
  // Formulario del modal
  const modalForm = document.getElementById('modalReservationForm');
  if (modalForm) {
    modalForm.addEventListener('submit', handleModalReservationSubmit);
  }
}

// Manejar envío del formulario del modal
async function handleModalReservationSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const reservation = {
    fecha: formData.get('date'),
    hora: formData.get('time'),
    nombre: formData.get('name'),
    email: formData.get('email'),
    telefono: formData.get('phone'),
    servicio: formData.get('service'),
    comentarios: formData.get('comments') || ''
  };

  try {
    showLoader();

    // Validar campos requeridos
    if (!reservation.fecha || !reservation.hora || !reservation.nombre || !reservation.email || !reservation.telefono || !reservation.servicio) {
      throw new Error('Todos los campos son requeridos');
    }

    // Crear reserva en el backend
    const success = await createReservationInBackend(reservation);

    if (success) {
      hideLoader();

      // Mostrar notificación de éxito
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: '¡Reserva Confirmada! 🌻',
          html: `
            <div style="text-align: left; padding: 20px;">
              <p><strong>¡Hola ${reservation.nombre}!</strong></p>
              <p>Tu cita ha sido registrada exitosamente en Google Sheets:</p>
              <ul style="margin: 15px 0;">
                <li><strong>Servicio:</strong> ${reservation.servicio}</li>
                <li><strong>Fecha:</strong> ${reservation.fecha}</li>
                <li><strong>Hora:</strong> ${reservation.hora}</li>
                <li><strong>Estado:</strong> Pendiente</li>
              </ul>
              <p>Te contactaremos pronto para confirmar tu cita.</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Perfecto',
          background: 'rgba(255, 255, 255, 0.95)',
          backdrop: 'rgba(156, 175, 136, 0.4)'
        });
      } else {
        showNotification('¡Reserva creada exitosamente en Google Sheets!', 'success');
      }

      // Cerrar modal y limpiar formulario
      closeReservationModal();
      
      // Recargar calendario para mostrar la nueva reserva
      loadCalendarReservations();

    } else {
      throw new Error('No se pudo guardar la reserva');
    }

  } catch (error) {
    console.error('Error creating reservation:', error);
    hideLoader();

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Error al Crear Reserva',
        text: error.message || 'No se pudo crear la reserva. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } else {
      showNotification('Error al crear la reserva: ' + error.message, 'error');
    }
  }
}

// Actualizar la función showSection para inicializar el calendario
const originalShowSection = showSection;
window.showSection = function(sectionName) {
  originalShowSection(sectionName);

  // Si se muestra la sección del calendario, inicializarlo
  if (sectionName === 'calendar') {
    setTimeout(() => {
      initializeCalendar();
    }, 100);
  }
};