import orders from '../models/orders.js'

export const checkout = async (req, res) => {
  try {
    if (req.user.cart.length > 0) {
      await orders.create({ user: req.user._id, products: req.user.cart, delivery: req.body.delivery, name: req.body.name, phone: req.body.phone, email: req.body.email, date: new Date() })
      req.user.cart = []
      req.user.save({ validateBeforeSave: false })
    }
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getOrders = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id }).populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getSingleOrder = async (req, res) => {
  try {
    const result = await orders.findById(req.params.id).populate('products.product').lean()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllOrders = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    const result = await orders.find().populate('user', 'account').populate('products.product', 'name price').lean()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: true, message: '伺服器錯誤' })
  }
}
