const KEY = 'heimamm60_token'

// 保存token
const saveToken = token => {
  localStorage.setItem(KEY, token)
}

// 获取token
const getToken = () => {
  return localStorage.getItem(KEY)
}

// 删除token
const removeToken = () => {
  localStorage.removeItem(KEY)
}

// 按需导出
export { saveToken, getToken, removeToken }
