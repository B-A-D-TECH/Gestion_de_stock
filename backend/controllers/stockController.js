const { getProductById, updateProduct } = require('../models/productModel');
const { createStockMovement, getStockMovements } = require('../models/stockMovementModel');

const addStock = async (req, res, next) => {
  try {
    const { produit_id, quantite, type_mouvement, note } = req.body;
    const utilisateur_id = req.user.id;

    const product = await getProductById(produit_id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
    }

    if (!['ENTREE', 'SORTIE'].includes(type_mouvement)) {
      return res.status(400).json({ success: false, message: 'Type de mouvement invalide.' });
    }

    const qty = Number(quantite);
    if (qty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantité doit être positive.' });
    }

    const quantite_avant = product.quantite_disponible;
    const quantite_apres = type_mouvement === 'ENTREE'
      ? quantite_avant + qty
      : quantite_avant - qty;

    if (quantite_apres < 0) {
      return res.status(400).json({ success: false, message: 'Stock insuffisant pour cette sortie.' });
    }

    await updateProduct(produit_id, { quantite_disponible: quantite_apres });
    const mouvement = await createStockMovement({
      produit_id,
      utilisateur_id,
      type_mouvement,
      quantite: qty,
      quantite_avant,
      quantite_apres,
      note,
    });

    res.status(201).json({ success: true, data: mouvement });
  } catch (error) {
    next(error);
  }
};

const listMovements = async (req, res, next) => {
  try {
    const movements = await getStockMovements();
    res.json({ success: true, data: movements });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addStock,
  listMovements,
};
