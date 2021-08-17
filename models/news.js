import mongoose from 'mongoose'

const Schema = mongoose.Schema

const newsSchema = new Schema({
  title: {
    type: String,
    required: [true, '標題不能為空'],
    minlength: [1, '標題不能為空']
  },
  description: {
    type: String,
    required: [true, '標題不能為空'],
  },
  image1: {
    type: String
  },
  post : {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    required: [true, '發布日期不能為空']
  }
}, { versionKey: false })

export default mongoose.model('news', newsSchema)