const express = require('express');
const router = express.Router();

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const TicketService = require('../services/TicketService');
const UserRepository = require('../repositories/UserRepository');
const passport = require('passport');

// Ruta para finalizar compra del carrito
router.post('/:cid/purchase',
    passport.authenticate('jwt-cookie', { session: false }),
    async (req, res) => {
    const { cid } = req.params;
    const userId = req.user._id;

    try {
      // Obtener el carrito completo y poblado con productos
        const cart = await Cart.findById(cid).populate('products.productId');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

      // Lista para productos que no se pudieron comprar
        const productosNoCompradosIds = [];

      // Lista para productos comprados y total a pagar
        const productosComprados = [];
        let totalAmount = 0;

      // Procesar cada producto del carrito
    for (let item of cart.products) {
        const productDoc = item.productId; // ya poblado
        if (!productDoc) continue; // por si acaso

        if (productDoc.stock >= item.quantity) {
          // Stock suficiente: reducir stock
            productDoc.stock -= item.quantity;
            await productDoc.save();

          // Agregar al listado de compras
            productosComprados.push({
            productId: productDoc._id,
            quantity: item.quantity,
            price: productDoc.price || 0 // asumiendo campo price en Product
            });

          totalAmount += (productDoc.price || 0) * item.quantity;
        } else {
          // Stock insuficiente: no se puede comprar este producto
            productosNoCompradosIds.push(productDoc._id);
        }
        }

      // Crear ticket solo si hay productos comprados
        let ticket = null;
        if (productosComprados.length > 0) {
        // Obtener datos del usuario comprador
        const purchaserDTO = await UserRepository.getUserDTOById(userId);
        // Generar ticket con monto total y datos del comprador
        ticket = await TicketService.createTicket(purchaserDTO.email, totalAmount);
        }

      // Actualizar el carrito: solo con los productos NO comprados
        cart.products = cart.products.filter(item => 
        !productosNoCompradosIds.includes(item.productId)
    );

        await cart.save();

        res.json({
        message: 'Compra finalizada',
        ticket: ticket,
        productosNoComprados: productosNoCompradosIds
    });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error durante la compra' });
    }
});

module.exports = router;