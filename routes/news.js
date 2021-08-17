import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

import {
  postNews,
  getNews,
  getAllNews,
  editNews,
  delFile
} from '../controllers/news.js'

const router = express.Router()

router.post('/', auth, upload, postNews)
router.get('/', getNews)
router.get('/all', auth, getAllNews)
router.patch('/:id', auth, upload, editNews)
router.patch('/:id/image1', auth, delFile)

export default router