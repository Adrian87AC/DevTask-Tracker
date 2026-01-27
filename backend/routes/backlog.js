// backend/routes/backlog.js
const express = require('express');
const router = express.Router();
const backlogController = require('../controllers/backlogController');

router.get('/', backlogController.getBacklog);
router.get('/stats', backlogController.getBacklogStats);
router.delete('/clean', backlogController.cleanOldBacklog);

module.exports = router;