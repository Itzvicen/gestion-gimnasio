const express = require('express');
const routerAdmin = express.Router();
const routerMembers = express.Router();
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

// Configuración de multer para el almacenamiento en disco.
// Esto controla cómo se procesan y almacenan los archivos que se cargan.
const storage = multer.diskStorage({
  // Determina en qué directorio se guardarán los archivos cargados.
  destination: function(req, file, cb) {
    // Guarda todos los archivos en 'uploads/pictures/'
    cb(null, 'uploads/pictures/');
  },

  // Determina el nombre que se asignará a los archivos cargados.
  filename: function(req, file, cb) {
    // Obtiene la extensión del archivo
    const ext = file.mimetype.split('/')[1];
    // Asigna el nuevo nombre al archivo. El nombre está compuesto por 'perfil-',
    // seguido del id de los parámetros de la solicitud, y la extensión del archivo.
    cb(null, `perfil-${req.params.id}.${ext}`);
  }
});

// Filtro de archivos que determina qué archivos deben ser aceptados.
const fileFilter = (req, file, cb) => {
  // Solo aceptar imágenes con extensión .png, .jpg, .jpeg
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    // Si la extensión es válida, acepta el archivo.
    cb(null, true);
  } else {
    // Si la extensión no es válida, rechaza el archivo y lanza un error.
    cb(null, false);
    cb(new Error('Solo se permiten imágenes .png, .jpg, .jpeg'));
  }
};

// Configuración final de multer.
const upload = multer({
  // Utiliza el objeto de almacenamiento definido previamente.
  storage: storage,

  // Define un límite para el tamaño del archivo cargado.
  // En este caso, el tamaño máximo es de 5 MB.
  limits: {
    fileSize: 1024 * 1024 * 5,
  },

  // Utiliza el filtro de archivos definido previamente.
  fileFilter: fileFilter
});

routerAdmin.use(verifyToken);
routerMembers.use(verifyToken);

// Este endpoint maneja la autenticación del usuario. Compara la contraseña proporcionada con la almacenada en la base de datos.
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

app.use('/uploads/pictures', express.static('uploads/pictures'), verifyToken);

// Este endpoint maneja la subida de archivos de imagen para los miembros del gimnasio
// Una vez que la imagen ha sido subida, su ruta se guarda en la base de datos
routerMembers.post('/:id/upload', upload.single('image_path'), (req, res) => {
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

// Este endpoint devuelve información sobre los usuarios registrados en el sistema.
routerAdmin.get('/', (req, res) => {
  const query = 'SELECT username, email FROM users';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Este endpoint devuelve una lista de todos los miembros del gimnasio.
routerMembers.get('/', (req, res) => {
  const query = 'SELECT * FROM members';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Este endpoint permite buscar miembros por nombre. Busca en los campos first_name y last_name.
routerMembers.get('/search', (req, res) => {
  const { name } = req.query;
  const query = 'SELECT * FROM members WHERE first_name LIKE ? OR last_name LIKE ?';
  db.query(query, [`%${name}%`, `%${name}%`], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Este endpoint permite crear un nuevo miembro en la base de datos.
// También maneja la subida de la imagen del perfil del miembro.
routerMembers.post('/', upload.single('image_path'), (req, res) => {
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

// Este endpoint permite actualizar la información de un miembro existente.
// También maneja la actualización de la imagen del perfil del miembro.
routerMembers.put('/:id', upload.single('image_path'), (req, res) => {
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

// Este endpoint permite eliminar un miembro de la base de datos.
routerMembers.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM members WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Miembro eliminado' });
  });
});

app.use('/api/admin', routerAdmin);
app.use('/api/members', routerMembers);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));