import { getValue } from '@/config/RedisConfig'
import jwt from 'jsonwebtoken'
import config from '@/config'
import fs from 'fs'
import path from 'path'

export const checkCode = async (key, value) => {
  // 如果key过期了或者取不到
  // redisData返回null
  // 否则返回取到的数据
  const redisData = await getValue(key)
  if (redisData !== null) {
    return value.toLowerCase() === redisData.toLowerCase()
  }
  else {
    return false
  }
}

export const getJWTPayload = (token) => {
  return jwt.verify(token.split(' ')[1], config.jwtSecret)
}

// fs.stats 判断一个文件夹是否存在
const getStats = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, status) => {
      if (err) {
        resolve(false)
      }
      else {
        resolve(status)
      }
    })
  })
}

const mkdir = (dir) => {
  return new Promise((resolve) => {
    fs.mkdir(dir, err => err ? resolve(false) : resolve(true))
  })
}

export const dirExists = async (dir) => {
  const isExists = await getStats(dir)
  // 如果该路径存在且不是文件, 返回true
  if (isExists && isExists.isDirectory()) {
    return true
  }
  else if (isExists) {
    // 路径存在, 但是这是一个文件, 返回false
    return false
  }
  // 如果该路径不存在
  // 循环遍历, 递归判断如果上级目录不存在, 则产生上级目录
  const tempDir = path.parse(dir).dir

  const status = await dirExists(tempDir)
  if (status) {
    return await mkdir(dir)
  } else {
    return false
  }
}
