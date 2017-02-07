module.exports = (app, passport) => {

    app.get('/signup', (req, res) =>{

        res.render('pages/signup', { message: req.flash('signupMessage') })
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/me', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }))    

    app.get('/login', (req, res) =>{

        res.render('pages/login', { message: req.flash('loginMessage') })
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/me', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }))    

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login

    // route for home page
    app.get('/', function(req, res) {
        res.render('pages/home'); // load the login.ejs file
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/me',
            failureRedirect: '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });	
}