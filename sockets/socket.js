const {io} = require("../index");
const Bands = require("../models/bands");
const Band = require("../models/band");

const bands = new Bands();

bands.addBand(new Band("Binomio de Oro"));
bands.addBand(new Band("Los Diablitos"));
bands.addBand(new Band("Los Embajadores Vallenatos"));
bands.addBand(new Band("Los Hermanos Zuleta"));
bands.addBand(new Band("Jean Carlos Centeno"));

// Mensajes de Sockets
io.on('connection', client => {
    console.log("Cliente conectado!");

    client.emit("active-bands", bands.getBands());
    
    client.on('disconnect', () => {
        console.log("Cliente desconectado!");
    });

    client.on("mensaje", (payload) => {
        console.log("Mensaje!!!", payload);
        
        io.emit("mensaje", {admin: "Nuevo mensaje desde el servidor"});
    })

    client.on("vote-band", (payload) => {
        bands.voteBand(payload.id);
        io.emit("active-bands", bands.getBands());
        //client.broadcast.emit("nuevo-mensaje", payload);
    });

    client.on("add-band", (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit("active-bands", bands.getBands());
    });

    client.on("delete-band", (payload) => {
        bands.deleteBand(payload.id)
        io.emit("active-bands", bands.getBands());
    });

   /*  client.on("emitir-mensaje", (payload) => {
        //console.log(payload);
        client.broadcast.emit("nuevo-mensaje", payload);
    }); */
});