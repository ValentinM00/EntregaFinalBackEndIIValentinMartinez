const express = require('express');
const passport = require('passport');
const router = express.Router();

const UserRepository = require('../repositories/UserRepository');

// Ruta para obtener información del usuario actual (solo DTO)
router.get('/current',
    passport.authenticate('jwt-cookie', { session: false }),
    async (req, res) => {
    try {
        const userDTO = await UserRepository.getUserDTOById(req.user._id);
        res.json(userDTO);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
});

// Ejemplo: login (esto depende de tu implementación)
router.post('/login', async (req, res) => {
  // Aquí deberías implementar la lógica de login,
  // verificar credenciales y generar token/cookie
});

// Ejemplo: logout
router.post('/logout', (req, res) => {
  // Lógica para cerrar sesión o eliminar cookies
});

// Rutas protegidas con roles y autenticación

const { authorizeRoles, isAuthenticated } = require('../middlewares/authMiddleware');

// Crear producto (solo admin)
router.post('/products',
    passport.authenticate('jwt-cookie', { session: false }),
    authorizeRoles('admin'),
    async (req, res) => {
    // lógica para crear producto
    res.json({ message: 'Producto creado' });
});

// Agregar producto al carrito (solo usuario)
router.post('/cart/:productId',
    passport.authenticate('jwt-cookie', { session: false }),
    authorizeRoles('user'),
    async (req, res) => {
    // lógica para agregar producto al carrito
    res.json({ message: `Producto ${req.params.productId} agregado al carrito` });
});

module.exports = router;