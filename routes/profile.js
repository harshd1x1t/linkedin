const express = require('express');
const router = express.Router();
const { saveProfileData, getAllProfiles, getProfileByName } = require('../controllers/profileController');

// New route to get a single profile by name
router.get('/:name', getProfileByName);


/**
 * @swagger
 * /api/profile/save:
 *   post:
 *     summary: Save a user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - experience
 *             properties:
 *               name:
 *                 type: string
 *               experience:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile saved successfully
 *       400:
 *         description: Incomplete profile data
 */
router.post('/save', saveProfileData);

/**
 * @swagger
 * /api/profile/all:
 *   get:
 *     summary: Get all saved profiles
 *     responses:
 *       200:
 *         description: A list of user profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   experience:
 *                     type: string
 */
router.get('/all', getAllProfiles);

module.exports = router;
