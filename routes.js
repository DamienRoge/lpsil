var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var bdd_singleton = require('./bdd_singleton'); // BDD
var fs = require('fs');
var session = require('express-session');
var router = express();


/* Middleware permettant de récupérer les données de la session dans une vue*/
localSession = function(req, res, next) {
    res.locals.session = req.session;
    next();
};

router.get('/',localSession, function (req, res) {
    var sess = req.session;
//Session set when user Request our app via URL
    if(sess.username) {
        /*
         * This line check Session existence.
         * If it existed will do some action.
         */
        res.redirect('/main');
    }
    else {
        res.redirect('/login');
    }
});


router.get('/login', function (req, res) {
    var sess = req.session;
//Session set when user Request our app via URL
    if(sess.username) {
        /*
         * This line check Session existence.
         * If it existed will do some action.
         */
        res.redirect('/main');
    }
    else {
        res.render('login',{session:sess});
    }

});

router.get('/logout', function (req, res) {
    req.session.destroy();

    res.redirect("/login");

});

/*-- TENTATIVE DE LOGIN --*/
router.post('/login', function (req, res) {
    var sess = req.session;
    bdd_singleton.doQuery("SELECT email,nom,prenom,password,id, CONVERT(profilepic USING utf8) as profilepic FROM USERS", function(err,rows,fields){
        if(err){
            console.log(err);
            res.render('login',{session:sess,error_message : "Unable to connect users database, please try later"});
        }
        else
        {
            var rowsLength = rows.length;
            for (var i = 0; i < rowsLength; i++) {
                if(req.body.username == rows[i].email && req.body.password == rows[i].password){
                    //TODO demarrer session
                    sess.username=req.body.username;
                    sess.nom=rows[i].nom;
                    sess.prenom=rows[i].prenom;
                    sess.profilepic=rows[i].profilepic;
                    sess.u_id=rows[i].id;

                    res.redirect('/main');
                }
            }
            if(!("username" in sess))
                res.render('login',{session:sess,error_message : "Bad username/password :("});


        }
    });

});

router.get('/main',localSession,function(req,res){
    var sess = req.session;

    if(sess.username){

        bdd_singleton.doQuery("SELECT * FROM DRAWINGS WHERE u_id="+sess.u_id,function (err,rows,fields) {

            res.render("completed",{session:sess,dessins:rows});

        });

        res.render("main");
    }
    else {
        res.render('login', {session:sess,error_message: "Veuillez vous connecter"});
    }

});


/* On affiche le profile  */
router.get('/profile',localSession, function (req, res) {
    var sess = req.session;
    if(sess.username) {

        bdd_singleton.doQuery("SELECT *,DATE_FORMAT(birthdate, \"%Y-%m-%d\") AS 'birthdate2' FROM USERS WHERE id="+sess.u_id, function(err,rows,fields){
            if(err){
                //console.log(err);
                res.render('profile',{error_message : "Unable to connect users database, please try later"});
            }
            else{
                if(rows[1]!=undefined){
                    res.render('profile',{error_message : "Error, please contact an admin"});

                }
                else {
                    var user_infos = {
                        tel: rows[0].tel,
                        website: rows[0].website,
                        birthdate: rows[0].birthdate2,
                        ville: rows[0].ville,
                        taille: rows[0].taille,
                        couleur: rows[0].couleur,
                        sexe: rows[0].sexe
                    };
                    //TODO Récuperer les infos de l'utilisateur et les passer à la vue
                    res.render('profile', {session: sess, user_infos: user_infos});
                }
            }
        });


    }
    else {
        //res.write("<strong style='color:rgba(255,62,43,0.93)'>Veuillez vous connecter<strong>");
        res.redirect("/login");
    }
});

router.get('/inscription', function(req,res){
    res.render('inscription');
});

