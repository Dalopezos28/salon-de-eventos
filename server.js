const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de Google Sheets
const SHEET_ID = process.env.SHEET_ID || '1RuJfdeEwRBnDIZVHjd0AVxgDTwD4nzTtAWAoKupRoQA';

// Parse Google credentials from environment
let googleCredentials;
try {
  googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
} catch (error) {
  console.error('Error parsing Google credentials:', error.message);
  process.exit(1);
}

// Configurar autenticación de Google
const auth = new google.auth.GoogleAuth({
  credentials: googleCredentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://cdnjs.cloudflare.com"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta nuevamente en 15 minutos.'
  }
});

app.use(limiter);

// Middleware básico
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Middleware para logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ========================
// FUNCIONES DE GOOGLE SHEETS
// ========================

// Inicializar hojas si no existen
async function initializeSheets() {
  try {
    console.log('Inicializando Google Sheets...');

    // Obtener información del spreadsheet
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    const existingSheets = spreadsheet.data.sheets.map(sheet => sheet.properties.title);

    // Crear hojas si no existen
    const requiredSheets = [
      {
        name: 'Reservas',
        headers: ['ID', 'Fecha', 'Hora', 'Nombre', 'Email', 'Telefono', 'Servicio', 'Comentarios', 'Estado', 'Fecha_Creacion']
      },
      {
        name: 'Servicios',
        headers: ['ID', 'Nombre', 'Descripcion', 'Duracion', 'Precio', 'Activo']
      },
      {
        name: 'Horarios',
        headers: ['ID', 'Dia_Semana', 'Hora_Inicio', 'Hora_Fin', 'Disponible']
      }
    ];

    for (const sheetConfig of requiredSheets) {
      if (!existingSheets.includes(sheetConfig.name)) {
        console.log(`Creando hoja: ${sheetConfig.name}`);

        // Crear la hoja
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetConfig.name
                }
              }
            }]
          }
        });

        // Agregar headers
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${sheetConfig.name}!A1:${String.fromCharCode(64 + sheetConfig.headers.length)}1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [sheetConfig.headers]
          }
        });

        // Insertar datos iniciales si es necesario
        if (sheetConfig.name === 'Servicios') {
          await insertDefaultServices();
        } else if (sheetConfig.name === 'Horarios') {
          await insertDefaultSchedules();
        }
      }
    }

    console.log('✅ Google Sheets inicializado correctamente');
    return true;

  } catch (error) {
    console.error('Error inicializando Google Sheets:', error);
    throw error;
  }
}

// Insertar servicios por defecto
async function insertDefaultServices() {
  const defaultServices = [
    ['1', 'Meditación Mindfulness', 'Sesión de meditación guiada para encontrar la paz interior', '60 min', '$50', 'TRUE'],
    ['2', 'Yoga Restaurativo', 'Práctica suave de yoga para relajación profunda', '90 min', '$70', 'TRUE'],
    ['3', 'Terapia de Sonido', 'Sanación a través de cuencos tibetanos y frecuencias', '75 min', '$80', 'TRUE'],
    ['4', 'Aromaterapia', 'Relajación con aceites esenciales y masaje suave', '60 min', '$65', 'TRUE'],
    ['5', 'Círculo de Sanación', 'Sesión grupal de sanación energética', '120 min', '$40', 'TRUE']
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Servicios!A2:F',
    valueInputOption: 'RAW',
    requestBody: {
      values: defaultServices
    }
  });
}

// Insertar horarios por defecto
async function insertDefaultSchedules() {
  const defaultSchedules = [
    ['1', 'Lunes', '09:00', '18:00', 'TRUE'],
    ['2', 'Martes', '09:00', '18:00', 'TRUE'],
    ['3', 'Miércoles', '09:00', '18:00', 'TRUE'],
    ['4', 'Jueves', '09:00', '18:00', 'TRUE'],
    ['5', 'Viernes', '09:00', '18:00', 'TRUE'],
    ['6', 'Sábado', '10:00', '16:00', 'TRUE'],
    ['7', 'Domingo', '10:00', '16:00', 'FALSE']
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Horarios!A2:E',
    valueInputOption: 'RAW',
    requestBody: {
      values: defaultSchedules
    }
  });
}

// ========================
// RUTAS DE LA API
// ========================

// Ruta principal - servir frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    sheetId: SHEET_ID
  });
});

