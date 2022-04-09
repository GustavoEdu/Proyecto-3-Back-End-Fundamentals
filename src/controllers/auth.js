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
        const validation = this.validate(req.body);
        if(!validation.isError) {
            res.json("Signing in a user");
        } else {
            res.json(validation);
        }
    }

    logOut(req, res) {
        return res.json("Logging Out");
    }

    validate(userData) {
        let result = { isError: false, errors: [] };

        if(!(userData.name && userData.username && userData.birthday && userData.profilePic && userData.email && userData.password && userData.passwordRepeated)) {
            result.isError = true;
            result.errors.push("Rellena todos los campos");
        }
        if(userData.password !== userData.passwordRepeated) {
            result.isError = true;
            result.errors.push("Las contraseñas no coinciden");
        }

        return result;
    }
}

module.exports = AuthController;