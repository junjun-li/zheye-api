const db_url = 'mongodb://test:123456@121.37.183.14:27017/testdb'

const redis = {
  host: '121.37.183.14',
  port: '15001',
  password: 'l11776174',
}

// const redis = {
//   host: '127.0.0.1',
//   port: '6379',
//   // password: 'l11776174',
// }

const jwtSecret = `A,+fFU4XoDo7&yBjCC.a2utGfajQB6+CZ-3;.e;_#E3p23PUM#`

export default {
  db_url,
  redis,
  jwtSecret,
}
