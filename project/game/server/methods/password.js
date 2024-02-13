const User = require("../models/user");
const express = require('express');
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'jobdiscoverypact2022@gmail.com',
	  pass: 'PM=Sauveur2022'
	}
  });

function sendPassword(req,res) {
	const {email} = req.body;
	User.findOne({email : email}).exec((err, user) => {
		let errors = [];
		if (user) {
			let password = user.password;
			sendEmailPassword(email, password, req, res, errors);
		}
		else {
			errors.push({msg :'Cet email ne correspond à aucun compte enregistré'});
			res.render('forgot', {errors});
		}
	})
};

function sendEmailPassword(email, password, req, res, errors) {
	let mailOptions = {
		from: 'jobdiscoverypact2022@gmail.com',
		to: email,
		subject: '[Job Discovery] Mot de passe oublié',
		text: 'Votre mot de passe est '+password+'.'
	};
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
			errors.push({msg : "Une erreur est survenue durant l'envoi de l'email merci de réessayer"});
			res.render('forgot', {errors});
		} else {
			console.log('Email sent: ' + info.response);
			req.flash('success_msg', 'Votre nouveau mot de passe vous a été envoyé par email.');
			res.redirect('/users/login');
		}
	});
	  
};

module.exports.sendPassword = sendPassword;
module.exports.sendEmailPassword = sendEmailPassword;