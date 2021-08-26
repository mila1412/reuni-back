import users from '../models/users.js'
import products from '../models/products.js'
import md5 from 'md5'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
    return
  }
  try {
    await users.create( { ...req.body, date: new Date() } )
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else if (error.name === 'MongoError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號或信箱已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
    return
  }
  try {
    const user = await users.findOne({ account: req.body.account }, '')
    if (user) {
      if (user.password === md5(req.body.password)) {
        const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
        user.tokens.push(token)
        user.save({ validateBeforeSave: false })
        res.status(200).send({
          success: true,
          message: '登入成功',
          token,
          email: user.email,
          account: user.account,
          role: user.role,
          birth: user.birth,
          // 登入時回傳購物車數量
          cart: user.cart
        })
      } else {
        res.status(400).send({ success: false, message: '密碼錯誤' })
      }
    } else {
      res.status(400).send({ success: false, message: '帳號錯誤' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const addCart = async (req, res) => {
  try {
    const result = await products.findById(req.body.product)
    if (!result || !result.sell) {
      res.status(404).send({ success: false, message: '資料不存在'})
      return
    }
    const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
    if (idx > -1) {
      req.user.cart[idx].amount += req.body.amount
    } else {
      req.user.cart.push({ product: req.body.product, amount: req.body.amount })
    }
    await req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getCart = async (req, res) => {
  try {
    const { cart } = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(200).send({ success: true, message: '', result: cart })
    // console.log(req.user)
    // console.log(req.user.cart)
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editCart = async (req, res) => {
  try {
    if (req.body.amount <= 0) {
      await users.findOneAndUpdate(
        { 'cart.product': req.body.product },
        {
          $pull: {
            cart: {
              product: req.body.product
            }
          }
        }
      )
    } else {
      await users.findOneAndUpdate(
        { 'cart.product': req.body.product },
        {
          $set: {
            'cart.$.amount': req.body.amount
          }
        }
      )
    }
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    req.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const addFavorite = async (req, res) => {
  try {
    const result = await products.findById(req.body.product)
    if (!result || !result.sell) {
      res.status(404).send({ success: false, message: '資料不存在'})
      return
    }
    const idx = req.user.favorite.findIndex(item => item.product.toString() === req.body.product)
    if (idx > -1) {
      req.user.favorite[idx].amount += 1
    } else {
      req.user.favorite.push({ product: req.body.product, amount: 1 })
    }
    await req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getFavorite = async (req, res) => {
  try {
    const { favorite } = await users.findById(req.user._id, 'favorite').populate('favorite.product')
    res.status(200).send({ success: true, message: '', result: favorite })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const delFavorite = async (req, res) => {
  try {
    await users.findOneAndUpdate(
      { 'favorite.product': req.body.product },
      {
        $pull: {
          favorite: {
            product: req.body.product
          }
        }
      }
    )
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    req.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editProfile = async (req, res) => {
  try {
    const result = await users.findOneAndUpdate({ account: req.user.account }, { account: req.body.account, password: req.body.password, email: req.body.email }, { new: true })
    // req.user.markModified('password')
    // req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else if (error.name === 'MongoError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號或信箱已存在' })
    } else {
      console.log(error)
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getAllUsers = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    const result = await users.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getUserInfo = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: { account: req.user.account, role: req.user.role, email: req.user.email, birth: req.user.birth }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => req.token === token)
    const token = jwt.sign({ _id: req.user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    // 標記陣列文字已修改過，不然不會更新
    req.user.markModified('tokens')
    req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}