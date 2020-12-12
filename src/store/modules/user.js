import { login, getInfo, autoLogin } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import errGif from '@/assets/401_images/401.gif'
import settings from '@/settings'

const state = {
  token: getToken(),
  user: {},
  name: '',
  dept: {},
  avatar: '',
  roles: [],
  permissions: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_DEPT: (state, dept) => {
    state.dept = dept
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        // console.log(response)
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user autologin
  autologin({ commit }, obj) {
    return new Promise((resolve, reject) => {
      const da = {
        'code': obj.code,
        'client_id': obj.client_id,
        'client_secret': obj.client_secret
      }
      autoLogin(da).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        // console.log(response)
        const data = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, person, avatar } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        const user = {
          userId: data.userId,
          account: data.account,
          person: { name: person.name }
        }
        commit('SET_USER', user)
        commit('SET_ROLES', roles.map(item => item.enName))
        commit('SET_PERMISSIONS', roles.flatMap(item => item.permissions).filter(item => item.type === '3').flatMap(item => item.enName))
        commit('SET_NAME', person.name)
        commit('SET_DEPT', person.depts[0])
        commit('SET_AVATAR', avatar || errGif)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    removeToken()
    resetRouter()
    dispatch('tagsView/delAllViews', null, { root: true })
    // const redirect_uri = settings.redirectUri
    const url = settings.oauthDoMain + '/logout?redirectUri=' + settings.redirectUri
    window.location.href = url
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     commit('SET_TOKEN', '')
    //     commit('SET_ROLES', [])
    //     removeToken()
    //     resetRouter()
    //
    //     // reset visited views and cached views
    //     // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    //     dispatch('tagsView/delAllViews', null, { root: true })
    //
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
