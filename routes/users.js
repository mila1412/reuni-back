import express from 'express'
import auth from '../middleware/auth.js'
import {
  register,
  getUserInfo,
  getAllUsers,
  editProfile,
  login,
  logout,
  addCart,
  getCart,
  editCart,
  addFavorite,
  getFavorite,
  delFavorite,
  extend
} from '../controllers/users.js'

const router = express.Router()

router.post('/', register)
router.get('/', auth, getUserInfo)
router.get('/all', auth, getAllUsers)
router.patch('/', auth, editProfile)
router.post('/login', login)
router.delete('/logout', auth, logout)
router.post('/cart', auth, addCart)
router.get('/cart', auth, getCart)
router.patch('/cart', auth, editCart)
router.post('/favorite', auth, addFavorite)
router.get('/favorite', auth, getFavorite)
router.patch('/favorite', auth, delFavorite)
router.post('/extend', auth, extend)

export default router