// Inicializar hojas
app.post('/api/init', async (req, res) => {
  try {
    await initializeSheets();
    res.json({
      success: true,
      message: 'Hojas inicializadas correctamente'
    });
  } catch (error) {
    console.error('Error en /api/init:', error);
    res.status(500).json({
      success: false,
      message: 'Error inicializando hojas',
      error: error.message
    });
  }
});

// Obtener servicios
app.get('/api/services', async (req, res) => {
  try {
    console.log('Obteniendo servicios...');

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Servicios!A2:F',
    });

    console.log('Respuesta de Google Sheets:', response.data);
    const rows = response.data.values || [];
    console.log('Filas obtenidas:', rows);

    const services = rows.map(row => ({
      id: row[0],
      nombre: row[1],
      descripcion: row[2],
      duracion: row[3],
      precio: row[4],
      activo: row[5] === 'TRUE'
    })).filter(service => service.activo);

    console.log('Servicios procesados:', services);

    res.json({
      success: true,
      data: services,
      count: services.length
    });

  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo servicios',
      error: error.message
    });
  }
});

// Crear reserva
app.post('/api/reservations', async (req, res) => {
  try {
    const { fecha, hora, nombre, email, telefono, servicio, comentarios } = req.body;

    // Validar campos requeridos
    if (!fecha || !hora || !nombre || !email || !telefono || !servicio) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    const reservation = {
      id: Date.now().toString(),
      fecha,
      hora,
      nombre,
      email,
      telefono,
      servicio,
      comentarios: comentarios || '',
      estado: 'Pendiente',
      fecha_creacion: new Date().toISOString()
    };

    console.log('Creando reserva:', reservation);

    // Insertar en Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Reservas!A:J',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          reservation.id,
          reservation.fecha,
          reservation.hora,
          reservation.nombre,
          reservation.email,
          reservation.telefono,
          reservation.servicio,
          reservation.comentarios,
          reservation.estado,
          reservation.fecha_creacion
        ]]
      }
    });

    console.log('✅ Reserva creada exitosamente');

    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: reservation
    });

  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando reserva',
      error: error.message
    });
  }
});

// Obtener reservas (todas o por email)
app.get('/api/reservations', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Obteniendo reservas para email:', email);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Reservas!A2:J',
    });

    const rows = response.data.values || [];
    let reservations = rows.map(row => ({
      id: row[0],
      fecha: row[1],
      hora: row[2],
      nombre: row[3],
      email: row[4],
      telefono: row[5],
      servicio: row[6],
      comentarios: row[7],
      estado: row[8],
      fecha_creacion: row[9]
    }));

    // Filtrar por email si se proporciona
    if (email) {
      reservations = reservations.filter(r =>
        r.email && r.email.toLowerCase() === email.toLowerCase()
      );
    }

    // Ordenar por fecha de creación (más recientes primero)
    reservations.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

    res.json({
      success: true,
      data: reservations,
      count: reservations.length,
      filteredBy: email || 'all'
    });

  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo reservas',
      error: error.message
    });
  }
});

// Obtener horarios
app.get('/api/schedules', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Horarios!A2:E',
    });

    const rows = response.data.values || [];
    const schedules = rows.map(row => ({
      id: row[0],
      dia_semana: row[1],
      hora_inicio: row[2],
      hora_fin: row[3],
      disponible: row[4] === 'TRUE'
    })).filter(schedule => schedule.disponible);

    res.json({
      success: true,
      data: schedules,
      count: schedules.length
    });

  } catch (error) {
    console.error('Error obteniendo horarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo horarios',
      error: error.message
    });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

// ========================
// INICIALIZACIÓN DEL SERVIDOR
// ========================

async function startServer() {
  try {
    console.log('🚀 Iniciando servidor...');

    // Verificar conexión con Google Sheets
    console.log('🔗 Verificando conexión con Google Sheets...');
    const testAuth = await auth.getClient();
    console.log('✅ Autenticación con Google exitosa');

    // Inicializar hojas
    await initializeSheets();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🌸 ==========================================`);
      console.log(`🌸 Salón de Bienestar - Servidor iniciado`);
      console.log(`🌸 ==========================================`);
      console.log(`📡 Servidor: http://localhost:${PORT}`);
      console.log(`📊 Google Sheet: ${SHEET_ID}`);
      console.log(`🌸 ==========================================\n`);
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejar cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();