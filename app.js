const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');

require('./config/passport'); // Configuración de Passport

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(session({ secret: 'tu-secreto', resave: false, saveUninitialized: true }));

mongoose.connect('mongodb://localhost/tu_base_de_datos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

const sessionsRoutes = require('./routes/sessions');

app.use('/api/sessions', sessionsRoutes);

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});