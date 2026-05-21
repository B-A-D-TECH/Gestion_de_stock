const express = require('express');
const {
  listProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  removeProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', roleMiddleware(['Admin']), createNewProduct);
router.put('/:id', roleMiddleware(['Admin']), updateExistingProduct);
router.delete('/:id', roleMiddleware(['Admin']), removeProduct);

module.exports = router;
