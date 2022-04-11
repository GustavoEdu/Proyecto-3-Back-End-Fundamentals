const db = require("../models/index");
const UserController = require("./users");

class AuthController {
    getLoginView(req, res) {
        const token = req.csrfToken();
        const status = req.flash("status");

        return res.render("login", {
            status: {
                show: status.length > 0,
                messages: status
            },
            csrfToken: token
        });
    }
    async logIn(req, res) {
        const credenciales = req.body;
        const userData = await UserController.findUserByEmail(credenciales.email);

        if(userData) {
            const user = userData.dataValues;
            if(user.password === credenciales.password) {
                req.session.loggedIn = true;
                req.session.username = user.username;
                req.session.idUser = user.id;

                return res.redirect("/chats");
            } else {
                return res.render("login", {
                    isError: true,
                    errors: ["Credenciales incorrectas"],
                    csrfToken: req.csrfToken()
                });
            }
        }

        return res.render("login", {
            isError: true,
            errors: ["Usuario no registrado"],
            csrfToken: req.csrfToken()
        })
    }
    getSignUpView(req, res) {
        const token = req.csrfToken();

        return res.render("signup", {
            csrfToken: token
        });
    }

    async signUp(req, res) {
        const validation = this.validate(req.body);
        if(!validation.isError) {
            try {
                const newUser = await db.User.create(req.body);
                req.flash("status", ["Usuario registrado exitosamente", "Por favor inicia sesión"]);
                return res.redirect("/auth/login");
            } catch(error) {
                const errors = error.errors.map(e => e.type === "unique violation" ?
                    `El ${e.path} '${e.value}' ya está en uso` :
                    e.message
                );

                return res.render("signup", {
                    isError: true,
                    errors: errors,
                    user: req.body,
                    csrfToken: req.csrfToken()
                });
            }
        } else {
            return res.render("signup", {
                isError: true,
                errors: validation.errors,
                user: req.body,
                csrfToken: req.csrfToken()
            });
        }
    }

    logOut(req, res) {
        req.session.destroy();
        return res.redirect("/auth/login");
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