const express = require('express');
const { addStock, listMovements } = require('../controllers/stockController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/movements', listMovements);
router.post('/', roleMiddleware(['Admin', 'Utilisateur']), addStock);

module.exports = router;
