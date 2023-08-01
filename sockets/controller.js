const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();


const socketController = (socket) => {

    // Cuando un cliente se conecta
    socket.emit( 'last-ticket', ticketControl.last );
    socket.emit( 'current-status', ticketControl.last4 );
    socket.emit( 'pending-tickets', ticketControl.tickets.length );

    socket.on('next-ticket', ( payload, callback ) => {
        
        const next = ticketControl.next();
        callback( next );
        socket.broadcast.emit( 'pending-tickets', ticketControl.tickets.length );

    })

    socket.on( 'answer-ticket', ( { desk }, callback ) => {

        if ( !desk ) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.attentionTicket( desk );

        
        socket.broadcast.emit( 'current-status', ticketControl.last4 );
        socket.emit( 'pending-tickets', ticketControl.tickets.length );
        socket.broadcast.emit( 'pending-tickets', ticketControl.tickets.length );

        if ( !ticket ) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            });
        }
    })

}


module.exports = {
    socketController
}

