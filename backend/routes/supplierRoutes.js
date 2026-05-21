const express = require('express');
const {
  listSuppliers,
  getSupplier,
  createNewSupplier,
  updateExistingSupplier,
  removeSupplier,
} = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', listSuppliers);
router.get('/:id', getSupplier);
router.post('/', roleMiddleware(['Admin']), createNewSupplier);
router.put('/:id', roleMiddleware(['Admin']), updateExistingSupplier);
router.delete('/:id', roleMiddleware(['Admin']), removeSupplier);

module.exports = router;
