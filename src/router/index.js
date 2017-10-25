import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/views/Home'
import Interview from '@/views/customer/Interview'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      hide: true,
      component: HelloWorld
    },
    {
      path: '/Home',
      name: 'Home',
      hide: true,
      component: Home
    },
    {
      path: '/Customer',
      name: 'NewCustomer',
      meta: {
        title: '员工管理'
      },
      component: Home,
      children: [
        {
          path: '/Customer/Interview',
          name: 'Interview',
          component: Interview,
          meta: {
            title: '面试管理'
          }
        },
        {
          path: '/Customer/Education',
          name: 'Education',
          meta: {
            title: '入职教育'
          },
          component: Home
        }
      ]
    }
  ]
})
