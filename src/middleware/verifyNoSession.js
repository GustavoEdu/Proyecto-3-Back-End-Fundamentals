function verifyNoSession(req, res, next) {
  if(req.session.loggedIn) {
    return res.redirect(`/users/${req.session.username}`);
  }

  next();
}

module.exports = verifyNoSession;