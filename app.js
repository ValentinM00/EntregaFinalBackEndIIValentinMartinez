require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor en puerto ${process.env.PORT || 3000}`);
});