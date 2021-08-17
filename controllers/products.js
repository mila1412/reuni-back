import products from '../models/products.js'

export const newProduct = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
    return
  }
  try {
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      sell: req.body.sell,
      image1: req.filepath1,
      image2: req.filepath2,
      image3: req.filepath3,
      image4: req.filepath4,
      category: req.body.category,
      date: req.body.date
    })
    res.status(200).send({ success: true, message: '', result })
    console.log(result)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      let message = error.errors[key].message
      if (key === 'category') {
        message = '分類不能為空'
      }
      res.status(400).send({ success: false, message: message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤'})
    }   
  }
}

// 上架
export const getProduct = async (req, res) => {
  try {
    const result = await products.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 全部
export const getAllProduct = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    const result = await products.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 個別
export const getProductById = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無商品' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const editProduct = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    const data = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      sell: req.body.sell,
      category: req.body.category,
      date: req.body.date
    }
    if (req.filepath1) data.image1 = req.filepath1
    if (req.filepath2) data.image2 = req.filepath2
    if (req.filepath3) data.image3 = req.filepath3
    if (req.filepath4) data.image4 = req.filepath4
    const result = await products.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else {
      console.log(error)
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const delFile1 = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    await products.findByIdAndUpdate(req.params.id, {
      $unset: {
        image1: ""
      }
    })
    res.status(200).send({ success: true, message: '' })
    // console.log(req.params.id)
    // console.log(req.user)
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無圖片' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const delFile2 = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    await products.findByIdAndUpdate(req.params.id, {
      $unset: {
        image2: ""
      }
    })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無圖片' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const delFile3 = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    await products.findByIdAndUpdate(req.params.id, {
      $unset: {
        image3: ""
      }
    })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無圖片' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const delFile4 = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    await products.findByIdAndUpdate(req.params.id, {
      $unset: {
        image4: ""
      }
    })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無圖片' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
