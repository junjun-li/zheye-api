import path from 'path'

const dbUrl = 'mongodb://test:123456@121.37.183.14:27017/testdb'

const redis = {
  host: '121.37.183.14',
  port: '15001',
  password: 'l11776174'
}

// const redis = {
//   host: '127.0.0.1',
//   port: '6379',
//   // password: 'l11776174',
// }

const jwtSecret = 'A,+fFU4XoDo7&yBjCC.a2utGfajQB6+CZ-3;.e;_#E3p23PUM#'

const uploadPath = process.env.NODE_ENV === 'production'
  ? '/app/public'
  : path.join(path.resolve(__dirname), '../../public')

export default {
  dbUrl,
  redis,
  jwtSecret,
  uploadPath
}
