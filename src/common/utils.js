import { getValue } from '@/config/RedisConfig'

export const checkCode = async (key, value) => {
  // 如果key过期了或者取不到
  // redisData返回null
  // 否则返回取到的数据
  const redisData = await getValue(key)
  if (redisData !== null) {
    return value.toLowerCase() === redisData.toLowerCase()
  } else {
    return false
  }
}
