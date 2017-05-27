'use strict';

const express = require("express");
const models = require("../models");
var fs = require('fs');
var jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/login/:acc/:passwd', function(req, res){
    models.user.find({
        where : {
            email: req.params.acc,
            password: req.params.passwd
        }
    }).then(function(result){
        if(result){
            var passwd = fs.readFileSync('configuration/passphrasetoken').toString();
            var token = jwt.sign({ data: result.lastname+"_"+result.firstname+"_authOK" }, passwd, { expiresIn: '12h' });
            var print = JSON.stringify({
                token: token
            }, null, 3);
            res.send(print);
        } else {
            res.send(JSON.stringify({
                message: "Error while authenticating. Maybe wrong account or password."
            }))
        }
    }).catch(function(err){
        if(err){
            res.send(JSON.stringify({
                message: "Error while authenticating."
            }));
            throw err;
        } 
    });    
});

router.get('/resetpwd/:email', function(req, res){
    models.user.find({
        where : {
            email: req.params.email
        }
    }).then(function(result){
        if(result){
            var newPassword = generatePassword(10);

            models.user.update({
                password: newPassword
            }, {
                where: {
                    email: req.params.email
                }
            }).then(function(updateResult){
                if(updateResult){
                    res.send(JSON.stringify({
                        success: true,
                        message: "Password successfully updated."
                    }));
                }
            }).catch(function(updateErr){
                if(updateErr){
                    res.send(JSON.stringify({
                        success: false,
                        message: "Error while updating password."
                    }));
                    throw err;
                } 
            })

        } else {
            res.send(JSON.stringify({
                success: false,
                message: "Error while resetting password. No account with this email."
            }))
        }
    }).catch(function(err){
        if(err){
            res.send(JSON.stringify({
                success: false,
                message: "Error while reseting password."
            }));
            throw err;
        } 
    });
})

//Générateur de mot de passe aléatoire
function generatePassword(length) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
module.exports = router;