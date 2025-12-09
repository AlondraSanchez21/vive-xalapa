-- Crear base de datos
CREATE DATABASE IF NOT EXISTS vivexalapa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vivexalapa_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  ciudad VARCHAR(50),
  rol ENUM('usuario', 'admin') DEFAULT 'usuario',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de hoteles
CREATE TABLE IF NOT EXISTS hoteles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  ubicacion VARCHAR(255),
  precioBase DECIMAL(10, 2),
  precioAntes DECIMAL(10, 2),
  imagen VARCHAR(255),
  calificacion DECIMAL(3, 1) DEFAULT 5.0,
  habitaciones INT,
  amenidades JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tours
CREATE TABLE IF NOT EXISTS tours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  ubicacion VARCHAR(255),
  precioBase DECIMAL(10, 2),
  precioAntes DECIMAL(10, 2),
  imagen VARCHAR(255),
  duracion VARCHAR(50),
  idiomas JSON,
  incluye JSON,
  horarios JSON,
  calificacion DECIMAL(3, 1) DEFAULT 5.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de viajes
CREATE TABLE IF NOT EXISTS viajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  origen VARCHAR(100),
  destino VARCHAR(100),
  precioBase DECIMAL(10, 2),
  precioAntes DECIMAL(10, 2),
  imagen VARCHAR(255),
  fechaSalida DATE,
  hora TIME,
  duracion VARCHAR(50),
  tipoTransporte ENUM('avion', 'autobus', 'tren') DEFAULT 'avion',
  asientos INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de gastronomias
CREATE TABLE IF NOT EXISTS gastronomias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  ubicacion VARCHAR(255),
  precioPromedio DECIMAL(10, 2),
  imagen VARCHAR(255),
  tipoComida VARCHAR(50),
  horarios VARCHAR(255),
  telefono VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  tipo ENUM('hotel', 'tour', 'viaje') NOT NULL,
  producto_id INT,
  cantidad INT,
  precioTotal DECIMAL(10, 2),
  estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
  fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('gastronomia', 'hotel', 'tour', 'viaje'),
  producto_id INT,
  calificacion DECIMAL(3, 1),
  texto TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('gastronomia', 'hotel', 'tour', 'viaje'),
  producto_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorito (usuario_id, tipo, producto_id)
);

-- Insertar datos de ejemplo
INSERT INTO usuarios (nombre, email, password, telefono, ciudad, rol) VALUES
('Admin', 'admin@vivexalapa.com', '12345', '2281234567', 'Xalapa', 'admin'),
('Juan García', 'juan@example.com', '12345', '2281234567', 'Xalapa', 'usuario'),
('María López', 'maria@example.com', '12345', '2289876543', 'Veracruz', 'usuario');

INSERT INTO hoteles (nombre, descripcion, ubicacion, precioBase, precioAntes, imagen, calificacion, habitaciones, amenidades) VALUES
('Hotel Xalapa Plaza', 'Hotel elegante en el centro de Xalapa', 'Centro, Xalapa', 1500.00, 2000.00, '/assets/hotel1.jpg', 4.5, 50, '["WiFi", "Piscina", "Restaurante", "Gym"]'),
('Posada del Enamorado', 'Boutique hotel con encanto', 'Zona Histórica', 1200.00, 1600.00, '/assets/hotel2.jpg', 4.8, 30, '["WiFi", "Desayuno", "Terraza"]'),
('Hotel Sierra de Xalapa', 'Hotel en la montaña con vistas panorámicas', 'Sierra, Xalapa', 1800.00, 2400.00, '/assets/hotel3.jpg', 4.3, 60, '["WiFi", "Spa", "Restaurante gourmet"]');

INSERT INTO tours (nombre, descripcion, ubicacion, precioBase, precioAntes, imagen, duracion, idiomas, incluye, horarios, calificacion) VALUES
('Tour Histórico de Xalapa', 'Recorrido por los sitios históricos más importantes', 'Centro Histórico', 500.00, 700.00, '/assets/tour1.jpg', '4 horas', '["español", "inglés"]', '["Guía profesional", "Transporte"]', '["09:00", "14:00"]', 4.7),
('Senderismo en Cofre de Perote', 'Expedición a la montaña más alta de Veracruz', 'Cofre de Perote', 800.00, 1200.00, '/assets/tour2.jpg', '8 horas', '["español"]', '["Guía", "Equipo", "Comida"]', '["07:00"]', 4.9),
('Tour de Gastronomía Xalapeña', 'Degustación de platillos típicos de la región', 'Centro Gastronómico', 600.00, 800.00, '/assets/tour3.jpg', '3 horas', '["español", "francés"]', '["Guía", "5 degustaciones", "Bebidas"]', '["12:00", "18:00"]', 4.6);

INSERT INTO viajes (nombre, descripcion, origen, destino, precioBase, precioAntes, imagen, fechaSalida, hora, duracion, tipoTransporte, asientos) VALUES
('Vuelo Xalapa - CDMX', 'Vuelo directo a la capital', 'Xalapa', 'Ciudad de México', 2500.00, 3500.00, '/assets/viaje1.jpg', '2025-12-20', '09:00', '1.5 horas', 'avion', 150),
('Autobús Xalapa - Veracruz', 'Transporte por carretera cómodo', 'Xalapa', 'Veracruz', 300.00, 400.00, '/assets/viaje2.jpg', '2025-12-21', '08:00', '2.5 horas', 'autobus', 50),
('Vuelo Xalapa - Cancún', 'Escapada al caribe', 'Xalapa', 'Cancún', 4500.00, 6000.00, '/assets/viaje3.jpg', '2025-12-25', '10:00', '3 horas', 'avion', 180);

INSERT INTO gastronomias (nombre, descripcion, ubicacion, precioPromedio, imagen, tipoComida, horarios, telefono) VALUES
('Restaurante Casa Vieja', 'Comida tradicional veracruzana', 'Centro', 350.00, '/assets/gastro1.jpg', 'Veracruzana', '12:00-23:00', '2281234567'),
('Café del Portal', 'Café especializado artesanal', 'Portal', 150.00, '/assets/gastro2.jpg', 'Café', '08:00-20:00', '2281234568'),
('La Chalupa Dorada', 'Mariscos frescos diarios', 'Puerto', 450.00, '/assets/gastro3.jpg', 'Mariscos', '11:00-23:00', '2281234569');
