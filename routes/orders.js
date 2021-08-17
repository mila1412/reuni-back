import express from 'express'
import auth from '../middleware/auth.js'
import {
  checkout,
  getOrders,
  getAllOrders,
  getSingleOrder
} from '../controllers/orders.js'

const router = express.Router()

router.post('/checkout', auth, checkout)
router.get('/', auth, getOrders)
router.get('/all', auth, getAllOrders)
router.get('/:id', auth, getSingleOrder)

export default router