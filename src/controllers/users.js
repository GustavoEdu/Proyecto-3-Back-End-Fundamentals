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
      res.render("profile", {
        profileCSS: true,
        userData: userData
      });
    } else {
      res.redirect("/notFound");
    }
  }
}

module.exports = UserController;
