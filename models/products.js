import mongoose from 'mongoose'

const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, '商品名稱不能為空'],
    minlength: [1, '商品名稱不能為空']
  },
  price: {
    type: Number,
    required: [true, '價格不能為空'],
    minlength: [0, '價格不能為負數']
  },
  description: {
    type: String
  },
  image1: {
    type: String
  },
  image2: {
    type: String
  },
  image3: {
    type: String
  },
  image4: {
    type: String
  },
  sell: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['千層蛋糕', '軟餅乾', '雪Q餅', '瑪德蓮', '檸檬塔', '香橙醬']
  },
  date: {
    type: Date,
    required: [true, '上架時間不能為空']
  }
}, { versionKey: false })

export default mongoose.model('products', productSchema)