const { getConnection } = require('../config/db');

const findUserByEmail = async (email) => {
  const pool = getConnection();
  const [rows] = await pool.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const pool = getConnection();
  const [rows] = await pool.query('SELECT id, nom, email, role, created_at FROM utilisateurs WHERE id = ?', [id]);
  return rows[0];
};

const createUser = async ({ nom, email, mot_de_passe, role = 'Utilisateur' }) => {
  const pool = getConnection();
  const [result] = await pool.query(
    'INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
    [nom, email, mot_de_passe, role]
  );
  return { id: result.insertId, nom, email, role };
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
