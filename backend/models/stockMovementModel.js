const { getConnection } = require('../config/db');

const createStockMovement = async ({ produit_id, utilisateur_id, type_mouvement, quantite, quantite_avant, quantite_apres, note }) => {
  const pool = getConnection();
  const [result] = await pool.query(
    `INSERT INTO mouvements_stock (produit_id, utilisateur_id, type_mouvement, quantite, quantite_avant, quantite_apres, note)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [produit_id, utilisateur_id, type_mouvement, quantite, quantite_avant, quantite_apres, note]
  );
  return { id: result.insertId, produit_id, utilisateur_id, type_mouvement, quantite, quantite_avant, quantite_apres, note };
};

const getStockMovements = async () => {
  const pool = getConnection();
  const [rows] = await pool.query(
    `SELECT m.*, p.nom AS produit_nom, u.nom AS utilisateur_nom
     FROM mouvements_stock m
     LEFT JOIN produits p ON m.produit_id = p.id
     LEFT JOIN utilisateurs u ON m.utilisateur_id = u.id
     ORDER BY m.created_at DESC`
  );
  return rows;
};

const getRecentMovements = async (limit = 5) => {
  const pool = getConnection();
  const [rows] = await pool.query(
    `SELECT m.*, p.nom AS produit_nom, u.nom AS utilisateur_nom
     FROM mouvements_stock m
     LEFT JOIN produits p ON m.produit_id = p.id
     LEFT JOIN utilisateurs u ON m.utilisateur_id = u.id
     ORDER BY m.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

module.exports = {
  createStockMovement,
  getStockMovements,
  getRecentMovements,
};
