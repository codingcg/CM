const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes
//router.get('/', userController.home);
router.get('/sus', userController.view);
//router.post('/', userController.find);
router.get('/adduser', userController.form);
router.post('/adduser', userController.create);
router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);
router.get('/viewuser/:id', userController.viewall);
router.get('/sheets', userController.sheets);
router.get('/', userController.login);
router.post('/auth', userController.auth);
router.post('/logout', userController.logout);

router.get('/overview', userController.overview);



// Render SHEETS 
router.get('/displayOneSheet/:sheet_id', userController.displayOneSheet);

// store sheet results in db
router.post('/storeAnswer/:currentExercise/:sheet_id', userController.storeAnswer);
router.get('/nextQuestion/:currentExercise/:sheet_id', userController.nextQuestion);


router.get('/:id',userController.delete);




module.exports = router;