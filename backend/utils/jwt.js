const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      nom: user.nom,
    },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
};

module.exports = {
  signToken,
  verifyToken,
};
