import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
  // 测试token：'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLCJleHAiOjE2MzgxMjIwNDQsInVzZXJJZCI6IjQwMjg4MmVkNzRmYmUyMmYwMTc0ZmJlMzFiOGMwMDAwIiwiYXV0aG9yaXRpZXMiOlsiQURNSU4iXSwianRpIjoiOTNkYmRlOTYtZDI4MS00NGFhLWJhODktYmVhMDQ3YmMzYzQ1IiwiY2xpZW50X2lkIjoic3lzIn0.KSkn5vvawm68-QosIluMrQC8cIqS0vHK4G9QuHdBiFxQ8TEMODjKkYcDPeC43lEFRq_K_5Y2bio2Tr2jm_WWRKMmVDi4XX7JMajzsR2hWaGW1jMG48t43KCa-CDhQfMfsyo9TL4hvPY0JQUK2muWzfNOBcWrpWSkRlIKDXqDtyM'
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
