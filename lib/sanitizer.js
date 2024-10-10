function user(user) {
  const sanitizedUser = user.toObject();
  delete sanitizedUser.password;
  return sanitizedUser;
}

const sanitizer = { user };

module.exports = sanitizer;
