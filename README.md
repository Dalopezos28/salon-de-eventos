# 🌸 Salón de Bienestar - Sistema de Reservas Mindfulness

Una aplicación web limpia y optimizada para gestionar reservas en un salón de bienestar, con integración a Google Sheets y un diseño orientado al mindfulness.

## ✨ Características Principales

- 🧘‍♀️ **Interfaz Mindfulness**: Diseño inspirado en la filosofía del bienestar
- 📅 **Calendario Interactivo**: Reservas directas desde el calendario
- 📊 **Integración Google Sheets**: Almacenamiento de datos en tiempo real
- 🎨 **Animaciones Suaves**: Efectos visuales elegantes con GSAP y AOS
- 🌻 **Pétalos de Girasol**: Efectos de partículas relajantes
- 📱 **Responsive Design**: Adaptable a todos los dispositivos
- ⚡ **Código Optimizado**: Estructura limpia y eficiente

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Animaciones y gradientes avanzados
- **JavaScript ES6+**: Lógica de aplicación moderna

### Librerías y Frameworks
- **GSAP**: Animaciones profesionales
- **AOS (Animate On Scroll)**: Animaciones al hacer scroll
- **Three.js**: Efectos 3D y partículas
- **Particles.js**: Sistema de partículas interactivas
- **Swiper.js**: Carruseles y sliders elegantes
- **Typed.js**: Efectos de texto animado
- **Sweet Alert 2**: Notificaciones hermosas
- **Flatpickr**: Selector de fechas avanzado
- **Font Awesome**: Iconografía moderna

### Backend/Datos
- **Google Sheets API**: Base de datos en la nube
- **Google Service Account**: Autenticación segura

## 📁 Estructura del Proyecto

```
proyecto_salon_bienestar/
├── index.html              # Página principal
├── styles.css              # Estilos principales
├── script.js               # Lógica de la aplicación
├── animations.js           # Animaciones y efectos
├── env.js                  # Configuración de entorno
├── .env                    # Variables de entorno (NO SUBIR A GIT)
├── .gitignore              # Archivos a ignorar en Git
└── README.md               # Documentación
```

## 🛠️ Instalación y Configuración

### Requisitos Previos
1. **Navegador Web Moderno** (Chrome, Firefox, Safari, Edge)
2. **Cuenta de Google** para Google Sheets
3. **Servidor Web Local** (opcional, para desarrollo)

### Configuración de Google Sheets

1. **Crear un Proyecto en Google Cloud Console**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita la API de Google Sheets

2. **Crear Service Account**:
   - Ve a "IAM & Admin" > "Service Accounts"
   - Crea una nueva cuenta de servicio
   - Descarga el archivo JSON de credenciales

3. **Configurar Google Sheets**:
   - Crea una nueva hoja de cálculo en Google Sheets
   - Comparte la hoja con el email de la service account
   - Copia el ID de la hoja (desde la URL)

### Configuración Local

1. **Clonar o Descargar el Proyecto**:
```bash
git clone [URL_DEL_REPOSITORIO]
cd proyecto_salon_bienestar
```

2. **Configurar Variables de Entorno**:
   - Copia el contenido de `.env.example` a `.env`
   - Actualiza las credenciales de Google Sheets
   - Configura el ID de tu hoja de cálculo

3. **Ejecutar la Aplicación**:
   - Abre `index.html` en tu navegador
   - O usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000

   # Con Node.js (http-server)
   npx http-server

   # Con PHP
   php -S localhost:8000
   ```

## 📊 Estructura de Datos en Google Sheets

La aplicación crea automáticamente tres hojas en tu Google Sheets:

### Hoja "Reservas"
| Columna | Descripción |
|---------|-------------|
| ID | Identificador único |
| Fecha | Fecha de la cita |
| Hora | Hora de la cita |
| Nombre | Nombre del cliente |
| Email | Correo electrónico |
| Teléfono | Número de teléfono |
| Servicio | Servicio solicitado |
| Comentarios | Observaciones especiales |
| Estado | Estado de la reserva |
| Fecha_Creación | Timestamp de creación |

### Hoja "Servicios"
| Columna | Descripción |
|---------|-------------|
| ID | Identificador del servicio |
| Nombre | Nombre del servicio |
| Descripción | Descripción detallada |
| Duración | Tiempo estimado |
| Precio | Costo del servicio |
| Activo | Estado del servicio |

### Hoja "Horarios"
| Columna | Descripción |
|---------|-------------|
| ID | Identificador del horario |
| Día_Semana | Día de la semana |
| Hora_Inicio | Hora de apertura |
| Hora_Fin | Hora de cierre |
| Disponible | Disponibilidad |

## 🎨 Personalización

### Colores y Tema
Los colores están definidos en variables CSS en `styles.css`:

```css
:root {
  --mindful-purple: #9B59B6;
  --mindful-green: #27AE60;
  --mindful-blue: #3498DB;
  --sage-green: #9CAF88;
  --lavender: #E6E6FA;
  --sunset-orange: #FF8C69;
}
```

### Servicios Predeterminados
Puedes modificar los servicios en `script.js` en la función `insertDefaultServices()`.

### Animaciones
Las animaciones se pueden personalizar en `animations.js` modificando los parámetros de GSAP y AOS.

## 🔒 Seguridad

### Variables de Entorno
- **NUNCA** subas el archivo `.env` a repositorios públicos
- Usa variables de entorno en producción
- Implementa autenticación en el servidor para producción

### Mejores Prácticas
- Las credenciales deben manejarse en el backend en producción
- Implementa rate limiting para prevenir spam
- Valida y sanitiza todas las entradas del usuario
- Usa HTTPS en producción

## 🚀 Despliegue

### GitHub Pages
1. Sube el código a un repositorio de GitHub
2. Ve a Settings > Pages
3. Configura la fuente como "Deploy from a branch"
4. Selecciona la rama principal

### Netlify
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno en Netlify
3. Deploya automáticamente

### Vercel
1. Importa tu proyecto desde GitHub
2. Configura las variables de entorno
3. Deploya con un click

## 🐛 Solución de Problemas

### Error de Autenticación con Google Sheets
- Verifica que las credenciales estén correctas
- Asegúrate de que la hoja esté compartida con la service account
- Revisa que la API de Google Sheets esté habilitada

### Problemas de CORS
- Usa un servidor web local para desarrollo
- En producción, configura los headers CORS apropiados

### Animaciones no funcionan
- Verifica que todas las librerías estén cargadas
- Revisa la consola del navegador para errores
- Asegúrate de que JavaScript esté habilitado

## 📈 Roadmap Futuro

- [ ] Sistema de notificaciones por email
- [ ] Integración con calendarios (Google Calendar, Outlook)
- [ ] Panel de administración avanzado
- [ ] Sistema de pagos online
- [ ] App móvil nativa
- [ ] Análíticas y reportes
- [ ] Sistema de recordatorios automáticos
- [ ] Integración con WhatsApp Business API

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📧 Contacto

- **Proyecto**: Salón de Bienestar
- **Desarrollador**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [tu-usuario-github]

## 🙏 Agradecimientos

- Inspirado en la filosofía mindfulness y el bienestar
- Diseño basado en principios de UX/UI modernos
- Comunidad de desarrolladores open source

---

**¡Namaste! 🙏 Que este proyecto traiga paz y bienestar a quienes lo usen.**