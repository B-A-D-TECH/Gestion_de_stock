const express = require('express');
const { getDashboard } = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getDashboard);

module.exports = router;
