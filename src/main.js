// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import router from './router'

// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'

Vue.use(ElementUI)
Vue.config.productionTip = false

// function buildRouteItem(data) {
//   var item = {
//     path: data.path,
//     name: data.code,
//     visible: data.visible,
//     component: data.component
//   }
// }
// let routes = [
//   // {
//   //   path: '/',
//   //   name: 'Hello',
//   //   visible: false,
//   //   component: () => import('../src/components/HelloWorld')
//   // }
// ];
// var user = {};
// if (user) {
//   api.getMenus()
//     .then(res => {
//       debugger
//       if (res.status && res.data && res.data.length > 0) {
//         let level1 = res.data.filter(o => o.level === 1);
//         for (var i = 0, j = level1.length; i < j; i++) {
//           var data = level1[i];
//           let routeItem = {
//             path: data.path,
//             name: data.name,
//             visible: data.visible,
//             component: () => import(data.component)
//           }
//           let children = [];
//           let level2 = res.data.filter(o => o.parent_id == data.id);
//           for (var m = 0, n = level2.length; m < n; m++) {
//             var childData = level2[m];
//             let childRouteItem = {
//               path: childData.path,
//               name: childData.name,
//               visible: childData.visible,
//               component: () => import(childData.component)
//             }
//             console.log(childData.component)
//             children.push(childRouteItem);
//           }
//           if (children.length > 0) {
//             routeItem.children = children;
//           }
//           routes.push(routeItem);
//         }
//         debugger
//         let router = new Router({ routes: routes })
//         new Vue({
//           el: '#app',
//           router,
//           template: '<App/>',
//           components: { App }
//         })
//       }
//     }).catch(err => console.log(err));
// }
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
/* eslint-disable no-new */

