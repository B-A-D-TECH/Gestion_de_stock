const { getConnection } = require('../config/db');

const getAllSuppliers = async () => {
  const pool = getConnection();
  const [rows] = await pool.query('SELECT * FROM fournisseurs ORDER BY id DESC');
  return rows;
};

const getSupplierById = async (id) => {
  const pool = getConnection();
  const [rows] = await pool.query('SELECT * FROM fournisseurs WHERE id = ?', [id]);
  return rows[0];
};

const createSupplier = async ({ nom, contact, telephone, email, adresse }) => {
  const pool = getConnection();
  const [result] = await pool.query(
    'INSERT INTO fournisseurs (nom, contact, telephone, email, adresse) VALUES (?, ?, ?, ?, ?)',
    [nom, contact, telephone, email, adresse]
  );
  return getSupplierById(result.insertId);
};

const updateSupplier = async (id, fields) => {
  const pool = getConnection();
  const updates = [];
  const values = [];

  Object.entries(fields).forEach(([key, value]) => {
    updates.push(`${key} = ?`);
    values.push(value);
  });
  values.push(id);

  await pool.query(`UPDATE fournisseurs SET ${updates.join(', ')} WHERE id = ?`, values);
  return getSupplierById(id);
};

const deleteSupplier = async (id) => {
  const pool = getConnection();
  await pool.query('DELETE FROM fournisseurs WHERE id = ?', [id]);
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
