import mongoose from '@/config/DBHelpler'
import moment from 'moment'

const Schema = mongoose.Schema

const PostSchema = new Schema({
  // https://mongoosejs.com/docs/populate.html
  // 查询其他表, 并且需要排除敏感数据, 例如用户名密码
  // 多表联合查询
  uid: {
    type: String,
    ref: 'users'
  },
  title: { type: String },
  content: { type: String },
  createdTime: { type: String },
  catalog: { type: String },
  fav: { type: String },
  isEnd: { type: String },
  reads: { type: Number },
  answer: { type: Number },
  status: { type: String },
  isTop: { type: String },
  sort: { type: String },
  tags: { type: Array }
})

PostSchema.pre('save', function (next) {
  this.createdTime = moment()
    .format('YYYY-MM-DD HH:mm:ss')
  next()
})

// 静态方法
PostSchema.statics = {
  /**
   * 获取文章列表数据
   * @param {Object} options 筛选条件
   * @param {String} sort 排序方式
   * @param {Number} page 分页页数
   * @param {Number} limit 分页条数
   */
  getList: function (options, sort, page, limit) {
    return this.find(options) // 筛选的参数
      .sort({ [sort]: -1 }) // 排序 根据sort 倒叙排列
      .skip(page * limit) // 跳过多少页 * 每一页的条数
      .limit(limit) // 取跳过之后的条数
      .populate({
        path: 'uid', // https://mongoosejs.com/docs/populate.html 根据 posts中的uid字段, 找到 users中的数据 把以下数据捞出来
        select: 'name isVip pic roles' // 筛选出来的字段
      })
  },
  // 查询本周热议, 回复数量最多, 倒叙排列的列表
  getTopWeek: function () {
    return this.find(
      // 筛选前七天的数据
      {
        'created': {
          // $gte: 大于等于(操作运算符)
          $gte: moment()
            .subtract(7, 'days')
        }
      },
      // 哪些数据需要给到我
      // 筛选需要的字段 0不需要 1需要
      {
        answer: 1,
        title: 1
      }
    )
      .sort({
        answer: -1 // 倒叙排序
      })
      .limit(15)
  }
}

const PostModel = mongoose.model('post', PostSchema)

export default PostModel
