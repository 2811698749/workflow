import request from '@/utils/request'
import axios from 'axios'
import qs from 'qs'
import settings from '@/settings'

export function login(data) {
  return axios({
    url: process.env.VUE_APP_BASE_API + '/auth/oauth/token',
    method: 'post',
    data: qs.stringify({ ...data, 'grant_type': 'password' }),
    auth: { 'username': settings.clientId, 'password': 'user-secret-8888' },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function autoLogin(data) {
  return axios({
    // url: process.env.VUE_APP_BASE_API + '/auth/oauth/token',
    url: settings.gateWayUrl + '/oauth/token',
    method: 'post',
    data: qs.stringify({ 'grant_type': 'authorization_code', 'code': data.code, 'client_id': data.client_id, 'client_secret': data.client_secret, 'redirect_uri': settings.redirectUri }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function getInfo() {
  return request({
    url: settings.gateWayUrl + '/auth/user/current',
    // url: '/auth/user/current',
    method: 'get',
    params: { 'systemId': settings.clientId }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
