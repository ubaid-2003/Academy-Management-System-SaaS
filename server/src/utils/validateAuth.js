// validateAuth.js
const validateRegister = ({ firstName, lastName, email, password, confirmPassword }) => {
  const errors = [];

  if (!firstName || !lastName) errors.push("Full name is required");
  if (!email) errors.push("Email is required");
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push("Invalid email format");

  if (!password) errors.push("Password is required");
  else if (password.length < 6) errors.push("Password must be at least 6 characters");

  if (!confirmPassword) errors.push("Confirm password is required");
  else if (password !== confirmPassword) errors.push("Passwords do not match");

  return errors;
};

const validateLogin = ({ email, password }) => {
  const errors = [];
  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");
  return errors;
};

module.exports = { validateRegister, validateLogin };
