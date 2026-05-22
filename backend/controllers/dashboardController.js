const { getConnection } = require('../config/db');
const { getRecentMovements } = require('../models/stockMovementModel');

const getDashboard = async (req, res, next) => {
  try {
    const pool = getConnection();

    // 1. Statistiques Globales
    const [[{ totalProducts }]] = await pool.query('SELECT COUNT(*) AS totalProducts FROM produits');
    const [[{ outOfStock }]] = await pool.query('SELECT COUNT(*) AS outOfStock FROM produits WHERE quantite_disponible <= 0');
    const [[{ lowStock }]] = await pool.query('SELECT COUNT(*) AS lowStock FROM produits WHERE quantite_disponible <= seuil_alerte');
    const [[{ totalQuantity }]] = await pool.query('SELECT IFNULL(SUM(quantite_disponible), 0) AS totalQuantity FROM produits');
    const [[{ totalStockValue }]] = await pool.query('SELECT IFNULL(SUM(prix * quantite_disponible), 0) AS totalStockValue FROM produits');
    const [[{ topProduct }]] = await pool.query('SELECT nom AS topProduct FROM produits ORDER BY quantite_disponible DESC LIMIT 1');
    const [[{ totalEntries }]] = await pool.query("SELECT IFNULL(SUM(quantite), 0) AS totalEntries FROM mouvements_stock WHERE type_mouvement = 'ENTREE'");
    const [[{ totalExits }]] = await pool.query("SELECT IFNULL(SUM(quantite), 0) AS totalExits FROM mouvements_stock WHERE type_mouvement = 'SORTIE'");

    const turnoverRate = totalQuantity > 0 ? Math.round((totalEntries / totalQuantity) * 1000) / 10 : 0;

    // 2. Évolution temporelle (Pour le graphique en courbe - 7 derniers jours)
    const [movementHistory] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d') as date,
        SUM(CASE WHEN type_mouvement = 'ENTREE' THEN quantite ELSE 0 END) as entries,
        SUM(CASE WHEN type_mouvement = 'SORTIE' THEN quantite ELSE 0 END) as exits
      FROM mouvements_stock
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // 3. Mouvements récents
    const recentMovements = await getRecentMovements(5);

    res.json({
      success: true,
      data: {
        totalProducts,
        outOfStock,
        lowStock,
        totalQuantity: totalQuantity || 0,
        totalStockValue,
        topProduct: topProduct?.topProduct || 'Aucun produit',
        turnoverRate,
        totalEntries,
        totalExits,
        movementHistory,
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