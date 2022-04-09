class AuthController {
    getLoginView(req, res) {
        return res.render("login");
    }
    logIn(req, res) {
        console.log(req.body);
        return res.json("Logging In");
    }
    getSignUpView(req, res) {
        return res.render("signup");
    }
    signUp(req, res) {
        console.log(req.body);
        return res.json("Signing Up");
    }
    logOut(req, res) {
        return res.json("Logging Out");
    }
}

module.exports = AuthController;