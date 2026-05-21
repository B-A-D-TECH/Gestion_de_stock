const { getConnection } = require('../config/db');

const getAllProducts = async () => {
  const pool = getConnection();
  const [rows] = await pool.query(
    `SELECT p.*, f.nom AS fournisseur_nom
     FROM produits p
     LEFT JOIN fournisseurs f ON p.fournisseur_id = f.id
     ORDER BY p.id DESC`
  );
  return rows;
};

const getProductById = async (id) => {
  const pool = getConnection();
  const [rows] = await pool.query(
    `SELECT p.*, f.nom AS fournisseur_nom
     FROM produits p
     LEFT JOIN fournisseurs f ON p.fournisseur_id = f.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
};

const createProduct = async ({ reference, nom, description, prix, quantite_disponible, seuil_alerte, fournisseur_id }) => {
  const pool = getConnection();
  const [result] = await pool.query(
    `INSERT INTO produits (reference, nom, description, prix, quantite_disponible, seuil_alerte, fournisseur_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [reference, nom, description, prix, quantite_disponible, seuil_alerte, fournisseur_id || null]
  );
  return getProductById(result.insertId);
};

const updateProduct = async (id, fields) => {
  const pool = getConnection();
  const updates = [];
  const values = [];

  Object.entries(fields).forEach(([key, value]) => {
    updates.push(`${key} = ?`);
    values.push(value);
  });
  values.push(id);

  await pool.query(`UPDATE produits SET ${updates.join(', ')} WHERE id = ?`, values);
  return getProductById(id);
};

const deleteProduct = async (id) => {
  const pool = getConnection();
  await pool.query('DELETE FROM produits WHERE id = ?', [id]);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
