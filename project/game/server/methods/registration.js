const User = require("../models/user");
const express = require('express');

function assessingRegistration(req) {
	const {name,email, secteur, password, password2} = req.body;
	let errors = [];
	
	if(!name || !email || !secteur || !password || !password2)
		errors.push({msg : 'Merci de remplir tous les champs'})

	//Verification des mots de passe
	if(password !== password2)
		errors.push({msg : 'Vos mots de passe ne correspondent pas'});
	
	//Vérification de la longueur du mot de passe
	if(password.length < 6 )
		errors.push({msg : 'Veuillez choisir un mot de passe dont la longueur est supérieure à 6 caractères'})
	
	return errors;
};

function saveToDB(req, res) {
	const {name, email, secteur, password, password2 } = req.body;

	console.log("Saving...");
	User.findOne({email : email}).exec((err, user) => {
		let errors =[];  
		if(user) {
			errors.push({msg: 'Cet email est déjà utilisé'});
			res.render('register',{errors, name, email, secteur, password, password2})  
		}
		else {
			const newUser = new User({ name, email, secteur, password });
			//Sauvegarde au sein de MongoDB de l'utilisateur
			newUser.save()
			.then( value => {
				console.log(value)
				req.flash('success_msg','Félicitations, vous êtes désormais inscrit!');
				res.redirect('/users/login');
			})
			.catch(value => console.log(value));
	   }
	});
};

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated())
		return next();
	req.flash('error_msg' , 'Merci de bien vouloir vous connecter pour accéder à cette page');
	res.redirect('/users/login');
};

function isAlreadyAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect('/dashboard');
	}
	return next();
};

function updateControl(req) {
    let errors = [];
    const oldemail = req.body.oldemail;
    const oldpassword = req.body.oldpassword;
    const newpassword = req.body.newpassword;
    const newpassword2 = req.body.newpassword2;
    if (req.user.email == oldemail) {
        if (!(oldpassword==req.user.password)) { 
            errors.push({msg :'Merci de rentrer le bon ancien  mot de passe'});
        }
        if ((newpassword.length > 0) && (newpassword.length < 6)) {
            errors.push({msg : 'Votre nouveau mot de passe doit faire au moins 6 caractères'});
        }
        if (!(newpassword2==newpassword)) {
            errors.push({msg: 'Les deux nouveaux mots de passe ne correspondent pas'});
        }
	}
    else {
            errors.push({msg : 'Merci de rentrer le bon ancien mail'})
        }
    return errors;
};

function updateAccount(req, res) {
    const newpseudo = req.body.newname;
    const newemail = req.body.newemail;
    const secteur = req.body.secteur;
    const newpassword = req.body.newpassword;
    if (!(secteur=='')) {
       req.user.secteur = secteur;
    }
    if (!(newemail=='')) {
        req.user.email = newemail;
    }
    if (!(newpseudo=='')) {
        req.user.name = newpseudo;
    }
    if (newpassword.length > 5) {
        req.user.password = newpassword;
    }
    req.user.save()
    req.flash('success_msg','Félicitations, votre profil a été modifié!');
	res.redirect('/users/success');
}



module.exports.assessingRegistration = assessingRegistration;
module.exports.saveToDB = saveToDB;
module.exports.ensureAuthenticated = ensureAuthenticated;
module.exports.isAlreadyAuthenticated = isAlreadyAuthenticated;
module.exports.updateAccount = updateAccount;
module.exports.updateControl = updateControl;