router.post('/inscription', function(req,res){

    //TODO echapper tout ça
    var email = req.body.email;
    var prenom = req.body.prenom;
    var nom = req.body.nom;
    var tel = req.body.tel;
    var website = req.body.website;
    var sexe = "";
    if("sexe" in req.body)
        sexe = req.body.sexe;
    var password = req.body.password;
    var birthdate = req.body.birthdate;
    var ville = req.body.ville;
    var taille = req.body.taille;
    var couleur = req.body.couleur.replace("#","");
    var profilepic = req.body.profilepic;




    bdd_singleton.doQuery("SELECT * FROM USERS", function(err,rows,fields){

        if(err){
            console.log(err);
            res.render('inscription',{error_message : "Unable to connect users database, please try later"});
        }
        else{
            var isPresent = false;
            var rowsLength = rows.length;
            for (var i = 0; i < rowsLength; i++) {
                if(req.body.email == rows[i].email){
                    render('inscription',{error_message:"e-mail déjà utilisé"});
                    isPresent=true;
                }
            }
            if(isPresent==false){//Ajout de l'utilisateur
                bdd_singleton.doQuery("INSERT INTO USERS (email, password, nom, prenom, tel, website, sexe, birthdate, ville, taille, couleur, profilepic) VALUES ('" +
                    email+"','"+password+"','"+nom+"','"+prenom+"','"+tel+"','"+website+"','"+sexe+"','"+birthdate+"','"+ville+"',"+taille+",'"+couleur+"','"+profilepic+"')", function(err,rows,fields){
                    if(err){
                        console.log(err);
                        res.render('inscription',{error_message : "Erreur lors de votre inscription, reesayez plus tard"});
                    }else
                    res.redirect("/login");

                });
            }

        }
    });

    });


router.post('/profile', function(req,res){
    var sess = req.session;

    //TODO echapper tout ça
    var email = req.body.email;
    var prenom = req.body.prenom;
    var nom = req.body.nom;
    var tel = req.body.tel;
    var website = req.body.website;
    var sexe = "";
    if("sexe" in req.body)
        sexe = req.body.sexe;
    //var password = req.body.password;
    var birthdate = req.body.birthdate;
    var ville = req.body.ville;
    var taille = req.body.taille;
    var couleur = req.body.couleur.replace("#","");
    var profilepic = req.body.profilepic;



    bdd_singleton.doQuery("UPDATE USERS SET " +
        "email=" +"'"+email+"'"+","+
        "prenom=" +"'"+prenom+"'"+","+
        "nom=" +"'"+nom+"'"+","+
        "tel=" +"'"+tel+"'"+","+
        "website=" +"'"+website+"'"+","+
        "sexe=" +"'"+sexe+"'"+","+
        "birthdate=" +"'"+birthdate+"'"+","+
        "ville=" +"'"+ville+"'"+","+
        "taille=" +taille+","+
        "couleur=" +"'"+couleur+"'"+","+
        "profilepic=" +"'"+profilepic+"'"+" "+
        "WHERE id="+sess.u_id, function(err,rows,fields){

        if(err){
            console.log(err);
            res.render('profile',{session:sess, error_message : "Unable to connect users database, please try later"});
        }
        else{

            sess.username=email;
            sess.nom=nom;
            sess.prenom=prenom;
            sess.profilepic=profilepic;
            res.redirect("/profile");


        }
    });

});


/* PAINT*/

router.get('/paint',function (req,res) {
    var sess = req.session;
    if(sess.username){

        //Loading du mot a dessiner
        fs.readFile(__dirname+"/public/mots.txt", 'utf8',function (err,data) {

            var array_mots = data.split(", ");
            var random_index = Math.floor((Math.random() * array_mots.length) + 1);
            console.log(err);
            console.log(data);
            res.render("paint",{session:sess,mot:array_mots[random_index]});

        });

    }
    else {
        res.render('login', {session:sess,error_message: "Veuillez vous connecter"});
    }});

router.post('/paint',function (req,res) {
    var sess = req.session;

    var commands = req.body.drawingCommands;
    var reponse = req.body.reponse;
    var picture = req.body.picture;
    var laDate = new Date();
    var date = ""+laDate.getFullYear()+"-"+laDate.getMonth()+1+"-"+laDate.getDate()+" "+laDate.getHours()+":"+laDate.getMinutes()+":"+laDate.getSeconds();


    console.log(req.body);

    bdd_singleton.doQuery("INSERT INTO DRAWINGS (u_id,drawingsCommands,reponse,date,picture) VALUES(" +
        sess.u_id+","+
        "'"+commands+"'"+","+
        "'"+reponse+"'"+","+
        "'"+date+"'"+","+
        "'"+picture+"'"+")"
        , function(err,rows,fields){

        if(err){
            console.log(err);
            res.render('profile',{session:sess, error_message : "Unable to connect users database, please try later"});
        }
        else{
            bdd_singleton.doQuery("SELECT MAX(id) AS id FROM DRAWINGS WHERE u_id="+sess.u_id+" GROUP BY u_id",function (err,rows,fields) {

                res.render("completed",{session:sess,picture:picture,d_id:rows[0].id});

            });



        }
    });
});

module.exports = router;
