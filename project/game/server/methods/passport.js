const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;


module.exports = function(passport) {
	passport.use (
		new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
			//Vérification de l'adresse mail

			console.log("Fetching...");
			User.findOne({email})
			.then( user => {
				if(!user)
					return done(null, false, {message:"Cet email n'est attribué à aucun compte"});
				
				//Vérification des mots de passe
				if(password == user.password)
					return done(null, user);
				else
					return done(null, false, {message: 'Le mot de passe est incorrect'});
			})
			.catch(err => { console.log(err) })
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id,done) => {
		User.findById(id, (err,user) => {
			done(err, user);
		});
	});
}