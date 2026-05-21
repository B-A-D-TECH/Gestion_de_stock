const bcrypt = require('bcryptjs');
const { findUserByEmail, createUser } = require('../models/userModel');
const { signToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { nom, email, mot_de_passe, role } = req.body;
    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({ success: false, message: 'Nom, email et mot de passe sont requis.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const user = await createUser({ nom, email, mot_de_passe: hashedPassword, role });
    const token = signToken(user);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;
    if (!email || !mot_de_passe) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe sont requis.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides.' });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides.' });
    }

    const token = signToken(user);
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
