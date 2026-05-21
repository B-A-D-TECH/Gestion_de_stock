const { getConnection } = require('../config/db');
const { getRecentMovements } = require('../models/stockMovementModel');

const getDashboard = async (req, res, next) => {
  try {
    const pool = getConnection();

    const [[{ totalProducts }]] = await pool.query('SELECT COUNT(*) AS totalProducts FROM produits');
    const [[{ outOfStock }]] = await pool.query('SELECT COUNT(*) AS outOfStock FROM produits WHERE quantite_disponible <= 0');
    const [[{ lowStock }]] = await pool.query('SELECT COUNT(*) AS lowStock FROM produits WHERE quantite_disponible <= seuil_alerte');
    const [[{ totalQuantity }]] = await pool.query('SELECT SUM(quantite_disponible) AS totalQuantity FROM produits');
    const [[{ totalEntries }]] = await pool.query("SELECT IFNULL(SUM(quantite), 0) AS totalEntries FROM mouvements_stock WHERE type_mouvement = 'ENTREE'");
    const [[{ totalExits }]] = await pool.query("SELECT IFNULL(SUM(quantite), 0) AS totalExits FROM mouvements_stock WHERE type_mouvement = 'SORTIE'");

    const recentMovements = await getRecentMovements(5);

    res.json({
      success: true,
      data: {
        totalProducts,
        outOfStock,
        lowStock,
        totalQuantity: totalQuantity || 0,
        totalEntries,
        totalExits,
        recentMovements,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};
