
exports.CriarConta = (req, res) => {
    res.json({ status: 200, result: req.user.local })
}

exports.RealizarLogin = (req, res) => {
    res.json({ status: 200, result: req.user.local })
}

exports.PaginaInicial = (req, res) => {
    res.redirect('/me')
}


exports.CallbackFacebook = () => {
    res.redirect('/me')
}

exports.Deslogar = (req, res) => {
    req.logout();
    res.redirect('/');
}
// route middleware to make sure a user is logged in
exports.redirecionarUsuario = (req, res, next) => {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next()

    // if they aren't redirect them to the home page
    res.redirect('/mapa');
}