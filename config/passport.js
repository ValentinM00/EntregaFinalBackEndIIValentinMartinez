const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

const jwtSecret = 'tu_secreto_jwt'; // Reemplaza con tu secreto

// Estrategia local para login
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'Incorrect email.' });

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Opciones para JWT desde cookie
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies['token']
  ]),
  secretOrKey: jwtSecret,
};

// Estrategia JWT desde cookie
passport.use('jwt-cookie', new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    else return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));