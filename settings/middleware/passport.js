const passport = require('passport');

const JwtStategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('../db');
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'i love apets'
}

module.exports = passport => {
    passport.use(
        new JwtStategy(options, (payload, done) => {
            try {
                db.query("select id, email from user where id = ?", payload.userId, (error, rows, fiels) => {
                    if(error) {
                        console.log(error);
                    } else {
                        const user = rows;
                        if(user) {
                            done(null, user);
                        } else {
                            done(null, false);
                        } 
                    }
                })
            } catch(e) {
                console.log(e);
            }
        })
    )
}