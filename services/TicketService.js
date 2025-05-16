const Ticket = require('../models/Ticket');

class TicketService {
    async createTicket(purchaserEmail, totalAmount) {
    const ticketData = {
        purchaser: purchaserEmail,
        amount: totalAmount,
    };
    const ticket = new Ticket(ticketData);
    await ticket.save();
    return ticket;
    }
}

module.exports = new TicketService();