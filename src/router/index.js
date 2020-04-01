import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/main',
    component: Layout,
    // redirect: '/main/jurisdiction',
    alwaysShow: true, // will always show the root menu
    name: 'main',
    meta: {
      title: '核心服务',
      icon: 'user',
      roles: ['maximum', 'second', 'three'] // you can set roles in root nav
    },
    children: [
      {
        path: 'jurisdiction',
        component: () => import('@/views/jurisdiction'),
        name: 'JurisDiction',
        meta: {
          title: '权限配置',
          roles: ['maximum']
        }
      },
      {
        path: 'noticemanage',
        component: () => import('@/views/noticemanage'),
        name: 'NoticeManage',
        meta: {
          title: '消息公告',
          roles: ['maximum']
        }
      },
      {
        path: 'studentmanage',
        name: 'StudentManage',
        component: () => import('@/views/studentmanage/index'), // 学生管理
        meta: {
          title: '学生管理',
          roles: ['second'] // 总负责人
        }
      },
      {
        path: 'approvalmanage',
        name: 'ApprovalManage',
        component: () => import('@/views/approvalmanage/index'), // 公告管理
        meta: {
          title: '公告管理',
          roles: ['second'] // 总负责人
        }
      },
      {
        path: 'statexhibition',
        name: 'StateXhibition',
        component: () => import('@/views/statexhibition/index'), // 状态展示
        meta: {
          title: '状态展示',
          roles: ['second'] // 总负责人
        }
      },
      {
        path: 'approvaler',
        name: 'Approvaler',
        component: () => import('@/views/approvaler/index'), // 审批管理
        meta: {
          title: '学生管理',
          roles: ['three'] // 审批人员
        }
      },
      {
        path: 'stateshow',
        name: 'stateshow',
        component: () => import('@/views/stateshow/index'), // 状态展示
        meta: {
          title: '状态展示',
          roles: ['three'] // 审批人员
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
