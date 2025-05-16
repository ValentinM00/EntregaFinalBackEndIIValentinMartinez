const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

// Generar código único automáticamente antes de guardar
ticketSchema.pre('save', function(next) {
    if (!this.code) {
    this.code = generateUniqueCode();
}
    next();
});

function generateUniqueCode() {
    return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;