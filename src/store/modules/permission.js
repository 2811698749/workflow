/* eslint-disable */
import {asyncRoutes, constantRoutes} from '@/router'
import Layout from "@/layout/index";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}


function constructAsyncRoutes(permissions) {
  console.log(permissions)
  let routers = [];
  for (let i = 0; i < permissions.length; i++) {
    let item = permissions[i];
    let parentId = item.parentId;
    if (parentId) {
      let index = permissions.findIndex(it => it.permissionId === parentId);
      if (index === -1) {
        routers.push(item)
      } else {
        let parent = permissions[index];
        parent.children = parent.children || [];
        parent.children.push(item);
      }
    } else {
      routers.push(item)
    }
  }
  return routers;
}

function constructStandardRouter(permissions, isChild) {
  if (!permissions || !permissions.length) return;
  return permissions.map(item => {
    if (isChild) {
      return {
        path: item.routeName ? item.routeName: item.httpUrl,//菜单的路径
        component: resolve => require([`@/views/${item.componentPath}`], resolve),
        name: item.enName,//菜单名称
        hidden: item.hidden,
        meta: {
          title: item.name,//菜单的标题
          icon: item.icon,

          key: item.permissionId,
          noCache: !item.catch
        },
        children: constructStandardRouter(item.children, true)
      }
    } else {//第一级路由 需要加layout组件
      return {
        path: item.routeName,//菜单的路径
        component: Layout,//菜单地址
        name: item.enName,//菜单名称
        hidden: item.hidden,
        meta: {
          title: item.name,//菜单的标题
          icon: item.icon,
          key: item.permissionId,
          noCache: !item.catch
        },
        children: constructStandardRouter(item.children, true)
      }
    }
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({commit}, roles) {
    return new Promise(resolve => {
      let permissions = []
      roles.forEach(item => {
        if (item.permissions && item.permissions.length) {
          permissions.push(...item.permissions)
        }
      })
      permissions = permissions.filter( it => (it.type == 1 || it.type == 2))
      permissions = constructAsyncRoutes(permissions)
      let accessedRoutes = constructStandardRouter(permissions) || []

      console.log(accessedRoutes);
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
