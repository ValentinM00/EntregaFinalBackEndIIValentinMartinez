const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.JWT_SECRET || 'tu_secreto_jwt'; // Usa variable de entorno o valor por defecto

// Función para generar token JWT
function generateToken(user) {
const payload = { id: user._id };
return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

// Ruta para login
router.post('/login', async (req, res) => {
const { email, password } = req.body;

try {
    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = generateToken(user);

    // Guardar token en cookie httpOnly
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Cambia a true si usas HTTPS
        maxAge: 3600000, // 1 hora en milisegundos
        sameSite: 'strict',
    });

    res.json({ message: 'Login exitoso' });
    } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Opcionalmente, puedes agregar una ruta para logout si quieres limpiar la cookie
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout exitoso' });
});

module.exports = router;