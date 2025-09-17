# 🚀 Instrucciones - Backend Node.js + Google Sheets

## ✅ **¡Tu aplicación está completa!**

He creado un **backend Node.js** que se conecta directamente con **Google Sheets API** usando tus credenciales, y un **frontend moderno** que se comunica con el backend.

---

## 📋 **Pasos para Ejecutar (Muy simple)**

### **Paso 1: Instalar Dependencias**
```bash
# En la terminal, en la carpeta del proyecto:
cd /mnt/c/Users/diego/OneDrive/Desktop/proyecto_salon_bienestar
npm install
```

### **Paso 2: Ejecutar el Servidor**
```bash
npm start
```

### **Paso 3: Abrir la Aplicación**
- Abre tu navegador
- Ve a: **http://localhost:3000**
- ¡La aplicación se conectará automáticamente!

---

## 🎯 **¿Qué hace automáticamente?**

### **🔐 Autenticación:**
- Se conecta a Google Sheets con tus credenciales
- Verifica permisos automáticamente
- Maneja tokens de acceso internamente

### **📊 Inicialización de Google Sheets:**
Automáticamente crea 3 hojas en tu Google Sheet (`1RuJfdeEwRBnDIZVHjd0AVxgDTwD4nzTtAWAoKupRoQA`):

1. **📋 "Reservas"** - Para todas las citas de clientes
2. **🛍️ "Servicios"** - Con 5 servicios predeterminados
3. **⏰ "Horarios"** - Con horarios de atención

### **🎨 Funcionalidades Completas:**
- ✅ **Crear reservas** → Se guardan en Google Sheets
- ✅ **Ver servicios** → Cargados desde Google Sheets
- ✅ **Buscar reservas** → Por email desde Google Sheets
- ✅ **Interfaz mindfulness** → Todas las animaciones
- ✅ **Responsive** → Móviles, tablets, desktop

---

## 🗂️ **Estructura de Archivos Creados**

```
proyecto_salon_bienestar/
├── 📄 index.html          # Frontend (HTML)
├── 🎨 styles.css          # Estilos (CSS)
├── ⚡ script.js           # Frontend (JavaScript)
├── ✨ animations.js       # Efectos visuales
├── 🔧 env.js              # Configuración de entorno
├── 🖥️ server.js           # Backend Node.js
├── 📦 package.json        # Dependencias
├── 🔑 .env                # Variables de entorno
└── 📋 .gitignore          # Archivos a ignorar
```

---

## 🌐 **API REST Endpoints**

Tu backend expone estas rutas:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Página principal (frontend) |
| `GET` | `/api/health` | Estado del servidor |
| `POST` | `/api/init` | Inicializar Google Sheets |
| `GET` | `/api/services` | Obtener servicios |
| `POST` | `/api/reservations` | Crear nueva reserva |
| `GET` | `/api/reservations` | Obtener reservas |
| `GET` | `/api/reservations?email=xxx` | Buscar por email |

---

## 📊 **Datos en Google Sheets**

### **Hoja "Reservas":**
```
ID | Fecha | Hora | Nombre | Email | Telefono | Servicio | Comentarios | Estado | Fecha_Creacion
```

### **Hoja "Servicios":**
```
ID | Nombre | Descripcion | Duracion | Precio | Activo
1  | Meditación Mindfulness | Sesión de meditación guiada... | 60 min | $50 | TRUE
2  | Yoga Restaurativo | Práctica suave de yoga... | 90 min | $70 | TRUE
3  | Terapia de Sonido | Sanación a través de cuencos... | 75 min | $80 | TRUE
4  | Aromaterapia | Relajación con aceites... | 60 min | $65 | TRUE
5  | Círculo de Sanación | Sesión grupal de sanación... | 120 min | $40 | TRUE
```

### **Hoja "Horarios":**
```
ID | Dia_Semana | Hora_Inicio | Hora_Fin | Disponible
1  | Lunes      | 09:00       | 18:00    | TRUE
2  | Martes     | 09:00       | 18:00    | TRUE
... (todos los días)
```

---

## 🔒 **Seguridad Implementada**

- ✅ **CORS** configurado para localhost
- ✅ **Rate Limiting** (100 requests por 15 min)
- ✅ **Helmet** para headers de seguridad
- ✅ **Validación** de datos en backend
- ✅ **Variables de entorno** protegidas
- ✅ **Logs** de todas las operaciones

---

## 🎯 **Para Usar en Producción**

### **1. Subir a un servidor:**
```bash
# Ejemplo con Heroku
git init
git add .
git commit -m "Salon Bienestar app"
heroku create tu-salon-bienestar
heroku config:set GOOGLE_CREDENTIALS_JSON='...'
heroku config:set SHEET_ID='1RuJfdeEwRBnDIZVHjd0AVxgDTwD4nzTtAWAoKupRoQA'
git push heroku main
```

### **2. Variables de entorno en producción:**
```bash
# Configurar en tu servidor:
GOOGLE_CREDENTIALS_JSON='...'
SHEET_ID='1RuJfdeEwRBnDIZVHjd0AVxgDTwD4nzTtAWAoKupRoQA'
NODE_ENV='production'
PORT=3000
```

---

## 🛠️ **Scripts Disponibles**

```bash
npm start     # Ejecutar en producción
npm run dev   # Ejecutar en desarrollo (con nodemon)
```

---

## 🔍 **Ver Logs en Tiempo Real**

```bash
# En la terminal verás:
🌸 ==========================================
🌸 Salón de Bienestar - Servidor iniciado
🌸 ==========================================
📡 Servidor: http://localhost:3000
📊 Google Sheet: 1RuJfdeEwRBnDIZVHjd0AVxgDTwD4nzTtAWAoKupRoQA
🌸 ==========================================
```

---

## 🆘 **Si algo no funciona**

### **Error de credenciales:**
- Verifica que el archivo `.env` tenga las credenciales correctas
- Asegúrate de que la cuenta de servicio tenga permisos en el Google Sheet

### **Error de conexión:**
- Verifica que el puerto 3000 esté libre
- Prueba con: `curl http://localhost:3000/api/health`

### **Error de permisos:**
- Asegúrate de que tu Google Sheet esté compartido con el email de la service account

---

## 🎉 **¡Listo para usar!**

1. **`npm install`** - Instalar dependencias
2. **`npm start`** - Ejecutar servidor
3. **Abrir http://localhost:3000** - Usar la aplicación

**¡Tu salón de bienestar ya puede recibir reservas que se guardan automáticamente en Google Sheets! 🌸**