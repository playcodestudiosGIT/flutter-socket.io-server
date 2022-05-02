const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');


const bands = new Bands();

bands.addBand( new Band( 'Queen' ) );
bands.addBand( new Band( 'Metallica' ) );
bands.addBand( new Band( 'Bon Jovi' ) );
bands.addBand( new Band( 'Heroes' ) );

console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    
    client.emit( 'active-bands', bands.getBands() );

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('usuario', (payload)=> {
        console.log('Nombre de Usuario:', payload);

        io.emit( 'mensaje', { admin: 'NUEVO MENSAJE'} );
    });

    client.on('vote-band', (payload) => {
        bands.voteBand( payload.id );
        io.emit( 'active-bands', bands.getBands() );
    });

    client.on( 'add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand( newBand );
        io.emit( 'active-bands', bands.getBands() );
    } );

    client.on('delete-band', (payload) => {

        bands.deleteBand( payload.id );
        io.emit( 'active-bands', bands.getBands() );
    });

    // delete-band

    // client.on('nuevo-mensaje', ( payload ) => {
    //     // console.log(payload);
    //     // io.emit('nuevo-mensaje', payload ); // emite a todos
    //     client.broadcast.emit('nuevo-mensaje', payload);
       
    // });



});
