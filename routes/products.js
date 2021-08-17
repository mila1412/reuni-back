import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

import {
  newProduct,
  getProduct,
  editProduct,
  getAllProduct,
  getProductById,
  delFile1,
  delFile2,
  delFile3,
  delFile4
} from '../controllers/products.js'

const router = express.Router()

router.post('/', auth, upload, newProduct)
router.get('/', getProduct)
router.get('/all', auth, getAllProduct)
router.get('/:id', getProductById)
router.patch('/:id', auth, upload, editProduct)
router.patch('/:id/image1', auth, delFile1)
router.patch('/:id/image2', auth, delFile2)
router.patch('/:id/image3', auth, delFile3)
router.patch('/:id/image4', auth, delFile4)

export default router