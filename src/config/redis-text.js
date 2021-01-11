import {
  setValue,
  getValue,
  getHMValue,
  delValue
} from './RedisConfig'

setValue('setValue', 'setValue', 600)

getValue('setValue').then(res => {
  console.log(res)
})

setValue('setObject', {
  name: 'luowei',
  age: 23,
  email: '981311431@qq.com',
})

getHMValue('setObject').then(res => {
  console.log(res)
})

// delValue('setValue')
