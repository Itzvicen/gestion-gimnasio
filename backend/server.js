const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { format } = require('date-fns');
const fs = require('fs');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'gym_db',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conexión a la base de datos establecida');
});

// Funcion para verificar el token de acceso
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token de acceso no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token de acceso no válido' });
    }

    req.user = decoded;
    next();
  });
}

// Configuración multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/pictures/');
  },
  filename: function(req, file, cb) {
    // obtén la extensión del archivo
    const ext = file.mimetype.split('/')[1];
    // asigna el nuevo nombre al archivo
    cb(null, `perfil-${req.params.id}.${ext}`);
  }
});

// 
const fileFilter = (req, file, cb) => {
  // Aceptar solo imágenes .png, .jpg, .jpeg
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
    cb(new Error('Solo se permiten imágenes .png, .jpg, .jpeg'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20, // permite archivos de hasta 5MB
  },
  fileFilter: fileFilter
});

app.use('/uploads/pictures', express.static('uploads/pictures'), verifyToken);

// Añade un punto final para manejar la subida de archivos
app.post('/api/members/:id/upload', verifyToken, upload.single('image_path'), (req, res) => {
  // 'profile_picture' es el nombre del campo que esperamos del formulario de subida
  // Una vez que la imagen se ha subido, su ruta se puede encontrar en req.file.path
  try {
      const query = 'UPDATE members SET image_path = ? WHERE id = ?';
      db.query(query, [req.file.path, req.params.id], (err, result) => {
          if (err) throw err;
          res.json({ message: 'File uploaded successfully', filePath: req.file.path });
      });
  } catch (err) {
      res.status(400).send({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      const user = result[0];

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  });
});

app.use('/api/admin', verifyToken);

app.get('/api/admin', (req, res) => {
  const query = 'SELECT username, email FROM users';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.use('/api/members', verifyToken);

app.get('/api/members', (req, res) => {
  const query = 'SELECT * FROM members';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/api/members/search', (req, res) => {
  const { name } = req.query;
  const query = 'SELECT * FROM members WHERE first_name LIKE ? OR last_name LIKE ?';
  db.query(query, [`%${name}%`, `%${name}%`], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/api/members', upload.single('image_path'), (req, res) => {
  const { first_name, last_name, email, phone, birth_date, registration_date, active } = req.body;
  
  const nacimiento = birth_date;
  const nacimiento_formateada = format(new Date(nacimiento), 'yyyy-MM-dd');
  
  const registro = registration_date;
  const registro_formateada = format(new Date(registro), 'yyyy-MM-dd');
  
  const query = 'INSERT INTO members (first_name, last_name, email, phone, birth_date, registration_date, active) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [first_name, last_name, email, phone, nacimiento_formateada, registro_formateada, active], (err, result) => {
    if (err) throw err;

    const id = result.insertId;
    let newImagePath;
    
    if (!req.file) {
      // Si no se ha subido ninguna imagen, se usa la imagen por defecto
      newImagePath = `uploads/pictures/default.png`;
    } else {
      const oldImagePath = req.file.path;
      newImagePath = `uploads/pictures/perfil-${id}.jpg`;

      fs.rename(oldImagePath, newImagePath, (err) => {
        if (err) throw err;
      });
    }
      
    const query = 'UPDATE members SET image_path = ? WHERE id = ?';
    db.query(query, [newImagePath, id], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Miembro creado', id: id });
    });
  });
});

app.put('/api/members/:id', upload.single('image_path'), (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, birth_date, registration_date, active } = req.body;

  const nacimiento = birth_date;
  const nacimiento_formateada = format(new Date(nacimiento), 'yyyy-MM-dd');

  const registro = registration_date;
  const registro_formateada = format(new Date(registro), 'yyyy-MM-dd');

  const image_path = req.file ? req.file.path : null;

  const query = 'UPDATE members SET first_name = ?, last_name = ?, email = ?, phone = ?, birth_date = ?, registration_date = ?, active = ?' + (image_path ? ', image_path = ?' : '') + ' WHERE id = ?';
  db.query(query, [first_name, last_name, email, phone, nacimiento_formateada, registro_formateada, active].concat(image_path ? [image_path, id] : [id]), (err, result) => {
    if (err) throw err;
    res.json({ message: 'Miembro actualizado' });
  });
});

app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM members WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Miembro eliminado' });
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));