-- ============================================================
-- BASE DE DATOS VIVE XALAPA - SCHEMA COMPLETO Y FUNCIONAL
-- ============================================================
-- Instrucciones:
-- 1. Abre phpMyAdmin en http://localhost/phpmyadmin
-- 2. Copia TODO este código
-- 3. Pega en la pestaña "SQL" de phpMyAdmin
-- 4. Haz clic en "Ejecutar"
-- 5. Listo! La BD estará creada con datos de ejemplo
-- ============================================================

-- ============================================================
-- PASO 1: CREAR LA BASE DE DATOS
-- ============================================================
DROP DATABASE IF EXISTS vivexalapa;
CREATE DATABASE vivexalapa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vivexalapa;

-- ============================================================
-- PASO 2: CREAR TABLA DE USUARIOS
-- ============================================================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  ciudad VARCHAR(50),
  foto_perfil VARCHAR(255),
  rol ENUM('usuario', 'admin', 'moderador') DEFAULT 'usuario',
  estado ENUM('activo', 'inactivo', 'bloqueado') DEFAULT 'activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_login TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASO 3: CREAR TABLA DE HOTELES
-- ============================================================
CREATE TABLE hoteles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion LONGTEXT,
  ubicacion VARCHAR(255),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  precio_base DECIMAL(10, 2) NOT NULL,
  precio_antes DECIMAL(10, 2),
  imagen VARCHAR(255),
  calificacion DECIMAL(3, 2) DEFAULT 5.00,
  num_resenas INT DEFAULT 0,
  habitaciones INT,
  amenidades JSON,
  politica_cancelacion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(100),
  web VARCHAR(255),
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre),
  INDEX idx_precio (precio_base),
  INDEX idx_calificacion (calificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASO 4: CREAR TABLA DE TOURS
-- ============================================================
CREATE TABLE tours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion LONGTEXT,
  ubicacion VARCHAR(255),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  precio_base DECIMAL(10, 2) NOT NULL,
  precio_antes DECIMAL(10, 2),
  imagen VARCHAR(255),
  duracion VARCHAR(50),
  idiomas JSON,
  incluye JSON,
  no_incluye JSON,
  horarios JSON,
  calificacion DECIMAL(3, 2) DEFAULT 5.00,
  num_resenas INT DEFAULT 0,
  max_personas INT,
  guia_incluido BOOLEAN DEFAULT TRUE,
  telefono VARCHAR(20),
  email VARCHAR(100),
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre),
  INDEX idx_precio (precio_base),
  INDEX idx_calificacion (calificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASO 5: CREAR TABLA DE VIAJES
-- ============================================================
CREATE TABLE viajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion LONGTEXT,
  origen VARCHAR(100) NOT NULL,
  destino VARCHAR(100) NOT NULL,
  precio_base DECIMAL(10, 2) NOT NULL,
  precio_antes DECIMAL(10, 2),
  imagen VARCHAR(255),
  fecha_salida DATE NOT NULL,
  hora_salida TIME,
  fecha_regreso DATE,
  hora_regreso TIME,
  duracion VARCHAR(50),
  tipo_transporte ENUM('avion', 'autobus', 'tren', 'barco') DEFAULT 'avion',
  asientos_disponibles INT,
  asientos_vendidos INT DEFAULT 0,
  asiento_total INT,
  aerolinea VARCHAR(100),
  numero_vuelo VARCHAR(50),
  escala BOOLEAN DEFAULT FALSE,
  calificacion DECIMAL(3, 2) DEFAULT 5.00,
  num_resenas INT DEFAULT 0,
  estado ENUM('activo', 'completo', 'cancelado') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_origen_destino (origen, destino),
  INDEX idx_fecha_salida (fecha_salida),
  INDEX idx_precio (precio_base)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASO 6: CREAR TABLA DE GASTRONOMÍAS
-- ============================================================
CREATE TABLE gastronomias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion LONGTEXT,
  ubicacion VARCHAR(255),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  precio_promedio DECIMAL(10, 2),
  imagen VARCHAR(255),
  tipo_comida VARCHAR(100),
  horarios VARCHAR(255),
  horario_apertura TIME,
  horario_cierre TIME,
  telefono VARCHAR(20),
  email VARCHAR(100),
  web VARCHAR(255),
  redes_sociales JSON,
  especialidades JSON,
  calificacion DECIMAL(3, 2) DEFAULT 5.00,
  num_resenas INT DEFAULT 0,
  reservas_disponibles BOOLEAN DEFAULT TRUE,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre),
  INDEX idx_tipo_comida (tipo_comida),
  INDEX idx_precio (precio_promedio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASO 7: CREAR TABLA DE LUGARES TURÍSTICOS
-- ============================================================
CREATE TABLE lugares_turisticos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion LONGTEXT,
  ubicacion VARCHAR(255),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  imagen VARCHAR(255),
  tipo ENUM('museo', 'parque', 'monumento', 'playa', 'montaña', 'otro') DEFAULT 'otro',
  entrada_libre BOOLEAN DEFAULT FALSE,
  precio_entrada DECIMAL(10, 2),
  horarios VARCHAR(255),
  horario_apertura TIME,
  horario_cierre TIME,
  telefono VARCHAR(20),
  email VARCHAR(100),
  web VARCHAR(255),
  calificacion DECIMAL(3, 2) DEFAULT 5.00,
  num_resenas INT DEFAULT 0,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASO 8: CREAR TABLA DE RESERVAS
-- ============================================================
CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('hotel', 'tour', 'viaje', 'gastronomia') NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT DEFAULT 1,
  precio_total DECIMAL(10, 2),
  precio_unitario DECIMAL(10, 2),
  estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
  fecha_check_in DATE,
  fecha_check_out DATE,
  comentarios TEXT,
  fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_confirmacion TIMESTAMP NULL,
  fecha_cancelacion TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario (usuario_id),
  INDEX idx_tipo (tipo),
  INDEX idx_estado (estado),
  INDEX idx_fecha_reserva (fecha_reserva)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASO 9: CREAR TABLA DE RESEÑAS/COMENTARIOS
-- ============================================================
CREATE TABLE resenas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('gastronomia', 'hotel', 'tour', 'viaje', 'lugar') NOT NULL,
  producto_id INT NOT NULL,
  calificacion DECIMAL(3, 2) NOT NULL,
  titulo VARCHAR(150),
  texto LONGTEXT,
  fotos JSON,
  util INT DEFAULT 0,
  no_util INT DEFAULT 0,
  estado ENUM('aprobada', 'pendiente', 'rechazada') DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario (usuario_id),
  INDEX idx_tipo_producto (tipo, producto_id),
  INDEX idx_calificacion (calificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASO 10: CREAR TABLA DE FAVORITOS
-- ============================================================
CREATE TABLE favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('gastronomia', 'hotel', 'tour', 'viaje', 'lugar') NOT NULL,
  producto_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorito (usuario_id, tipo, producto_id),
  INDEX idx_usuario (usuario_id),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASO 11: CREAR TABLA DE CARRITOS
-- ============================================================
CREATE TABLE carritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('hotel', 'tour', 'viaje', 'gastronomia') NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT DEFAULT 1,
  precio_unitario DECIMAL(10, 2),
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_carrito (usuario_id, tipo, producto_id),
  INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASO 12: INSERTAR USUARIOS DE PRUEBA
-- ============================================================
INSERT INTO usuarios (nombre, apellido, email, password, telefono, ciudad, rol, estado) VALUES
('Admin', 'Sistema', 'admin@vivexalapa.com', '12345', '2281234567', 'Xalapa', 'admin', 'activo'),
('Juan', 'García', 'juan@example.com', '12345', '2281234567', 'Xalapa', 'usuario', 'activo'),
('María', 'López', 'maria@example.com', '12345', '2289876543', 'Veracruz', 'usuario', 'activo'),
('Carlos', 'Rodríguez', 'carlos@example.com', '12345', '2281111111', 'Xalapa', 'usuario', 'activo'),
('Ana', 'Martínez', 'ana@example.com', '12345', '2282222222', 'Coatepec', 'usuario', 'activo');

-- ============================================================
-- PASO 13: INSERTAR HOTELES
-- ============================================================
INSERT INTO hoteles (nombre, descripcion, ubicacion, precio_base, precio_antes, imagen, calificacion, habitaciones, amenidades, telefono) VALUES
('Hotel Xalapa Plaza', 'Hotel elegante en el centro de Xalapa con todas las comodidades modernas', 'Centro, Xalapa, Ver.', 1500.00, 2000.00, 'https://via.placeholder.com/300x200?text=Hotel+Xalapa+Plaza', 4.5, 50, '["WiFi", "Piscina", "Restaurante", "Gym", "Spa", "Estacionamiento"]', '2281234567'),
('Posada del Enamorado', 'Boutique hotel con encanto en zona histórica con atmósfera colonial', 'Zona Histórica, Xalapa', 1200.00, 1600.00, 'https://via.placeholder.com/300x200?text=Posada+del+Enamorado', 4.8, 30, '["WiFi", "Desayuno incluido", "Terraza", "Bar", "Sala común"]', '2281234568'),
('Hotel Sierra de Xalapa', 'Hotel en la montaña con vistas panorámicas y aire puro', 'Sierra de Xalapa', 1800.00, 2400.00, 'https://via.placeholder.com/300x200?text=Hotel+Sierra', 4.3, 60, '["WiFi", "Spa", "Restaurante gourmet", "Sauna", "Yoga"]', '2281234569'),
('Casa Hotel Real', 'Casa hacienda colonial convertida en hotel boutique', 'Xico, Veracruz', 950.00, 1300.00, 'https://via.placeholder.com/300x200?text=Casa+Hotel+Real', 4.6, 20, '["WiFi", "Desayuno", "Piscina", "Jardines"]', '2281111111'),
('Eco Hotel Bosque', 'Hotel ecológico rodeado de naturaleza y áreas verdes', 'Coatepec, Veracruz', 850.00, 1150.00, 'https://via.placeholder.com/300x200?text=Eco+Hotel', 4.7, 35, '["WiFi", "Naturaleza", "Senderismo", "Restaurante"]', '2281222222');

-- ============================================================
-- PASO 14: INSERTAR TOURS
-- ============================================================
INSERT INTO tours (nombre, descripcion, ubicacion, precio_base, precio_antes, imagen, duracion, idiomas, incluye, horarios, calificacion, max_personas) VALUES
('Tour Histórico de Xalapa', 'Recorrido completo por los sitios históricos más importantes de Xalapa', 'Centro Histórico, Xalapa', 500.00, 700.00, 'https://via.placeholder.com/300x200?text=Tour+Historico', '4 horas', '["español", "inglés"]', '["Guía profesional", "Transporte en grupo", "Entrada a museos"]', '["09:00", "14:00"]', 4.7, 15),
('Senderismo en Cofre de Perote', 'Expedición a la montaña más alta de Veracruz con vistas espectaculares', 'Cofre de Perote', 800.00, 1200.00, 'https://via.placeholder.com/300x200?text=Senderismo+Cofre', '8 horas', '["español"]', '["Guía experto", "Equipo", "Comida", "Transporte"]', '["07:00"]', 4.9, 10),
('Tour de Gastronomía Xalapeña', 'Degustación de platillos típicos de la región con recorrido gastronómico', 'Centro Gastronómico, Xalapa', 600.00, 800.00, 'https://via.placeholder.com/300x200?text=Tour+Gastronomia', '3 horas', '["español", "francés"]', '["Guía gastronómico", "5 degustaciones", "Bebidas", "Propina no incluida"]', '["12:00", "18:00"]', 4.6, 12),
('Tour Cascadas de Texolo', 'Recorrido hacia las hermosas cascadas de Texolo en Xico', 'Xico, Veracruz', 450.00, 650.00, 'https://via.placeholder.com/300x200?text=Cascadas+Texolo', '5 horas', '["español", "inglés"]', '["Guía", "Transporte", "Snacks", "Fotos"]', '["08:30", "13:30"]', 4.8, 12),
('Tour Jardín Botánico Clavijero', 'Visita guiada al hermoso jardín botánico con más de 2000 especies', 'Xalapa', 350.00, 500.00, 'https://via.placeholder.com/300x200?text=Jardin+Botanico', '2.5 horas', '["español", "inglés"]', '["Guía botanista", "Entrada"]', '["10:00", "16:00"]', 4.5, 20);

-- ============================================================
-- PASO 15: INSERTAR VIAJES
-- ============================================================
INSERT INTO viajes (nombre, descripcion, origen, destino, precio_base, precio_antes, imagen, fecha_salida, hora_salida, duracion, tipo_transporte, asientos_disponibles, asiento_total, aerolinea, numero_vuelo) VALUES
('Vuelo Xalapa - CDMX', 'Vuelo directo a la capital con servicio de catering', 'Xalapa', 'Ciudad de México', 2500.00, 3500.00, 'https://via.placeholder.com/300x200?text=Vuelo+CDMX', '2025-12-20', '09:00:00', '1.5 horas', 'avion', 120, 150, 'Aeromexico', 'AM456'),
('Autobús Xalapa - Veracruz', 'Transporte por carretera cómodo con aire acondicionado', 'Xalapa', 'Veracruz', 300.00, 400.00, 'https://via.placeholder.com/300x200?text=Autobus', '2025-12-21', '08:00:00', '2.5 horas', 'autobus', 35, 50, 'Primera Plus', 'PP-789'),
('Vuelo Xalapa - Cancún', 'Escapada al caribe con opciones de actividades', 'Xalapa', 'Cancún', 4500.00, 6000.00, 'https://via.placeholder.com/300x200?text=Vuelo+Cancun', '2025-12-25', '10:00:00', '3 horas', 'avion', 95, 180, 'Viva Aerobus', 'VB-234'),
('Autobús Xalapa - Oaxaca', 'Viaje a la hermosa ciudad de Oaxaca', 'Xalapa', 'Oaxaca', 850.00, 1150.00, 'https://via.placeholder.com/300x200?text=Autobus+Oaxaca', '2025-12-22', '07:30:00', '7 horas', 'autobus', 20, 50, 'Autobuses Unidos', 'AU-567'),
('Vuelo Xalapa - Mérida', 'Viaje a Mérida para explorar la cultura maya', 'Xalapa', 'Mérida', 3200.00, 4500.00, 'https://via.placeholder.com/300x200?text=Vuelo+Merida', '2025-12-28', '11:30:00', '2 horas', 'avion', 140, 180, 'Volaris', 'Y4-891');

-- ============================================================
-- PASO 16: INSERTAR GASTRONOMÍAS
-- ============================================================
INSERT INTO gastronomias (nombre, descripcion, ubicacion, precio_promedio, imagen, tipo_comida, horarios, telefono) VALUES
('Restaurante Casa Vieja', 'Comida tradicional veracruzana en ambiente colonial', 'Centro, Xalapa', 350.00, 'https://via.placeholder.com/300x200?text=Casa+Vieja', 'Veracruzana', '12:00-23:00', '2281234567'),
('Café del Portal', 'Café especializado artesanal con excelentes bebidas', 'Portal, Xalapa', 150.00, 'https://via.placeholder.com/300x200?text=Cafe+Portal', 'Café', '08:00-20:00', '2281234568'),
('La Chalupa Dorada', 'Mariscos frescos diarios preparados con recetas tradicionales', 'Puerto, Veracruz', 450.00, 'https://via.placeholder.com/300x200?text=Chalupa+Dorada', 'Mariscos', '11:00-23:00', '2281234569'),
('Cantina Urbana', 'Bar de comida moderna con fusión de sabores', 'Centro, Xalapa', 400.00, 'https://via.placeholder.com/300x200?text=Cantina+Urbana', 'Moderna', '18:00-02:00', '2281111111'),
('El Comedor Campestre', 'Comida casera hecha con ingredientes locales y frescos', 'Coatepec', 250.00, 'https://via.placeholder.com/300x200?text=Comedor', 'Comida Casera', '12:00-21:00', '2281222222');

-- ============================================================
-- PASO 17: INSERTAR LUGARES TURÍSTICOS
-- ============================================================
INSERT INTO lugares_turisticos (nombre, descripcion, ubicacion, imagen, tipo, entrada_libre, precio_entrada, horarios, telefono) VALUES
('Palacio Municipal de Xalapa', 'Edificio histórico del siglo XVIII con arquitectura colonial impresionante', 'Centro, Xalapa', 'https://via.placeholder.com/300x200?text=Palacio+Municipal', 'monumento', TRUE, 0.00, 'Lunes a Viernes 09:00-17:00', '2281234567'),
('Jardín Botánico Clavijero', 'Jardín con más de 2000 especies de plantas y flores de diversas regiones', 'Xalapa', 'https://via.placeholder.com/300x200?text=Jardin+Botanico', 'parque', FALSE, 80.00, '10:00-17:00', '2281234568'),
('Museo de Antropología', 'Museo con colecciones de arte prehispánico y etnografía de Veracruz', 'Xalapa', 'https://via.placeholder.com/300x200?text=Museo+Antropologia', 'museo', FALSE, 60.00, '09:00-17:00', '2281234569'),
('Cascadas de Texolo', 'Hermosas cascadas rodeadas de naturaleza en Xico', 'Xico, Veracruz', 'https://via.placeholder.com/300x200?text=Cascadas', 'montaña', FALSE, 30.00, '08:00-17:00', '2281111111'),
('Parque Los Macuiltépetl', 'Parque ecológico con bosque nublado y senderos para caminatas', 'Xalapa', 'https://via.placeholder.com/300x200?text=Parque+Macuilte', 'parque', TRUE, 0.00, '06:00-18:00', '2281222222');

-- ============================================================
-- VERIFICACIÓN: Ver todas las tablas creadas
-- ============================================================
-- Ejecuta esto para verificar que todo está bien:
-- SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'vivexalapa_db';

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
