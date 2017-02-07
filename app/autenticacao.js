module.exports = (app, passport) => {

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/mapa', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }))    

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/mapa', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }))    

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login

    // route for home page
    app.get('/', function(req, res) {

        res.render('pages/home', { login_message: req.flash('loginMessage'), signup_message: req.flash('signupMessage') }); // load the login.ejs file
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/mapa',
            failureRedirect: '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });	
}