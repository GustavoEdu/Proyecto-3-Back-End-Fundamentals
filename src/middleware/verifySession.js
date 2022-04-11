function verifySession(req, res, next) {
  if(!req.session.loggedIn) {
    return res.redirect("/notAllowed");
  }

  next();
}

module.exports = verifySession;