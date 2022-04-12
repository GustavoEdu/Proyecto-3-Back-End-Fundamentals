const db = require("../models/index");

class UserController {
  static async findUserByEmail(email) {
    const userData = await db.User.findOne({
      where: {
        email: email,
      },
    });

    return userData;
  }

  async findUserByUsername(req, res) {
    const username = req.query.username;
    const userData = await db.User.findOne({
      where: {
        username: username,
      },
    });

    return res.json(userData);
  }

  async getUserView(req, res) {
    const username = req.params.username;
    const userData = await db.User.findOne({
      where: {
        username: username
      }
    });

    if(userData) {
      return res.render("profile", {
        profileCSS: true,
        userData: userData
      });
    } else {
      return res.redirect("/notFound");
    }
  }

  async getEditView(req, res) {
    if(Number(req.params.id) === req.session.idUser) {
      const id = req.params.id;
      const userData = await db.User.findOne({
        where: {
          id: id
        }
      });
      res.json(userData);
    } else {
      return res.redirect("/notAllowed");
    }
  }
}

module.exports = UserController;
