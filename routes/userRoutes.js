import express from 'express'
import userController from '../controllers/userController.js'
import authjwt from '../middlewares/isAuth.js'
const router = express.Router()

router.post('/signup',userController.signup)
router.post('/login',userController.login)
router.get('/signup',userController.signupPage)
router.get('/login',userController.loginPage)
router.get('/',userController.loginPage)
router.get('/users',authjwt,userController.getUsers)
router.get('/chat/user/:id',authjwt,userController.chat)
router.get('/logout',authjwt,userController.logout)
export default router